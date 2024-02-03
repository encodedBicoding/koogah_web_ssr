const fetch = require('node-fetch');
const Promise = require('bluebird');

const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? process.env.BASE_URL_PRODUCTION : process.env.BASE_URL_DEVELOPMENT;

class Estimate {
  static getDeliveryEstimate(req, res) {
    return Promise.try(async () => {
      const response = await fetch(`${base_url}/v2/package/estimate/${req.query.dispatchType}`, {
        method: 'post',
        body: JSON.stringify(req.body),
        headers: {
          'Content-Type': 'application/json',
          '__koogah_external_api_session_secret': process.env.EXTERNAL_API_SESSION_SECRET,
        },
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

module.exports = Estimate;
