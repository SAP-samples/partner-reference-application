FROM node:lts-slim AS builder

WORKDIR /usr/src/build
RUN mkdir html5-deployer

COPY poetryslams poetryslams/
RUN npm ci --prefix  poetryslams
RUN npm run build:copy --prefix  poetryslams

COPY visitors visitors/
RUN npm ci --prefix  visitors
RUN npm run build:copy --prefix  visitors

FROM sapse/html5-app-deployer:7.2.1 AS runner

# Bundle app source
COPY --from=builder /usr/src/build/html5-deployer/  .

CMD [ "npm", "start" ]