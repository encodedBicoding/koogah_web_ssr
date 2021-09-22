
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
    timeFrame: 'months'
  },
  beforeMount() {
    this.host = window.location.origin;
  },
  created() {
    // connect to websocket.
    // listen for notification
    const self = this;
    let connectionString = 'ws://localhost:4000/data_seeking'
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
    this.getTotalEarningsData();
    this.getTotalDispatchersOverview();
    this.getTotalDeleveriesOverview();
  },
  methods: {
    goHome: function () {
      window.location.href = '/company/admin/dashboard';
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
        this.total_earnings_item = response.data;
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
        this.total_dispatchers_item = response.data;
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
        this.total_delivery_item = response.data;
        this.total_successful_deliveries = response.data.total_value;
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