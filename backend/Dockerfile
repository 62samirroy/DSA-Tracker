FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Remove dev dependencies after build (optional, to reduce image size)
RUN npm prune --production

EXPOSE 3000

# Run the compiled JavaScript
CMD ["npm", "start"]