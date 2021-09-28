showLoader();
const estimate_vm = new Vue({
  el: '#approval_page',
  data: {
    banks: [],
    bankName: '',
    accountNumber: '',
    password: '',
    formErrors: {},
    showPassword: false,
    bankDetails: null,

  },
  beforeMount() {
    this.fetchNigerianBanks();
  },
  mounted() {
    hideLoader();
  },
  watch: {
    accountNumber: async function (nv, ov) {
      try {
        const self = this;
        if (!this.bankName) {
          this.formErrors.bank = 'You need to choose a bank first'
        } else {
          this.formErrors.bank = null;
          if (nv.length === 10) {
            this.bankDetails = null;
            let bank_code = this.banks.find((b) => b.name === this.bankName).code;
            const host = window.location.origin;
            showLoader();
            const response = await window.fetch(
              `${host}/api/register/verify_bank_details`,
              {
                method: 'POST',
                body: JSON.stringify({
                  bank_code,
                  account_number: nv
                }),
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            ).then((resp) => resp.json()).then((res) => res);
            hideLoader();
            if (response.status) {
              self.bankDetails = response.data;
              this.formErrors.bank = null;
            } else {
              this.formErrors.bank = null;
              this.formErrors.bank = 'Invalid Account';
              alert('Invalid Account');
            }
          }
        }
      } catch (err) {
        hideLoader();
        console.log(err);
      }
    },
    password: function (nv, ov) {
      // validate input on ket press.
      this.formErrors.password = null;
      if (nv.length < 8) {
        this.formErrors.password = 'Password must have minimum of 8 characters';
      } else {
        this.formErrors.password = null;
        let pattern = RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$');
        let valid = pattern.test(nv);
        if (!valid) {
          this.formErrors.password = 'Password should contain at least one upper case\none lower case, one digit and one Special character';
        } else {
          this.formErrors.password = null;
        }
      }
    }
  },
  methods: {
    togglePasswordReveal: function () {
      this.showPassword = !this.showPassword;
    },
    handleInputChange(value, item) {
      this[item] = value;
    }, 
    setupAccount: async function () {
      const host = window.location.origin;
      let canProceed = false;
      const query = new URLSearchParams(window.location.href);
      const token = query.values().next().value;
      console.log(token);
      if (!token) {
        return;
      } else {
        canProceed = Object.values(this.formErrors).length > 0 ? false : true;
        if (canProceed) {
          showLoader()
          const response = await window.fetch(
            `${host}/api/register/company/activate/account?key=${token}`,
            {
              method: 'POST',
              body: JSON.stringify({
                password: this.password,
                bank_name: this.bankName,
                account_number: this.accountNumber
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            }
          ).then((resp) => resp.json()).then((res) => res);
          hideLoader();
          // if success - redirect to login
          if (response.status === 200) {
            showToast('success', response.message);
            const to = setTimeout(() => {
              window.location.replace('/company/admin/login');
              clearTimeout(to);
            }, 500)
          } else {
            showToast('error', response.error);
          }
        } else {
          showToast(
            'error',
            'Please fix all errors on the form before proceeding.'
          );
        }
      }
    },
    fetchNigerianBanks: async function () {
      let retry = 0;
      try {
        showLoader();
        const response = await window.fetch('https://api.paystack.co/bank', {
          method: 'GET'
        }).then((resp) => resp.json()).then((res) => res);
        hideLoader();
        this.banks = [];
        this.banks = response.data;
      } catch (err) {
        console.log(err);
        if (retry < 5) {
          this.fetchNigerianBanks();
          retry = retry + 1;
        }
      }
    }
  },
});