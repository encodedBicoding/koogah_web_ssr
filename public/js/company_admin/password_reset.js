const vm = new Vue({
  el: '#company_admin_password_reset_page',
  data: {
    screen: 1,
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    formErrors: {},
    token: '',
  },
  beforeMount() { 
    const query = new URLSearchParams(window.location.search);
    const screen = query.get('screen');
    if (screen) { 
      this.screen = screen;
    }
    if (screen == 2) { 
      const token = query.get('token');
      this.token = token;
    }
    console.log(screen);
  },
  watch: {
    confirmPassword: function (nv, ov) {
      if (this.password !== nv) {
        this.formErrors.confirmPassword = 'Passwords does not match';
      } else { 
        this.formErrors.confirmPassword = '';
        delete this.formErrors.confirmPassword;
      }
     }
  },
  mounted() {
    // get screen query param
   },
  methods: {
    togglePasswordReveal: function () {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordReveal: function () { 
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    handleParsingForgotForm: function () {
      let formErrors = this.formErrors;
      let passFirstCheck = Object.values(formErrors).length > 0 ? false : true;
      let passSecondCheck = false;
      if (passFirstCheck) {
        if (!this.email) formErrors.email = 'email address cannot be empty';
        this.formErrors = {};
        this.formErrors = formErrors;
        passSecondCheck = Object.values(this.formErrors).length > 0 ? false : true;
      }
      return passSecondCheck && passFirstCheck;

    },
    handleParsingResetForm: function () {
      let formErrors = this.formErrors;
      let passFirstCheck = Object.values(formErrors).length > 0 ? false : true;
      let passSecondCheck = false;
      if (passFirstCheck) {
        if (!this.password) formErrors.password = 'password cannot be empty';
        this.formErrors = {};
        this.formErrors = formErrors;
         passSecondCheck = Object.values(this.formErrors).length > 0 ? false : true;
      }
      return passSecondCheck && passFirstCheck;

    },
    forgotPassword: async function () { 
      try {
        const host = window.location.origin;
        let passChecks = this.handleParsingForgotForm();
        if (passChecks) {
          showLoader();
          const response = await window.fetch(
            `${host}/api/company/password/forgot`,
            {
              method: 'POST',
              body: JSON.stringify({
                email: this.email,
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            }
          ).then((resp) => resp.json()).then((res) => {
            return res
          });
          hideLoader();
          console.log(response);
          if (response.status !== 200) {
            showToast(
              'error',
              response.error,
            );
          } else {
            showToast(
              'success',
              response.message,
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    resetPassword: async function () { 
      try {
        const host = window.location.origin;
        let passChecks = this.handleParsingResetForm();
        if (passChecks) {
          showLoader();
          const response = await window.fetch(
            `${host}/api/company/password/reset?token=${this.token}`,
            {
              method: 'POST',
              body: JSON.stringify({
                new_password: this.password,
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
           window.location.replace('/company/admin/login');
          }
        }
      } catch (err) {
        hideLoader();
        console.log(err);
      }
    }
    
  },

});