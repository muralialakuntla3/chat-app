# Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
  - [Main features](#main-features)
  - [Run locally with docker](#run-locally-with-docker)
  - [Screenshots](#screenshots)
    - [Private chat](#private-chat)
    - [Group chat](#group-chat)
    - [View all screenshots](#view-all-screenshots)
- [Techstack](#techstack)
  - [Frontend](#frontend)
  - [Backend](#backend)

# Overview

RealChat is a chat application build with Node.js and Typescript. It provides a real-time chat platform for users to chat with each other. RealChat supports both private and group chat conversations.

## Main features

- Authentication using JWT tokens.
- Real time private chat.
- Real time group chat.
- Black theme support.

# Messaging Application Single Server Deployment

## Server Setup

- OS: ubuntu 20.04
- Type: t2.medium
- Ports: 22, 80, 8080, 5432, 5173
- Storage: 10 GB

## postgres installation

- sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
- wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
- sudo apt-get update
- sudo apt-get -y install postgresql
- sudo ss -ntpl

## postgres password setup
- sudo su - postgres
- psql
- \password
- enter your password: password
- enter it again: password
- \q
- exit
- sudo systemctl restart postgresql

## node installation
- curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
- sudo apt-get install -y nodejs
- node -v
- npm -v

## Build Backend
- git clone https://github.com/DL-Murali/messaging-app.git
- cd messaging-app/backend/
- npm install
- sudo npm install pm2 -g
- openssl rand -base64 32
  - 9cN2NP0uL4GF4kbPT6rcIvbDgs5DtYQ/f9HxQ/Ft6VM=  [ JWT TOKEN ]
- vi .env
  - DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"
  - JWT_SECRET=cqn8s5c48XxYEbkXGQEYA+FdW75gHjsyKO+7j8R1zZU=
  - PORT=8080
  - SENDGRID_API_KEY=sendgridapikey
  - FRONTEND_URL=http://localhost:5173
  - SENDGRID_FROM_EMAIL=muralialakuntla3@gmail.com
  - NODE_ENV=development

- npx prisma db push
- npm run build
- ls build/src
  - app.js  channels  config.js  index.js  modules server.js  socketio.js  types

- cp src/openapi.yaml build/src/
- ls build/src/
  - app.js  channels  config.js  index.js  modules  openapi.yaml  server.js  socketio.js  types

- pm2 start -i 0 build/src/index.js
- curl ifconfig.io
  - 52.53.237.9
- ss -ntpl

## Build Frontend

- cd ../frontend/
- vi .env
  - VITE_APP_TITLE="Digital Lync Chat Application"
  - VITE_API_URL=http://52.53.237.9:8080/api/v1
  - VITE_SOCKET_URL=http://52.53.237.9:8080

- npm install
- npm run build

## Deploy Frontend
- sudo apt install nginx -y
- sudo rm -rf /var/www/html/*
- sudo cp -r ./dist/* /var/www/html/
- sudo systemctl restart nginx
- ss -ntpl

## Access Application
- browse pub-ip
- create account
  - Name:
  - Username:
  - Email:
  - Password:
- sign in with above details 
  - Username:
  - Password:


## Screenshots

### Private chat

<p align="center">
  <img  src="./screenshots/private-chat.png">
</p>

### Group chat

<p align="center">
  <img  src="./screenshots/group-chat.png">
</p>

### [View all screenshots](screenshots/screenshots.md)

# Techstack

## Frontend

- Reactjs & Vite
- Mantine
- Tanstack Query and React router
- Zod
- Socket.io client

## Backend

- Nodejs/Expressjs
- Socket.io
- Prisma
- jsonwebtokens, pino, zod, swagger

---
