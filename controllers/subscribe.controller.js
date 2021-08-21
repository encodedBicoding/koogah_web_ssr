const fetch = require('node-fetch');
class Subscribe {
  static async subscribeEmail(req, res) {
    try {
      const { email} = req.params;
      const SLACK_EMAIL_SUBSCRIPTION_CHANNEL_HOOK = process.env.SLACK_EMAIL_SUBSCRIPTION_CHANNEL_HOOK;
      fetch(SLACK_EMAIL_SUBSCRIPTION_CHANNEL_HOOK, {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `<!channel> \nNew Email Subscription\n\nAddress: ${email}`,
        }),
      }).then(result => {
          return res.status(200).json({
            status: 200,
            message: 'Subscription successful',
          });
        }).catch(err => {s
          return res.status(400).json({
            status: 400,
            error: 'An error occurred'
          });
        });
    } catch (err) {
      console.log(err);
    }
   }
}

module.exports = Subscribe;