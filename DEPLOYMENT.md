# Deploying RM STORE to Azure

This project has three deployable pieces:

| App | What it is | Suggested Azure service |
|---|---|---|
| `backend/` | Express API | Azure App Service (Linux, Node 18) |
| `frontend/` | Customer store (React) | Azure Static Web Apps |
| `admin/admin-frontend/` | Admin dashboard (React) | Azure Static Web Apps |

The database (MongoDB Atlas) and image storage (Cloudinary) are external managed
services — you don't host them on Azure yourself.

---

## 0. Prerequisites

1. **MongoDB Atlas** (free tier, M0 cluster):
   - Create a cluster, a database user, and grab the connection string.
   - Under **Network Access**, add `0.0.0.0/0` (or Azure's outbound IP ranges once
     you know them) so App Service can reach it.
2. **Cloudinary** account (free tier) — grab your Cloud Name, API Key, API Secret.
3. **Stripe** account — grab your secret key and publishable key. You'll add the
   webhook endpoint once the backend has a public URL (step 3 below).
4. An **Azure subscription**.

---

## 1. Deploy the backend (Azure App Service)

1. In the Azure Portal: **Create a resource → Web App**
   - Publish: **Code**
   - Runtime stack: **Node 18 LTS**
   - Operating System: **Linux**
   - Plan: **Free F1** (fine for practice/dev)

2. Set the **Startup Command** (App Service → Configuration → General settings):
   ```
   npm start
   ```
   (this runs `node src/server.js`, matching `backend/package.json`)

3. Under **Configuration → Application settings**, add these (values from your
   `backend/.env` — see `backend/.env.example` for the full list):

   | Name | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string |
   | `CLIENT_URL` | your deployed customer-frontend URL (step 2) |
   | `CORS_ORIGINS` | `https://<your-frontend>.azurestaticapps.net,https://<your-admin-frontend>.azurestaticapps.net` |
   | `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | from Cloudinary |
   | `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_USER` / `EMAIL_PASS` / `EMAIL_FROM` | your SMTP provider |
   | `STRIPE_SECRET_KEY` | from Stripe |
   | `STRIPE_WEBHOOK_SECRET` | from Stripe, once the webhook is created (step below) |
   | `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` (so Azure runs `npm install` for you) |

   You will not have `CLIENT_URL`/`CORS_ORIGINS` values until the frontends are
   deployed — come back and fill these in after step 2.

4. **Deploy the code.** Easiest path: connect the App Service to your GitHub repo
   under **Deployment Center**, pointing at the `backend/` folder — Azure will
   build and redeploy automatically on every push. Alternatively, use the
   included workflow at `.github/workflows/azure-deploy-backend.yml`:
   - Download the App Service's publish profile (Overview → **Get publish profile**).
   - Add it as a GitHub Actions secret named `AZURE_WEBAPP_PUBLISH_PROFILE`.
   - Set `AZURE_WEBAPP_NAME` at the top of the workflow file to your App Service's name.

5. Once deployed, verify with: `https://<your-app>.azurewebsites.net/api/health`
   — should return `{"status":"ok", ...}`.

6. **Stripe webhook**: in the Stripe Dashboard, add an endpoint pointing to
   `https://<your-app>.azurewebsites.net/api/payment/webhook`, subscribe to
   `payment_intent.succeeded`, and copy the generated signing secret into the
   `STRIPE_WEBHOOK_SECRET` app setting.

---

## 2. Deploy the frontends (Azure Static Web Apps)

Repeat for both `frontend/` (customer store) and `admin/admin-frontend/`
(admin dashboard) — they're independent static apps.

1. **Create a resource → Static Web App**, connect it to your GitHub repo.
2. Build configuration:
   - **App location**: `/frontend` (or `/admin/admin-frontend`)
   - **Output location**: `build`
3. Azure auto-generates a GitHub Actions workflow for you — no manual YAML needed.
4. Under **Configuration → Application settings** on the Static Web App, add:
   - `REACT_APP_API_URL` = `https://<your-backend-app>.azurewebsites.net/api`
   - `REACT_APP_STRIPE_PUBLIC_KEY` = your Stripe publishable key (customer frontend only)

5. Once both are deployed, go back to the backend App Service's `CLIENT_URL` and
   `CORS_ORIGINS` settings and fill in the real Static Web App URLs, then restart
   the App Service.

---

## 3. Post-deploy checklist

- [ ] `GET /api/health` on the backend returns `ok`
- [ ] Register + login works from the deployed customer frontend
- [ ] Admin login works from the deployed admin frontend (an existing user needs
      `isAdmin: true` — set this directly in Atlas, or run `npm run data:import`
      in `backend/` once with `MONGO_URI` pointed at Atlas to seed a default admin)
- [ ] Product image upload from the admin panel lands in Cloudinary and the URL
      renders on the storefront
- [ ] Stripe webhook shows successful deliveries in the Stripe Dashboard
- [ ] CORS: confirm the browser console shows no CORS errors on either frontend

---

## Known remaining gap

The customer checkout's card-payment step (`PaymentProcessingPage.js`) currently
**simulates** a successful Stripe charge client-side rather than running a real
one — the backend endpoints for a real charge already exist and are correct
(`POST /api/payment/create-payment-intent` + the `/api/payment/webhook` handler).
Wiring `@stripe/react-stripe-js`'s `<CardElement>` and `stripe.confirmCardPayment()`
into that page is the remaining piece needed for real card payments to work
end-to-end. This is flagged with a `TODO` comment at the relevant spot in the code.
