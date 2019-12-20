FROM node:7

# Set timezone
RUN echo America/Fortaleza | tee /etc/timezone && dpkg-reconfigure --frontend noninteractive tzdata

# Creating app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app

RUN npm install
RUN npm install -g nodemon

# Bundle app source
COPY . /usr/src/app

CMD ["yarn", "start"]