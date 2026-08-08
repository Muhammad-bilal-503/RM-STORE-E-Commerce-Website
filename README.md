# RM STORE E-commerce Website

RM STORE is a premium retail brand specializing in high-quality food products, including flours, rice, honey, dry fruits, dates, and spices. This e-commerce platform allows customers to browse and purchase products while providing admin tools for inventory and order management.

## Features

### Frontend (User Panel)
- Homepage with dynamic hero banner and product categories
- Advanced search functionality with filters
- Detailed product pages with high-quality images
- Shopping cart and secure checkout process
- Customer account management
- Recipe section and engagement content

### Backend (Admin Panel)
- Secure admin login with role-based authentication
- Product and inventory management
- Order processing and tracking
- Customer data management
- Analytics dashboard
- Marketing tools

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT and bcrypt
- **Payment Gateways**: Stripe and PayPal
- **Image Handling**: Direct image URLs (pasted links), stored as strings in MongoDB

## Getting Started

### Prerequisites
- Node.js and npm
- MongoDB

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/rm-store.git
cd rm-store
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Install frontend dependencies
```
cd ../frontend
npm install
```

4. Set up environment variables
Create .env files in both frontend and backend directories with the necessary environment variables.

5. Run the development servers
```
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

## Project Structure

```
rm-store/
├── frontend/            # React frontend
│   ├── public/          # Public assets
│   └── src/             # Source files
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       └── assets/      # Assets like images, icons
├── backend/             # Node.js backend
│   └── src/             # Source files
│       ├── controllers/ # Route controllers
│       ├── models/      # Database models
│       ├── routes/      # API routes
│       └── middlewares/ # Custom middlewares
└── README.md           # Project documentation
``` 