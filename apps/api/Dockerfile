FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/api/src ./src

# Build the application
RUN pnpm build:api

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 3001

# Start the application
CMD ["pnpm", "start"]