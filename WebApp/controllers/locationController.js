const https = require('https');
const url = require('url');
const fs = require('fs');

/** Rest API 서버로 모든 데이터 요청 */
exports.showAll = function(req, res) {
  
  var allLocationData; //서버로 부터 받은 응답에서 데이터를 파싱해 저장하기위한 변수

  // Rest API server에 요청하기 위해 옵션 설정
  var options = {
    host: process.env.IP_OF_REST,
    port: 8080,
    path: '/locations',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    key : fs.readFileSync(process.env.PRIVATE_KEY_PATH),
    cert : fs.readFileSync(process.env.PUBLIC_KEY_PATH)
  };
    
  // 요청 전 request 환경 설정 및 response 콜백 처리
  var httpsReq = https.request(options, function (restApiResponse) {
    // Rest API server에서 온 응답 처리
    restApiResponse.setEncoding('utf8');
    restApiResponse.on('data', function (response_chunk) {
      allLocationData = JSON.parse(response_chunk).singleLocationData;
    });
      
    restApiResponse.on('end',function(response){
      // Browser로 response
      res.render('location_list',{locations : allLocationData, nav_show : req.session.logged, location_show : req.session.logged, is_center: req.session.logged})
    })
  });
  
  // Rest API server에 요청
  httpsReq.write("");
  httpsReq.end();
}


/** Rest API 서버로 특정 하나의 데이터 요청 */
exports.showSingleDetail = function(req, res) {

  var webUrl = req.url;
  var queryData = url.parse(webUrl,true).query;
  var locationID = queryData.id;
  var singleLocationData;

  var options = {
    host: process.env.IP_OF_REST,
    port: 8080,
    path: '/locations/'+locationID,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    key : fs.readFileSync(process.env.PRIVATE_KEY_PATH),
    cert : fs.readFileSync(process.env.PUBLIC_KEY_PATH)
  };
  
  // 요청 전 request 환경 설정 및 response 콜백 처리
  var httpsReq = https.request(options, function (restApiResponse) {
    restApiResponse.setEncoding('utf8');
    restApiResponse.on('data', function (response_chunk) {
      singleLocationData = JSON.parse(response_chunk).singleLocationData;
    }); 

    restApiResponse.on('end',function(response){
      res.render('location_detail',{location : singleLocationData, author_name : req.session.userID, edit_show : req.session.logged, nav_show : req.session.logged, location_show : req.session.logged, is_center: req.session.logged})
    })
  });
  
  // Rest API server로 request
  httpsReq.write("");
  httpsReq.end();
}


/** Rest API 서버로부터 수정하고 싶은 데이터 원본을 받음 */
exports.showEditPage = function(req, res) {

  // 로그인 한 유저만 수정이 필요한 데이터를 받을 수 있음
  if(req.session.logged === true){
    var webUrl=req.url;
    var queryData = url.parse(webUrl,true).query;
    var locationID = queryData.id;
    var singleLocationData;
  
    var options = {
      host: process.env.IP_OF_REST,
      port: 8080,
      path: '/locations/'+locationID,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      key : fs.readFileSync(process.env.PRIVATE_KEY_PATH),
      cert : fs.readFileSync(process.env.PUBLIC_KEY_PATH)
    };
    
    // 요청 전 request 환경 설정 및 response 콜백 처리
    var httpsReq = https.request(options, function (restApiResponse) {
      restApiResponse.setEncoding('utf8');
      restApiResponse.on('data', function (response_chunk) {
        singleLocationData = JSON.parse(response_chunk).singleLocationData;
      });
        
      restApiResponse.on('end',function(response){
        res.render('location_create',{location : singleLocationData, create_or_edit : false, author_name : req.session.userID, nav_show : req.session.logged, location_show : req.session.logged, is_center: req.session.logged})
      })
    });

    // Rest API server로 request
    httpsReq.write("");
    httpsReq.end();

  } else{
      console.log("need to login first for edit")
      res.writeHead(302, {Location : "/location"});
      res.end();
    }

}


/** 수정하고 싶은 데이터 Rest API server로 전송 */
exports.requestDataEdit = function(req,res){

  var webUrl=req.url;
  var queryData = url.parse(webUrl,true).query;
  var locationID = queryData.id;
  
  var totalEditData = new Array();

  if(req.body.title){
    editName = { "propName" : "name", "value" : req.body.title };
    totalEditData.push(editName);
  }
  if(req.body.latitude){
    editLatitude = { "propName" : "latitude", "value" : req.body.latitude };
    totalEditData.push(editLatitude);
  }
  if(req.body.longitude){
    editLongitude = { "propName" : "longitude", "value" : req.body.longitude };
    totalEditData.push(editLongitude);
  }
  if(req.body.altitude){
    editAltitude = { "propName" : "altitude", "value" : req.body.altitude };
    totalEditData.push(editAltitude);
  }
  if(req.body.text){
    editText = { "propName" : "text", "value" : req.body.text };
    totalEditData.push(editText);
  }
  
  if(totalEditData.length > 0) {
    //기존 JSON 데이터 => 문자열 : Request로 보내기 위해
    totalEditData = JSON.stringify(totalEditData);
  
    var options = {
      host: process.env.IP_OF_REST,
      port: 8080,
      path: '/locations/'+locationID,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer '+req.session.token
      },
      key : fs.readFileSync(process.env.PRIVATE_KEY_PATH),
      cert : fs.readFileSync(process.env.PUBLIC_KEY_PATH)
    };
    
    // 요청 전 request 환경 설정 및 response 콜백 처리
    var httpsReq = https.request(options, function (restApiResponse) {
      res.writeHead(302, {Location : "/location/detail?id="+locationID});
      res.end();
    });
    
    // Rest API server로 수정할 데이터 request
    httpsReq.write(totalEditData);
    httpsReq.end();

  } else {
      console.log("no data submitted by client");
      res.writeHead(302, {Location : "/location"});
      res.end();
  }
}


/** Location 데이터 생성용 페이지 보여줌 */
exports.showCreatePage = function(req,res){

  if(req.session.logged===true){
    console.log("Get into create!");
    res.render('location_create',{author_name : req.session.userID, create_or_edit : true, nav_show : req.session.logged, location_show : req.session.logged, is_center: req.session.logged});
  
  } else{
    console.log("Login required for creation");
    res.writeHead(302, {Location : "/location"});
    res.end();
  }
}


/** 생성하고 싶은 데이터 Rest API server로 전송 */
exports.requestDataCreate = function(req,res){
  //로그인 되어 있을 경우
  if(req.session.logged === true){
        
    var register_location_data = JSON.stringify({
      name: req.body.title,
      latitude: req.body.latitude,
      longitude : req.body.longitude,
      altitude : req.body.altitude,
      text : req.body.text
    });
        
    var options = {
      host: process.env.IP_OF_REST,
      port: 8080,
      path: '/locations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer '+req.session.token
      },
      key : fs.readFileSync(process.env.PRIVATE_KEY_PATH),
      cert : fs.readFileSync(process.env.PUBLIC_KEY_PATH)
    };
        
    // 요청 전 request 환경 설정 및 response 콜백 처리
    var httpsReq = https.request(options, function (restApiResponse) {
      // Rest API server로부터 받은 응답 처리
      res.writeHead(302, {Location : "/location"});
      res.end();
    });
        
    // Rest API server로 request
    httpsReq.write(register_location_data);
    httpsReq.end();
    
  } else { //로그인 X
    res.writeHead(302, {Location : "/location"});
    console.log("Not logged!");
    res.end();
  }
}


/** Rest API server로 삭제하고 싶은 데이터 요청 */
exports.deleteSingleData = function(req,res){
  //로그인 확인
  if(req.session.logged===true){
    var webUrl=req.url;
    var queryData = url.parse(webUrl,true).query;
    var locationID = queryData.id; //삭제하고 싶은 데이터의 id 값 획득
  
    var options = {
      host: process.env.IP_OF_REST,
      port: 8080,
      path: '/locations/'+locationID,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer '+req.session.token
      },
      key : fs.readFileSync(process.env.PRIVATE_KEY_PATH),
      cert : fs.readFileSync(process.env.PUBLIC_KEY_PATH)
    };
    
    var httpsReq = https.request(options, function (restApiResponse) {
      // 서버로부터 받은 응답 처리
      res.writeHead(302, {Location : "/location"});
      res.end();
    });
    
    //Rest API server로 request
    httpsReq.write("");
    httpsReq.end();
  
  } else{
    console.log("Delete failed");
    res.writeHead(302, {Location : "/location"});
    res.end();
  }
}