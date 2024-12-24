# Use Node.js 22 Alpine image as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the working directory
COPY package*.json . 

# Install dependencies
RUN npm install

# Copy the rest of the application code into the working directory
COPY . .

# Expose the port used by the frontend application
EXPOSE 5173

# Start the application in development mode
CMD ["npm", "run", "dev"]


