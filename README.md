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

For Vercel, add `VITE_API_BASE_URL` under **Project Settings > Environment
Variables**. Once the production API is available at the planned domain, use
`https://api.techblog.com` for the Production environment, then redeploy so
Vite includes the value in the build. Set a different value for Preview only
if you have a separate preview API.

`VITE_` variables are included in browser code and are public. Never put
private keys, database passwords, or other server secrets in them; keep those
on the backend.
