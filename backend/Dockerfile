# Uses official Node.js image as the base
FROM node:18-alpine

# Sets working directory inside the container
WORKDIR /backend

# Copy first package.json and package-lock.json before npm install -
# (can speed up npm install process if cached docker image layers are available -
# prerequisite: no changes in copied files present)
COPY package.json package-lock.json ./

# Installs dependencies
RUN npm install

# Copies rest of the application files into the container (except listed files in .dockerignore)
COPY . .

# Runs Prisma commands to set up the database !!should be altered for real prod built!!
RUN npx prisma generate && \
    npx prisma db push

# Exposes the port the application will run on
EXPOSE 3001

# Starts the application
CMD ["node", "index.js"]