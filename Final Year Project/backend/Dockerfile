# This retrieves the 'nede18.18.0' image either locally or from Dockerhub.
FROM node:18.18.0

# Here '-g' is used as a 'global' command to install 'nodemon' globally.
RUN npm install -g nodemon

# This sets the working directory of the file structure within the container.
WORKDIR /backend

# Here 'layer caching' is implemented to copy the 'package.json' file before the rest of the code. This is done so that if the application code is changed when rebuilding the image
# if the package.json file hasn't been changed it can be sourced from the cache increasing the image rebuild efficiency greatly speeding up the process.
COPY package.json .

# This runs the 'npm install' command within the the container installing all of the dependencies from the 'package.jason' filethat was copied accross.
RUN npm install
# This runs the 'npm rebuild bcrypt --build-from-source' command within the the container specifically installing the dependencies for 'bcrypt' from it's source.
RUN npm rebuild bcrypt --build-from-source

# This copies all the source code from this directory (single dot   .) to the root directory (single dot    .) in the image.
COPY . .

# This exposes port 9000 on the container to enable a connection.
EXPOSE 9000

# This specifies what commands should be run at runtime once the container has been spun up and running.
# Here the 'npm run dev' command is used to run 'nodemon'.
CMD ["npm", "run", "dev"]