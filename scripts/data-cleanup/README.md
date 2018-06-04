# Data Cleanup

## Introduction
This script takes a local backup of the DB and cleans up the `events` and `users` collections for the study.

## Setup
- Download MongoDB and MongoDB Compass from [here](https://www.mongodb.com/download-center#community).
- Install MongoDB
- Start MongoDB
    * On Windows, one might have to create `C:\data\db` folder for the data storage
    * On Windows, run `mongod.exe` present in `bin` folder of MongoDB Installation folder (generally `C:\Program Files\MongoDB\Server\3.6`)
    * Connect to the DB using Compass to test connectivity
- Ensure MongoDB `bin` folder is in the PATH

## Run
In the current folder, 
```sh
$ data-cleanup
```