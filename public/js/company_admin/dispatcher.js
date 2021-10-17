
this.showLoader();
const vm = new Vue({
  el: '#company_admin_dispatcher',
  data: {
    socket: '',
    host: '',
    notifications: [],
    is_adding_dispatcher: false,
    is_adding_dispatcher_email: false,
    is_adding_dispatcher_phone: false,
    is_adding_dispatcher_data: false,
    is_verifying_signup_code: false,
    show_new_dispatcher_password: false,
    current_dispatcher_add_phase: 'email',
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
    total_data_count: 0,
    dispatchers: [],
    is_table_loading: false,
    timeFrame: 'months',
    selectedTableNav: 'all',
    dateRange: {
      start: 0,
      end: 0,
    },
    fetch_dispatcher_error_retry: 5,
    show_edit_dispatcher_modal: false,
    active_edit_dispatcher_id: null,
    edit_form_field: null,
    new_dispatcher: {},
    dispatcher_reg_code_one: '',
    dispatcher_reg_code_two: '',
    dispatcher_reg_code_three: '',
    dispatcher_reg_code_four: '',
    dispatcher_reg_code_five: '',
    temp_dispatcher_profile_image: '',
    all_states: [],
    all_selected_towns: [],
    selected_dispatcher_state: '',
    selected_dispatcher_country: '',
    selected_dispatcher_city: '',
    selected_dispatcher_gender: '',
    show_logout_dropdown: false,
    last_data_timestamp: '',
    show_notification_dropdown: false,
  },
  beforeMount() {
    this.host = window.location.origin;
  },
  watch: {
    temp_dispatcher_profile_image: async function (nv, ov) {
      try {
        const input_file_image = document.getElementById('add_dispatcher_profile_image');
        const server_host = 'https://core.koogahapis.com/v1';
        const local_server_host = 'http://localhost:4000/v1';
        this.new_dispatcher.profile_image = '';
        const [file] = input_file_image.files;
        if (file) {
          const fd = new FormData();
          fd.append('profile', file);
          showToast('neutral', 'Image upload is processing...', null, null, true);
          const response = await window.fetch(`${server_host}/profile/courier/upload/single`, {
            method: "PUT",
            body: fd,
          }).then((resp) => resp.json()).then((res) => res);
          if (response.status === 200) {
            this.new_dispatcher.profile_image = '';
            this.new_dispatcher.profile_image = response.data.secure_url;
            showToast('success', 'Profile image added successfully', null, null, true)
          } else {
            showToast('error', 'Image upload error, please retry or choose another image', null, null, true);
            return;
          }
        } else {
          showToast('error', 'Image upload error, please retry or choose another image', null, null, true);
          return;
        }
      } catch (err) {
        console.log(err);
      }
    },
    selected_dispatcher_country: function (nv, ov) {
      try {
        this.new_dispatcher.nationality = nv;
        this.all_states = citiesAndTowns.map((c) => c.name);
      } catch (err) {
        console.log(err);
      } 
    },
    selected_dispatcher_state: function (nv, ov) {
      try {
        if (nv) {
          const cities_in_states = citiesAndTowns.find((s) => s.name.toLowerCase() === nv).lgas;
          this.all_selected_towns = cities_in_states;
          this.new_dispatcher.state = nv;
        }
      } catch (err) {
        console.log(err);
      }
    },
    selected_dispatcher_city: function (nv, ov) {
      this.new_dispatcher.town = nv;
    },
    selected_dispatcher_gender: function (nv, ov) {
      this.new_dispatcher.sex = nv;
    },

    dispatcher_reg_code_one: function (nv, ov) {
      const elem = document.getElementById('dispatcher_reg_code_one');
      if (nv) {
        elem.nextElementSibling.focus();
      } else {
        elem.blur();
      }
    },
    dispatcher_reg_code_two: function (nv, ov) {
      const elem = document.getElementById('dispatcher_reg_code_two');
      if (nv) {
        elem.nextElementSibling.focus();
      } else {
        elem.previousElementSibling.focus();
      }
    },
    dispatcher_reg_code_three: function (nv, ov) {
      const elem = document.getElementById('dispatcher_reg_code_three');
      if (nv) {
        elem.nextElementSibling.focus();
      } else {
        elem.previousElementSibling.focus();
      }
    },
    dispatcher_reg_code_four: function (nv, ov) {
      const elem = document.getElementById('dispatcher_reg_code_four');
      if (nv) {
        elem.nextElementSibling.focus();
      } else {
        elem.previousElementSibling.focus();
      }
    },
    dispatcher_reg_code_five: function (nv, ov) {
      const elem = document.getElementById('dispatcher_reg_code_five');
      if (!nv) {
        elem.previousElementSibling.focus();
      } else {
        elem.blur();
      }
    },
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
        console.log(msg);
        self.currently_tracking_dispatchers = msg.payload;
      }
      if (msg.event === 'company_new_package_creation') {
        showMarketPlaceToast('neutral', msg.payload, null, 'bottom_left', true);
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
          await this.loadOlderData();
        }
      }
      lastScrollPos = st <= 0 ? 0 : st;
    }, false);
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
    selectTableNav: async function (nav) {
      if (nav !== this.selectedTableNav) {
        this.selectedTableNav = nav;
        this.last_data_timestamp = '';
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
      let result;
      if (Array.isArray(data)) {
        result = data.map((d) => {
          let obj = {};
          obj.id = d.id;
          obj.profile_image = d.profile_image;
          obj.first_name = d.first_name;
          obj.last_name = d.last_name;
          obj.full_name = `${this.toSentenceCase(d.first_name)} ${this.toSentenceCase(d.last_name)}`;
          obj.deliveries = d.deliveries;
          obj.email = d.email;
          obj.rating = d.rating;
          obj.mobile_number = d.mobile_number;
          obj.date = moment(d.created_at).format('DD/MM/YYYY');
          return obj;
        });
      } else {
        result = {};
        result.id = data.id;
        result.profile_image = data.profile_image;
        result.first_name = data.first_name;
        result.last_name = data.last_name;
        result.full_name = `${this.toSentenceCase(data.first_name)} ${this.toSentenceCase(data.last_name)}`;
        result.deliveries = data.deliveries;
        result.email = data.email;
        result.rating = data.rating;
        result.mobile_number = data.mobile_number;
        result.date = moment(data.created_at).format('DD/MM/YYYY');
      }
      return result;
    },
    loadOlderData: async function () {
      let to;
      let data = this.dispatchers;
      let last_data_timestamp = data[data.length - 1].created_at;
      if (this.last_data_timestamp !== last_data_timestamp) {
        this.last_data_timestamp = last_data_timestamp;
        to = setTimeout(async () => {
          await this.fetchAllDispatchers();
        }, 1500)
      } else {
        clearTimeout(to);
      }
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
          let temp_data = this.dispatchers.concat(result);
          this.dispatchers = temp_data;
          this.total_pages = response.data.totalPages;
          this.current_fetch_page = response.data.currentPage;
          this.total_data_count = response.data.count;
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
    editDispatcher: async function () {
      try {
        if (!this.edit_form_field.first_name) {
          showToast('error', 'First name cannot be empty', true);
          return;
        }
        if (!this.edit_form_field.last_name) {
          showToast('error', 'Last name cannot be empty', true);
          return;
        }
        if (!this.edit_form_field.mobile_number) {
          showToast('error', 'Mobile number cannot be empty', true);
          return;
        }
        showLoader();
        const response = await window.fetch(`${this.host}/api/company/admin/dispatcher/edit/${this.active_edit_dispatcher_id}`, {
          method: 'POST',
          body: JSON.stringify(this.edit_form_field),
          headers: {
            'Content-Type': 'application/json'
          },
        }).then((resp) => resp.json()).then((res) => res);
        hideLoader();
        if (response.status === 200) {
          // find the index;
          let temp_data = this.dispatchers;
          const idx = temp_data.findIndex((d) => d.id === this.active_edit_dispatcher_id);
          if (idx !== -1) {
            temp_data[idx] = this.formatDispatcherData(response.data);
            this.dispatchers = temp_data;
            showToast('success', response.message, null, null, true);
            this.closeEditDispatcher();
          }
        } else {
          showToast('error', response.error, null, null, true);
        }
      } catch (err) {
        hideLoader();
        showToast('error', 'An error occurred', null, null, true);
        console.log(err);
      }
    },
    removeDispatcher: function (id) {
    },
    showEditDispatcher: function (id) {
      try {
        // get the actual dispatcher
        const editModal = document.getElementById('show_edit_dispatcher_modal');
        editModal.classList.remove('hide');
        editModal.classList.add('show');

        const disp = this.dispatchers.find((d) => d.id === id);
        if (disp !== -1) {
          this.edit_form_field = {};
          this.edit_form_field.first_name = disp.first_name;
          this.edit_form_field.last_name = disp.last_name;
          this.edit_form_field.mobile_number = disp.mobile_number
          this.active_option_id = null;
          this.active_edit_dispatcher_id = id;
          this.show_edit_dispatcher_modal = true;
        } else {
          return;
        }
      } catch (err) {
        console.log(err);
      }
    },
    closeEditDispatcher: function () {
      const editModal = document.getElementById('show_edit_dispatcher_modal');
      editModal.classList.remove('show');
      editModal.classList.add('hide');
      this.active_edit_dispatcher_id = null;
      this.edit_form_field = null;
      this.show_edit_dispatcher_modal = false;
    },
    closeAddingDispatcher: function () {
      const addDispatcherModal = document.getElementById('is_adding_dispatcher');
      addDispatcherModal.classList.remove('show');
      addDispatcherModal.classList.add('hide');
      this.is_adding_dispatcher = false;
      this.is_adding_dispatcher_data = false;
      this.is_adding_dispatcher_phone = false;
      this.is_adding_dispatcher_email = false;
      this.is_verifying_signup_code = false;
      this.new_dispatcher = {};
    },
    startDispatcherAddition: function () {
      const addDispatcherModal = document.getElementById('is_adding_dispatcher');
      addDispatcherModal.classList.remove('hide');
      addDispatcherModal.classList.add('show');
      this.is_adding_dispatcher = true;
      this.is_adding_dispatcher_email = true;
    },
    sendEmailVerificationCode: async function () {
      try {
        if (this.new_dispatcher.email) {
          showLoader();
          const response = await window.fetch(`${this.host}/api/company/admin/dispatcher/signup/email/${this.new_dispatcher.email}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
          }).then((resp) => resp.json()).then((res) => res);
          hideLoader();
          if (response.status !== 200) {
            showToast(
              'error',
              response.error,
              null,
              null,
              true
            );
            return;
          } else {
            // change form to a code form.
            this.is_adding_dispatcher_email = false;
            this.is_verifying_signup_code = true;
          }
        } else {
          showToast(
            'error',
            'Please add an email address',
            null,
            null,
            true,
          );
          return;
        }

      } catch (err) {
        console.log(err);
      }
    },
    sendMobileVerificationCode: async function () {
      try {
        if (this.new_dispatcher.mobile_number) {
          showLoader();
          const response = await window.fetch(`${this.host}/api/company/admin/dispatcher/signup/mobile`, {
            method: 'POST',
            body: JSON.stringify({
              country_code: '+234',
              email: this.new_dispatcher.email,
              mobile_number: this.new_dispatcher.mobile_number
            }),
            headers: {
              'Content-Type': 'application/json'
            },
          }).then((resp) => resp.json()).then((res) => res);
          hideLoader();
          if (response.status !== 200) {
            showToast(
              'error',
              response.error,
              null,
              null,
              true
            );
            return;
          } else {
            // change form to a code form.
            this.is_adding_dispatcher_phone = false;
            this.is_verifying_signup_code = true;
          }
        } else {
          showToast(
            'error',
            'Please add an email address',
            null,
            null,
            true,
          );
          return;
        }

      } catch (err) {
        console.log(err);
      }
    },
    clearMobileCodes: function () {
      this.dispatcher_reg_code_one = '';
      this.dispatcher_reg_code_two = '';
      this.dispatcher_reg_code_three = '';
      this.dispatcher_reg_code_four = '';
      this.dispatcher_reg_code_five = '';
    },
    verifyDispatcherCode: async function () {
      const self = this;
      try {
        const url = `${this.host}/api/company/admin/dispatcher/verify/code/${this.current_dispatcher_add_phase}`;
        let code = `${this.dispatcher_reg_code_one}${this.dispatcher_reg_code_two}${this.dispatcher_reg_code_three}${this.dispatcher_reg_code_four}${this.dispatcher_reg_code_five}`;
        if (code.length !== 5) {
          showToast(
            'error',
            'You must fill out all code boxes',
            null,
            null,
            true,
          );
          return;
        } else {
          const body = {
            [this.current_dispatcher_add_phase === 'email' ? 'email_verify_code' : 'mobile_verify_code']: code,
            email: this.new_dispatcher.email,
          }
          showLoader();
          const response = await window.fetch(url, {
            method: 'POST',
            body: JSON.stringify({...body}),
            headers: {
              'Content-Type': 'application/json',
            }
          }).then((resp) => resp.json()).then((res) => res);
          hideLoader();
          this.clearMobileCodes();
          if (response.status === 200) {
            showToast('success', response.message, null, null, true);
            if (self.current_dispatcher_add_phase === 'email') {
              self.current_dispatcher_add_phase = '';
              self.current_dispatcher_add_phase = 'mobile';
              self.is_verifying_signup_code = false;
              self.is_adding_dispatcher_phone = true;
            } else {
              if(self.current_dispatcher_add_phase === 'mobile'){
                self.is_verifying_signup_code = false;
                self.is_adding_dispatcher_data = true;
              }
            }
          } else {
            showToast('error', response.error, null, null, true);
            return;
          }
        }
      } catch (err) {
        hideLoader();
        showToast('error', 'An error occurred, please try again', null, null, true);
        console.log(err);
      }
    },
    togglePasswordReveal: function () {
      this.show_new_dispatcher_password = !this.show_new_dispatcher_password;
    },
    handleParseNewDispatcherForm: function (data) {
      try {
        const d = Object.keys((data));
        const is_profile_image = d.findIndex((d) => d === 'profile_image');
        if (is_profile_image === -1) {
          showToast('error', 'You have either not added a profile image, or it\'s still processing.', null, null, true);
          return false;
        }
        if (d.length < 10) {
          showToast('error', 'All fields are compulsory.', null, null, true);
          return false;
        }
        return true;

      } catch (err) {
        console.log(err);
      }
    },
    addNewDispatcher: async function () {
      try {
        const { mobile_number, ...data } = this.new_dispatcher;
        const proceed = this.handleParseNewDispatcherForm(data);
        if (proceed) {
          showLoader();
          const response = await window.fetch(`${this.host}/api/company/admin/dispatcher/registration/complete`, {
            method: 'POST',
            body: JSON.stringify({...data}),
            headers: {
              'Content-Type': 'application/json'
            },
          }).then((resp) => resp.json()).then((res) => res);
          hideLoader();
          if (response.status === 200) {
            this.is_adding_dispatcher = false;
            this.is_adding_dispatcher_data = false;
            showToast('success', response.message, null, null, true);
            await this.getNewDispatchersCount();
            this.fetchAllDispatchers(true);
          } else {
            showToast('error', response.error, null, null, true);
          }
        }
      } catch (err) {
        showToast('error', 'An error occurred', null, null, true);
        console.log(err);
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