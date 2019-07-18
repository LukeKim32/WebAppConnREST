const https = require('https');
const url = require('url');
const fs = require('fs');

exports.get_all_data = function(req, res) {
  
    var all_location_data;
    var options = {
      host: '',
      port: 8080,
      path: '/locations',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      key : fs.readFileSync(''),
    cert : fs.readFileSync('')
    };
    

    var httpreq = https.request(options, function (rest_response) {
      rest_response.setEncoding('utf8');
      rest_response.on('data', function (response_chunk) {
        
        all_location_data = JSON.parse(response_chunk).location_data;
      });
      
      rest_response.on('end',function(response){
       
          res.render('location_list',{locations : all_location_data, nav_show : req.session.logged, location_show : req.session.logged, is_center: req.session.logged})
      })
    });
  
    httpreq.write("");
    httpreq.end();

}

exports.get_single_detail = function(req, res) {
    var web_url=req.url;
    var queryData = url.parse(web_url,true).query;
    var locationID = queryData.id;
      var location_data;

      var options = {
        host: '',
        port: 8080,
        path: '/locations/'+locationID,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        key : fs.readFileSync(''),
    cert : fs.readFileSync('')
      };
    
      var httpreq = https.request(options, function (rest_response) {
        rest_response.setEncoding('utf8');
        rest_response.on('data', function (response_chunk) {
          location_data = JSON.parse(response_chunk).location_data;
        });        
         rest_response.on('end',function(response){
            res.render('location_detail',{location : location_data, author_name : req.session.userID, edit_show : req.session.logged, nav_show : req.session.logged, location_show : req.session.logged, is_center: req.session.logged})
          })
      });
    
      httpreq.write("");
      httpreq.end();
}

exports.what_data_to_edit = function(req, res) {
    if(req.session.logged===true){
      var web_url=req.url;
      var queryData = url.parse(web_url,true).query;
      var locationID = queryData.id;
      var location_data;
  
      var options = {
        host: '',
        port: 8080,
        path: '/locations/'+locationID,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        key : fs.readFileSync(''),
    cert : fs.readFileSync('')
      };
    
      var httpreq = https.request(options, function (rest_response) {
        rest_response.setEncoding('utf8');
        rest_response.on('data', function (response_chunk) {
          //Print response body
          console.log("body: " + response_chunk);
          location_data = JSON.parse(response_chunk).location_data;
        });
        
         rest_response.on('end',function(response){
           console.log("Entered into Edit")
            console.log(location_data);
            res.render('location_create',{location : location_data, create_or_edit : false, author_name : req.session.userID, nav_show : req.session.logged, location_show : req.session.logged, is_center: req.session.logged})
          })
      });
      httpreq.write("");
      httpreq.end();
    }
    else{
      console.log("need to login first for edit")
      res.writeHead(302, {Location : "/location"});
      res.end();
    }
  }

  exports.send_edit_data = function(req,res){

    var web_url=req.url;
    var queryData = url.parse(web_url,true).query;
    var locationID = queryData.id;
  
  
    var edit_location_data = new Array();
    if(req.body.title){
      edit_name = { "propName" : "name", "value" : req.body.title };
      edit_location_data.push(edit_name);
    }
    if(req.body.latitude){
      edit_latitude = { "propName" : "latitude", "value" : req.body.latitude };
      edit_location_data.push(edit_latitude);
    }
    if(req.body.longitude){
      edit_longitude = { "propName" : "longitude", "value" : req.body.longitude };
      edit_location_data.push(edit_longitude);
    }
    if(req.body.altitude){
      edit_altitude = { "propName" : "altitude", "value" : req.body.altitude };
      edit_location_data.push(edit_altitude);
    }
    if(req.body.text){
      edit_text = { "propName" : "text", "value" : req.body.text };
      edit_location_data.push(edit_text);
    }
  
    if(edit_location_data.length > 0) {
      edit_location_data = JSON.stringify(edit_location_data);
  
      var options = {
        host: '',
        port: 8080,
        path: '/locations/'+locationID,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : 'Bearer '+req.session.token
        },
        key : fs.readFileSync(''),
    cert : fs.readFileSync('')
      };
    
      var httpreq = https.request(options, function (rest_response) {
        res.writeHead(302, {Location : "/location/detail?id="+locationID});
        res.end();
      });
    
      httpreq.write(edit_location_data);
      httpreq.end();
    }
    else {
      console.log("no data submitted by client");
      res.writeHead(302, {Location : "/location"});
      res.end();
    }
  }

  exports.show_create_form = function(req,res){
    if(req.session.logged===true){
      console.log("Get into create!");
        res.render('location_create',{author_name : req.session.userID, create_or_edit : true, nav_show : req.session.logged, location_show : req.session.logged, is_center: req.session.logged});
    }
    else{
      console.log("Login required for creation");
      res.writeHead(302, {Location : "/location"});
      res.end();
    }
  }

  exports.send_create_data = function(req,res){

    if(req.session.logged === true){
        console.log(req.body);
        var register_location_data = JSON.stringify({
            name: req.body.title,
            latitude: req.body.latitude,
            longitude : req.body.longitude,
            altitude : req.body.altitude,
            text : req.body.text
        });
        
        var options = {
          host: '',
          port: 8080,
          path: '/locations',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer '+req.session.token
          },
          key : fs.readFileSync(''),
    cert : fs.readFileSync('')
        };
        
        var httpreq = https.request(options, function (rest_response) {
          res.writeHead(302, {Location : "/location"});
          res.end();
        });
        
        httpreq.write(register_location_data);
        httpreq.end();
    }
    else {
        res.writeHead(302, {Location : "/location"});
        console.log("Not logged!");
        res.end();
    }
}

exports.delete_data = function(req,res){
    if(req.session.logged===true){
      var web_url=req.url;
      var queryData = url.parse(web_url,true).query;
      var locationID = queryData.id;
  
      var options = {
        host: '',
        port: 8080,
        path: '/locations/'+locationID,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : 'Bearer '+req.session.token
        },
        key : fs.readFileSync(''),
    cert : fs.readFileSync('')
      };
    
      var httpreq = https.request(options, function (rest_response) {
        res.writeHead(302, {Location : "/location"});
        res.end();
      });
    
      httpreq.write("");
      httpreq.end();
     }
    else{
        console.log("Delete failed");
        res.writeHead(302, {Location : "/location"});
        res.end();
    }
  }