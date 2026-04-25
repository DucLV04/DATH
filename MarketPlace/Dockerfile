# Development Dockerfile for MarketPlace Frontend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Set environment variable for React dev server
ENV REACT_APP_API_URL=http://localhost:8080
ENV WDS_SOCKET_PORT=0
ENV CHOKIDAR_USEPOLLING=true

# Start the development server
CMD ["npm", "start"]
