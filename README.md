# E-Commerce Admin Dashboard

## Project Overview

This project is a comprehensive e-commerce admin dashboard built using Next.js, TypeScript, and MongoDB. It provides a full-featured platform for managing an online store, including product inventory, order processing, user management, and payment integration. The application is designed to be scalable, secure, and user-friendly, making it suitable for small to medium-sized e-commerce businesses.

## Features

### Core Functionality
- **User Authentication**: Secure login and registration using NextAuth.js with support for admin and regular user roles.
- **Product Management**: Create, read, update, and delete (CRUD) operations for products, including image uploads via Cloudinary.
- **Order Management**: View and manage customer orders with status tracking (pending, paid, shipped, delivered, cancelled).
- **Cart Management**: Handle shopping cart operations for users.
- **Dashboard Analytics**: Visual charts and statistics using Recharts for sales and product data.
- **Payment Integration**: Secure payment processing with Stripe.
- **Image Upload**: Cloud-based image storage and management with Cloudinary.

### Technical Features
- **Responsive Design**: Built with Tailwind CSS for mobile-first, responsive UI.
- **Type Safety**: Full TypeScript implementation for robust code.
- **API Routes**: RESTful API endpoints for all backend operations.
- **Data Validation**: Zod schemas for input validation.
- **Database**: MongoDB with Mongoose ODM for data modeling.
- **Security**: Password hashing with bcryptjs, JWT authentication.

## Technologies Used

### Frontend
- **Next.js 16.1.1**: React framework for server-side rendering and API routes.
- **React 19.2.3**: UI library for building interactive components.
- **TypeScript 5**: For type-safe JavaScript development.
- **Tailwind CSS 4**: Utility-first CSS framework for styling.
- **Recharts 3.6.0**: Chart library for data visualization.

### Backend
- **NextAuth 4.24.13**: Authentication library for Next.js.
- **Mongoose 9.0.2**: MongoDB object modeling for Node.js.
- **Zod 4.2.1**: TypeScript-first schema validation.
- **bcryptjs 3.0.3**: Password hashing library.
- **Stripe 20.1.1**: Payment processing platform.
- **Cloudinary 2.8.0**: Cloud-based image management.

### Development Tools
- **ESLint 9**: Code linting and formatting.
- **TypeScript Compiler**: For type checking.

## Installation

### Prerequisites
- Node.js (version 18 or higher)
- MongoDB database (local or cloud instance like MongoDB Atlas)
- Stripe account for payment processing
- Cloudinary account for image uploads

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/harryx32/E-Commerce-Dashboard.git
   cd ecommerce-admin
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Database Setup**
   Ensure MongoDB is running and accessible via the connection string.

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Admin Dashboard
- Access the admin panel at `/dashboard` (requires admin role).
- Manage products, orders, and users from the dashboard interface.
- View analytics and charts for business insights.

### User Operations
- Register and login at `/register` and `/login`.
- Browse products at `/store`.
- Add items to cart and proceed to checkout.
- View order history at `/orders`.

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth API routes

#### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product (admin only)
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

#### Orders
- `GET /api/orders` - Get all orders (admin) or user orders
- `POST /api/orders` - Create new order

#### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/[itemId]` - Remove item from cart

#### Upload
- `POST /api/upload` - Upload image to Cloudinary

## Database Schema

### User Model
```typescript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```typescript
{
  image: String,
  name: String (required),
  price: Number (required, min: 0),
  stock: Number (required, min: 0),
  category: String (required),
  description: String,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```typescript
{
  user: ObjectId (ref: 'User', required),
  items: [{
    product: ObjectId (ref: 'Product', required),
    name: String,
    price: Number,
    quantity: Number (required, min: 1),
    image: String
  }],
  totalAmount: Number (required, min: 0),
  status: String (enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentIntentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Model
```typescript
{
  user: ObjectId (ref: 'User', required),
  items: [{
    product: ObjectId (ref: 'Product', required),
    name: String,
    price: Number,
    quantity: Number (required, min: 1),
    image: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```
ecommerce-admin/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── products/
│   │   └── upload/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── store/
│   └── ...
├── components/
├── lib/
│   ├── models/
│   ├── validators/
│   └── ...
├── types/
├── public/
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the excellent framework
- MongoDB and Mongoose for database solutions
- Stripe for payment processing
- Cloudinary for image management
- All open-source contributors

## Contact

For questions or support, please contact the project maintainer.

---

**Note**: This project is developed as part of a college assignment and demonstrates full-stack web development skills using modern technologies.