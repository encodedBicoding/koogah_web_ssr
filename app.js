const express = require('express');
const createError = require("http-errors");
const cors = require('cors');
const path = require("path");
const ejs = require('ejs');
var fs = require('fs');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
require("dotenv").config();


const app = express();

const indexRoutes = require('./routes/indexRoutes');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/', indexRoutes);

app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});




const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

module.exports = app;