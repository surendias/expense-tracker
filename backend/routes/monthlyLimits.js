import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// 🔐 Protect all routes
router.use(authenticateToken);

// 📌 GET /api/monthly-limits?month=YYYY-MM
router.get('/', async (req, res) => {
  const { month } = req.query;

  const limit = await prisma.monthlyLimit.findFirst({
    where: {
      userId: req.userId,
      ...(month && { month }),
    },
  });

  res.json(limit || null);
});

// ➕ POST /api/monthly-limits
router.post('/', async (req, res) => {
  const { month, amount } = req.body;

  if (!month || typeof amount !== 'number') {
    return res.status(400).json({ message: 'Month and amount are required' });
  }

  try {
    const newLimit = await prisma.monthlyLimit.create({
      data: {
        month,
        amount,
        userId: req.userId,
      },
    });
    res.status(201).json(newLimit);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Limit for this month already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📝 PUT /api/monthly-limits/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const existing = await prisma.monthlyLimit.findFirst({
    where: {
      id: parseInt(id),
      userId: req.userId,
    },
  });

  if (!existing) {
    return res.status(404).json({ message: 'Monthly limit not found' });
  }

  const updated = await prisma.monthlyLimit.update({
    where: { id: existing.id },
    data: { amount },
  });

  res.json(updated);
});

// ❌ DELETE /api/monthly-limits/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.monthlyLimit.findFirst({
    where: {
      id: parseInt(id),
      userId: req.userId,
    },
  });

  if (!existing) {
    return res.status(404).json({ message: 'Not found' });
  }

  await prisma.monthlyLimit.delete({
    where: { id: existing.id },
  });

  res.status(204).end();
});

export default router;
