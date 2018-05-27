# Data Sanity Checker

## Introduction
This script checks the database for data correctness issues. Currently it looks up the `movies` in the database and checks if the Poster URLs and YouTube trailer videos associated are available for the study.

For checking the Poster URLs, it tries to GET the URL and if it recieves a 200 response, it assumes that the Poster URL is available. In case it recieves 4xx/5xx response or if it encounters errors such as 'Domain name not found' (ENOTFOUND), it assumes that the Poster URL is not available.  

For checking the YouTube trailer videos, it utilizes the YouTube API (v3) to check if the videoId in DB corresponds to an available video. It checks if the videoId is valid and if the video is non-private, embeddable and viewable in US. This script assumes that the study will be run in US and the videos must be accesible in US for checking the video availability.  

If a trailer is not available, it searches for the trailer using the search API. It then checks if either of the top two results work for our study.  

In case the script encounters network issues such as 'Connection Reset' (ECONNRESET) and 'Connection Timeout' (ETIMEDOUT), it retires 10 times before reporting those entries as part of the same output, so that they can be verified manually.

## Run
```sh
$ node data-sanity-check.js
```

### Output
The script dumps the output to a file set as FILE_NAME in the script. The default value of `FILE_NAME` is 'data-sanity-errors.csv'. It is a CSV file with the following columns :
- `_id` : `_id` in the `movies` in DB
- `id_number` : `id_number` in the `movies` in DB
- `movieID` : `movieID` in the `movies` in DB
- `imdbID` : `imdbID` in the `movies` in DB
- `title` : `title` in the `movies` in DB
- `poster` : `poster` in the `movies` in DB (Poster URL)
- `trailer` : YouTube Trailer URL
- `posterError` : POSTER_FOUND / POSTER_UNAVAILABLE
- `posterErrorDetails` : If POSTER_UNAVAILABLE, the error associated with it (eg. ENOTFOUND, Response Code :: 403)
- `youtubeError` : TRAILER_FOUND / TRAILER_UNAVAILABLE
- `youtubeErrorDetails` : if TRAILER_UNAVAILABLE, the error associated with it (eg. 'Video not found', 'Video cannot be played', 'Video is private', 'Video cannot be embedded')
- `youtubeSuggestion` : if TRAILER_UNAVAILABLE, the possible subsititute video (maybe empty)