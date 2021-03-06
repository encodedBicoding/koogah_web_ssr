
this.showLoader();
const vm = new Vue({
  el: '#company_admin_dashboard',
  data: {
    socket: '',
    host: '',
    notifications: [],
    is_loading_total_earnings_item: false,
    total_earnings_item: {
      total_value: 0,
      current_month: 0,
      last_month: 0,
      increased: false,
      percent: -2.4,
    },
    is_loading_total_dispatchers_item: false,
    total_dispatchers_item: {
      total_value: 0,
      current_month: 0,
      last_month: 0,
      increased: false,
      percent: -2.4,
    },
    is_loading_total_delivery_item: false,
    total_delivery_item: {
      total_value: 0,
      current_month: 1234,
      last_month: 0,
      increased: true,
      percent: -2.4,
    },
    is_loading_delivery_status: false,
    total_successful_deliveries: 0,
    total_failed_deliveries: 0,
    currently_tracking_dispatchers: [],
    dateRange: {
      start: null,
      end: null
    },
    timeFrame: 'months',
    show_logout_dropdown: false,
    show_notification_dropdown: false,
  },
  beforeMount() {
    this.host = window.location.origin;
  },
  async created() {
    // connect to websocket.
    // listen for notification
    const self = this;
    const ws_string_response = await fetch(`${this.host}/api/company/admin/ws/connect`).then((resp => resp.json())).then((res) => res);
    let connectionString = `wss://koogah-api-staging.herokuapp.com${ws_string_response.connection_url}`;
    let mainConnectionString = `wss://core.koogahapis.com${ws_string_response.connection_url}`;
    let localConnectionString = `ws://localhost:4000${ws_string_response.connection_url}`;
    const webSocket = new WebSocket(mainConnectionString);
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
      if (msg.event === 'company_new_package_creation') {
        showMarketPlaceToast('neutral', msg.payload, null, 'bottom_left', true);
      }
    } 
  },
  mounted() {
    hideLoader();
    this.getTotalEarningsData();
    this.getTotalDispatchersOverview();
    this.getTotalDeleveriesOverview();
  },
  methods: {
    logout: async function () {
      try {
        const response = await window.fetch(`${this.host}/api/company/admin/logout`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((resp) => resp.json()).then((res) => res);
        if (response.status === 200) {
          window.location.href = '/company/admin/login';
        }
      } catch (err) {
        console.log(err);
      }
    },
    toggleLogout: function () {
      this.show_logout_dropdown = !this.show_logout_dropdown;
    },
    goHome: function () {
      window.location.href = '/company/admin/dashboard';
    },
    gotoRoute: function (route) {
      window.location.href = route;
     },
    selectTimeFrame: async function (tf) {
      this.timeFrame = tf;
      await this.getTotalEarningsData();
      await this.getTotalDispatchersOverview();
      await this.getTotalDeleveriesOverview();
    },
    getTotalEarningsData: async function () {
      try {
        this.is_loading_total_earnings_item = true;
        const response = await window.fetch(`${this.host}/api/company/admin/total_earnings?&time_frame=${this.timeFrame}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((resp) => resp.json()).then((res) => res);
        this.total_earnings_item = {}
        this.is_loading_total_earnings_item = false;
        if (response.status === 200) {
          this.total_earnings_item = response.data;
        }

      } catch (err) {
        console.log(err);
      }
    },
    getTotalDispatchersOverview: async function () {
      try {
        this.is_loading_total_dispatchers_item = true;
        const response = await window.fetch(`${this.host}/api/company/admin/total_dispatchers_overview?&time_frame=${this.timeFrame}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((resp) => resp.json()).then((res) => res);
        this.total_dispatchers_item = {}
        this.is_loading_total_dispatchers_item = false;
        if (response.status === 200) {
          this.total_dispatchers_item = response.data;
        }

      } catch (err) {
        console.log(err);
      }
    },
    getTotalDeleveriesOverview: async function () {
      try {
        this.is_loading_total_delivery_item = true;
        const response = await window.fetch(`${this.host}/api/company/admin/total_deliveries_overview?&time_frame=${this.timeFrame}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((resp) => resp.json()).then((res) => res);
        this.total_delivery_item = {}
        this.is_loading_total_delivery_item = false;
        if (response.status === 200) {
          this.total_delivery_item = response.data;
          this.total_successful_deliveries = response.data.total_value;
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
    activateNotification: function () {
      try {
        this.show_notification_dropdown = !this.show_notification_dropdown;
      } catch (err) {
        console.log(err);
      }
    }
  }
});