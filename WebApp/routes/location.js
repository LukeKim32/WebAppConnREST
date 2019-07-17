const express = require('express');
const location_router = express.Router();
const multer = require('multer'); 
const bodyParser = require('body-parser');
const LocationController = require('../controllers/locationController');

location_router.use(bodyParser.urlencoded({extended : true}));

var storage = multer.diskStorage({
    destination : function(req, file, cb){
        //if(file형식 == image) 이런 식으로 응용 가능
        cb(null, './CheomBoo')
    },
    filename : function (req, file, cb){
        cb(null, file.originalname);
    }
})
var upload = multer({storage : storage});

location_router.use(function timeLog(req,res,next){
    console.log('Location in Time: ',Date.now());
    next();
})
//main page
location_router.get('/', LocationController.get_all_data);

location_router.get('/detail', LocationController.get_single_detail);

location_router.get('/edit', LocationController.what_data_to_edit);

location_router.post('/edit',upload.single('upload_file'),LocationController.send_edit_data);

location_router.get('/create', LocationController.show_create_form);


location_router.post('/create',upload.single('upload_file'),LocationController.send_create_data);

location_router.get('/delete',LocationController.delete_data);

 module.exports = location_router;
