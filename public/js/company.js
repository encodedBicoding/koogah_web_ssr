window.onload = function () {
  let formData = {};
  const compNext = document.getElementById('comp_next');
  compNext.addEventListener('click', next);

  const select_country = document.getElementById('company_select_country');
  const select_state = document.getElementById('company_select_state');
  select_country.addEventListener('change', selectCountry);
  select_state.addEventListener('change', selectState);

  const register_company = document.getElementById('company_register');
  register_company.addEventListener('click', registerCompany);




  function next(e) {
    e.preventDefault();
    // get current form;
    formData = getFirstFormData();
    if (!formData) {
      return false;
    } else {
    let current_form = document.querySelector('.show');
    const cf_id = current_form.getAttribute('id');
    if(cf_id == 'form1') {
      // get form2;
      const form2= document.getElementById('form2');
      current_form.classList.replace('show', 'hide')
      form2.classList.replace('hide', 'show');
    }
    }
  };

  function determineCountryCode(country) {
    switch (country) {
      case 'nigeria':
        return '+234';
      default:
        return '+234';
    }
   }
  
  function getFirstFormData() {
    let first_name = document.getElementsByName('first_name')[0].value;
    let last_name = document.getElementsByName('last_name')[0].value;
    let email = document.getElementsByName('email')[0].value;
    let phone = document.getElementsByName('phone')[0].value;
    let nin = document.getElementsByName('nin')[0].value;
    let data = {
      first_name,
      last_name,
      email,
      phone,
      nin,
    };
    let hasIssues = false
    Object.values(data).forEach((v) => {
      if (!v) {
        hasIssues = true;
      } else {
        hasIssues = false;
      }
    })
    if (hasIssues) {
      return false;
    } else {
      return data;
    }
  }
  
  function getSecondFormData() {
    const businessName = document.getElementsByName('business_name')[0].value;
    const businessCountry = document.getElementsByName('country')[0].value;
    const businessState = document.getElementsByName('state')[0].value;
    const businessCity = document.getElementsByName('city')[0].value;
    const businessAddress = document.getElementsByName('business_address')[0].value;
    let data = {
      business_name: businessName,
      business_town: businessCity,
      business_country: businessCountry,
      business_state: businessState,
      country_code: determineCountryCode(businessCountry),
      business_address: businessAddress,
    };
    let hasIssues = false
    Object.values(data).forEach((v) => {
      if (!v) {
        hasIssues = true;
      } else {
        hasIssues = false;
      }
    })
    if (hasIssues) {
      return false;
    } else {
      return data;
    }
  
  }
  
  function selectCountry(e) {
    // get the value of the selected country;
    let country = e.target.value;
    if (!country) return false;
    // get state element
    const state = document.getElementById('company_select_state');
    state.removeAttribute('disabled');
    if (state.children.length > 1) {
      Array.from(state.children).forEach(child => state.removeChild(child));
    }
    const all_states = citiesAndTowns.map((c) => c['name']);
    all_states.forEach((st) => {
      let options = document.createElement('option');
      options.value = st.toLowerCase();
      options.innerHTML = st;
      state.appendChild(options);
    });
  
  
  }
  
  function selectState(e) {
    let state = e.target.value;
    if (!state) return false
    // get city element;
    const city = document.getElementById('company_select_city');
    city.removeAttribute('disabled');
    if (city.children.length > 1) {
      Array.from(city.children).forEach(child => city.remove(child))
    }
    const cities = citiesAndTowns.find((c) => c.name.toLowerCase() === state)['lgas'];
    cities.forEach((ct) => {
      let options = document.createElement('option');
      options.value = ct.toLowerCase();
      options.innerHTML = ct;
      city.appendChild(options);
    });
  }
  
  let hasCheckedTerms = false;

  function checkTerms() {
    hasCheckedTerms = !hasCheckedTerms;
  }

  const terms = document.getElementById('company_terms');
  terms.addEventListener('change', checkTerms);

  async function registerCompany(e) {
    try {
      e.preventDefault();
     
      if (!hasCheckedTerms) {
        showToast('error', 'Please agree to our T&C before proceeding', 5, 'bottom');
        return;
      }
      let prevFormData = formData;
      formData = getSecondFormData();
      if (!formData) {
        return false
      } else {
        formData = {
          ...formData,
          ...prevFormData
        };
        const host = window.location.origin;
        register_company.innerHTML = 'Loading...';
        const response = await fetch(`${host}/api/register/company/signup`, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((resp) => resp.json())
        register_company.innerHTML = 'Register';
        if (response.status === 200) {
          showToast(
            'success',
             response.message,
          );
        } else {
          showToast(
            'error',
             response.error.message ? response.error.message : response.error,
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  
  }




}

