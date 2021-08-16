const express = require('express');
const ejs = require('ejs');
const RouterWares = require('../middlewares/locale');

const indexRoutes = express.Router();
const view_path = 'views';

const {
  checkLocation,
} = RouterWares;

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
  '/dispatch',
  function (req, res, next) {
  ejs.renderFile(`${view_path}/dispatch.ejs`, {
    page: 'dispatch'
  }, {}, function (err, template) {
    if (err) throw err;
    res.end(template);
  });
});
indexRoutes.get(
  '/cities',
  function (req, res, next) {
  ejs.renderFile(`${view_path}/cities.ejs`, {
    page: 'faq'
  }, {}, function (err, template) {
    if (err) throw err;
    res.end(template);
  });
});



module.exports = indexRoutes;
