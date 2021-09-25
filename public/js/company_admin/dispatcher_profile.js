
this.showLoader();
const vm = new Vue({
  el: '#company_dispatcher_profile',
  data: {
    socket: '',
    host: '',
    notifications: [],
    active_dispatcher: null,
    total_money_made_overview: null,
    total_delivery_overview: null,
    total_failed_delivery_overview: null,
    current_dispatcher_id: null,
    is_fetching_profile: true,
    has_error_fetching_profile: false,
    map_table_state: 'history', // history or tracking.
    is_table_loading: false,
    delivery_histories: [],
    current_history_page: 0,
    total_pages: 0,
    history_error_retry: 5,
    error_fetch_single_retry: 5,
  },
  beforeMount() {
    this.host = window.location.origin;
    const profile_id = new URLSearchParams(window.location.href).get('id');
    if (profile_id) {
      this.current_dispatcher_id = profile_id;
      this.fetchSingleDispatcher(profile_id);
    } else {
      window.location.href = '/company/admin/dispatchers';
    }
  },
  created() {
    // connect to websocket.
    // listen for notification
    const self = this;
    let connectionString = 'ws://localhost:4000/data_seeking'
    const webSocket = new WebSocket(connectionString);
    webSocket.onopen = function () {
      self.socket = webSocket;
    }
    webSocket.onmessage = async function (message) {
      let msg = JSON.parse(message.data);
      if (msg.event === 'in_app_notification') {
        self.notifications = [];
        self.notifications = msg.payload;
      }
    } 
  },
  mounted() {
    hideLoader();
    this.fetchDispatcherDeliveryHistory(this.current_dispatcher_id, true);
    let table_container = document.querySelector('.main_disp_table_body_con');
    let lastScrollPos = 0;
    const self = this;
    table_container.addEventListener('scroll', async (e) => {
      const elems = Array.from(document.getElementsByName('dispatcher_table_map_body'));
      const last_elem = elems[elems.length - 1];
      let st = e.target.scrollTop;
      if (st > lastScrollPos) {
        if (st > last_elem.getBoundingClientRect().x) {
          if (self.total_pages > self.delivery_histories.length) {
            await this.fetchDispatcherDeliveryHistory(this.active_dispatcher.id, false);
          }
        }
      }
      lastScrollPos = st <= 0 ? 0 : st;
    }, false)
  },
  methods: {
    goHome: function () {
      window.location.href = '/company/admin/dashboard';
    },
    gotoRoute: function (route) {
      window.location.href = route;
     },
    toSentenceCase: function (s) {
      return `${s[0].toUpperCase()}${s.substring(1, s.length)}`;
    },
    selectMapTable: async function (value) {
      if (!this.active_dispatcher) {
        return;
      } else {
        if (value === 'tracking' && this.active_dispatcher.is_currently_dispatching === false) {
          showToast(
            'neutral',
            'This dispatcher is not actively delivering a package',
            null,
            'bottom',
            true
          );
          return;
        } else {
          this.map_table_state = value;
          // fetch based on map table state.
          if (value === 'history') {
            await this.fetchDispatcherDeliveryHistory(this.active_dispatcher.id, true);
          } else {

          }
        }
      }
    },
    formatMobileNumber: function (country, number) {
      if (country === 'nigeria') {
        return `+234${number}`;
      }
    },
    reload: async function () {
      await this.fetchSingleDispatcher(this.current_dispatcher_id);s
    },
    fetchSingleDispatcher: async function (id) {
      const self = this;
      try {
        this.is_fetching_profile = true;
        const response = await window.fetch(`${this.host}/api/company/admin/dispatcher/profile/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        }).then((resp) => resp.json()).then((res) => res);
        this.is_fetching_profile = false;
        if (response.status === 200) {
          this.active_dispatcher = response.data.dispatcher;
          this.total_money_made_overview = response.data.total_money_made_overview;
          this.total_delivery_overview = response.data.total_delivery_overview;
        } else {
          if (response.status === 404) {
            window.location.href = '/company/admin/dispatchers';
          } else {
            this.is_fetching_profile = false;
            this.has_error_fetching_profile = true;
          }
        }
      } catch (err) {
        if (self.error_fetch_single_retry > 0) {
          self.is_fetching_profile = true;
          self.error_fetch_single_retry = self.error_fetch_single_retry - 1;
          await self.fetchSingleDispatcher(id);
        } else {
          self.is_fetching_profile = false;
          self.active_dispatcher = null;
          self.total_money_made_overview = null;
          self.has_error_fetching_profile = true;
        }
        console.log(err);
      }
    },
    formatDeliveryHistory: function (data) {
      let result = data.map((d) => {
        let obj = {};
        obj.package_id = d.package_id;
        obj.status = d.status;
        obj.description = d.description;
        obj.delivery_price = d.delivery_price;
        obj.pickup_address = d.pickup_address;
        obj.dropoff_address = d.dropoff_address;
        obj.created_at = moment(d.created_at).format('DD/MM/YYYY');
        return obj;
      });
      return result;
     },
    fetchDispatcherDeliveryHistory: async function (id, showLoading = true) {
      const self = this;
      try {
        if (showLoading) {
          this.is_table_loading = true;
        }
        const response = await window.fetch(`${this.host}/api/company/admin/dispatcher/delivery/history/${id}?page=${this.current_history_page}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        }).then((resp) => resp.json()).then((res) => res);
        this.is_table_loading = false;
        if (response.status === 200) {
          const result = this.formatDeliveryHistory(response.data.rows)
          this.delivery_histories = this.delivery_histories.concat(result);
          this.total_pages = response.data.totalPages;
          this.current_history_page = response.data.currentPage;
        } else {
          if (self.history_error_retry > 0) {
            self.is_table_loading = true;
            self.history_error_retry = self.history_error_retry - 1;
            await self.fetchDispatcherDeliveryHistory(id, true);
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
    }
  }
});