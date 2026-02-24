FROM sapse/approuter:20.8.7

# Create app directory
RUN mkdir -p /app
RUN chown node:node /app

WORKDIR /app

# Bundle app source
COPY . .

CMD [ "npm", "start" ]