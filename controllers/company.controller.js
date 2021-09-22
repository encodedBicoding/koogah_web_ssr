const fetch = require('node-fetch');
const Promise = require('bluebird');

const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? process.env.BASE_URL_PRODUCTION : process.env.BASE_URL_DEVELOPMENT;

class CompanyController {
  static login(req, res) {
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
      if (response.status === 200) {
        res.clearCookie('koogah_session_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/' });
        res.cookie('koogah_session_token', response.token, {
          secure: true,
          httpOnly: true,
        });
        res.cookie('refresh_token', response.refresh_token, {
          secure: true,
          httpOnly: true,
        })
      }
      return res.json(response);
    })
      .catch((err) => {
        return res.status(500).json({
          status: 500,
          error: err,
        })
    })
  }
  static getTotalEarnings(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      const { time_frame } = req.query;
      const response = await fetch(`${base_url}/company/total_earnings?time_frame=${time_frame}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }).then((resp) => resp.json());
      return res.json(response);
    }).catch(err => {
        return res.status(500).json({
          status: 500,
          error: err,
        })
    })
  }

  static getTotalDispatchersOverview(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      const { time_frame } = req.query;
      const response = await fetch(`${base_url}/company/total_dispatchers/overview?time_frame=${time_frame}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }).then((resp) => resp.json());
      return res.json(response);
    }).catch(err => {
        return res.status(500).json({
          status: 500,
          error: err,
        })
    })
  }

  static getTotalDeliveriesOverview(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      const { time_frame } = req.query;
      const response = await fetch(`${base_url}/company/total_deliveries/overview?time_frame=${time_frame}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }).then((resp) => resp.json());
      return res.json(response);
    }).catch(err => {
        return res.status(500).json({
          status: 500,
          error: err,
        })
    })
  }
};

module.exports = CompanyController;