# Build stage
FROM node:alpine AS builder
WORKDIR /app

# Accept build arguments
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_ENABLE_EXPORT=true

# Set environment variables for build
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_ENABLE_EXPORT=$NEXT_PUBLIC_ENABLE_EXPORT

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Production stage
FROM node:alpine AS production
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN adduser -D app
USER app

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://0.0.0.0:3000 || exit 1

EXPOSE 3000
CMD ["yarn", "start"]   