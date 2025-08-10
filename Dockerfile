# Multi-stage build for production
FROM node:20-alpine AS builder

# Install dependencies for building
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy server
COPY --from=builder /app/server ./server
WORKDIR /app/server
RUN npm ci --only=production && npm cache clean --force
RUN npm run build

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

# Expose port
EXPOSE 5175

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5175/health || exit 1

# Start the application
CMD ["node", "server/dist/server.js"]
