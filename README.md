# Instructions to run
### -This is express.js application
### -node_modules are not in repository, they have to be installed with "npm install"
### -I've used "nodemon" for running server, but simple "node app.js" will do the job
### -Port is defined in "www" file, it is "3000" by default
### -For database, I've used MongoDB database, located in Atlas MongoDB cloud.
- I've connected application to database in app.js file.
- Password for database is present in repository, I haven't put it in .gitignore.
- Database is always up, so you just have to run node app and you should be ready to go.
### - Jest is used for testing purposes

# Implementation details worth mentioning
- Most recent post are sorted by createdAt, not by updatedAt. All posts are returned by default (sorted). 
- Posts are referenced by id, not slug, by comments. So the reference doesn't have to be changed when updating post title. 
- Post comments are deleted when post is deleted 


