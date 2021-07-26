const express = require('express');
const createError = require("http-errors");
const ejs = require('ejs');
const cors = require('cors');
const path = require("path");
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
require("dotenv").config();


const app = express();

const indexRoutes = require('./routes/indexRoutes');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set('trust proxy', true)

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use('/', indexRoutes);

app.use(function(req, res, next) {
  ejs.renderFile('views/not_found.ejs', {
    page: 'error'
  }, {}, function (err, template) {
    if (err) throw err;
      res.end(template);
  })
});


module.exports = app;