const express = require('express');
const ejs = require('ejs');
const companyAdminRoutes = express.Router();
const view_path = 'views';
const AuthMiddleware = require('../middlewares/auth.middleware');
const Company = require('../models/user.class');

companyAdminRoutes.get(
  '/',
  function (req, res, next) {
    ejs.renderFile(`${view_path}/company.ejs`, {
      page: 'company'
    }, {}, function (err, template) {
      if (err) throw err;
      res.end(template);
    });
    }
);
companyAdminRoutes.get(
  '/approval',
  function (req, res, next) {
    ejs.renderFile(`${view_path}/company_approval.ejs`, {
      page: 'company_approval',
    }, {}, function (err, template) {
      if (err) throw err;
      res.end(template);
    });
  }
);
companyAdminRoutes.get(
  '/verify/email',
  function (req, res, next) {
    res.redirect(`/verify/mobile?&code=${req.query.code}&key=${req.query.key}`)
  }
);

companyAdminRoutes.get(
  '/admin/login',
  function (req, res, next) {
    ejs.renderFile(`${view_path}/company_admin/login.ejs`, {
      page: 'company_admin_login',
    }, {}, function (err, template) {
      if (err) throw err;
      res.end(template);
    });
  }
);

companyAdminRoutes.get(
  '/admin/dashboard',
  AuthMiddleware.checkAuthenticated,
  function (req, res, next) {
    ejs.renderFile(`${view_path}/company_admin/dashboard.ejs`, {
      page: 'company_admin_dashboard_overview',
      user: req.user,
    }, {}, function (err, template) {
      if (err) throw err;
      res.end(template);
    });
  }
);


companyAdminRoutes.get(
  '/admin/wallet',
  AuthMiddleware.checkAuthenticated,
  function (req, res, next) {
    ejs.renderFile(`${view_path}/company_admin/wallet.ejs`, {
      page: 'company_admin_dashboard_wallet',
      user: req.user,
    }, {}, function (err, template) {
      if (err) throw err;
      res.end(template);
    });
  }
);



module.exports = companyAdminRoutes;