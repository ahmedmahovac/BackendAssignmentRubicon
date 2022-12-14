var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var blogRouter = require('./routes/blog');

const mongoose = require('mongoose');


const swaggerDocument = require('./swagger.json');
const swaggerUI = require('swagger-ui-express');

var app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api", blogRouter);


const mongoDB = 'mongodb+srv://amahovac1:ahmedoni123@cluster0.8mk1e6d.mongodb.net/BlogApp?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true });
const db = mongoose.connection; // konekcija na bazu
db.on('connected', function () {
  console.log('sve ok, imam konekciju na bazu');
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
