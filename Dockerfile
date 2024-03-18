# Use official Node.js image as base
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for backend
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY . .

# Set working directory for frontend
WORKDIR /app/frontend

# Copy package.json and package-lock.json for frontend
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ .

# Build the React app
RUN npm run build

# Expose port for Express server
EXPOSE 5000

# Command to run the backend
CMD ["node", "server.js"]
