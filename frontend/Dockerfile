# Use a Node.js image for building Svelte
FROM node:18-alpine


# Set the working directory inside the container
WORKDIR /home/app/frontend

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite app
RUN npm run build

