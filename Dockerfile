# Use a smaller Node.js runtime for better performance
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy the rest of the application files
COPY . .

# Set environment variable for Cloud Run
ENV PORT=8080

# Create and switch to a non-root user
RUN useradd --create-home appuser
USER appuser

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["node", "src/index.js"]
