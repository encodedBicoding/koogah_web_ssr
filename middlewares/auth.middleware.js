const fetch = require('node-fetch');
const Promise = require('bluebird');
const ejs = require('ejs');

const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? process.env.BASE_URL_PRODUCTION : process.env.BASE_URL_DEVELOPMENT;

const Company = require('../models/user.class');
class AuthMiddleware {
  static checkAuthenticated(req, res, next) {
    return Promise.try(
      async () => {
        let token = req.cookies['koogah_session_token'];
        let refresh_token = req.cookies['refresh_token'];
        let user;
        if (!token) {
          return res.redirect('/company/admin/login');
        }
        // get the user;
        // store the user on the request
        const response = await fetch(`${base_url}/v1/company/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }).then((resp) => resp.json()).then((res) => res);
        if (response.status !== 200) {
          // use refresh
          const refresh_response = await fetch(`${base_url}/v1/company/me/refresh?refresh_token=${refresh_token}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }).then((resp) => resp.json()).then((res) => res);
          if (refresh_response.status !== 200) {
            return res.redirect('/company/admin/login');
          } else {
            res.clearCookie('koogah_session_token', { path: '/' });
            res.cookie('koogah_session_token', refresh_response.token, {
              secure: true,
              httpOnly: true,
            });
            res.clearCookie('refresh_token', { path: '/' });
            res.cookie('refresh_token', refresh_response.refresh_token, {
              secure: true,
              httpOnly: true,
            });
            user = refresh_response.data;
            req.user = new Company(user);
            return next();
          }
        } else {
          user = response.data;
        }
        req.user = new Company(user);
        return next();
      }
    ).catch(err => {
      // render server down page here
      ejs.renderFile('views/server_down.ejs', {
        page: 'error'
      }, {}, function (err, template) {
        if (err) throw err;
          res.end(template);
      })
    })
  }
}

module.exports = AuthMiddleware;