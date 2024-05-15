# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /.

# Copy package.json (and package-lock.json if available) from the oracle-docker directory to the current working directory in the container
COPY ./package*.json ./

# Copy the rest of the application code into the container
COPY ./ ./

# Specify the command to run when the container starts
CMD [ "npm", "start" ]