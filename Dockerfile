# Use the official Node.js image as the base image
FROM node:16

# Create and set the working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the entire project to the container's working directory
COPY . .

# Expose the port your application will listen on (if applicable)
EXPOSE 3000

# Specify the command to run your application
CMD ["yarn", "start:prod"]
