# Use an official Node runtime as the parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the public folder
COPY public ./public

# Copy the src folder
COPY src ./src

# Build the app
RUN npm run build

# Install a simple server for serving static content
RUN npm install -g serve

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["serve", "-s", "build", "-l", "3000"]