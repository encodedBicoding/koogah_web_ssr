this.showLoader();
const vm = new Vue({
  el: '#company_admin_dashboard_profile',
  data: {
    socket: '',
    host: '',
    notifications: [],
    user: null,
    is_loading_total_dispatchers_item: false,
    total_dispatchers_item: {
      total_value: 0,
      current_month: 0,
      last_month: 0,
      increased: false,
      percent: -2.4,
    },
    timeFrame: 'months',
    show_logout_dropdown: false,
    temp_profile_image_upload: '',
    user_update: {},
    user_profile_image: '',
    user_first_name: '',
    user_last_name: '',
    user_email: '',
    user_bank_account_name: '',
    user_bank_account_number: '',
    banks: [],
    retry_fetch_nigerian_banks: '',
    is_fetching_banks: true,
    show_notification_dropdown:false,
  },
  beforeMount() {
    this.host = window.location.origin;
  },
  watch: {
    temp_profile_image_upload: async function (nv, ov) {
      try {
        const input_file_image = document.getElementById('temp_profile_image_upload');
        const server_host = 'https://core.koogahapis.com/v1';
        const local_server_host = 'http://localhost:4000/v1';
        this.user_update.profile_image = '';
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
            this.user_update.profile_image = '';
            this.user_update.profile_image = response.data.secure_url;
            await this.updateProfile();
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
        showToast('error', 'Image upload error, please retry or choose another image', null, null, true);
        console.log(err);
      }
    },
    user_first_name: function (nv, ov) {
      this.user_update.first_name = nv;
    },
    user_last_name: function (nv, ov) {
      this.user_update.last_name = nv;
    },
    user_email: function (nv, ov) {
      this.user_update.email = nv;
    },
    user_bank_account_name: function (nv, ov) {
      this.user_update.bank_account_name = nv;
    },
    user_bank_account_number: function (nv, ov) {
      this.user_update.bank_account_number = nv;
    }
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
    }
    webSocket.onmessage = async function (message) {
      let msg = JSON.parse(message.data);
      if (msg.event === 'in_app_notification') {
        self.notifications = [];
        self.notifications = msg.payload;
      }
      if (msg.event === 'company_new_package_creation') {
        showMarketPlaceToast('neutral', msg.payload, null, 'bottom_left', true);
      }
    } 
  },
  mounted() {
    hideLoader();
    this.fetchMe();
    this.getTotalDispatchersOverview();
    this.fetchNigerianBanks();
  },
  methods: {
    updateProfile: async function () {
      try {
        const proceed = Object.values(this.user_update).length;

        if (proceed > 0) {
          const response = await window.fetch(`${this.host}/api/company/admin/profile/update`, {
            method: 'POST',
            body: JSON.stringify({...this.user_update}),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then((resp) => resp.json()).then((res) => res);
          if (response.status === 200) {
            await this.fetchMe();
            showToast('success', response.message, null, null, true);
          } else {
            showToast('error', 'Error occurred uploading image', null, null, true);
          }
        } else {
          showToast('error', 'No data to update', null, null, true);
        }
      } catch (err) {
        showToast('error', 'An error occurred', null, null, true);
        console.log(err);
      }
    },
    fetchNigerianBanks: async function () {
      const self = this;
      try {
        self.is_fetching_banks = true;
        const response = await window.fetch('https://api.paystack.co/bank', {
          method: 'GET'
        }).then((resp) => resp.json()).then((res) => res);
        if (response.status == true) {
          self.banks = [];
          self.banks = response.data;
          if (!self.user) {
            await self.fetchMe();
          }
          self.is_fetching_banks = false;
        }
      } catch (err) {
        if (self.retry_fetch_nigerian_banks < 5) {
          self.fetchNigerianBanks();
          self.retry_fetch_nigerian_banks = self.retry_fetch_nigerian_banks + 1;
        }
      }
    },
    fetchMe: async function () {
      try {
        const self = this;
        const response = await window.fetch(`${this.host}/api/company/admin/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((resp) => resp.json()).then((res) => res);
        self.user = response.data;
        self.user.created_at = moment(response.data.createdAt).format('Do MMMM, YYYY');
        self.user_profile_image = self.user.profile_image;
        self.user_first_name = self.user.first_name;
        self.user_last_name = self.user.last_name;
        self.user_email = self.user.email;
        self.user_bank_account_name = self.user.bank_account_name;
        self.user_bank_account_number = self.user.bank_account_number;
      } catch (err) {
        console.log(err);
      }
    },
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
    activateNotification: function () {
      try {
        this.show_notification_dropdown = !this.show_notification_dropdown;
      } catch (err) {
        console.log(err);
      }
    }
  }
});