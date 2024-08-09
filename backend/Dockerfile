FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and nodemon globally
RUN npm install && npm install -g nodemon

# Copy the src directory
COPY src ./src

# Copy any other necessary files (e.g., configuration files)
COPY nodemon.json ./

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application using nodemon in development
CMD ["nodemon", "src/server.js"]
