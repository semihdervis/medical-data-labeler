# Multi-stage build for frontend and backend
FROM node:18-alpine AS frontend-build

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production --silent
COPY frontend/ ./

# Set production environment for build
ENV NODE_ENV=production
RUN npm run build

# Backend stage
FROM node:18-alpine

# Install dependencies for backend
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production --silent

# Copy backend source
COPY server/ ./

# Copy built frontend to backend static directory
COPY --from=frontend-build /app/frontend/dist ./public

# Create necessary directories for file uploads and data
RUN mkdir -p uploads projects data

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
