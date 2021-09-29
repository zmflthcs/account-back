var express = require('express');
var router = express.Router();
var loginCheck = require('../module/jwt');
const categoryController = require('../controller/category');


router.post('/',loginCheck, categoryController.create_category);

router.get('/', loginCheck, categoryController.get_all_categories);

router.delete('/:categoryId', loginCheck, categoryController.delete_category);


module.exports=router;