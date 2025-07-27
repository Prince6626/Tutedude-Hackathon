# StreetSmart Supply - Local Database Setup

A marketplace platform connecting street food vendors with suppliers, now with a local SQLite database backend.

## Features

- **Local SQLite Database**: Complete local database solution with Express.js backend
- **User Authentication**: JWT-based authentication with role-based access
- **Product Management**: Browse and search products with filtering
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: Place orders and track order history
- **Role-Based Access**: Separate dashboards for vendors, suppliers, and admins

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js with Express.js
- SQLite database
- JWT authentication
- bcryptjs for password hashing

## Database Schema

### Tables
1. **users** - User accounts (vendors, suppliers, admins)
2. **products** - Product catalog with supplier relationships
3. **orders** - Order management with vendor/supplier relationships
4. **order_items** - Individual items within orders
5. **cart_items** - Shopping cart functionality

### Sample Data
The application comes with pre-loaded sample data:
- **Admin User**: admin@streetsmart.com / password
- **Supplier**: seller@example.com / password (Green Valley Farms)
- **Vendor**: vendor@example.com / password (Maria's Tacos)
- **Sample Products**: Fresh tomatoes, ground beef, organic bananas

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd project-12
npm install
```

### 2. Start the Backend Server
```bash
npm run server
```
This will:
- Start the Express server on port 3001
- Create and initialize the SQLite database
- Insert sample data
- Set up all API endpoints

### 3. Start the Frontend Development Server
```bash
npm run dev
```
This will start the React development server on port 5173.

### 4. Run Both Servers Together
```bash
npm run dev:full
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/:id` - Get specific product

### Cart
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

### Users (Admin Only)
- `GET /api/users` - Get all users

## Usage

### 1. Access the Application
Open your browser and navigate to `http://localhost:5173`

### 2. Login with Sample Accounts
- **Vendor**: vendor@example.com / password
- **Supplier**: seller@example.com / password  
- **Admin**: admin@streetsmart.com / password

### 3. Vendor Workflow
1. Login as a vendor
2. Browse the marketplace
3. Add products to cart
4. Complete checkout process
5. View order history

### 4. Supplier Workflow
1. Login as a supplier
2. View incoming orders
3. Manage product inventory
4. Update order status

### 5. Admin Workflow
1. Login as admin
2. Manage users
3. View platform analytics
4. Monitor transactions

## Database Management

### View Database
```bash
sqlite3 database.sqlite
```

### Common SQLite Commands
```sql
-- View all tables
.tables

-- View table schema
.schema users

-- View sample data
SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM orders;

-- Exit SQLite
.quit
```

### Reset Database
To reset the database and start fresh:
```bash
rm database.sqlite
npm run server
```

## File Structure

```
project-12/
├── server/
│   └── index.js              # Express server with all API endpoints
├── src/
│   ├── components/           # React components
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication context
│   ├── services/
│   │   └── api.ts           # API service layer
│   ├── pages/               # Page components
│   └── App.tsx              # Main app component
├── database.sqlite          # SQLite database file
├── package.json
└── README.md
```

## Environment Variables

Create a `.env` file in the root directory for production:

```env
PORT=3001
JWT_SECRET=your-secure-secret-key
NODE_ENV=production
```

## Development

### Adding New Features
1. **Database Changes**: Modify the `initializeDatabase()` function in `server/index.js`
2. **API Endpoints**: Add new routes in `server/index.js`
3. **Frontend**: Create new components and update the API service

### Database Migrations
For production, consider using a migration tool like `knex` or `sequelize` for database schema management.

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill existing processes
   pkill -f "node server"
   npm run server
   ```

2. **Database Locked**
   ```bash
   # Remove and recreate database
   rm database.sqlite
   npm run server
   ```

3. **CORS Issues**
   - Ensure the backend is running on port 3001
   - Check that the frontend is making requests to `http://localhost:3001/api`

4. **Authentication Issues**
   - Clear browser localStorage
   - Check that JWT tokens are being sent in Authorization headers

### Debug Mode
To enable debug logging, set the environment variable:
```bash
DEBUG=* npm run server
```

## Production Deployment

### Backend Deployment
1. Set up a production database (PostgreSQL recommended)
2. Configure environment variables
3. Set up proper JWT secrets
4. Enable HTTPS
5. Set up proper CORS configuration

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure the API base URL for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 