const express = require('express');
const locationRouter = express.Router();
const multer = require('multer'); 
const bodyParser = require('body-parser');
const LocationController = require('../controllers/locationController');

// 첨부파일 처리 -> extended 값 = true
locationRouter.use(bodyParser.urlencoded({extended : true}));

// 첨부파일 처리 환경설정
var storage = multer.diskStorage({
    destination : function(req, file, cb){
        //if(file형식 == image) 이런 식으로 응용 가능
        cb(null, './CheomBoo')
    },
    filename : function (req, file, cb){
        cb(null, file.originalname);
    }
})

// 첨부파일 처리용 모듈
var upload = multer({storage : storage});

locationRouter.use(function timeLog(req,res,next){
    console.log('Location in Time: ',Date.now());
    next();
})

//main page
locationRouter.get('/', LocationController.showAll);

locationRouter.get('/detail', LocationController.showSingleDetail);

locationRouter.get('/edit', LocationController.showEditPage);
locationRouter.post('/edit',upload.single('upload_file'),LocationController.requestDataEdit);

locationRouter.get('/create', LocationController.showCreatePage);
locationRouter.post('/create',upload.single('upload_file'),LocationController.requestDataCreate);

locationRouter.get('/delete',LocationController.deleteSingleData);

module.exports = locationRouter;
