# @fric Money

Banking application built with **Angular 21** + **Tailwind CSS 4** + **SSR**.

Technical assessment for @fric Payment Solutions — manages user accounts, transactions, and banking operations against a REST API.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file (edit API_URL if needed)
cp .env.example .env

# Start dev server (default: http://localhost:4200)
npm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server with live reload |
| `npm run build` | Production build |
| `npm test` | Run test suite (Vitest) |

## API

Base URL: `https://recruitment.africremit.ca/api`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/register` | POST | No | Create account |
| `/login` | POST | No | Authenticate |
| `/logout` | POST | Bearer | Deauthenticate |
| `/user` | GET | Bearer | User details + account + transactions |
| `/account/credit` | POST | Bearer | Deposit money |
| `/account/debit` | POST | Bearer | Withdraw money |

## Stack

- **Angular 21** — standalone components, signals, lazy routes, functional interceptors
- **Tailwind CSS 4** — utility-first styling with PostCSS
- **SSR** — server-side rendering via Angular SSR + Express
- **Vitest** — unit testing with Angular TestBed
- **dotenv** — environment variable loading

## Pages

- **Register** — create a new account (name, email, password, currency)
- **Login** — authenticate with email/password
- **Dashboard** — balance overview, send/add money, transaction history from API
