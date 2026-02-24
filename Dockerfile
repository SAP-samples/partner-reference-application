################################################
# BUILDER - executed CDS build
################################################

FROM alpine:3.20 as builder

RUN apk add -U --no-cache nodejs npm

WORKDIR /usr/src/build
COPY package*.json .
COPY db db
COPY mtx mtx
COPY srv srv

RUN ["npm", "ci"]
RUN ["npx", "--package=@sap/cds-dk@9", "cds", "build", "--production"]

WORKDIR /usr/src/build/gen/srv
RUN ["npm", "ci", "--production"]

################################################
# RUNNER - base node runner for all targets
################################################

FROM alpine:3.20 as runner

RUN addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node

RUN apk add -U --no-cache nodejs npm \
    && apk -U upgrade \
    && npm update -g npm

USER node

################################################
# SERVER (target: srv)
################################################

FROM runner AS srv

WORKDIR /usr/src/app
COPY --chown=node:node --from=builder /usr/src/build/gen/srv/ /usr/src/app/
ENV NODE_ENV=production

CMD ["node", "node_modules/@sap/cds/bin/serve.js"]
