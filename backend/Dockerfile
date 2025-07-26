# backend/Dockerfile
FROM node:18

# Set working dir
WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy entire backend (including frontend build output)
COPY backend .

# Install Prisma CLI globally (or include in dev deps)
RUN npx prisma generate

# Build step for frontend (served from backend/frontend)
RUN npm run build:frontend

# Expose server port
EXPOSE 3000

CMD ["node", "index.js"]
