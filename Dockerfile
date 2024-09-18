# Specify the base image with a specific Node.js version
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Pass the argument as an environment variable if it's needed by your application
ARG VITE_SOCKET_URL=https://www.dowellchat.uxlivinglab.online
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

# Expose the port the Vite app runs on
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]
