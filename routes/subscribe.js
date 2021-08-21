const express = require("express");
const subscribeRoute = express.Router();

const Subscribe = require('../controllers/subscribe.controller');

subscribeRoute.get(
  '/email-list/:email',
  Subscribe.subscribeEmail
);

module.exports = subscribeRoute;