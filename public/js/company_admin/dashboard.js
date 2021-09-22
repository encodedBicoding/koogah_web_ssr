

const vm = new Vue({
  el: '#company_admin_dashboard',
  data: {
    socket: null,
    notifications: [],
    total_earnings: 0,
    is_loading_total_dispatchers_item: false,
    total_dispatchers_item: {
      current_month: 0,
      last_month: 0,
      increased: false,
      percent: 2.4,
    },
    is_loading_total_delivery_item: false,
    total_delivery_item: {
      current_month: 1234,
      last_month: 0,
      increased: true,
      percent: 2.4,
    },
    is_loading_delivery_status: false,
    total_successful_deliveries: 306,
    total_failed_deliveries: 0,
    currently_tracking_dispatchers: 0,
    dateRange: {
      start: null,
      end: null
    },
    timeFrame: 'months'
  },
  beforeMount() { },
  created() {
    // connect to websocket.
    const self = this;
    let connectionString = 'ws://localhost:4000/data_seeking'
    const webSocket = new WebSocket(connectionString);
    webSocket.onopen = function () {
      self.socket = webSocket;
    }
    // listen for notification
    webSocket.onmessage = async function (message) {
      let msg = JSON.parse(message.data);
      if (msg.event === 'in_app_notification') {
        self.notifications = [];
        self.notifications = msg.payload;
      }
    } 
  },
  mounted() {
  },
  methods: {
    goHome: function () {
      window.location.href = '/company/admin/dashboard';
    },
    selectTimeFrame: function (tf) {
      console.log('active');
      this.timeFrame = tf;
     }
  }
});