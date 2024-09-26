# Use the latest Node.js 22 image as the base
FROM node:22

# Set the environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Corepack acts as a proxy for npm, yarn, and pnpm
# They do not need to be installed globally
RUN corepack enable 

# Set the store directory for pnpm
RUN pnpm config set store-dir /app/.pnpm-store/v3 --global

# Install global dependencies using pnpm
RUN pnpm add -g typescript@^5.6.2 nodemon@^3.1.7 ts-node@^10.9.2

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json to cache dependencies
COPY ./package.json ./pnpm-lock.yaml ./

# Install project dependencies using pnpm
RUN pnpm install

# Copy the rest of the project files into the container
COPY . .

# Expose any required ports (optional)
# EXPOSE 3000

# Define the command to start the application
CMD ["pnpm", "run", "dev"]