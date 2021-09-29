var express = require('express');
const recordController = require('../controller/record');
var router = express.Router();
const {User,Category, Record} = require('../models');
const category = require('../models/category');
var loginCheck = require('../module/jwt');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/:id', loginCheck,recordController.get_record);

router.post('/',loginCheck, recordController.create_record);

router.get('/', loginCheck, recordController.get_records_condition)

router.patch('/:id', loginCheck, recordController.change_record);

router.delete('/:id', loginCheck, recordController.delete_record);

module.exports = router;