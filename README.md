# Instructions to run
### -This is express.js application
### -node_modules are not in repository, they have to be installed with "npm install"
### -I've used "nodemon" for running server, but simple "node ./bin/www" will do the job
### -Port is defined in "www" file, it is "3000" by default
### -For database, I've used MongoDB database, located in Atlas MongoDB cloud.
- I've connected application to database in app.js file.
- Password for database is present in repository, I haven't put it in .gitignore.
- Database is always up, so you just have to run node app and you should be ready to go.
### - Jest is used for testing purposes. Script can be run with "npm test"
### - Swagger UI is available at http://localhost:3000/api-docs/

# Implementation details worth mentioning
- Since I'm mainly familiar with plain javascript and since typescript is basically superset of javascript, I haven't converted my javascript code to typescript code. I didn't want to submit non-optimal typescript code and I didn't have enough time to get familiar with typescript too. I hope it's acceptable.
- This is my first time writing swagger.json file, so there could be some mistakes.
- Most recent post are sorted by createdAt, not by updatedAt. All posts are returned by default (sorted). 
- Posts are referenced by id, not slug, by comments. So the reference doesn't have to be changed when updating post title. 
- Post comments are deleted when post is deleted 
- I noticed 1 bug, but after deadline so I didn't want to commit anything. Since I've changed db structure a few times, when I decided to stick with postId attribute in CommentModel, I forgot to make changes to getting comments for certain blog post. The implementation I've submitted is based on assumption that "postSlug" attribute in CommentModel exists, which isn't true. Based on current db structure, I should have first got post id by using slug, then to simply get comments by previously found _postId.

