const express = require('express');
const companyApis = express.Router();
const CompanyController = require('../controllers/company.controller.js');
const AuthMiddleware = require('../middlewares/auth.middleware');

companyApis.post('/admin/login', CompanyController.login);
companyApis.get(
  '/admin/me',
  AuthMiddleware.checkAuthenticated,
  CompanyController.getMe,
);
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
companyApis.get(
  '/admin/balance/withdrawable',
  AuthMiddleware.checkAuthenticated,
  CompanyController.getWithdrawableBalance,
);

companyApis.post(
  '/admin/accounts/payout/request',
  AuthMiddleware.checkAuthenticated,
  CompanyController.requestPayout,
);

companyApis.get(
  '/admin/dispatchers/new',
  AuthMiddleware.checkAuthenticated,
  CompanyController.getNewDispatchers,
);

companyApis.get(
  '/admin/dispatcher/all',
  AuthMiddleware.checkAuthenticated,
  CompanyController.getAllDispatchers,
);

companyApis.get(
  '/admin/dispatcher/profile/:id',
  AuthMiddleware.checkAuthenticated,
  CompanyController.getSingleDispatcher,
);

companyApis.get(
  '/admin/dispatcher/delivery/history/:id',
  AuthMiddleware.checkAuthenticated,
  CompanyController.getSingleDispatcherDeliveryHistory,
);

companyApis.get(
  '/admin/dispatcher/tracking/:id',
  AuthMiddleware.checkAuthenticated,
  CompanyController.fetchSingleDispatcherTrackingLocation,
)




module.exports = companyApis;