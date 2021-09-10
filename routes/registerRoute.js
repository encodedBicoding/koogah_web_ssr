const express = require("express");
const registerRoute = express.Router();
const Register = require("../controllers/register.controller");

registerRoute.get("/dispatcher", Register.SignUpDispatcher);

registerRoute.post('/company/signup', Register.SignupCompany);

registerRoute.post('/mobile/verify', Register.sendMobileVerificationCode);

registerRoute.post('/mobile/code', Register.mobileCodeVerification);




module.exports = registerRoute;
