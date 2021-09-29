var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sequelize = require('./models').sequelize;
var session = require('express-session');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var oauthRouter = require('./routes/oauth');
var categoryRouter = require('./routes/category');
var recordRouter = require('./routes/record');
const record = require('./models/record');

require('dotenv').config();
var app = express();
sequelize.sync();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true, // 크로스 도메인 허용
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
}));

if(process.env.NODE_ENV ==='production'){
  app.use(logger('combined'));
} else{
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET_CODE,
  cookie: {
  httpOnly: true,
  secure: false
  }
  }))
  
  
app.use('/users', usersRouter);
app.use('/oauth', oauthRouter)
app.use('/category',categoryRouter);
app.use('/record', recordRouter);
app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing  error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log('error handler');
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.json({message: err.message})
});

module.exports = app;
