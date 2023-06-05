FROM node:18.15.0-alpine3.17 AS builder

ARG API_PREFIX
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_LOGIN_URI
ENV VITE_API_PREFIX=$API_PREFIX
ENV VITE_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_LOGIN_URI=$GOOGLE_LOGIN_URI

WORKDIR /usr/src/app

RUN apk update && \
    apk add --no-cache git 

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm i

COPY . .

RUN pnpm build

FROM node:18.15.0-alpine3.17

WORKDIR /usr/src/app

RUN apk update && \
    apk add --no-cache git 

RUN npm install -g pnpm

COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm i --ignore-scripts --prod

CMD ["node", "build"]
