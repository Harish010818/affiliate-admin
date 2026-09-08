# Affiliate Portal — Admin Frontend

Next.js (App Router, JavaScript, Tailwind CSS) admin console: review
applications, approve/reject/request changes, and manage affiliate metrics
and targets. Like the affiliate frontend, this is a pure client of the shared
backend API — no direct database access.

## Setup

```bash
cd frontend
npm install
cp  .env.local
```

Set `API_URL` to the API server's URL.

```bash
npm run dev     # runs on http://localhost:3002
```

> Add this app's origin to the backend's `ADMIN_ORIGINS` env var
> (e.g. `http://localhost:3002` for local dev). This both allows CORS and
> tells the backend to issue this app its own separate session cookie,
> distinct from the affiliate frontend's — so logging into one never affects
> the other's session, even in the same browser tab.

## Pages

| Route                     | Description |
|---------------------------|--------------|
| `/`                       | Redirects to `/dashboard` or `/login` |
| `/login`                  | Admin login — rejects non-admin accounts |
| `/dashboard`              | Total / pending / approved / rejected counts |
| `/applications`           | List with status filter tabs |
| `/applications/[id]`      | Full detail + Approve / Reject / Request changes |
| `/affiliates`             | List of approved affiliates with current metrics |
| `/affiliates/[userId]`    | Edit that affiliate's metrics and monthly targets|