FROM node:latest AS build
WORKDIR /app
COPY package.json package-lock.json /app/
COPY . .
RUN npm install

RUN npx prisma generate
RUN npm run build

FROM node:latest
WORKDIR /app
COPY --from=build /app/build /app/
COPY --from=build /app/node_modules /app/node_modules
COPY package.json package-lock.json /app/
COPY src/openapi.yaml /app/src
COPY prisma .
EXPOSE 8080
CMD [ "npm", "start" ]
