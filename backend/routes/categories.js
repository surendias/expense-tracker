// backend/routes/categories.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Protect all routes below
router.use(authenticateToken);

// GET /api/categories
router.get('/', async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { userId: req.userId },
    orderBy: { name: 'asc' },
  });
  res.json(categories);
});

// POST /api/categories
router.post('/', async (req, res) => {
  const { name, type } = req.body;

  if (!type) return res.status(400).json({ message: 'Category type is required' });

  const category = await prisma.category.create({
    data: {
      name,
      type,
      userId: req.userId,
    },
  });

  res.status(201).json(category);
});


// PUT /api/categories/:id
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  // Ensure ownership
  const category = await prisma.category.findFirst({
    where: { id: parseInt(id), userId: req.userId },
  });

  if (!category) return res.status(404).json({ message: 'Not found' });

  const updated = await prisma.category.update({
    where: { id: category.id },
    data: { name },
  });

  res.json(updated);
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const category = await prisma.category.findFirst({
    where: { id: parseInt(id), userId: req.userId },
  });

  if (!category) return res.status(404).json({ message: 'Not found' });

  await prisma.category.delete({ where: { id: category.id } });
  res.status(204).end();
});

export default router;
