FROM node:14
WORKDIR /app
COPY package.json .
COPY package-lock.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ];\
  then npm install;\
  else npm ci;\
  fi

COPY . .
RUN npx prisma generate
ENV PORT 5000
EXPOSE ${PORT}
CMD ["node", "./src/server.js"]