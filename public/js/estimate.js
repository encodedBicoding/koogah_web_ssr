showLoader();
const estimate_vm = new Vue({
  el: '#get_estimate_page',
  data: {
    formattedData: {},
    weight: '',
    value: '',
    pickupState: '',
    pickupCity: '',
    dropOffState: '',
    dropOffCity: '',
    dispatchType: 'intra',
    formErrors: {},
    hasTyped: false,
  },
  beforeMount() {
  },
  mounted() {
    hideLoader();
  },
  watch: {
    pickupState: function (value) {
      this.hasTyped = true;
      if (value) {
        if (this.formattedData['pickupState'] !== value) {
          this.formErrors['pickupState'] = 'Please choose pickup state from dropdowm';
        } else {
          this.formErrors['pickupState'] = '';
        }
      }
    },
    pickupCity: function (value) {
      this.hasTyped = true;
      if (value) {
        if (this.formattedData['pickupCity'] !== value) {
          this.formErrors['pickupCity'] = 'Please choose pickup city from dropdowm';
        } else {
          this.formErrors['pickupCity'] = '';
        }
      }
    },
    dropOffCity: function (value) {
      this.hasTyped = true;
      if (value) {
        if (this.formattedData['dropOffCity'] !== value) {
          this.formErrors['dropOffCity'] = 'Please choose dropoff city from dropdowm';
        } else {
          this.formErrors['dropOffCity'] = '';
        }
      }
    },
    dropOffState: function (value) {
      this.hasTyped = true;
      if (value) {
        if (this.formattedData['dropOffState'] !== value) {
          this.formErrors['dropOffState'] = 'Please choose dropOff state from dropdowm';
        } else {
          this.formErrors['dropOffState'] = '';
        }
      }
    },

  },
  methods: {
    handleInputChange(value, item) {
      this[item] = value;
    },
    async handleKeyup(event) {
      const options = {
        strictBounds: false,
      };
      let value = event.target.value;
      if (value) {
        const autocomplete = new google.maps.places.Autocomplete(event.target, options);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) {
            showToast(
              'error',
              'Invalid location',
              4,
              'bottom',
              true
            );
          }
          this.formattedData[event.target.getAttribute('aria-name')] = `${place.name}, ${place.formatted_address}`;
          this.storePredictionValue(`${place.name}, ${place.formatted_address}`, event.target.getAttribute('aria-name'))
        });
      }
    },
    storePredictionValue(value, item) {
      if (item === 'pickupState') {
        this['dropOffState'] = value;
      }
      this[item] = value;
    },
    handleParseForm() {
      let canProceed = false;
      const formData = {
        weight:  this.weight,
        value: this.value,
        from_state: this.pickupState,
        from_town: this.pickupCity,
        to_state: this.dropOffState,
        to_town: this.dropOffCity,
      }
      Object.values(formData).forEach((v) => {
        if (!v) {
          canProceed = false;
        } else {
          canProceed = true
        }
      });
      return {
        canProceed,
        formData
      };
    },
    clearForm() {
      this.weight = '';
      this.value = '';
      this.pickupState = '';
      this.pickupCity ='';
      this.dropOffState ='';
      this.dropOffCity = '';
    },
    async getEstimate() {
      try {
        const p = this.handleParseForm();
        if (p.canProceed) {
          let shouldProceed = false;
          if (this.hasTyped) {
            Object.values(this.formErrors).forEach((e) => {
              if (e) {
                shouldProceed = false;
              } else {
                shouldProceed = true;
              }
            });
            if (shouldProceed) {
              const host = window.location.origin;
              showLoader();
              const response = await fetch(`${host}/api/delivery/estimate?dispatchType=${this.dispatchType}`, {
                method: 'POST',
                body: JSON.stringify(p.formData),
                headers: {
                  'Content-Type': 'application/json'
                }
              }).then((resp) => resp.json());
              hideLoader();
              this.clearForm();             
              if (response.status === 200) {
                showModal();
                buildGetEstimateModal(response.data);
              } else {
                showToast(
                  'error',
                  response.error.message ? response.error.message : response.error,
                );
              }
            }
          }

        }
      } catch {
        hideLoader();
        console.log('ds');
      }
    },
  },
});