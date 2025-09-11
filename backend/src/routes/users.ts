import { Request, Response, NextFunction } from 'express';
import { runQuery, getRow, getAllRows } from '../database/init';

// Users routes
export const userRoutes = {
  // Get all users
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await getAllRows('SELECT * FROM users ORDER BY created_at DESC');
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  // Get user by ID
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await getRow('SELECT * FROM users WHERE id = ?', [id]);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  // Create user
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email } = req.body;
      
      if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required' });
      }
      
      const result = await runQuery(
        'INSERT INTO users (username, email) VALUES (?, ?)',
        [username, email]
      );
      
      const newUser = await getRow('SELECT * FROM users WHERE id = ?', [result.id]);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      next(error);
    }
  },

  // Update user
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { username, email } = req.body;
      
      const result = await runQuery(
        'UPDATE users SET username = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [username, email, id]
      );
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const updatedUser = await getRow('SELECT * FROM users WHERE id = ?', [id]);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  // Delete user
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      const result = await runQuery('DELETE FROM users WHERE id = ?', [id]);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};
