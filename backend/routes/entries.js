// backend/routes/entries.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Apply JWT middleware
router.use(authenticateToken);

// GET /api/entries?month=2025-07&type=expense&categoryId=2
router.get('/', async (req, res) => {
  const { month, type, categoryId } = req.query;

  const whereClause = {
    userId: req.userId,
  };

  if (type) whereClause.type = type;
  if (categoryId) whereClause.categoryId = parseInt(categoryId);

  // If month is provided, filter dates by the month
  if (month) {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    whereClause.date = {
      gte: startDate,
      lt: endDate,
    };
  }

  const entries = await prisma.entry.findMany({
    where: whereClause,
    include: { category: true },
    orderBy: { date: 'desc' },
  });

  res.json(entries);
});


// POST /api/entries - create new entry
router.post('/', async (req, res) => {
  try {
    const { date, account, amount, type, categoryId } = req.body;

    const parsedCategoryId = parseInt(categoryId, 10);
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Check if category belongs to user
    const category = await prisma.category.findFirst({
      where: { id: parsedCategoryId, userId: req.userId },
    });

    if (!category) return res.status(400).json({ message: 'Invalid category' });

    const entry = await prisma.entry.create({
      data: {
        date: new Date(date),
        account,
        amount: parseFloat(amount),
        type,
        categoryId: parsedCategoryId,
        userId: req.userId,
      },
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create entry' });
  }
});

// PUT /api/entries/:id - update entry
router.put('/:id', async (req, res) => {
  try {
    const entryId = parseInt(req.params.id, 10);
    const { date, account, amount, type, categoryId } = req.body;

    if (isNaN(entryId)) return res.status(400).json({ message: 'Invalid entry ID' });

    const existing = await prisma.entry.findFirst({
      where: { id: entryId, userId: req.userId },
    });

    if (!existing) return res.status(404).json({ message: 'Entry not found' });

    const parsedCategoryId = parseInt(categoryId, 10);
    if (isNaN(parsedCategoryId)) return res.status(400).json({ message: 'Invalid category ID' });

    const updated = await prisma.entry.update({
      where: { id: existing.id },
      data: {
        date: new Date(date),
        account,
        amount: parseFloat(amount),
        type,
        categoryId: parsedCategoryId,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update entry' });
  }
});


// DELETE /api/entries/:id - delete entry
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.entry.findFirst({
    where: { id: parseInt(id), userId: req.userId },
  });

  if (!existing) return res.status(404).json({ message: 'Entry not found' });

  await prisma.entry.delete({ where: { id: existing.id } });

  res.status(204).end();
});

export default router;
