# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Admin CMS Features

This project now includes a responsive admin module with:

- Secure admin login route at `/admin/login`
- Protected admin dashboard at `/admin`
- Create, edit, preview, and publish article workflows
- Draft and published statuses
- Client-side validation and route-level authorization checks
- Login rate-limiting guard on repeated attempts

### Demo mode

If no backend API is configured, the app uses local storage for demo admin data.

- Email: `admin@ledgerpost.com`
- Password: `AdminPass!2026`

### Backend integration

The public article feed and admin API share one base URL configured through
`VITE_API_BASE_URL`. For local development, copy `.env.example` to `.env` and
set the URL to the port used by your local Express backend:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

If your backend uses a different port, update the value in `.env`. The `.env`
file is ignored by Git; `.env.example` is safe to commit and contains only the
local development default.

`VITE_` variables are included in browser code and are public. Never put
private keys, database passwords, or other server secrets in them; keep those
on the backend.

## Deploy to Vercel

1. **Prepare the backend.** Deploy the API separately over HTTPS and configure its CORS policy to allow your Vercel production domain and any preview domains you plan to use. The frontend appends `/posts`, `/auth/login`, and `/admin/articles` to the configured base URL, so include any API prefix (for example, `/api`) when your backend expects one. Do not include a trailing slash.
2. **Push the frontend to GitHub.** Commit and push the app files, including `package-lock.json`. Do not commit `.env`; it is ignored by Git.
3. **Import the repository into Vercel.** Choose **Add New > Project**, connect GitHub, and import this repository. Set **Root Directory** to the repository root, which is the folder containing `package.json`.
4. **Check the build settings.** Vercel should detect Vite. If it asks, use Framework Preset `Vite`, Build Command `npm run build`, Output Directory `dist`, and Install Command `npm install`.
5. **Add the production API URL.** In **Settings > Environment Variables**, add `VITE_API_BASE_URL` with the HTTPS base URL for the deployed API. Select **Production** and, if previews need backend access, **Preview**. A URL such as `https://api.example.com/api` is correct only if the backend serves the expected endpoints under `/api`. This variable is embedded in the browser bundle, so it must not contain secrets.
6. **Deploy and verify.** Trigger a deployment, then check the homepage, an article page, and `/admin/login`. Also open `/admin` and an article URL directly, then refresh each page to verify client-side routes load. Check the browser’s Network panel for API or CORS errors. Redeploy after changing `VITE_API_BASE_URL`, since Vite reads it at build time.

If refreshing a client-side route returns a Vercel 404, add a `vercel.json` at
the repository root with this rewrite, then redeploy:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Production admin security:** do not deploy with `VITE_API_BASE_URL` unset.
Without it, the app uses demo login credentials and browser-local storage;
this is for demonstration only and does not provide production authentication
or shared article storage. The backend must enforce authorization for every
admin API request.
