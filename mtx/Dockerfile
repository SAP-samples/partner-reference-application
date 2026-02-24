################################################
# BUILDER - executed CDS build
################################################

FROM alpine:3.20 as builder

RUN apk add -U --no-cache nodejs npm

WORKDIR /usr/src/build
COPY package*.json .cdsrc.json ./
COPY db db
COPY mtx mtx
COPY srv srv

RUN ["npm", "ci"] 
RUN ["npx", "cds", "build", "--for", "mtx-sidecar", "--production"]

WORKDIR /usr/src/build/gen/mtx/sidecar
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
# SERVER (target: mtx)
################################################

FROM runner AS mtx

WORKDIR /usr/src/srv

# copy tsc compiled result from builder
COPY --chown=node:node --from=builder /usr/src/build/gen/mtx/sidecar .

ENV NODE_ENV=production