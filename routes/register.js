const express = require("express");
const registerRoute = express.Router();
const registerController = require("../controllers/register.controller");
const { SignUpDispatcher } = registerController;

registerRoute.get("/dispatcher", SignUpDispatcher);

module.exports = registerRoute;
