const eventEmitter = require('../event');
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  apiKey: process.env.GOOGLE_API_KEY,
};

const geocoder = NodeGeocoder(options);

class RouterWares {
  static async checkLocation(req, res, next) {
    try {
      const url = req.url;
      let host = req.headers.host;
      const connectionIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
      geolocation.getCurrentPosition(function (err, position) {
        if (err) throw err
        console.log(position)
      })
      next();
    } catch (err) {
      console.log(err);
      next();
    }
  }
}


module.exports = RouterWares;
