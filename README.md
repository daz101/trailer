# Movie Recommender: Testing the Effect of Trailers 

This repository features a choice-based movie recommender with the following features: 
1. *Poster only*: this condition renders the poster, plot summary, director, actors, movie title and movie year details for each movie 
2. *Trailer only*: this condition renders the movie trailer for the selected movie, movie title, year of movie 
3. *Blur right*: this condition features the movie trailer on the right of the movie summary information (plot summary, actors etc). 
4. *Blur left*: this condition features the movie trailer on the left of the movie summary information (plot summary, actors etc). 

**Prerequisites for local installation:**
- Node 
- MongoDB 
- Heroku CLI (optional) 

This app is deployed on Heroku and can be accessed at: http://trailerstudy.herokuapp.com. It is based off of this app:https://github.com/surajiyer/Movie-Recommendation-system.

## Setting up 

**Run Mongo locally** 

You can create a database locally and insert at least 1 item to initiate the database after you have successfully installed Mongo. Alternatively you can run an instance of Mongo in a docker container.

*For docker set up* 

First, download and set up docker locally. After you successfully install docker: 
```
docker pull mongo
docker run --name mongodb mongo:latest
docker run -d -p 27017-27019:27017-27019 --name mongodb mongo:4.0.4
docker exec -it mongodb bash
```

*Do the following if you have MongoDB running locally or using docker*

```
show dbs
use trailerDB
db.users.insert({userId:"test"})
```

Note: If you get an error with docker about a container already running try the following: 
```
docker stop <container_name>
docker rm <container_name>
```
To see the name of your container try `docker ps` or `docker ps -a`. 

**Start Express Server** 
1. Clone repo to your machine. You can do this through the command line or using Github desktop.
2. Navigate to the project path using the command line then run the following commands: 

```
npm install
npm run dev
```

**Run Node App** 
1. Ensure that the repo is cloned to your machine and that you are using the path to the project. Using the command line, execute the following command:

`npm start`

## Main Functions and key features 

**Routes/Page navigation:**

The app is structured around the value of the `choice_number` which determines the navigation. For example, if `choice_number = -3` then the app would render the welcome page.
Details for the endpoints and structure for navigation can be found in `/routes/index.js`. This file also handles:

- randomly assigning participants to conditions 
- schema for the user collection 
- handler for different browser types 

**Sending Data to Database** 
For the callback functions see `/views/js`. The files:

- script-intro.js: handles pages before the stimulus (welcome, overview, consent, pre-survey)
- script-index.js: handles pages at the stimulus page 
- script-survey.js: handles survey at the end of the study 

`routes/api.js` handles the structure for the get/post calls to the database. 

As mentioned before, this project uses MongoDB for its database. 

## Possible Errors 

It is possible that different versions of Node may cause certains functions to not run normally. If there are version errors, refer to package.json for the version of Node that this project is based on. 



