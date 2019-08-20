var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysql_store = require('express-mysql-session')(session);
var bodyparser = require('body-parser');
require('dotenv').config();
var loginRouter = require('./routes/loginRouter');

var locationRouter = require('./routes/locationRouter');

/** 세션 환경 설정 */
app.use(session({ //use session module..
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false, //session data 값이 변경되어야 저장하는 옵션
    store : new mysql_store({ //세션 데이터는 로컬 mysql 에 저장
      host: 'localhost',
      user : 'root',
      password : process.env.SQL_PW,
      database : process.env.SQL_DB_NAME
    })
  }));
  
app.use(bodyparser.urlencoded({extended:false}));

// 뷰 엔진 설정 : 'pug'
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public/'))); // 'public/'을 해주면 layout의 css링크 앞에 /css/~ 를 안붙여도 된다

// 다른 https 서버로 요청할 때 권한이 없어도 가능하게 해주는 설정
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

/** 라우터 설정 */
app.use('/login', loginRouter);
app.use('/location', locationRouter);

/** 메인페이지 설정 */
app.get('/', function(req, res, next) {
    res.render('index',{nav_show : req.session.logged, is_center : req.session.is_center});
});

module.exports = app;
