const express = require('express');
const companyApis = express.Router();
const CompanyController = require('../controllers/company.controller.js');

companyApis.post('/admin/login', CompanyController.login);


module.exports = companyApis;