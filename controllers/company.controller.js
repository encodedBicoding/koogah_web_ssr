const fetch = require('node-fetch');
const Promise = require('bluebird');

const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? process.env.BASE_URL_PRODUCTION : process.env.BASE_URL_DEVELOPMENT;

class CompanyController {
  static login(req, res) {
    // console.log(req.cookies['koogah_session_token']);
    return Promise.try(async () => {
      const { email, password } = req.body;
      const response = await fetch(`${base_url}/company/signin`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((resp) => resp.json());
      res.cookie('koogah_session_token', response.data.token, {
        secure: true,
        httpOnly: true,
      });
      res.cookie('refresh_token', response.data.refresh_token, {
        secure: true,
        httpOnly: true,
      })
      return res.json(response);
    })
      .catch((err) => {
        return res.status(500).json({
          status: 500,
          error: err,
        })
    })
  }
};

module.exports = CompanyController;