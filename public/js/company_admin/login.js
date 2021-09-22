const vm = new Vue({
  el: '#admin_login_page',
  data: {
    email: '',
    password: '',
    showPassword: false,
    formErrors: {},
  },
  beforeMount() { },
  mounted() {
    console.log('mounted')
   },
  methods: {
    togglePasswordReveal: function () {
      this.showPassword = !this.showPassword;
    },
    handleParsingForm: function () {
      let formErrors = this.formErrors;
      let passFirstCheck = Object.values(formErrors).length > 0 ? false : true;
      let passSecondCheck = false;
      if (passFirstCheck) {
        if (!this.email) formErrors.email = 'email address cannot be empty';
        if (!this.password) formErrors.password = 'password cannot be empty';
        this.formErrors = {};
        this.formErrors = formErrors;
         passSecondCheck = Object.values(this.formErrors).length > 0 ? false : true;
      }
      return passSecondCheck && passFirstCheck;

    },
    login: async function () {
      try {
        const host = window.location.origin;
        let passChecks = this.handleParsingForm();
        if (passChecks) {
          showLoader();
          const response = await window.fetch(
            `${host}/api/company/admin/login`,
            {
              method: 'POST',
              body: JSON.stringify({
                email: this.email,
                password: this.password
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            }
          ).then((resp) => resp.json()).then((res) => {
            return res
          });
          
          hideLoader();
          if (response.status !== 200) {
            showToast(
              'error',
              response.error,
              null,
              null,
              true,
            );
          } else {
            showToast(
              'success',
              response.message,
              null,
              null,
              true,
            );
            window.location.replace('/company/admin/dashboard');
          }
        }
      } catch (err) {
        hideLoader();
        console.log(err);
      }
    }
  },

});