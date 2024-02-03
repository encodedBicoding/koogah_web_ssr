showLoader();
const estimate_vm = new Vue({
  el: '#get_estimate_page',
  data: {
    formattedData: {},
    transportMode: '',
    value: '',
    pickupAddress: '',
    dropOffAddress: '',
    dispatchType: 'intra',
    from_state: '',
    formErrors: {},
    hasTyped: false,
    availableIn: [
      'lagos',
      'abuja',
    ]
  },
  beforeMount() {
  },
  mounted() {
    hideLoader();
  },
  watch: {
    pickupAddress: function (value) {
      this.hasTyped = true;
      if (value) {
        if (this.formattedData['pickupAddress'] !== value) {
          this.formErrors['pickupAddress'] = 'Please choose pickup address from dropdown';
        } else {
          this.formErrors['pickupAddress'] = '';
        }
      }
    },
    dropOffAddress: function (value) {
      this.hasTyped = true;
      if (value) {
        if (this.formattedData['dropOffAddress'] !== value) {
          this.formErrors['dropOffAddress'] = 'Please choose dropoff address from dropdown';
        } else {
          this.formErrors['dropOffAddress'] = '';
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
      const self = this;
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
          let state = ''
          // find state
          for(const component of place.address_components) {
            if(self.availableIn.includes(component.long_name.toLowerCase())) {
              state = component.long_name.toLowerCase();
              break;
            }
          }
          this.storePredictionValue(`${place.name}, ${place.formatted_address}`, event.target.getAttribute('aria-name'), state)
        });
      }
    },
    storePredictionValue(value, item, state) {
      if(item === 'pickupAddress') {
        this.from_state = state;
      }
      this[item] = value;
    },
    handleParseForm() {
      let canProceed = false;
      if(!this.from_state) {
        showToast(
          'error',
          'The selected pickup address falls in a state we currently do not delivery to',
        );
        return;
      }
      const formData = {
        transport_mode_category:  this.transportMode,
        value: this.value,
        pickup_address: this.pickupAddress,
        dropoff_address: this.dropOffAddress,
        from_state: this.from_state,
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
      this.transportMode = '';
      this.value = '';
      this.pickupAddress ='';
      this.dropOffAddress = '';
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