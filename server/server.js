const createError = require('http-errors');  //
const express = require('express');
const path = require("path");
const cookieParser = require("cookie-parser");
const apiRoutes = require('./routes');
const expressValidator = require('express-validator');//
const flash = require('express-flash');//
const logger = require('morgan');//

const app = express();
 //defines a route for all API requests starting 
app.use('/api/pizza', apiRoutes);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
//Set up ejs as template engine to render html pages
app.set('view engine','ejs')

//log HTTP requests
app.use(logger('dev'));//
//Parse json data
app.use(express.json());
app.use(cookieParser());//
//middleware for serving static file
//parse form data from html
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(flash());//
app.use(expressValidator()) ;//
 
/// catch 404 and forward to error handler
app.use(function(req, res , next) {
  next(createError(404));
});
 
// /error handler
app.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
 
  // /render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || '3000', () =>{

    console.log(`server is running on port: ${process.env.PORT || '3000'}`)
});



