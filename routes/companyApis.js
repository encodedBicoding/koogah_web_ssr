const express = require('express');
const companyApis = express.Router();
const CompanyController = require('../controllers/company.controller.js');
const AuthMiddleware = require('../middlewares/auth.middleware');

companyApis.post('/admin/login', CompanyController.login);
companyApis.get(
  '/admin/total_earnings',
  AuthMiddleware.checkAuthenticated,
  CompanyController.getTotalEarnings
);
companyApis.get(
  '/admin/total_dispatchers_overview',
  AuthMiddleware.checkAuthenticated,
  CompanyController.getTotalDispatchersOverview
);
companyApis.get(
  '/admin/total_deliveries_overview',
  AuthMiddleware.checkAuthenticated,
  CompanyController.getTotalDeliveriesOverview,
);




module.exports = companyApis;