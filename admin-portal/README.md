# Admin Portal — SL Police Traffic Fine System

React/Vite admin dashboard for senior police officials. Displays nationwide fine collection statistics pulled from the JWT-protected `/api/admin/**` endpoints.

## Prerequisites

- Node.js 18+
- Backend running at `http://localhost:8080` (start with `mvn spring-boot:run` in `/backend`)

## Setup

```bash
cd admin-portal
npm install
```

## Run (development)

```bash
npm run dev
```

Opens at **http://localhost:3000**

## Default credentials

| Username | Password  |
|----------|-----------|
| `admin`  | `admin123`|

## Build (production)

```bash
npm run build
npm run preview
```

## Environment

Copy `.env.example` to `.env.local` and set `VITE_API_BASE` if the backend runs on a different URL:

```
VITE_API_BASE=http://localhost:8080
```

## Features

- Login page with JWT authentication
- Protected dashboard (redirects to login if no token)
- Summary cards: total collected, paid count, unpaid count
- Collections by district — table + bar chart
- Collections by category — table + bar chart
- Session persisted in `localStorage` (survives page refresh)
- Auto-logout on token expiry (403 response)
