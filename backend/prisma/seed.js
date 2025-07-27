// backend/prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

    // Clean up existing demo data
  await prisma.entry.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const usersData = [
    { email: 'alice@example.com', password: 'password123' },
    { email: 'bob@example.com', password: 'password123' },
  ];

  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
      },
    });

    const defaultCategories = [
      { name: 'Food', type: 'expense' },
      { name: 'Transport', type: 'expense' },
      { name: 'Utilities', type: 'expense' },
      { name: 'Salary', type: 'income' },
    ];

    const createdCategories = await Promise.all(
      defaultCategories.map(cat =>
        prisma.category.create({
          data: { ...cat, userId: user.id },
        })
      )
    );

    // Create sample entries
    const sampleEntries = [
      {
        date: new Date('2025-07-01'),
        account: 'Visa',
        amount: 45.5,
        type: 'expense',
        categoryId: createdCategories.find(c => c.name === 'Food')?.id,
      },
      {
        date: new Date('2025-07-05'),
        account: 'Cash',
        amount: 20.0,
        type: 'expense',
        categoryId: createdCategories.find(c => c.name === 'Transport')?.id,
      },
      {
        date: new Date('2025-07-10'),
        account: 'Bank Transfer',
        amount: 1500.0,
        type: 'income',
        categoryId: createdCategories.find(c => c.name === 'Salary')?.id,
      },
    ];

    await Promise.all(
      sampleEntries.map(entry =>
        prisma.entry.create({
          data: {
            ...entry,
            userId: user.id,
          },
        })
      )
    );

    console.log(`Seeded user: ${user.email}`);
  }

  console.log('✅ Demo data seeded');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });