const express = require('express');
const ejs = require('ejs');
const Estimate = require('../controllers/estimate.controller');

const indexRoutes = express.Router();
const view_path = 'views';

indexRoutes.get(
  '/',
  function (req, res, next) {
  ejs.renderFile(`${view_path}/index.ejs`, {
    page: 'index'
  },
    {}, function (err, template) {
      if (err) throw err;
      res.end(template);
    }
  );
});
indexRoutes.get(
  '/faq',
  function (req, res, next) {
  ejs.renderFile(`${view_path}/faq.ejs`, {
    page: 'faq'
  }, {}, function (err, template) {
    if (err) throw err;
    res.end(template);
  });
});
indexRoutes.get(
  '/dispatcher',
  function (req, res, next) {
  ejs.renderFile(`${view_path}/dispatch.ejs`, {
    page: 'dispatcher'
  }, {}, function (err, template) {
    if (err) throw err;
    res.end(template);
  });
});
indexRoutes.get(
  '/cities',
  function (req, res, next) {
  ejs.renderFile(`${view_path}/cities.ejs`, {
    page: 'cities'
  }, {}, function (err, template) {
    if (err) throw err;
    res.end(template);
  });
});
indexRoutes.get(
  '/privacy',
  function (req, res, next) {
  ejs.renderFile(`${view_path}/privacy.ejs`, {
    page: 'privacy'
  }, {}, function (err, template) {
    if (err) throw err;
    res.end(template);
  });
});
indexRoutes.get(
  '/customer',
  function (req, res, next) {
  ejs.renderFile(`${view_path}/customer.ejs`, {
    page: 'customer'
  }, {}, function (err, template) {
    if (err) throw err;
    res.end(template);
  });
  });

indexRoutes.get(
  '/register',
  function (req, res, next) {
    if(req.query && req.query.ref)
    {
      res.cookie('ref', req.query.ref, {
        secure: true,
        httpOnly: true,
      });
    }
    res.redirect('/')
  });

indexRoutes.get(
  '/verify/mobile',
  function (req, res, next) {
    ejs.renderFile(`${view_path}/mobile_verification.ejs`, {
      page: 'company_verify_email',
    }, {}, function (err, template) {
      if (err) throw err;
      res.end(template);
    });
  }
);
indexRoutes.get(
  '/delivery/estimate',
  function (req, res, next) {
    ejs.renderFile(`${view_path}/estimate.ejs`, {
      page: 'get_delivery_estimate',
    }, {}, function (err, template) {
      if (err) throw err;
      res.end(template);
    });
  }
);
indexRoutes.post(
  '/api/delivery/estimate',
  Estimate.getDeliveryEstimate,
);



module.exports = indexRoutes;
