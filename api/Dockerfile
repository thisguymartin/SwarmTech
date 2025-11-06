FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose API port
EXPOSE 8001

# Start the server
CMD ["npm", "start"]
