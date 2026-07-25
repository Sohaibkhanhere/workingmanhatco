# Workin' Man Hat Co. - E-Commerce Platform

Hats and apparel for the everyday workin' man. Full-stack e-commerce backend with admin dashboard, product management, and order tracking.

## Features

- **Product Catalog** - Browse hats and apparel with filtering, search, and pagination
- **Admin Dashboard** - Manage products, orders, and site settings
- **Order Management** - Create, track, and update order statuses
- **JWT Authentication** - Secure admin routes with token-based auth
- **Site Settings** - Configurable branding, colors, fonts, and homepage content
- **Responsive Design** - Mobile-friendly storefront

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT, bcryptjs
- **Frontend:** Vanilla HTML/CSS/JS
- **Admin:** Vanilla HTML/CSS/JS

## Project Structure

```
ecommerce-site/
├── admin/              # Admin dashboard
│   ├── css/
│   └── js/
├── backend/
│   ├── middleware/
│   │   └── auth.js     # JWT auth + role middleware
│   ├── models/
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── User.js
│   │   └── Settings.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── settings.js
│   │   └── media.js
│   ├── seed/
│   │   └── seed.js     # Database seeder
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/           # Customer storefront
│   ├── css/
│   ├── images/
│   ├── js/
│   └── pages/
└── README.md
```

## Setup

### Prerequisites

- Node.js (v16+)
- MongoDB running locally or a connection string

### Install

```bash
cd backend
npm install
```

### Configure Environment

Create `backend/.env`:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/workinman_ecommerce
JWT_SECRET=your_secret_key
```

### Seed Database

```bash
npm run seed
```

This creates:
- 1 admin user
- 25 products (17 hats, 8 apparel)
- 4 sample orders
- Default site settings

### Run Server

```bash
npm start
```

Or with auto-reload:

```bash
npm run dev
```

Server runs at `http://localhost:3000`

## Default Admin Credentials

| Field    | Value                |
|----------|----------------------|
| Email    | admin@workinman.com  |
| Password | admin123             |

## API Endpoints

### Auth

| Method | Endpoint         | Auth | Description            |
|--------|------------------|------|------------------------|
| POST   | /api/auth/register | No   | Register admin user    |
| POST   | /api/auth/login    | No   | Login, returns JWT     |
| GET    | /api/auth/me       | Yes  | Get current user       |

### Products

| Method | Endpoint              | Auth | Description                    |
|--------|-----------------------|------|--------------------------------|
| GET    | /api/products          | No   | List products (filter/search)  |
| GET    | /api/products/:slug    | No   | Get single product by slug     |
| POST   | /api/products          | Yes  | Create product (admin)         |
| PUT    | /api/products/:id      | Yes  | Update product (admin)         |
| DELETE | /api/products/:id      | Yes  | Delete product (admin)         |

**Query params:** `category`, `search`, `featured`, `sort` (price_asc|price_desc|newest), `limit`, `offset`

### Orders

| Method | Endpoint                | Auth | Description               |
|--------|-------------------------|------|---------------------------|
| GET    | /api/orders/stats/summary | Yes  | Dashboard stats (admin)   |
| GET    | /api/orders              | Yes  | List all orders (admin)   |
| GET    | /api/orders/:id          | No   | Get order by ID           |
| POST   | /api/orders              | No   | Create new order          |
| PUT    | /api/orders/:id/status   | Yes  | Update order status (admin) |

**Order statuses:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`

### Settings

| Method | Endpoint      | Auth | Description             |
|--------|---------------|------|-------------------------|
| GET    | /api/settings  | No   | Get site settings       |
| PUT    | /api/settings  | Yes  | Update settings (admin) |

### Media

| Method | Endpoint              | Auth | Description                |
|--------|-----------------------|------|----------------------------|
| GET    | /api/media            | No   | List uploaded images       |
| POST   | /api/media/upload     | Yes  | Upload image (admin)       |

## Store Pages

| URL | Page |
|-----|------|
| `/` | Home with hero, featured products |
| `#products` | Product listing with category filters |
| `#product/:slug` | Product detail page |
| `#cart` | Shopping cart |
| `#checkout` | Checkout form |
| `#about` | About page |
| `#contact` | Contact form |
| `#gallery` | Brand In Action gallery |

## Admin Panel

Access at `http://localhost:3000/admin`

- Dashboard with order stats
- Product CRUD management
- Order tracking and status updates
- Content editor for homepage settings
- Media library with image upload
