
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
    current_tracking_package: null,
    packageTrackingData: null,
    map: null,
    dispatcher_location: { lat: null, lng: null }, // dispatcher location
    package_location: { lat: null, lng: null },
    location_fetch_interval: null,
    show_edit_dispatcher_modal: false,
    edit_form_field: {},
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
    const admin_overview = document.querySelector('.admin_overview');
    admin_overview.addEventListener('touchstart', null, { passive: true })
    admin_overview.addEventListener('touchmove', null, { passive: true })
    hideLoader();
    this.fetchDispatcherDeliveryHistory(this.current_dispatcher_id, true);

    let table_container = document.querySelector('.main_disp_table_body_con');

    let scroll_function = async (e) => {
      let lastScrollPos = 0;
      const self = this;
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
    }
    if (this.map_table_state === 'history') {
      table_container.addEventListener('scroll', scroll_function, false);
    }
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
          if (value === this.map_table_state) {
            return;
          } else {
            this.map_table_state = value;
            // fetch based on map table state.
            if (value === 'history') {
              await this.fetchDispatcherDeliveryHistory(this.active_dispatcher.id, true);
            } else {
              await this.fetchTrackingData();
            }
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
      await this.fetchSingleDispatcher(this.current_dispatcher_id);
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
          if (response.data.dispatcher.is_currently_dispatching === true) {
            this.selectMapTable('tracking');
          }
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
          const result = this.formatDeliveryHistory(response.data.rows);
          // find and update the current tracking package
          const isFoundCurrentTracking = result.findIndex((d) => d.status === 'tracking');
          if (isFoundCurrentTracking !== -1) {
            this.current_tracking_package = isFoundCurrentTracking;
          }
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
    },
    fetchTrackingData: async function () {
      let self = this;
      try {
        this.is_table_loading = true;
        const response = await window.fetch(`${this.host}/api/company/admin/dispatcher/tracking/${self.active_dispatcher.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        }).then((resp) => resp.json()).then((res) => res);
        this.is_table_loading = false;
        if (response.status === 200) {
          // first save the data.
          let result = response.data.tracking_package;
          let dispatcher_location = {};
          let package_location = {};
          dispatcher_location.lat = result.dispatcher_lat;
          dispatcher_location.lng = result.dispatcher_lng;
          package_location.lat = result.destination_lat;
          package_location.lng = result.destination_lng;

          if (self.package_location.lat === null && self.package_location.lng == null) {
            self.package_location = package_location;
          }
          if (self.dispatcher_location.lat !== dispatcher_location.lat
            || self.dispatcher_location.lng !== dispatcher_location.lng) {
            self.dispatcher_location = dispatcher_location;
            this.initializeMap();
          }
          // activate interval recalls;
          self.location_fetch_interval = setInterval(() => {
            self.fetchTrackingData();
          }, 40000)
        } else {
          if (self.location_fetch_interval != null) {
            clearInterval(self.location_fetch_interval);
          }
          self.selectMapTable('history');
          return;
        }

      } catch (err) {
        this.is_table_loading = false;
        if (self.location_fetch_interval != null) {
          clearInterval(self.location_fetch_interval);
        }
        self.selectMapTable('history');
      }
    },
    initializeMap: function () {
      const self = this;
      let interval;
      try {
        const package_location_marker = `${this.host}/images/delivery_destination.png`;
        const dispatcher_location_marker = `${this.host}/images/dispatcher_location_marker.png`;
        let retry = 10;
        let elem;
        if (!elem) {
          if (retry > 0) {
            interval = setInterval(() => {
              elem = document.getElementById('map_holder');
              if (elem) {
                if (google) {
                  this.map = new google.maps.Map(document.getElementById('map_holder'), {
                    center: this.dispatcher_location,
                    zoom: 15,
                    zoomControl: true,
                  });
                  const dispatcher_marker = new google.maps.Marker({
                    position: this.dispatcher_location,
                    map: this.map,
                    title: 'Dispatcher location',
                    icon: dispatcher_location_marker,
                    optimized: true,
                  });
                  const d_info_window = new google.maps.InfoWindow({
                    content: `
                      <span class='font-bold'>${self.toSentenceCase(this.active_dispatcher.first_name)}'s </span>
                      <span>location is being tracked.</span>
                    `
                  });
                  dispatcher_marker.addListener('click', () => {
                    d_info_window.open({
                      anchor: dispatcher_marker,
                      map: this.map,
                      shouldFocus: false,
                    })
                  });
                  // add circle
                  new google.maps.Circle({
                    strokeColor: "#f29b38",
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    fillColor: "#f29b38",
                    fillOpacity: 0.35,
                    map: self.map,
                    center: self.dispatcher_location,
                    radius: 150,
                  });
                   const package_marker = new google.maps.Marker({
                    position: this.package_location,
                    map: this.map,
                    title: 'Package Location',
                    icon: package_location_marker,
                    optimized: true,
                   });
                  clearInterval(interval);
                }
              }
              retry--;
            }, 1000);
          } else {
            clearInterval(interval);
          }
        }
      } catch (err) {
        clearInterval(interval);
        console.log(err);
      }
    },
    hideEditDispatcherForm: function () {
      this.edit_form_field = {};
      this.show_edit_dispatcher_modal = false;
    },
    showEditDispatcherForm: function () {
      this.edit_form_field.first_name = this.active_dispatcher.first_name;
      this.edit_form_field.last_name = this.active_dispatcher.last_name;
      this.edit_form_field.mobile_number = this.active_dispatcher.mobile_number;
      this.show_edit_dispatcher_modal = true;
    },
    actionEditDispatcher: async function () {
      try {
        if (!this.edit_form_field.first_name) {
          showToast('error', 'First name cannot be empty', null, null, true);
          return;
        }
        if (!this.edit_form_field.last_name) {
          showToast('error', 'Last name cannot be empty', null, null, true);
          return;
        }
        if (!this.edit_form_field.mobile_number) {
          showToast('error', 'Mobile number cannot be empty', null, null, true);
          return;
        }
        showLoader();
        const response = await window.fetch(`${this.host}/api/company/admin/dispatcher/edit/${this.active_dispatcher.id}`, {
          method: 'POST',
          body: JSON.stringify(this.edit_form_field),
          headers: {
            'Content-Type': 'application/json'
          },
        }).then((resp) => resp.json()).then((res) => res);
        hideLoader();
        if (response.status === 200) {
          showToast('success', response.message, null, null, true);
          this.show_edit_dispatcher_modal = false;
          this.active_dispatcher = response.data;
        } else {
          showToast('error', response.error, null, null, true);
        }
      } catch (err) {
        hideLoader();
        showToast('error', 'An error occurred', null, null, true);
        this.show_edit_dispatcher_modal = false;
        console.log(err);
      }
    },
  }
});
