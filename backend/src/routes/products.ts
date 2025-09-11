import { Request, Response, NextFunction } from 'express';
import { runQuery, getRow, getAllRows } from '../database/init';

// Products routes
export const productRoutes = {
  // Get all products
  getProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await getAllRows(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.is_active = 1
        ORDER BY p.created_at DESC
      `);
      res.json(products);
    } catch (error) {
      next(error);
    }
  },

  // Get product by ID
  getProductById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await getRow(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.id = ? AND p.is_active = 1
      `, [id]);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  // Create product
  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price, category_id, stock_quantity } = req.body;
      
      if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
      }
      
      const result = await runQuery(
        'INSERT INTO products (name, description, price, category_id, stock_quantity) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, category_id, stock_quantity || 0]
      );
      
      const newProduct = await getRow(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.id = ?
      `, [result.id]);
      
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  },

  // Update product
  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, description, price, category_id, stock_quantity, is_active } = req.body;
      
      const result = await runQuery(
        `UPDATE products SET 
         name = ?, description = ?, price = ?, category_id = ?, 
         stock_quantity = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [name, description, price, category_id, stock_quantity, is_active, id]
      );
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const updatedProduct = await getRow(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.id = ?
      `, [id]);
      
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },

  // Delete product (soft delete)
  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      const result = await runQuery(
        'UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Update stock quantity
  updateStock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number') {
        return res.status(400).json({ error: 'Quantity must be a number' });
      }
      
      const result = await runQuery(
        'UPDATE products SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [quantity, id]
      );
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const updatedProduct = await getRow(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.id = ?
      `, [id]);
      
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }
};
