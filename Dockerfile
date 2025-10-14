FROM node:18-alpine

WORKDIR /workspace

# Copy root package.json for workspace commands
COPY package*.json ./

# Copy server package files and install dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy all source code
COPY . .

# Build the Next.js application
RUN cd server && npm run build

# Expose port
EXPOSE 8082

# Start the Next.js application
CMD ["npm", "start"]
