FROM node:12

WORKDIR /app/server

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

EXPOSE 5000

ENV NODE_ENV=development

RUN yarn global add nodemon

CMD [ "yarn", "dev" ]