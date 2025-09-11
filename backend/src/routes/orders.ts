import { Request, Response, NextFunction } from 'express';
import { runQuery, getRow, getAllRows } from '../database/init';

// Orders routes
export const orderRoutes = {
  // Get all orders
  getOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await getAllRows(`
        SELECT o.*, u.username, u.email 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC
      `);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  },

  // Get order by ID with items
  getOrderById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      const order = await getRow(`
        SELECT o.*, u.username, u.email 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id 
        WHERE o.id = ?
      `, [id]);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      const items = await getAllRows(`
        SELECT oi.*, p.name as product_name 
        FROM order_items oi 
        LEFT JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = ?
      `, [id]);
      
      res.json({ ...order, items });
    } catch (error) {
      next(error);
    }
  },

  // Create order with items
  createOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, items } = req.body;
      
      if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'User ID and items array are required' });
      }
      
      let total_amount = 0;
      
      // Calculate total amount and validate products
      for (const item of items) {
        if (!item.product_id || !item.quantity || item.quantity <= 0) {
          return res.status(400).json({ error: 'Invalid item data' });
        }
        
        const product = await getRow('SELECT * FROM products WHERE id = ? AND is_active = 1', [item.product_id]);
        if (!product) {
          return res.status(404).json({ error: `Product with ID ${item.product_id} not found` });
        }
        
        if (product.stock_quantity < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for product ${product.name}` });
        }
        
        const itemTotal = product.price * item.quantity;
        total_amount += itemTotal;
        item.unit_price = product.price;
        item.total_price = itemTotal;
      }
      
      // Create order
      const orderResult = await runQuery(
        'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
        [user_id, total_amount]
      );
      
      // Create order items and update stock
      for (const item of items) {
        await runQuery(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
          [orderResult.id, item.product_id, item.quantity, item.unit_price, item.total_price]
        );
        
        await runQuery(
          'UPDATE products SET stock_quantity = stock_quantity - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
      
      // Get created order with details
      const newOrder = await getRow(`
        SELECT o.*, u.username, u.email 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id 
        WHERE o.id = ?
      `, [orderResult.id]);
      
      const orderItems = await getAllRows(`
        SELECT oi.*, p.name as product_name 
        FROM order_items oi 
        LEFT JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = ?
      `, [orderResult.id]);
      
      res.status(201).json({ ...newOrder, items: orderItems });
    } catch (error) {
      next(error);
    }
  },

  // Update order status
  updateOrderStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
      
      const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      const result = await runQuery(
        'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      const updatedOrder = await getRow(`
        SELECT o.*, u.username, u.email 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id 
        WHERE o.id = ?
      `, [id]);
      
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  },

  // Get orders analytics
  getOrdersAnalytics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const totalOrders = await getRow('SELECT COUNT(*) as count FROM orders');
      const totalRevenue = await getRow('SELECT SUM(total_amount) as total FROM orders WHERE status = "completed"');
      const pendingOrders = await getRow('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');
      
      const topProducts = await getAllRows(`
        SELECT p.name, SUM(oi.quantity) as total_sold, SUM(oi.total_price) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'completed'
        GROUP BY p.id, p.name
        ORDER BY total_sold DESC
        LIMIT 10
      `);
      
      const recentOrders = await getAllRows(`
        SELECT o.*, u.username 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC 
        LIMIT 10
      `);
      
      res.json({
        totalOrders: totalOrders.count,
        totalRevenue: totalRevenue.total || 0,
        pendingOrders: pendingOrders.count,
        topProducts,
        recentOrders
      });
    } catch (error) {
      next(error);
    }
  }
};
