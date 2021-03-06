const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config');
const verifyToken = require('./middleware/verify-token');
const indexRouter = require('./routes/index');
const movieRouter = require('./routes/movie');
const directorRouter = require('./routes/director');
const app = express();
mongoose.connect('mongodb+srv://koray:Koray1245@movie-api.ykj2a.mongodb.net/?retryWrites=true&w=majority');

// view engine setup

app.set('api_secret_key',config.api_secret_key);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api',verifyToken);
app.use('/', indexRouter);
app.use('/api/movies',movieRouter);
app.use('/api/directors',directorRouter);

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
  res.json({error:{message : err.message,status: err.code}});
});

app.listen(3000);

module.exports = app;
