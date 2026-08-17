# RM Store — E-commerce Platform

RM Store is a full-stack e-commerce platform for premium food products
(flours, rice, honey, dry fruits, dates, spices) with a customer-facing
store, a role-based admin dashboard, and a recipe section. Built as a MERN
application (MongoDB, Express, React, Node.js).

---

## 🌐 Live Deployment

| Part | Platform | URL |
|---|---|---|
| **Backend API** | Azure App Service | `https://rm-store-hfhaeefehpfyg0g4.centralindia-01.azurewebsites.net/api` |
| **Customer Store** | Vercel | `https://rm-store-lake.vercel.app` |
| **Admin Panel** | Vercel | `https://admin-panel-rmstore.vercel.app` |
| **Database** | MongoDB Atlas | (managed, not self-hosted) |

Health check: `GET /api/health` on the backend URL should return
`{"status":"ok"}` when everything is running correctly.

---

## 🏗️ Project Structure

This is a monorepo with three independently deployable apps:

```
RM-STORE-E-Commerce-Website/
├── backend/                 → Express REST API (deployed to Azure)
├── frontend/                → Customer-facing store (deployed to Vercel)
├── admin/
│   └── admin-frontend/      → Admin dashboard (deployed to Vercel)
├── .github/workflows/       → CI/CD for the backend
├── README.md                → this file
└── DEPLOYMENT.md            → step-by-step deployment guide
```

---

## 🧰 Tech Stack

- **Frontend / Admin**: React, React Router, Redux Toolkit, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB Atlas
- **Auth**: JWT, bcrypt, role-based access control (RBAC)
- **Payments**: Stripe
- **Email**: Nodemailer (SMTP)
- **Images**: stored as plain URL strings (no third-party image host required)
- **Hosting**: Azure App Service (backend) + Vercel (both frontends)

---

## 🔐 Roles & Access

The platform has one public role (**Customer**) and six internal staff
roles, each with specific permissions enforced on the backend:

| Role | Can manage |
|---|---|
| **Super Admin** | Everything, including Staff & Roles |
| **Product Manager** | Products, variants, inventory |
| **Recipe Manager** | Recipes, nutrition info |
| **Order Manager** | Orders, order status, customer info |
| **Content Manager** | Categories, recipes |
| **Analytics Viewer** | Dashboard & analytics (read-only) |

Staff accounts are created from the admin panel's **Staff Management**
page (Super Admin only) — there is no public sign-up path to any staff
role. Public registration always creates a plain Customer account.

---

## 🚀 Deployment Overview

### Backend → Azure App Service

- **Resource name**: `rm-store` (Linux, Node 18)
- **Deploys via**: GitHub Actions — `.github/workflows/azure-deploy-backend.yml`
  triggers automatically on every push to `main` that touches `backend/`
- **Auth**: uses a repository secret `AZURE_WEBAPP_PUBLISH_PROFILE`
  (downloaded from the App Service's "Get publish profile" button in the
  Azure Portal)
- **Required App Service environment variables** (set in Azure Portal →
  Environment variables): `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`,
  `CLIENT_URL`, `CORS_ORIGINS`, `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_USER` /
  `EMAIL_PASS` / `EMAIL_FROM`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

### Customer Store & Admin Panel → Vercel

- Each is its own **Vercel project**, both pointed at the same GitHub repo
  with a different **Root Directory**:
  - Customer store → `frontend`
  - Admin panel → `admin/admin-frontend`
- Vercel auto-deploys on every push to `main` — no manual workflow needed
- **Environment variables** (set per-project in Vercel → Settings →
  Environment Variables):
  - `REACT_APP_API_URL` = the Azure backend URL + `/api`
  - `REACT_APP_STRIPE_PUBLIC_KEY` (customer store only)
  - `REACT_APP_ADMIN_URL` (customer store only, optional — links to the
    admin panel from the header for admin users)

  ⚠️ These are baked in at **build time** — after changing one, you must
  trigger a **Redeploy** from Vercel's Deployments tab for it to take effect.

### Connecting the pieces

The backend's `CORS_ORIGINS` and `CLIENT_URL` environment variables must
list the real Vercel URLs, or the frontends won't be able to talk to the
API. See `DEPLOYMENT.md` for the full step-by-step walkthrough.

---

## 💻 Local Development

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in your own values
npm run dev             # runs on http://localhost:5000

# Customer store
cd frontend
npm install
cp .env.example .env
npm start                # runs on http://localhost:3000

# Admin panel
cd admin/admin-frontend
npm install
cp .env.example .env
npm start                # runs on http://localhost:3001
```

For local development you can point `MONGO_URI` at either a local MongoDB
instance or a MongoDB Atlas cluster — no code changes needed either way.

---

## 📋 Features

**Customer store**: browse products/recipes by category, search, product
variants with real-time stock, cart, checkout (Stripe or Cash on Delivery),
order history, wishlist, editable profile with address book.

**Admin panel**: real-time dashboard (revenue, orders, customers — all
live from the database), product/recipe/category CRUD, order management
with status tracking, inventory overview, analytics, staff & role
management.

---

## 📖 More Documentation

See **`DEPLOYMENT.md`** for the complete step-by-step deployment guide,
including MongoDB Atlas setup, Azure App Service configuration, and the
GitHub Actions / Vercel connection details.
