FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy all server code
COPY . .

# Expose the Realtime Socket IO port
EXPOSE 3001

# Command to run the application
CMD ["node", "server.js"]
