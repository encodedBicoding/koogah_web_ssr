const express = require("express");
const ejs = require("ejs");

const indexRoutes = express.Router();
const view_path = "views";

indexRoutes.get("/", function (req, res, next) {
  ejs.renderFile(
    "views/index.ejs",
    {
      message: "Hello Worldsss",
    },
    {},
    function (err, template) {
      if (err) throw err;
      res.end(template);
    }
  );
});

indexRoutes.get("/faq", function (req, res, next) {
  ejs.renderFile(
    "views/faq.ejs",
    {
      message: "Faq",
    },
    {},
    function (err, template) {
      if (err) throw err;
      res.end(template);
    }
  );
});

module.exports = indexRoutes;
