I want to prepare this React + Vite frontend for deployment.

Our intended architecture is:
- Local development: React frontend communicating with a local Express backend.
- Production frontend: Vercel.
- Production backend: Google Cloud Run.
- Future frontend domain: www.techblog.com.
- Future backend domain: api.techblog.com.

Please inspect the existing codebase before making changes.

Specifically:

1. Find every backend API request throughout the frontend.
2. Inspect `src/App.jsx`, particularly the use of `PUBLIC_API_BASE_URL`.
3. Inspect `src/features/admin/services/adminApi.js`, particularly `API_BASE_URL`.
4. Find where both variables are defined and identify any other API URL configurations.
5. Check whether API paths are consistent with the existing Express backend routes.
6. Determine whether the frontend currently has duplicated or inconsistent API configuration.

Implementation requirements:

- Establish one central API configuration used by all frontend API requests.
- Use Vite environment variables with the `VITE_` prefix.
- Use `VITE_API_BASE_URL` as the single configuration variable.
- Preserve all existing API endpoint paths and request behaviour.
- Ensure local development can use the backend running on localhost.
- Prepare an `.env.example` containing the required variable, without secrets.
- Ensure actual `.env` files are ignored by Git.
- Explain how to configure `VITE_API_BASE_URL` in Vercel later.
- Check whether authentication requests require credentials to be included, but do not change authentication behaviour without explaining why.

Important restrictions:

- Do not rewrite components, pages, services or business logic.
- Do not change backend code.
- Do not introduce a new API library.
- Do not hardcode production URLs.
- Do not expose secrets or print `.env` contents.
- Do not commit or push anything.

After implementation:
- Run the existing lint and build commands.
- Report all files changed.
- Explain how the API configuration works.
- Show the expected local and production environment variable values.
- Report any issues that need my approval before proceeding.