# Campus Bites

**Campus Bites** is a full-stack online canteen ordering platform for Institute of Engineering and Technology (IET), Lucknow.

[![Open Campus Bites](https://img.shields.io/badge/Open-Live%20Website-F97316?style=for-the-badge)](https://campus-bites-alpha.vercel.app/)

**Live website:** https://campus-bites-alpha.vercel.app/

![Campus Bites preview](https://campus-bites-alpha.vercel.app/og-image.png)

## About

Campus Bites lets students browse the canteen menu, place and track orders, choose pickup times, join shared table orders, reserve seats, and receive live order updates. Staff and administrators get dedicated tools for order management, menu operations, inventory, promotions, announcements, reports, users, and seat settings.

## Features

### Student experience

- Campus email registration and JWT-based login
- Browse, search, filter, and sort the menu
- Favorites and dish ratings
- Persistent shopping tray
- Promo-code discounts and checkout summaries
- Pre-order pickup slots
- Shared/group table orders
- Live order status timeline and ready-for-pickup notifications
- Seat availability and check-in/check-out
- Order receipts and order history
- Real-time updates through Socket.IO
- Offline fallback screen

### Staff and admin tools

- Live order console with status filters and search
- Order lifecycle management
- Dedicated kitchen display
- Menu creation and editing
- Inventory tracking and low-stock alerts
- Sales and order reports with CSV export
- User management
- Promo-code management
- Canteen announcements
- Seat capacity and occupancy management
- Canteen settings and optional strict order lifecycle

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- Framer Motion
- React Icons
- Socket.IO Client
- Playwright

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens
- bcrypt
- Socket.IO
- express-rate-limit
- `node:test` with Supertest and `mongodb-memory-server`

## Project Structure

```text
College-Canteen/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── api.js
│       ├── App.jsx
│       ├── realtime.js
│       └── main.jsx
└── backend/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── scripts/
    ├── services/
    ├── utils/
    ├── app.js
    ├── config.js
    └── server.js
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/ankitsainiietlko/College-Canteen.git
cd College-Canteen
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
npm install
```

Set at least:

- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGINS`

Generate a strong JWT secret:

```bash
npm run generate:secret
```

Copy the generated value into `JWT_SECRET` in `backend/.env`.

Example local configuration:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/canteenDB
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

### 3. Configure the frontend

```bash
cd ../frontend
cp .env.example .env
npm install
```

For local development, the Vite proxy can forward `/api` to the backend:

```env
VITE_API_URL=/api
```

The default API URL is `http://localhost:5000`.

### 4. Run MongoDB

Start MongoDB locally, or set `MONGO_URI` to a hosted MongoDB instance.

### 5. Start the backend

```bash
cd backend
npm run dev
```

The API is available at `http://localhost:5000`, and the health endpoint is `http://localhost:5000/api/health`.

### 6. Start the frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Vite will print the local URL, normally `http://localhost:5173`.

## Create an Admin or Staff Account

Public signup always creates a student account. Use the seed script to create or update an admin account:

```bash
cd backend
cp .env.example .env
npm run generate:secret
```

Set the following variables before running the seed script:

```env
ADMIN_EMAIL=head@college.edu
ADMIN_NAME=Canteen Admin
ADMIN_PASSWORD=your-strong-password
ADMIN_ROLE=admin
```

Then run:

```bash
npm run seed:admin
```

Use `ADMIN_ROLE=staff` to seed a staff account instead.

## Environment Variables

### Frontend

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend origin or `/api` for Vite proxy development |

### Backend

| Variable | Description |
| --- | --- |
| `PORT` | HTTP server port; defaults to `5000` |
| `NODE_ENV` | `development`, `test`, or `production` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Required secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token lifetime; defaults to `1d` |
| `CORS_ORIGINS` | Comma-separated browser origins allowed to call the API |
| `RATE_LIMIT_ENABLED` | Enables API and authentication rate limits |
| `ORDER_MAX_QUANTITY` | Maximum quantity of one item per order |
| `ORDER_MAX_ITEMS` | Maximum different items per order |
| `ORDER_STRICT_LIFECYCLE` | Requires the complete Pending → Accepted → Preparing → Ready → Completed lifecycle |
| `OTP_MAILER` | OTP delivery mode: `log` or `anypost` |
| `ANYPOST_API_KEY` | API key for email verification |
| `OTP_FROM_EMAIL` | Verified sender address for OTP emails |
| `AUTH_EMAIL_PATTERN` | Regex used to restrict public signup emails |

See [`backend/.env.example`](backend/.env.example) for the complete backend configuration.

## Available Scripts

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run preview
npm run test:e2e
npm run test:e2e:ui
```

### Backend

```bash
cd backend
npm run dev
npm start
npm test
npm run seed:admin
npm run generate:secret
```

## Building for Production

Build the frontend:

```bash
cd frontend
npm run build
```

With `NODE_ENV=production`, the Express server can serve `frontend/dist` from the same origin. Set `VITE_API_URL` only when the frontend and API are deployed on separate origins.

Before production deployment:

- Use a strong `JWT_SECRET`
- Set an explicit `CORS_ORIGINS` allowlist
- Use a managed MongoDB database
- Configure HTTPS and a secure hosting environment
- Set `NODE_ENV=production`
- Configure the OTP mailer if email verification is used

## API Overview

The REST API is available under `/api`:

| Area | Endpoints |
| --- | --- |
| Authentication | `/api/auth/*` |
| Menu | `/api/food/*` |
| Orders | `/api/orders/*` |
| Inventory | `/api/inventory/*` |
| Analytics | `/api/analytics/*` |
| Users | `/api/users/*` |
| Promotions | `/api/promos/*` |
| Announcements | `/api/announcements/*` |
| Seats | `/api/seats/*` |
| Settings | `/api/settings/*` |
| Pickup slots | `/api/slots/*` |
| Group orders | `/api/groups/*` |
| Ratings | `/api/food/:id/rating` and `/api/ratings/*` |

`GET /api/health` provides a basic service-health response.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes.
4. Run builds and relevant tests.
5. Open a pull request.
