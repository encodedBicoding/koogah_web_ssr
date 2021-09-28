this.showLoader();
const vm = new Vue({
  el: '#company_admin_dashboard_wallet',
  data: {
    socket: '',
    host: '',
    notifications: [],
    banks: [],
    bank_code: '',
    user: {},
    is_fetching_banks: true,
    currently_tracking_dispatchers: [],
    is_loading_withdrawable_current_balance: true,
    withdrawable_balance: 0,
    current_balance: 0,
    retry_fetch_nigerian_banks: 0,
  },
  beforeMount() {
    this.host = window.location.origin;
  },
  created() {
    // connect to websocket.
    // listen for notification
    const self = this;
    let connectionString = 'wss://koogah-api-staging.herokuapp.com/data_seeking' //wss://core.koogahapis.com/data_seeking
    const webSocket = new WebSocket(connectionString);
    webSocket.onopen = function () {
      self.socket = webSocket;
      self.wsGetTrackingDispatchers();
    }
    webSocket.onmessage = async function (message) {
      let msg = JSON.parse(message.data);
      if (msg.event === 'in_app_notification') {
        self.notifications = [];
        self.notifications = msg.payload;
      }
      if (msg.event === 'company_tracking_dispatchers_result') {
        self.currently_tracking_dispatchers = msg.payload;
      }
    } 
  },
  mounted() {
    hideLoader();
    this.getWithdrawableBalance();
    this.fetchMe();
    this.fetchNigerianBanks();
  },
  methods: {
    goHome: function () {
      window.location.href = '/company/admin/dashboard';
    },
    gotoRoute: function (route) {
      window.location.href = route;
    },
    fetchMe: async function () {
      try {
        const response = await window.fetch(`${this.host}/api/company/admin/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((resp) => resp.json()).then((res) => res);
        this.user = response.data;
      } catch (err) {
        console.log(err);
      }
    },
    fetchNigerianBanks: async function () {
      this.is_fetching_banks = true;
      const self = this;
      try {
        const response = await window.fetch('https://api.paystack.co/bank', {
          method: 'GET'
        }).then((resp) => resp.json()).then((res) => res);
        if (response.status === true) {
          this.banks = [];
          this.banks = response.data;
          if (!this.user) {
            await this.fetchMe();
          }
          this.bank_code = this.banks.find((b) => b.name === this.user.bank_account_name).code;
        }
        this.is_fetching_banks = false;
      } catch (err) {
        if (self.retry_fetch_nigerian_banks < 5) {
          this.fetchNigerianBanks();
          self.retry_fetch_nigerian_banks = self.retry_fetch_nigerian_banks + 1;
        }
      }
    },
    getWithdrawableBalance: async function () {
      try {
        this.is_loading_withdrawable_current_balance = true;
        const response = await window.fetch(`${this.host}/api/company/admin/balance/withdrawable`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((resp) => resp.json()).then((res) => res);
        this.is_loading_withdrawable_current_balance = false;
        this.withdrawable_balance = response.data.withdrawable_balance;
      } catch (err) {
        console.log(err);
      }
    },
    proceedWithrawal: async function () {
      try {
        hideModal();
        showLoader();
        const response = await window.fetch(`${this.host}/api/company/admin/accounts/payout/request`,
          {
            method: 'POST',
            body: JSON.stringify({bank_code: this.bank_code}),
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ).then((resp) => resp.json()).then((res) => res);
        hideLoader();
        if (response.status === 200) {
          showModal();
          buildNoticeModal(
            response.message,
            () => {
              hideModal();
              window.location.reload();
            },
            'Okay',
            false,
            'success',
          );
        } else {
          showToast(
            'error',
            response.error,
            null,
            null,
            true,
          );
        }
      } catch (err) {
        console.log(err);
        hideLoader();
      }
    },
    withdrawFunds: async function () {
      try {
        if (this.currently_tracking_dispatchers.length > 0) {
          showModal();
          buildNoticeModal(
            'You have dispatcher(s) currently on a delivery. Money paid to you may be lower than your current balance.',
            await this.proceedWithrawal,
            'Proceed'
          )
        } else {
          await this.proceedWithrawal();
        }
      } catch (err) {
        console.log(err);
      }
    },
    wsGetTrackingDispatchers: function () {
      const message = JSON.stringify({
        event: 'get_company_tracking_dispatchers',
      });
      if (this.socket) {
        this.socket.send(message);
      }
    },
  }
});