const express = require("express");
const registerRoute = express.Router();
const Register = require("../controllers/register.controller");



registerRoute.post('/company/signup', Register.SignupCompany);

registerRoute.post('/mobile/verify', Register.sendMobileVerificationCode);

registerRoute.post('/mobile/code', Register.mobileCodeVerification);

registerRoute.post('/verify_bank_details', Register.verifyBankDetails);

registerRoute.post('/company/activate/account', Register.activateAccount);

registerRoute.post("/client/:type", Register.SignUpClient);




module.exports = registerRoute;
