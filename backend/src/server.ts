import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/init';
import { userRoutes } from './routes/users';
import { productRoutes } from './routes/products';
import { categoryRoutes } from './routes/categories';
import { orderRoutes } from './routes/orders';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for Expo
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:8081',
  'http://localhost:19006',
  'exp://192.168.1.100:19000' // Replace with your IP
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Sample POS API Server', 
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      products: '/api/products', 
      categories: '/api/categories',
      orders: '/api/orders'
    }
  });
});

// Users routes
app.get('/api/users', userRoutes.getUsers);
app.get('/api/users/:id', userRoutes.getUserById);
app.post('/api/users', userRoutes.createUser);
app.put('/api/users/:id', userRoutes.updateUser);
app.delete('/api/users/:id', userRoutes.deleteUser);

// Products routes
app.get('/api/products', productRoutes.getProducts);
app.get('/api/products/:id', productRoutes.getProductById);
app.post('/api/products', productRoutes.createProduct);
app.put('/api/products/:id', productRoutes.updateProduct);
app.delete('/api/products/:id', productRoutes.deleteProduct);
app.patch('/api/products/:id/stock', productRoutes.updateStock);

// Categories routes
app.get('/api/categories', categoryRoutes.getCategories);
app.get('/api/categories/:id', categoryRoutes.getCategoryById);
app.post('/api/categories', categoryRoutes.createCategory);
app.put('/api/categories/:id', categoryRoutes.updateCategory);
app.delete('/api/categories/:id', categoryRoutes.deleteCategory);

// Orders routes
app.get('/api/orders', orderRoutes.getOrders);
app.get('/api/orders/analytics', orderRoutes.getOrdersAnalytics);
app.get('/api/orders/:id', orderRoutes.getOrderById);
app.post('/api/orders', orderRoutes.createOrder);
app.patch('/api/orders/:id/status', orderRoutes.updateOrderStatus);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err);
  
  if (err.message.includes('CORS')) {
    return res.status(403).json({ error: 'CORS policy violation' });
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📖 API documentation available at http://localhost:${PORT}/api`);
      console.log(`🏥 Health check at http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🛑 SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
