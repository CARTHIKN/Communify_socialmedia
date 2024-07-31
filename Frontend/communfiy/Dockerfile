FROM node:21-alpine

RUN npm install -g vite

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD ["vite", "--host", "0.0.0.0"]





# FROM node:alpine


# WORKDIR /app

# COPY package*.json ./

# RUN npm install -g npm@10.4.0

# COPY . .


# RUN npm run build


# RUN npm install -g serve


# CMD ["serve", "-s", "build"]






# # Use a leaner base image
# FROM node:18-alpine

# # Create app directory
# WORKDIR /app

# # Copy package.json first for efficient layer caching
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Expose the development server port
# EXPOSE 5173

# # Start the development server
# CMD ["vite", "dev", "--host", "0.0.0.0"]
