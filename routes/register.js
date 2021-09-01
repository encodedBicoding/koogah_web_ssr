const express = require("express");
const registerRoute = express.Router();
const Register = require("../controllers/register.controller");

registerRoute.post("/dispatcher", Register.SignUpDispatcher);


module.exports = registerRoute;
