const https = require('https');
const url = require('url');
const fs = require('fs');

exports.showLoginPage = (req, res, next) => res.render('login');

/** Rest API server로 로그인 요청(토큰 요청) */
exports.login = function(req,res){

  var login_data = JSON.stringify({
    email: req.body.id,
    password: req.body.pass
  });

  var options = {
    host: process.env.IP_OF_REST,
    port: 8080,
    path: '/user/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    key : fs.readFileSync(process.env.PRIVATE_KEY_PATH),
    cert : fs.readFileSync(process.env.PUBLIC_KEY_PATH)
  
  };

  var httpsRequest = https.request(options, function (restApiResponse) {
    var token;
    restApiResponse.setEncoding('utf8');
    restApiResponse.on('data', function (response_chunk) {
      // 토큰 파싱, 저장
      token = JSON.parse(response_chunk).token;
      console.log("Token : ",token);
    });

    /** 세션에 1) 토큰, 2) 로그인 여부, 3) DB내 할당받은 data id 값 유지 */
    restApiResponse.on('end',function (response){
      req.session.token = token;
      req.session.logged = true; //login success!
      req.session.userID = req.body.id;
      res.writeHead(302, {Location : "/"});
      res.end();
    })
  });

  // Rest API server로 request
  httpsRequest.write(login_data);
  httpsRequest.end();
  
}


/** 로그아웃 */
exports.logout = function(req, res){
  delete req.session.logged;
  delete req.session.userID;
  if(req.session.is_center) delete req.session.is_center;

  // 로컬 MySQL 에서 세션 데이터 지우기
  db.query(`DELETE FROM sessions WHERE session_id=`,[req.session.id],function(err,result){  
    req.session.destroy(function(err) {
      res.writeHead(302,{Location : "/"});
      res.end();
    })
  })
}