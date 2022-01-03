const fetch = require('node-fetch');
const Promise = require('bluebird');
var FormData = require('form-data');
const fs = require("fs");
const ImageDataURI = require('image-data-uri');

const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? process.env.BASE_URL_PRODUCTION : process.env.BASE_URL_DEVELOPMENT;

class Register{
  static async SignUpClient(req, res) {
    const { type } = req.params;
    if(!type || type != 'customer' && type != 'courier') {
      return res.status(400).json({type: 'Provided client not recognized by Koogah'})
    }

    let status = '';
    let uploadOK = false;
    let response = null;

    if(type === 'courier'){
      const filePath = await ImageDataURI.outputFile(req.body.profile_image, "picture");

      const fd = new FormData();
      fd.append('profile', fs.createReadStream(filePath))

      response = await fetch(
        `${base_url}/profile/courier/upload/single`, 
        {
          method: 'PUT',
          body: fd,
        }
      )
      .then((resp) => {
        status = resp.status;
        uploadOK = resp.ok
        return resp.json()
      })
    }
    
    if(type === 'customer' || uploadOK) {
      const ref = req.cookies && req.cookies.ref;

      //override profile image value with upload result
      if (response) {
        if (response.data) {
          req.body.profile_image = response.data.secure_url
        }
      }

      response = await fetch(
        `${base_url}/user/${req.params.type}/signup?fromApp=web${ref ? `&&ref=${ref}` : ""}`, 
        {
          method: 'POST',
          body: JSON.stringify(req.body),
          headers: { 'Content-Type': 'application/json' }
        }
      )
      .then((resp) => {
        status = resp.status;
        if(resp.ok) {
          res.clearCookie('ref', { path: '/' });
        }
        return resp.json()
      })
    }
    

    res.status(status).json(response)
  }

  static SignupCompany(req, res) {
    return Promise.try(async () => {
      const response = await fetch(`${base_url}/company/signup`, {
        method: 'post',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
      }).then((resp) => resp.json());
      return res.json(response);
    }).catch((err) => {
      return res.status(500).json({
        status: 500,
        error: err,
      })
     });
  }
  static sendMobileVerificationCode(req, res) {
    return Promise.try(async () => {
      let account = req.query.account;
      let token = req.query.token;
      let request_string = account === 'courier' ? `${base_url}/user/verify/email` : account === 'customer' ? `${base_url}/user/${account}/verify/email` : `${base_url}/${account}/verify/email`;
      const response = await fetch(`${request_string}?key=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then((resp) => resp.json());
      return res.json(response);
    })
      .catch((err) => {
        return res.status(500).json({
          status: 500,
          error: err,
        })
      })
  }
  static mobileCodeVerification(req, res) {
    return Promise.try(async () => {
      let { code, token, account } = req.query;
      let request_string = account === 'courier' ? `${base_url}/user/verify/mobile` : account === 'customer' ? `${base_url}/user/${account}/verify/mobile` : `${base_url}/${account}/verify/mobile`;
      const response = await fetch(`${request_string}?key=${token}`, {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: { 'Content-Type': 'application/json' }
      }).then((resp) => resp.json());
      return res.json(response);

    }).catch(err => {
        return res.status(500).json({
          status: 500,
          error: err,
        })
      })
  }
  static verifyBankDetails(req, res) {
    return Promise.try(async () => {
      const { bank_code, account_number } = req.body;
      const response = await fetch(
        `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.PAYSTACK_LIVE_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      ).then((resp) => resp.json());
      return res.json(response);
    }).catch(err => {
      return res.status(500).json({
        status: 500,
        error: err,
      })
    });
  }

  static activateAccount(req, res) {
    return Promise.try(async () => {
      const { password, bank_name, account_number } = req.body;
      const token = req.query.key;
      const response = await fetch(
        `${base_url}/company/approved/welcome?key=${token}`,
        {
          method: 'POST',
          body: JSON.stringify({
            password,
            bank_name,
            account_number
          }),
          headers: {
            'Authorization': `Bearer ${process.env.PAYSTACK_LIVE_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      ).then((resp) => resp.json());
      return res.json(response);
    }).catch(err => {
      return res.status(500).json({
        status: 500,
        error: err,
      });
    });
  }
}

module.exports = Register;