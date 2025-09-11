# Sample POS - Full Stack Setup

A complete Point of Sale (POS) application built with Expo + Electron frontend and Express TypeScript backend with SQLite database.

## Project Structure

```
sample-pos/
├── src/                          # Frontend components (Expo/Electron)
├── backend/                      # Express TypeScript API server
│   ├── src/
│   │   ├── server.ts            # Main server file
│   │   ├── database/
│   │   │   └── init.ts          # Database initialization
│   │   └── routes/              # API route handlers
│   │       ├── users.ts
│   │       ├── products.ts
│   │       ├── categories.ts
│   │       └── orders.ts
│   ├── package.json
│   └── .env.example
├── SimpleDatabaseDemo.ts         # Database integration demo
├── AppIntegration.ts            # App-level integration example
└── package.json                 # Root package.json with scripts
```

## Features

### Backend API
- ✅ Express TypeScript server with CORS for Expo
- ✅ SQLite database with full CRUD operations
- ✅ RESTful API endpoints for:
  - Users management
  - Products catalog with stock tracking
  - Categories organization
  - Orders with items and analytics
- ✅ Comprehensive error handling and validation
- ✅ Health checks and API documentation
- ✅ Graceful shutdown handling

### Frontend Integration
- ✅ Cross-platform database architecture
- ✅ Platform detection (mobile vs desktop)
- ✅ APIDataService for mobile (REST API calls)
- ✅ SQLiteDataService for desktop (direct SQLite)
- ✅ Complete usage examples and demos

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (root, expo-app, and backend)
npm run setup
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your preferences (optional)
```

### 3. Run Full Stack Development

```bash
# Run both backend API server and Expo dev server
npm run dev:fullstack
```

This will start:
- **Backend API**: http://localhost:3001
- **Expo Dev Server**: http://localhost:8081 (or 19006)

### 4. Alternative: Run Services Separately

```bash
# Terminal 1: Start backend API server
npm run backend:dev

# Terminal 2: Start Expo development server  
npm run expo:dev

# Terminal 3: Start Electron (desktop)
npm run dev:watch
```

## API Endpoints

### Base URL: `http://localhost:3001`

#### Health & Info
- `GET /health` - Health check
- `GET /api` - API documentation

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product (soft delete)
- `PATCH /api/products/:id/stock` - Update stock quantity

#### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/analytics` - Get orders analytics
- `GET /api/orders/:id` - Get order by ID with items
- `POST /api/orders` - Create order with items
- `PATCH /api/orders/:id/status` - Update order status

## Database Integration Usage

### For Mobile App (Expo)

```typescript
import { SimpleDatabaseDemo } from './SimpleDatabaseDemo';

const dbDemo = new SimpleDatabaseDemo();

// Initialize (uses REST API)
await dbDemo.initialize();

// Create user
const user = await dbDemo.createUser('john_doe', 'john@example.com');

// Get products
const products = await dbDemo.getAllProducts();
```

### For Desktop App (Electron)

```typescript
import { SimpleDatabaseDemo } from './SimpleDatabaseDemo';

const dbDemo = new SimpleDatabaseDemo();

// Initialize (uses SQLite directly)  
await dbDemo.initialize();

// Same API, different implementation under the hood
const user = await dbDemo.createUser('desktop_user', 'desktop@example.com');
```

### App Integration

```typescript
import { AppWithDatabase } from './AppIntegration';

export default function App() {
  return <AppWithDatabase />;
}
```

## Sample API Requests

### Create User
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com"}'
```

### Create Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Coffee Mug",
    "description": "Ceramic coffee mug",
    "price": 12.99,
    "category_id": 1,
    "stock_quantity": 50
  }'
```

### Create Order
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "items": [
      {"product_id": 1, "quantity": 2}
    ]
  }'
```

## Development Scripts

```bash
# Setup all dependencies
npm run setup

# Run full stack (backend + expo)
npm run dev:fullstack

# Backend only
npm run backend:dev     # Development with hot reload
npm run backend:build   # Build for production
npm run backend:start   # Start production build

# Frontend only
npm run expo:dev        # Expo development server
npm run dev:watch      # Electron with Expo (desktop)

# Build
npm run build          # Build everything
npm run dist          # Create distribution
```

## Environment Variables

Backend (`.env`):
```env
NODE_ENV=development
PORT=3001
DB_PATH=./database.sqlite
DB_VERBOSE=true
ALLOWED_ORIGINS=http://localhost:8081,http://localhost:19006
```

## Troubleshooting

### CORS Issues
- Ensure your Expo development server URL is in `ALLOWED_ORIGINS`
- Check your local IP address if testing on physical device

### Database Issues
- Database file will be created automatically
- Check `DB_PATH` in environment variables
- Enable `DB_VERBOSE=true` for SQL debugging

### Connection Issues
- Verify backend is running on http://localhost:3001
- Check Expo is running on expected port
- Ensure firewall allows local connections

## Production Deployment

### Backend
```bash
cd backend
npm run build
npm run start
```

### Frontend
```bash
npm run build
npm run dist
```

## Next Steps

1. **Authentication**: Add JWT authentication
2. **Real-time**: Implement WebSocket for real-time updates
3. **Images**: Add product image upload/management
4. **Reports**: Extend analytics with charts
5. **Mobile**: Test on physical devices
6. **Desktop**: Package Electron app for distribution
