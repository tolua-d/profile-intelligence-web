# Insighta Web Portal (Stage 3)

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Notes

- Uses backend GitHub OAuth entry: `/auth/github/login/`
- Uses cookie-based auth (`credentials: include`)
- Sends `X-API-Version: 1` for profile endpoints
- Adds `X-CSRF-Token` from cookie for state-changing requests
