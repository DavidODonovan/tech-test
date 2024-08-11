FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./


# Install dependencies and Nest CLI globally
RUN npm install && npm install -g @nestjs/cli

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application in development mode
CMD ["npm", "run", "start:dev"]
