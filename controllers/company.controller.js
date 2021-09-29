const fetch = require('node-fetch');
const Promise = require('bluebird');

const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? process.env.BASE_URL_PRODUCTION : process.env.BASE_URL_DEVELOPMENT;

class CompanyController {
  static logout(req, res, next) {
    return Promise.try(async () => {
      res.clearCookie('koogah_session_token', { path: '/' });
      res.clearCookie('refresh_token', { path: '/' });
      return res.status(200).json({
        status: 200,
        message: 'Logout successfully',
      })
    }).catch((err) => {
      return res.status(500).json({
        status: 500,
        error: err,
      });
    });
  }
  
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
  static getMe(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      const response = await fetch(`${base_url}/company/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then((resp) => resp.json()).then((res) => res);
      return res.json(response);
    }).catch(err => {
      return res.status(500).json({
        status: 500,
        error: err,
      });
    });
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

  static getWithdrawableBalance(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      const response = await fetch(`${base_url}/company/accounts/wallet/withdrawable`, {
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

  static requestPayout(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      const { bank_code } = req.body;
      const response = await fetch(`${base_url}/company/accounts/payout`, {
        method: 'POST',
        body: JSON.stringify({bank_code}),
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

  static getNewDispatchers(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      const response = await fetch(`${base_url}/company/dispatchers/new`, {
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

  static getAllDispatchers(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      const { field, fieldValue, page } = req.query;
      const response = await fetch(`${base_url}/company/dispatcher/all?field=${field}&fieldValue=${fieldValue}&page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }).then((resp) => resp.json());
      return res.json(response);
    }).catch((err) => {
      return res.status(500).json({
        status: 500,
        error: err,
      })
    })
  }

  static getSingleDispatcher(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      let { id } = req.params;
      const response = await fetch(`${base_url}/company/dispatcher/single/${id}`, {
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

  static getSingleDispatcherDeliveryHistory(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      let { id } = req.params;
      const { page } = req.query;
      const response = await fetch(`${base_url}/company/dispatcher/delivery/history/${id}?page=${page}`, {
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

  static fetchSingleDispatcherTrackingLocation(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      let { id } = req.params;
      const response = await fetch(`${base_url}/company/dispatcher/tracking/${id}`, {
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

  static editDispatcherDetail(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      let { id } = req.params;
      const { ...data } = req.body;
      const response = await fetch(`${base_url}/company/dispatcher/edit/${id}`, {
        method: 'PUT',
        body: JSON.stringify({...data}),
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
  static sendDispatcherEmailVerificationCode(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      let { email } = req.params;
      const response = await fetch(`${base_url}/company/dispatcher/signup/email`, {
        method: 'POST',
        body: JSON.stringify({email}),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }).then((resp) => resp.json());
      return res.json(response);
    }).catch((err) => {
      return res.status(500).json({
        status: 500,
        error: err,
      })
    })
  }
  static sendDispatcherMobileVerificationCode(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      const response = await fetch(`${base_url}/company/dispatcher/signup/mobile`, {
        method: 'POST',
        body: JSON.stringify({...req.body}),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }).then((resp) => resp.json());
      return res.json(response);
    }).catch((err) => {
      return res.status(500).json({
        status: 500,
        error: err,
      })
    })
  }
  static verifyDispatcherEmailVerificationCode(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      const response = await fetch(`${base_url}/company/dispatcher/verify/code/email`, {
        method: 'POST',
        body: JSON.stringify({...req.body}),
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
  
  static verifyDispatcherMobileVerificationCode(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      const response = await fetch(`${base_url}/company/dispatcher/verify/code/mobile`, {
        method: 'POST',
        body: JSON.stringify({...req.body}),
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
  static completeDispatcherRegisteration(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      const response = await fetch(`${base_url}/company/dispatcher/registration/complete`, {
        method: 'POST',
        body: JSON.stringify({...req.body}),
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

  static companyUpdateProfile(req, res) {
    return Promise.try(async () => {
      let token = req.cookies['koogah_session_token'];
      const response = await fetch(`${base_url}/company/profile/update`, {
        method: 'PUT',
        body: JSON.stringify({...req.body}),
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
      });
    });
  }
};

module.exports = CompanyController;