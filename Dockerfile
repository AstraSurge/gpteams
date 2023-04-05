ARG VITE_APP_NAME
ARG VITE_GLOB_OPEN_LONG_REPLY
# build front-end
FROM node:lts-alpine AS frontend

WORKDIR /app

COPY ./package.json /app

COPY ./yarn.lock /app

RUN yarn --frozen-lockfile

COPY . /app

ARG VITE_APP_NAME
ARG VITE_GLOB_OPEN_LONG_REPLY
RUN yarn build

# build backend
FROM node:lts-alpine as backend

WORKDIR /app

COPY /service/package.json /app

COPY /service/yarn.lock /app

RUN yarn --frozen-lockfile

COPY /service /app

RUN yarn build

# service
FROM node:lts-alpine

WORKDIR /app

COPY --from=frontend /app/dist /app/public

COPY --from=backend /app/package.json /app
COPY --from=backend /app/node_modules /app/node_modules
COPY --from=backend /app/build /app/build

EXPOSE 3002

CMD ["yarn", "run", "prod"]
