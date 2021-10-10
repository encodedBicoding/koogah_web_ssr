const express = require('express');
const companyApis = express.Router();
const CompanyController = require('../controllers/company.controller.js');
const AuthMiddleware = require('../middlewares/auth.middleware');

// testing
companyApis.get('/admin/ws/connect', CompanyController.connect_ws);
companyApis.post('/admin/login', CompanyController.login);
companyApis.get(
  '/admin/me',
  CompanyController.getMe,
);
companyApis.get(
  '/admin/total_earnings',
  CompanyController.getTotalEarnings
);
companyApis.get(
  '/admin/total_dispatchers_overview',
  CompanyController.getTotalDispatchersOverview
);
companyApis.get(
  '/admin/total_deliveries_overview',
  CompanyController.getTotalDeliveriesOverview,
);
companyApis.get(
  '/admin/balance/withdrawable',
  CompanyController.getWithdrawableBalance,
);

companyApis.post(
  '/admin/accounts/payout/request',
  CompanyController.requestPayout,
);

companyApis.get(
  '/admin/dispatchers/new',
  CompanyController.getNewDispatchers,
);

companyApis.get(
  '/admin/dispatcher/all',
  CompanyController.getAllDispatchers,
);

companyApis.get(
  '/admin/dispatcher/profile/:id',
  CompanyController.getSingleDispatcher,
);

companyApis.get(
  '/admin/dispatcher/delivery/history/:id',
  CompanyController.getSingleDispatcherDeliveryHistory,
);

companyApis.get(
  '/admin/dispatcher/tracking/:id',
  CompanyController.fetchSingleDispatcherTrackingLocation,
)

companyApis.post(
  '/admin/dispatcher/edit/:id',
  CompanyController.editDispatcherDetail,
);

companyApis.post(
  '/admin/dispatcher/signup/email/:email',
  CompanyController.sendDispatcherEmailVerificationCode,
);

companyApis.post(
  '/admin/dispatcher/signup/mobile/',
  CompanyController.sendDispatcherMobileVerificationCode,
);

companyApis.post(
  '/admin/dispatcher/verify/code/email',
  CompanyController.verifyDispatcherEmailVerificationCode,
);
companyApis.post(
  '/admin/dispatcher/verify/code/mobile',
  CompanyController.verifyDispatcherMobileVerificationCode,
);
companyApis.post(
  '/admin/dispatcher/registration/complete',
  CompanyController.completeDispatcherRegisteration,
);

companyApis.post('/admin/profile/update', CompanyController.companyUpdateProfile);

companyApis.get('/admin/logout', CompanyController.logout);

module.exports = companyApis;