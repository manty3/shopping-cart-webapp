var createError = require('http-errors');
const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
const hbs=require('express-handlebars')
const app = express();
const fileUpload =require('express-fileupload')
var db=require('./config/connection');
var session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose= require('mongoose')
const http = require('http');


// const { error, log } = require('console');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/' }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())


// app.use(session({secret:"key",cookie:{maxAge:180 * 60 * 1000 }}))
// db.connect((err)=>{
//   if(err) console.log("connection error"+err)

//   console.log("Database connected")
// })

mongoose.connect("mongodb+srv://akshaymadathil3:Pq9UMD7JKiwEwVTq@cluster0.8otn68e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
const server = http.createServer(app);

server.listen(3000,function(){
  console.log('listening on port 3000')
})

app.use('/', usersRouter);
app.use('/admin', adminRouter);
db
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
