var express = require('express');
var router = express.Router();
var db= require('../models/mysqlDB');
var bodyparser = require('body-parser');
var session = require('express-session');
var mysql_store = require('express-mysql-session')(session);
const querystring = require('querystring');
const http = require('http');

  router.use(session({
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
router.use(bodyparser.urlencoded({extended:false}));


/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login');
  //if user properly logged in, he/she is unable to get to loginpage
});

// Login
router.post('/',function(req,res){
  var login_data = JSON.stringify({
    email: req.body.id,
    password: req.body.pass
  });

  var options = {
    host: '54.180.170.132',
    port: 8080,
    path: '/user/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  var httpreq = http.request(options, function (rest_response) {
    var token;
    console.log("Request : ",login_data);
    rest_response.setEncoding('utf8');
    rest_response.on('data', function (response_chunk) {
      //Print response body
      //console.log("body: " + response_chunk);
      token = JSON.parse(response_chunk).token;
      console.log("Token : ",token);
    });

    rest_response.on('end',function (response){
      req.session.token = token;
      req.session.logged = true; //login success!
      req.session.userID = req.body.id;
      res.writeHead(302, {Location : "/"});
      res.end();
    })
  });
  httpreq.write(login_data);
  httpreq.end();
  
});


//logout
router.get('/logout',function(req, res){
  delete req.session.logged;
  delete req.session.userID;
  if(req.session.is_center) delete req.session.is_center;
  db.query(`DELETE FROM sessions WHERE session_id=`,[req.session.id],function(err,result){  
    req.session.destroy(function(err) {
      res.writeHead(302,{Location : "/"});
      res.end();
    })
  })
})

module.exports = router;
