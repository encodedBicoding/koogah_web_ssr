let formData = {};
const compNext = document.getElementById("next");
compNext.addEventListener("click", next);
const ref = window.sessionStorage.getItem("ref");
let hasRef = ref === null ? false : true;

const select_country = document.getElementById("dispatch_select_country");
const select_state = document.getElementById("dispatch_select_state");
select_country.addEventListener("change", selectCountry);
select_state.addEventListener("change", selectState);

const register_dispatcher = document.getElementById("submit");
register_dispatcher.addEventListener("click", registerDispatcher);

function next(e) {
  e.preventDefault();
  // get current form;
  formData = getFirstDispatchData();
  if (!formData) {
    return false;
  } else {
    let current_form = document.querySelector(".show");
    const cf_id = current_form.getAttribute("id");
    if (cf_id == "form1") {
      // get form2;
      const form2 = document.getElementById("form_2");
      current_form.classList.replace("show", "hide");
      form2.classList.replace("hide", "show");
    }
  }
}

function determineCountryCode(country) {
  switch (country) {
    case "nigeria":
      return "+234";
    default:
      return "+234";
  }
}

function getSecondFormData() {
  let automobile;
  let dispatch;
  if (document.getElementById("automobile").value === "yes") {
    automobile = true;
  } else {
    automobile = false;
  }
  if (document.getElementById("dispatch").value === "yes") {
    dispatch = true;
  } else {
    dispatch = false;
  }
  let address = document.getElementById("address").value;
  let sex = document.getElementById("sex").value;
  let owns_automobile = automobile;
  let done_dispatch_before = dispatch;
  let nin = document.getElementById("nin").value;
  let data = {
    address,
    sex,
    owns_automobile,
    done_dispatch_before,
    nin,
  };
  let hasIssues = false;
  Object.values(data).forEach((v) => {
    if (!v) {
      hasIssues = true;
    } else {
      hasIssues = false;
    }
  });
  if (hasIssues) {
    return false;
  } else {
    return data;
  }
}

function getFirstDispatchData() {
  let email = document.getElementById("email").value;
  let firstName = document.getElementById("first_name").value;
  let lastName = document.getElementById("last_name").value;
  let phoneNumber = document.getElementById("number").value;
  let nationality = document.getElementById("dispatch_select_country").value;
  let state = document.getElementById("dispatch_select_state").value;
  let town = document.getElementById("dispatch_select_city").value;

  let data = {
    email,
    firstName,
    lastName,
    phoneNumber,
    country_code: determineCountryCode(nationality),
    nationality,
    state,
    town,
  };

  let hasIssues = false;
  Object.values(data).forEach((v) => {
    if (!v) {
      hasIssues = true;
    } else {
      hasIssues = false;
    }
  });
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
  const state = document.getElementById("dispatch_select_state");
  state.removeAttribute("disabled");
  if (state.children.length > 1) {
    Array.from(state.children).forEach((child) => state.removeChild(child));
  }
  const all_states = citiesAndTowns.map((c) => c["name"]);
  all_states.forEach((st) => {
    let options = document.createElement("option");
    options.value = st.toLowerCase();
    options.innerHTML = st;
    state.appendChild(options);
  });
}

function selectState(e) {
  let state = e.target.value;
  if (!state) return false;
  // get city element;
  const city = document.getElementById("dispatch_select_city");
  city.removeAttribute("disabled");
  if (city.children.length > 1) {
    Array.from(city.children).forEach((child) => city.remove(child));
  }
  const cities = citiesAndTowns.find((c) => c.name.toLowerCase() === state)[
    "lgas"
  ];
  cities.forEach((ct) => {
    let options = document.createElement("option");
    options.value = ct.toLowerCase();
    options.innerHTML = ct;
    city.appendChild(options);
  });
}

let hasCheckedTerms = false;

function checkTerms() {
  hasCheckedTerms = !hasCheckedTerms;
}

const terms = document.getElementById("dispatch_terms");
terms.addEventListener("change", checkTerms);

async function registerDispatcher(e) {
  try {
    e.preventDefault();

    if (!hasCheckedTerms) {
      alert("Please agree to our T&C before proceeding");
      showToast("error", "Please agree to our T&C before proceeding", 5);
      return;
    }
    let prevFormData = formData;
    formData = getSecondFormData();
    if (!formData) {
      return false;
    } else {
      formData = {
        ...formData,
        ...prevFormData,
      };
      const host = window.location.origin;
      register_dispatcher.innerHTML = "Loading...";
      const response = await fetch(
        `user/courier/signup?fromApp=web${hasRef ? `&&ref=${ref}` : ""}`,
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((resp) => resp.json());
      register_dispatcher.innerHTML = "Sign Up";
      if (response.status === 200) {
        console.log(response.data)
        showToast("success", response.message);
      } else {
        console.log(response.error.message)
        showToast(
          "error",
          response.error.message ? response.error.message : response.error
        );
      }
    }
  }  catch (err) {
    console.log(err);
  }
}
