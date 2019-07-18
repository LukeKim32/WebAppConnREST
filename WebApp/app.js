var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysql_store = require('express-mysql-session')(session);
var bodyparser = require('body-parser');

var loginRouter = require('./routes/login');

var locationRouter = require('./routes/location');


app.use(session({ //use session module..
    secret : 'legday key',
    resave : false,
    saveUninitialized : false,
    store : new mysql_store({
      host: 'localhost',
      user : 'root',
      password : '',
      database : ''
    })
  }));
  
  app.use(bodyparser.urlencoded({extended:false}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public/'))); // 'public/'을 해주면 layout의 css링크 앞에 /css/~ 를 안붙여도 된다

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

//app.use('/',mainRouter);
app.use('/login', loginRouter);
app.use('/location', locationRouter);

app.get('/', function(req, res, next) {
    res.render('index',{nav_show : req.session.logged, is_center : req.session.is_center});
});

module.exports = app;
