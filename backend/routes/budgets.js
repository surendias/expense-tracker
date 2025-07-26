// backend/routes/budgets.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

// GET /api/budgets?month=YYYY-MM
router.get('/', async (req, res) => {
  const { month } = req.query;

  const budgets = await prisma.budget.findMany({
    where: {
      userId: req.userId,
      ...(month ? { month } : {})
    },
    include: { category: true },
    orderBy: { month: 'desc' },
  });

  res.json(budgets);
});

// POST /api/budgets
router.post('/', async (req, res) => {
  console.log('Creating budget:', req.body);
  const { month, categoryId, amount } = req.body;

  if (!month || !categoryId || amount == null)
    return res.status(400).json({ message: 'month, categoryId and amount are required' });

  const existing = await prisma.budget.findFirst({
    where: {
      userId: req.userId,
      month,
      categoryId,
    },
  });

  if (existing) {
    return res.status(409).json({ message: 'Budget already exists for this category and month' });
  }

  const budget = await prisma.budget.create({
    data: {
      userId: req.userId,
      month,
      categoryId,
      amount: parseFloat(amount),
    },
  });

  res.status(201).json(budget);
});

// PUT /api/budgets/:id
router.put('/:id', async (req, res) => {
  const { amount } = req.body;
  const { id } = req.params;

  const budget = await prisma.budget.findFirst({
    where: { id: parseInt(id), userId: req.userId },
  });

  if (!budget) return res.status(404).json({ message: 'Not found' });

  const updated = await prisma.budget.update({
    where: { id: budget.id },
    data: { amount: parseFloat(amount) },
  });

  res.json(updated);
});

// DELETE /api/budgets/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const budget = await prisma.budget.findFirst({
    where: { id: parseInt(id), userId: req.userId },
  });

  if (!budget) return res.status(404).json({ message: 'Not found' });

  await prisma.budget.delete({ where: { id: budget.id } });
  res.status(204).end();
});

export default router;
