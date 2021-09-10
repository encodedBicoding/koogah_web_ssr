const fetch = require('node-fetch');
const Promise = require('bluebird');

const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? process.env.BASE_URL_PRODUCTION : process.env.BASE_URL_DEVELOPMENT;
class Register{
  static async SignUpDispatcher(req, res) {
    try {
      console.log(req);
      return res.status(200).json({status: 200, message: 'Retrieved'})
    } catch (error) {
      console.log(error)
    }
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
}

module.exports = Register;