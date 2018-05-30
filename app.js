var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var monk = require('monk');
var app = express();
var useragent = require('express-useragent');
var routes = require('./routes/index');
var api = require('./routes/api');
if (app.get('env') === 'development') env = require('./env.js');

// connect to database
var db = monk(process.env.MONGOLAB_URL);
app.db = db;

// settings
var encryptionPassword = process.env.ENCRYPTION_PASSWORD;
app.set("ENCRYPTION_PASSWORD", encryptionPassword);
var hashSalt = process.env.HASH_SALT;
app.set("HASH_SALT", hashSalt);

// view engine setup

//app.set('views', path.join(__dirname, 'views'));
//app.set('views', path.join(__dirname, 'views')); 
app.engine('html', require('ejs').renderFile); 
app.set('view engine', 'html'); 
app.set('views', path.join(__dirname, './views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); 
app.use(express.static(path.join(__dirname, 'views')));
app.use(useragent.express());

// Make our db and settings accessible to our routes
app.use(function(req,res,next){
  req.db = db;
  req.settings = {}
  req.settings.encryptionPassword = encryptionPassword;
  req.settings.hashSalt = hashSalt;
  next();
});

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//app.use(express.static ('public'));
app.use('/', routes);
app.use('/api', api);

app.use(ignoreFavicon);
//ignore favicon 
function ignoreFavicon(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({nope: true});
  } else {
    next();
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
