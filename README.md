
# Insighta Labs+ Web Portal

A modern, secure web portal for profile intelligence and data management built with Next.js. This application provides a user-friendly interface for managing and analyzing profile data with advanced search capabilities and export functionality.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure GitHub OAuth integration with PKCE
- **Profile Management**: Create, view, and manage profile records
- **Advanced Search**: Natural language search across profile data
- **Data Export**: CSV export functionality for profiles and search results
- **Role-based Access**: Different permissions for analysts and administrators

### Security Features
- HTTP-only cookies for secure authentication
- CSRF protection on state-changing operations
- Secure API communication with version headers
- Environment-based configuration

### User Interface
- Responsive design with modern UI components
- Real-time data loading and pagination
- Intuitive navigation and user experience
- Loading states and error handling

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: CSS Modules with custom styling
- **Authentication**: GitHub OAuth with PKCE
- **API**: RESTful API with versioned endpoints
- **Deployment**: Docker containerization
- **Development**: Hot reload, TypeScript checking, ESLint

## 📋 Prerequisites

- Node.js 16 or higher
- npm or yarn package manager
- Backend API server running
- Docker (for containerized deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd profile-intelligence-web
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Authentication
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id

# Feature Flags
NEXT_PUBLIC_ENABLE_EXPORT=true
NEXT_PUBLIC_ENABLE_SEARCH=true

# Development
FRONTEND_PORT=3000
```

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 📖 Usage

### Authentication
1. Navigate to `/login`
2. Click "Login with GitHub"
3. Authorize the application
4. You'll be redirected to the dashboard

### Profile Management
- **View Profiles**: Navigate to `/profiles` to browse all profiles
- **Filter Profiles**: Use the gender filter to narrow down results
- **Pagination**: Use Prev/Next buttons to navigate through pages
- **View Details**: Click "View" on any profile to see full details

### Search Functionality
- **Natural Language Search**: Go to `/search`
- **Query Examples**:
  - "young males from nigeria"
  - "females aged 25-35"
  - "profiles from ghana"

### Data Export
- **Profile Export**: On the profiles page, click "Export CSV" to download all profiles
- **Search Export**: After searching, click "Export CSV" to download search results
- **Filtered Export**: Exports respect current filters and search criteria

### Administrative Features
- **Create Profiles**: Admin users can create new profiles
- **User Management**: Access account settings and logout functionality

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | Yes | `http://localhost:8000` |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | GitHub OAuth Client ID | Yes | - |
| `NEXT_PUBLIC_ENABLE_EXPORT` | Enable CSV export feature | No | `false` |
| `NEXT_PUBLIC_ENABLE_SEARCH` | Enable search functionality | No | `true` |
| `FRONTEND_PORT` | Port for development server | No | `3000` |

### API Integration

The frontend communicates with a REST API that should provide:

- `GET /auth/me/` - User authentication status
- `GET /api/v2/profiles` - List profiles with pagination
- `GET /api/v2/profiles/search` - Search profiles
- `POST /api/v2/profiles` - Create new profiles (admin only)
- `GET /api/v2/profiles/{id}` - Get profile details

## 🏗 Development

### Project Structure

```
profile-intelligence-web/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── dashboard/         # Dashboard page
│   ├── profiles/          # Profile management
│   ├── search/            # Search functionality
│   ├── login/             # Authentication
│   └── account/           # Account management
├── components/            # Reusable UI components
├── lib/                   # Utility functions and API clients
│   ├── api.ts            # API client functions
│   ├── config.ts         # Configuration
│   └── csrf.ts           # CSRF protection
├── public/               # Static assets
└── styles/               # Global styles
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Docker
docker build -t profile-intelligence-web .
docker run -p 3000:3000 profile-intelligence-web
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (recommended)

## 🚢 Deployment

### Docker Deployment

1. **Build the image**:
```bash
docker build -t insighta-profile-intelligence-web .
```

2. **Run with Docker Compose**:
```bash
docker-compose up -d
```

3. **Environment Configuration**:
```bash
# .env file
FRONTEND_PORT=3000
API_BASE_URL=http://your-api-server:8000
```

### Production Build

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure code passes linting

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Check the [WEB_PORTAL_SETUP.md](WEB_PORTAL_SETUP.md) for detailed setup instructions
- Review the API documentation in the backend repository
- Create an issue for bugs or feature requests

## 📊 API Reference

### Authentication Endpoints
- `GET /auth/me/` - Get current user information
- `POST /auth/logout/` - Logout current user

### Profile Endpoints
- `GET /api/v2/profiles` - List profiles (paginated)
  - Query parameters: `page`, `limit`, `gender`
- `GET /api/v2/profiles/search` - Search profiles
  - Query parameters: `q` (search query), `page`, `limit`
- `POST /api/v2/profiles` - Create new profile (admin only)
- `GET /api/v2/profiles/{id}` - Get profile details

### Request Headers
- `X-API-Version: 1` - API version header
- `X-CSRFToken` - CSRF token for POST requests (from cookie)

---

**Built with ❤️ by Insighta Labs+ Team**
```

Server runs at `http://localhost:3000`

## Key Features Implementation

### 1. GitHub OAuth with PKCE

**File**: `src/components/Auth/GitHubOAuth.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const GitHubOAuth = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  const initateLogin = async () => {
    try {
      // Generate PKCE parameters
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

   
```

## Key Features Implementation

### 1. GitHub OAuth with PKCE

**File**: `src/components/Auth/GitHubOAuth.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const GitHubOAuth = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  const initateLogin = async () => {
    try {
      // Generate PKCE parameters
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Store verifier in sessionStorage
      sessionStorage.setItem('oauth_code_verifier', codeVerifier);

      // Redirect to GitHub
      const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
      const redirectUri = `${window.location.origin}/auth/callback`;
      
      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', githubClientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('scope', 'user');
      authUrl.searchParams.set('code_challenge', codeChallenge);
      authUrl.searchParams.set('code_challenge_method', 'S256');

      window.location.href = authUrl.toString();
    } catch (err) {
      setError('Failed to initiate login');
    }
  };

  return (
    <button onClick={initateLogin} className="btn-github">
      Sign in with GitHub
    </button>
  );
};
```

### 2. HTTP-Only Cookie Authentication

**File**: `src/pages/auth/callback.tsx`

```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

export default function AuthCallback() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const code = router.query.code as string;
      const codeVerifier = sessionStorage.getItem('oauth_code_verifier');

      if (!code || !codeVerifier) {
        router.push('/auth/login?error=invalid_request');
        return;
      }

      try {
        // Exchange code for tokens
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/github/token/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Important: include cookies
          body: JSON.stringify({ code, code_verifier: codeVerifier }),
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        
        // Update auth state
        await login(data);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        router.push('/auth/login?error=auth_failed');
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router]);

  return <div>Authenticating...</div>;
}
```

### 3. CSRF Protection

**File**: `src/utils/csrf.ts`

```typescript
import { getCookie } from './storage';

export async function getCSRFToken(): Promise<string> {
  let token = getCookie('csrftoken');

  if (!token) {
    // Fetch CSRF token from backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/csrf/`, {
      credentials: 'include',
    });
    const data = await response.json();
    token = data.csrfToken;
  }

  return token;
}

export function addCSRFHeader(headers: HeadersInit = {}): HeadersInit {
  const token = getCookie('csrftoken');
  if (token) {
    headers['X-CSRFToken'] = token;
  }
  return headers;
}
```

### 4. Role-Based Access Control

**File**: `src/hooks/useAuth.ts`

```typescript
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return {
    ...context,
    isAdmin: () => context.user?.role === 'admin',
    isAnalyst: () => context.user?.role === 'analyst',
    canEdit: () => ['admin', 'analyst'].includes(context.user?.role),
  };
};
```

### 5. API Client with Token Management

**File**: `src/services/api.ts`

```typescript
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Include cookies
    headers: addCSRFHeader(headers),
  });

  // Handle token refresh on 401
  if (response.status === 401) {
    await refreshToken();
    // Retry request
    return apiCall(endpoint, options);
  }

  return response;
}

async function refreshToken() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    // Token refresh failed, redirect to login
    window.location.href = '/auth/login';
  }
}
```

## Security Considerations

1. **HTTP-Only Cookies**: Tokens are stored in HTTP-only cookies, preventing XSS attacks
2. **CSRF Protection**: All state-changing requests include CSRF token
3. **PKCE Flow**: OAuth uses PKCE for enhanced security in SPAs
4. **SameSite Cookies**: Cookies set with SameSite=Lax to prevent CSRF
5. **Secure Flag**: Cookies only sent over HTTPS in production
6. **Content Security Policy**: Configure appropriate CSP headers

## Environment Variables

```
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# GitHub OAuth
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_client_id

# Frontend URL (used by backend for redirects)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# API Timeout (ms)
NEXT_PUBLIC_API_TIMEOUT=30000

# Feature Flags
NEXT_PUBLIC_ENABLE_EXPORT=true
NEXT_PUBLIC_ENABLE_SEARCH=true
```

## Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t insighta-profile-intelligence-web .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://api:8000 insighta-profile-intelligence-web
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## Troubleshooting

### Cookie Not Being Set
- Ensure `credentials: 'include'` in fetch requests
- Check CORS settings on backend
- Verify `CSRF_TRUSTED_ORIGINS` includes frontend URL

### 403 Permission Denied
- Check user role is correct
- Ensure JWT token is valid
- Verify endpoint permissions

### OAuth Not Working
- Check GitHub Client ID is correct
- Verify redirect URI matches GitHub app settings
- Check sessionStorage is enabled

## Support

For issues and questions, please open an issue on the repository.
