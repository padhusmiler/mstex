# TrendyShirts - E-Commerce T-Shirt Store

A complete, production-ready e-commerce website for men's and women's T-shirts built with React, FastAPI, and MongoDB.

## 🎨 Features

### User Features
- **Product Storefront**: Browse T-shirts with advanced filtering
  - Filter by gender (Men's/Women's)
  - Filter by size (XS, S, M, L, XL, XXL)
  - Filter by color (10+ color options)
  - Filter by price range
  - Search by product name/description
- **Product Detail Pages**: View multiple product images, select size/color, adjust quantity
- **Shopping Cart**: Add/remove items, update quantities
- **User Authentication**: Register, login, profile management
- **Checkout Flow**: Enter shipping address, dummy payment gateway
- **Order History**: View all past orders with status tracking

### Admin Features
- **Admin Dashboard**: Overview of products, orders, revenue, and pending orders
- **Product Management**: 
  - Add new products with multiple images
  - Edit existing products
  - Delete products
  - Select from pre-loaded T-shirt images
  - Set sizes, colors, price, stock
- **Order Management**:
  - View all orders
  - Update order status (pending → processing → shipped → delivered)
  - Update payment status
  - Filter orders by status

## 🚀 Technology Stack

- **Frontend**: React 19, Tailwind CSS, Shadcn UI components
- **Backend**: FastAPI (Python), JWT authentication, bcrypt password hashing
- **Database**: MongoDB with Motor (async driver)
- **Image Handling**: External URLs with metadata storage

## 📦 Database Schema

### Collections

1. **users**
   - id, email, password (hashed), name, phone, address, role, created_at

2. **products**
   - id, name, description, category, price, sizes[], colors[], stock, images[], created_at

3. **carts**
   - id, user_id, items[{product_id, quantity, size, color, price}], updated_at

4. **orders**
   - id, user_id, items[], total_amount, shipping_address, status, payment_status, created_at

## 🔑 Default Login Credentials

### Admin Access
- **URL**: `/admin/login`
- **Email**: `admin@trendyshirts.com`
- **Password**: `admin123`

### Sample User
- **URL**: `/login`
- **Email**: `user@example.com`
- **Password**: `password123`

## 📁 Project Structure

```
/app/
├── backend/
│   ├── server.py              # FastAPI application with all routes
│   ├── seed_data.py           # Database seeding script
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   └── uploads/               # Product image uploads directory
│       └── products/
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React application
│   │   ├── App.css            # Global styles
│   │   ├── pages/             # Page components
│   │   │   ├── Home.js
│   │   │   ├── ProductDetail.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── Orders.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   └── admin/
│   │   │       ├── AdminLogin.js
│   │   │       ├── AdminDashboard.js
│   │   │       ├── AdminProducts.js
│   │   │       └── AdminOrders.js
│   │   └── components/        # Reusable components
│   │       ├── Header.js
│   │       ├── Footer.js
│   │       ├── ProductCard.js
│   │       └── ui/            # Shadcn UI components
│   ├── package.json
│   └── .env
└── README.md
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User/Admin login
- `GET /api/auth/profile?token={token}` - Get user profile
- `PUT /api/auth/profile?token={token}` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/{id}` - Get single product
- `POST /api/admin/products?token={token}` - Create product (admin)
- `PUT /api/admin/products/{id}?token={token}` - Update product (admin)
- `DELETE /api/admin/products/{id}?token={token}` - Delete product (admin)
- `POST /api/admin/products/{id}/images?token={token}` - Upload image (admin)

### Cart
- `GET /api/cart?token={token}` - Get user's cart
- `POST /api/cart/add?token={token}` - Add item to cart
- `PUT /api/cart/update?token={token}` - Update cart items
- `DELETE /api/cart/remove/{product_id}?token={token}` - Remove item
- `DELETE /api/cart/clear?token={token}` - Clear cart

### Orders
- `POST /api/orders/create?token={token}` - Create order
- `GET /api/orders?token={token}` - Get user's orders
- `GET /api/admin/orders?token={token}` - Get all orders (admin)
- `PUT /api/admin/orders/{id}/status?token={token}&status={status}` - Update order status (admin)

## 🎨 Design Features

- **Bold & Colorful**: Orange-to-pink gradient hero section
- **Modern Fonts**: Bebas Neue for headings, Inter for body text
- **Responsive Design**: Works on desktop and mobile
- **Micro-animations**: Hover effects, smooth transitions
- **Professional UI**: Shadcn components for consistency
- **Color Indicators**: Visual color dots on product cards

## 📊 Sample Data

The database is pre-seeded with:
- 2 users (1 admin, 1 regular user)
- 8 sample products (4 men's, 4 women's T-shirts)
- Products include various sizes, colors, and price points
- High-quality T-shirt images from Unsplash and Pexels

## 🔄 Running the Application

Services are managed by supervisor:
```bash
sudo supervisorctl status        # Check status
sudo supervisorctl restart all   # Restart all services
```

### Backend
- Runs on port 8001
- Auto-reload enabled for development

### Frontend
- Runs on port 3000
- Hot module replacement enabled

### Database
- MongoDB running on localhost:27017
- Database name: test_database

## 🧪 Testing

Run the test script:
```bash
/tmp/test_api.sh
```

This tests:
- Product listing
- User login
- Admin login
- Cart operations
- Order management

## 🎯 Payment Gateway

Currently uses a **dummy payment gateway** for testing. In production, integrate:
- Stripe
- PayPal
- Or your preferred payment processor

## 📝 Image Management

### Admin Image Upload
Admins can select from 12 pre-loaded T-shirt images when creating products. Images are stored as:
- External URLs (Unsplash/Pexels)
- Metadata includes: filename, size, dimensions

### Future Enhancement
Implement actual file upload to:
- Local storage
- AWS S3
- Cloudinary

## 🔒 Security Considerations

Current implementation includes:
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control (admin/user)
- ✅ Input validation with Pydantic

For production, add:
- HTTPS only
- Rate limiting
- CSRF protection
- Environment variable security
- Proper secret key management

## 📈 Future Enhancements

1. **Product Reviews & Ratings**
2. **Wishlist functionality**
3. **Advanced search with filters**
4. **Email notifications for orders**
5. **Inventory management**
6. **Sales analytics dashboard**
7. **Discount codes & promotions**
8. **Social media integration**

## 🐛 Troubleshooting

### Backend not starting
```bash
tail -50 /var/log/supervisor/backend.err.log
```

### Frontend not loading
```bash
tail -50 /var/log/supervisor/frontend.err.log
```

### Database connection issues
```bash
sudo supervisorctl restart mongodb
```

## 📞 Support

For issues or questions:
- Check logs in `/var/log/supervisor/`
- Verify all services are running: `sudo supervisorctl status`
- Ensure MongoDB is accessible

## 🎉 Credits

Built with ❤️ using:
- React & Tailwind CSS
- FastAPI & MongoDB
- Shadcn UI Components
- Images from Unsplash & Pexels

---

**Version**: 1.0.0  
**Last Updated**: 2025
