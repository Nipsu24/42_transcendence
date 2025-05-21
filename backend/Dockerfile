# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /backend

# Copy package.json and package-lock.json first to leverage Docker's caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Run Prisma commands to set up the database
RUN npx prisma generate && \
    npx prisma db push && \
    npx prisma db seed

# Expose the port the application will run on
EXPOSE 3001

# Start the application
CMD ["node", "index.js"]