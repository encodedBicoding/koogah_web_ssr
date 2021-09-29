const express = require('express');
const createError = require("http-errors");
const ejs = require('ejs');
const cors = require('cors');
const path = require("path");
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const session = require('express-session');
require("dotenv").config();


const app = express();
const indexRoutes = require('./routes/indexRoutes');
const registerRoute = require('./routes/registerRoute');
const subscribeRoute = require('./routes/subscribeRoute');
const companyAdminRoutes = require('./routes/companyAdminRoutes');
const companyApis = require('./routes/companyApis.js');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set('trust proxy', true)

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  cookie: {
    secure: process.env.NODE_ENV === 'production' ? true : false,
    path: '/',
    expires: new Date(253402300000000),
  },
  saveUninitialized: true,
  proxy: true,
  resave: false,
  secret: process.env.SESSION_SECRET
}))

app.use('/', indexRoutes);
app.use('/api/register', registerRoute);
app.use('/company', companyAdminRoutes);
app.use('/subscribe', subscribeRoute);
app.use('/api/company', companyApis);

app.use(function(req, res, next) {
  ejs.renderFile('views/not_found.ejs', {
    page: 'error'
  }, {}, function (err, template) {
    if (err) throw err;
      res.end(template);
  })
});


module.exports = app;