import { Request, Response, NextFunction } from 'express';
import { runQuery, getRow, getAllRows } from '../database/init';

// Categories routes
export const categoryRoutes = {
  // Get all categories
  getCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await getAllRows('SELECT * FROM categories ORDER BY name ASC');
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },

  // Get category by ID
  getCategoryById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await getRow('SELECT * FROM categories WHERE id = ?', [id]);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  // Create category
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      
      const result = await runQuery(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [name, description]
      );
      
      const newCategory = await getRow('SELECT * FROM categories WHERE id = ?', [result.id]);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  },

  // Update category
  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      const result = await runQuery(
        'UPDATE categories SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, description, id]
      );
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      const updatedCategory = await getRow('SELECT * FROM categories WHERE id = ?', [id]);
      res.json(updatedCategory);
    } catch (error) {
      next(error);
    }
  },

  // Delete category
  deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Check if category has products
      const productsCount = await getRow('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [id]);
      
      if (productsCount.count > 0) {
        return res.status(400).json({ error: 'Cannot delete category with associated products' });
      }
      
      const result = await runQuery('DELETE FROM categories WHERE id = ?', [id]);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};
