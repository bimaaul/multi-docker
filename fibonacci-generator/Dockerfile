FROM node:alpine as builder
WORKDIR '/app'

COPY ./package.json ./
RUN yarn install

COPY . .
RUN yarn build

FROM nginx
EXPOSE 5137
COPY ./nginx/default.conf /etc/nginx/conf.d/default.confg
COPY --from=builder /app/dist /usr/share/nginx/html