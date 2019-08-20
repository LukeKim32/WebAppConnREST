var express = require('express');
var router = express.Router();
var db= require('../models/mysqlDB');
var bodyparser = require('body-parser');
var session = require('express-session');
var mysql_store = require('express-mysql-session')(session);
const fs = require('fs');
const https = require('https');
const loginController = require('../controllers/loginController');

router.use(session({
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : false,
  store : new mysql_store({
    host: 'localhost',
    user : 'root',
    password : process.env.SQL_PW,
    database : process.env.SQL_DB_NAME
  })
}));
router.use(bodyparser.urlencoded({extended:false}));


/* GET login page. */
router.get('/', loginController.showLoginPage);

// Login
router.post('/',loginController.login);

// Logout
router.get('/logout',loginController.logout);

module.exports = router;
