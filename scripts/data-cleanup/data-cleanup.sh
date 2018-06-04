cd data
mongodump --host ds243325.mlab.com:43325 -d heroku_ln6dp8f9 -u admin -p randomfishes234
mongorestore
cd ..
node data-cleanup.js