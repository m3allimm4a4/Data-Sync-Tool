# Database sync tool

## sync-tool

### Introduction

I created a desktop application that syncs the offline database with the online database using electron. The application is called `sync-tool`. It's very simple to use.

By default it will connect to the local mysql database using the `root` user and without a password. I used prisma as ORM to access the local db. The DB schema is located inside `./sync-tool/prisma/schema.prisma`.

In case the user wants to use a different user or password, he can enter it inside the form and the application will connect to the database.

When the user presses the `Sync` button, the application will sync the local database with the online database using the api link provided. By default the api link is `http://localhost:5000/api/v1`.

### How it works

The application will send a request to the server to clear the online-db. Then it will connect to the local database and fetch all the data 100 records at a time. It will then send the data to the web api and save it in the online database 100 records at a time. (To avoid the server from getting overloaded). When the sync is over the application will send an email notification to the user.

### Installation

- go to [Data-Sync-Tool v1.0.0](https://github.com/m3allimm4a4/Data-Sync-Tool/releases/tag/sync-tool)
- download `sync-tool-1.0.0.Setup.exe`

## web api

I created a simple web api using ExpressJs and Prisma. The api is located inside `./api`. I created the online DB using prisma migrations. The schema is located inside `./api/prisma/schema.prisma`, it is identical to the offline db schema.

As you notice the api project does contain docker files, but it is not used in this project because I was having issues connecting the api to the docker mysql db
