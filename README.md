# 🚀 Order Orbit - Online Food Ordering Platform

A full-stack food ordering web application built with React, Node.js, Express, and PostgreSQL.

## Tech Stack
- **Frontend**: React, React Router, Axios, CSS Variables
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Auth**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Features
- 🔐 User registration & login (JWT auth)
- 🍽️ Browse restaurants & menus by category
- 🔍 Search restaurants
- 🛒 Cart management (multi-item, multi-quantity)
- 📦 Place orders with delivery address & payment method
- 🗺️ Real-time order tracking with status steps
- ⭐ Leave reviews & ratings
- 👑 Admin dashboard (stats, manage orders/users)

---

## Setup Instructions

### 1. PostgreSQL Database
```sql
CREATE DATABASE order_orbit;
```
Then run the schema:
```bash
psql -U postgres -d order_orbit -f backend/config/schema.sql
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DB credentials
node server.js
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

App runs on: http://localhost:3000  
API runs on: http://localhost:5000

---

## Admin Account
To create an admin account, register normally then update the role in the database:
```sql
UPDATE users SET role='admin' WHERE email='your@email.com';
```
Or use the demo credentials shown on the login page.

## Database Schema
- **users** – customer & admin accounts
- **restaurants** – restaurant listings
- **menu_items** – food items per restaurant
- **orders** – customer orders with status tracking
- **order_items** – individual items within each order
- **reviews** – ratings and comments

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/restaurants | List all restaurants |
| GET | /api/restaurants/:id | Restaurant + menu + reviews |
| POST | /api/orders | Place order |
| GET | /api/orders/my | My orders |
| GET | /api/orders/:id | Order detail |
| POST | /api/reviews | Add review |
| GET | /api/admin/stats | Admin stats |
| PATCH | /api/orders/:id/status | Update order status |
