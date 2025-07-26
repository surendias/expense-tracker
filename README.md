# 💰 Expense Tracker App

A full-featured personal expense and budgeting tracker. Track income and expenses, categorize entries, set monthly budgets, and visualize your financial performance over time.

Built with:
- React (Vite) frontend (served via Express)
- Express + Node.js backend
- MySQL + Prisma ORM
- Auth with JWT
- Fully containerized with Docker
- Ready for deployment on Google Cloud VM

---

## 📦 Features

- ✅ Email/password login
- ✅ Add/edit/delete entries (income/expense)
- ✅ Monthly filters
- ✅ Category-based grouping
- ✅ Inline category management
- ✅ Monthly budget setting per category
- ✅ Monthly spending limit
- ✅ Summary + Budget vs. Actual comparison
- ✅ Mobile-friendly UI

---

## 🏗️ Project Structure

```
.
├── backend
│   ├── prisma/             # Prisma schema & migrations
│   ├── routes/             # API routes (entries, auth, budgets, etc.)
│   ├── frontend/           # Compiled frontend files served by Express
│   └── index.js            # Express app
├── frontend
│   ├── src/                # React codebase
│   └── vite.config.js      # Vite config
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## 🚀 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

### 2. Set up `.env` in `/backend`

```env
DATABASE_URL=mysql://user:password@mysql:3306/db_expense_tracker
JWT_SECRET=your_jwt_secret
```

### 3. Run with Docker

This will:
- Create MySQL container
- Run Prisma migrations
- Build frontend
- Start Express backend (serving React app)

```bash
docker-compose up --build
```

Access app at: [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker Compose Overview

```yaml
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: db_expense_tracker
    ports:
      - "3306:3306"

  app:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - mysql
```

---

## ☁️ Deployment Guide (GCP VM)

1. Create a Compute Engine VM (Ubuntu/Debian preferred)
2. Install Docker + Docker Compose
3. Clone this repo and set `.env` inside `/backend`
4. Run:

```bash
docker-compose up --build -d
```

App will be live at your instance IP (port 3000)

---

## 🧪 Prisma DB Management

```bash
# Create & apply new migration
npx prisma migrate dev --name your_migration_name

# Push schema without creating migration (e.g., CI)
npx prisma db push

# View DB in browser (dev only)
npx prisma studio
```

---

## ✨ Credits

Created with ❤️ by Suren Dias.

---

## 📜 License

MIT License
