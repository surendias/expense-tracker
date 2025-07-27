# Dockerfile in project root
FROM node:18

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy full code
COPY backend ./backend
COPY frontend ./frontend

# Build frontend
RUN cd frontend && npm run build

# Move built frontend into backend/frontend folder
RUN rm -rf backend/frontend && cp -r frontend/dist backend/frontend

# Generate Prisma client
RUN cd backend && npx prisma generate

# Add non-root user
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Change ownership of app folder
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

WORKDIR /app/backend
EXPOSE 3000
CMD ["npm", "run", "start"]