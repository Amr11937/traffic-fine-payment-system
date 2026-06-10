# Traffic Fine Payment Portal

Public web portal for paying Sri Lanka Police traffic fines. Drivers enter their fine reference number and category code to look up and pay a fine online.

## Prerequisites

- Node.js 18+
- Backend running on `http://localhost:8080`

## Setup

```bash
cd web-payment
npm install
```

Optionally copy `.env.example` to `.env` and set a different backend URL:

```bash
cp .env.example .env
# edit VITE_API_BASE if your backend runs elsewhere
```

## Run (development)

```bash
npm run dev
```

Opens at **http://localhost:5173**

## Build (production)

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```
