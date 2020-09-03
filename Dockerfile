FROM node:14.4.0-alpine as base

WORKDIR /gobarber/

COPY package.json yarn.lock tsconfig.json .eslintignore .eslintrc.json prettier.config.js /gobarber/

RUN yarn --pure-lockfile

COPY ormconfig.docker.json /gobarber/ormconfig.json

COPY src /gobarber/src/

EXPOSE 3333

FROM base as development

CMD yarn start
