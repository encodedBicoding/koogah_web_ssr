
this.showLoader();
const vm = new Vue({
  el: '#company_admin_dispatcher',
  data: {
    socket: '',
    host: '',
    notifications: [],
    is_adding_dispatcher: false,
    is_loading_total_dispatchers_item: false,
    active_option_id: null,
    total_dispatchers_item: {
      total_value: 0,
      current_month: 0,
      last_month: 0,
      increased: false,
      percent: -2.4,
    },
    new_dispatchers: [],
    new_dispatchers_count: 0,
    is_fetching_new_dispatchers: false,
    currently_tracking_dispatchers: [],
    current_fetch_page: 0,
    total_pages: 0,
    dispatchers: [],
    is_table_loading: false,
    timeFrame: 'months',
    selectedTableNav: 'all',
    dateRange: {
      start: 0,
      end: 0,
    },
    fetch_dispatcher_error_retry: 5,
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
    this.getTotalDispatchersOverview();
    this.getNewDispatchersCount();
    this.fetchAllDispatchers(true);
    let table_container = document.querySelector('.main_disp_table_body_con');
    let lastScrollPos = 0;
    const self = this;
    table_container.addEventListener('scroll', async (e) => {
      const elems = Array.from(document.getElementsByName('dispatcher_table_body'));
      const last_elem = elems[elems.length - 1];
      let st = e.target.scrollTop;
      if (st > lastScrollPos) {
        if (st > last_elem.getBoundingClientRect().x) {
          if (self.total_pages > self.dispatchers.length) {
            await this.fetchAllDispatchers();
          }
        }
      }
      lastScrollPos = st <= 0 ? 0 : st;
    }, false)

  },
  methods: {
    selectTableNav: async function (nav) {
      this.selectedTableNav = nav;
      this.resetPageData();
      if (this.selectedTableNav === 'all') {
        await this.fetchAllDispatchers(true);
      }
      if (this.selectedTableNav === 'new') {
        let result = this.formatDispatcherData(this.new_dispatchers);
        this.dispatchers = [];
        this.dispatchers = result;
      }
      if (this.selectedTableNav === 'tracking') {
        let result = this.formatDispatcherData(this.currently_tracking_dispatchers);
        this.dispatchers = [];
        this.dispatchers = result;
      }
    },
    resetPageData: function () {
      this.total_pages = 0;
      this.current_fetch_page = 0;
      this.dispatchers = [];
    },
    activateOptionId: function (id) {
      if (this.active_option_id != id) {
        this.active_option_id = id;
      } else {
        this.active_option_id = null;
      }

    },
    goHome: function () {
      window.location.href = '/company/admin/dashboard';
    },
    gotoRoute: function (route) {
      window.location.href = route;
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
    getNewDispatchersCount: async function () {
      try {
        this.is_fetching_new_dispatchers = true;
        const response = await window.fetch(`${this.host}/api/company/admin/dispatchers/new`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((resp) => resp.json()).then((res) => res);
        this.is_fetching_new_dispatchers = false;
        this.new_dispatchers_count = response.data.count;
        this.new_dispatchers = response.data.rows;
      } catch (err) {
        this.is_fetching_new_dispatchers = false;
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
    toSentenceCase: function (s) {
      return `${s[0].toUpperCase()}${s.substring(1, s.length)}`;
    },
    formatDispatcherData: function (data) {
      let result = data.map((d) => {
        let obj = {};
        obj.id = d.id;
        obj.profile_image = d.profile_image;
        obj.full_name = `${this.toSentenceCase(d.first_name)} ${this.toSentenceCase(d.last_name)}`;
        obj.deliveries = d.deliveries;
        obj.email = d.email;
        obj.rating = d.rating;
        obj.date = moment(d.created_at).format('DD/MM/YYYY');
        return obj;
      });
      return result;
    },
    fetchAllDispatchers: async function (showLoading = false) {
      const self = this;
      try {
        if (showLoading) {
          this.is_table_loading = true;
        }
        const response = await window.fetch(`${this.host}/api/company/admin/dispatcher/all?field=is_active&fieldValue=true&page=${this.current_fetch_page}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        }).then((resp) => resp.json()).then((res) => res);
        this.is_table_loading = false;
        if (response.status === 200) {
          let result = this.formatDispatcherData(response.data.rows);
          this.dispatchers = this.dispatchers.concat(result);
          this.total_pages = response.data.totalPages;
          this.current_fetch_page = response.data.currentPage;
        } else {
          if (self.fetch_dispatcher_error_retry > 0) {
            self.is_table_loading = true;
            self.fetch_dispatcher_error_retry = self.fetch_dispatcher_error_retry - 1;
            await this.fetchAllDispatchers(true);
          } else {
            self.is_table_loading = false;
            showToast(
              'error',
              'Error fetching category',
              null,
              'bottom',
              true
            );
          }
        }
      } catch (err) {
        self.is_table_loading = false;
        console.log(err);
      }
    },
    viewDispatcher: function (id) {
      window.location.href = `/company/dispatcher/profile?&id=${id}`;
    },
    editDispatcher: function (id) { },
    removeDispatcher: function (id) {

    },
  }
});