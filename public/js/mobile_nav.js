
const nav_icon_btn = document.querySelector(".nav_icon_btn");
const nav_items_container = document.querySelector(".nav_items_container");
const dropdown_hover_trigger = document.querySelector('.dropdown_container');

let showSignupDropdown = false;

if (nav_icon_btn !== null) {
  nav_icon_btn.classList.add("inactive");
  nav_icon_btn.innerHTML = '<i class="fas fa-bars"></i>';
  nav_icon_btn.addEventListener("click", function (e) {
    e.preventDefault();
    if (nav_items_container.classList.contains("active")) {
      nav_items_container.classList.remove("active");
      nav_items_container.classList.add("inactive");
      nav_icon_btn.innerHTML = '<i class="fas fa-bars"></i>';
    } else {
      nav_items_container.classList.remove("inactive");
      nav_items_container.classList.add("active");
      nav_icon_btn.innerHTML = '<i class="fas fa-times"></i>';
    }
  });
}
// nav dropdown.
dropdown_hover_trigger.addEventListener('click', activateDropdownMouseOver);

function activateDropdownMouseOver() {
  let icon = document.querySelector('.drop-down-icon');
  let dropdown_content = document.querySelector('.dropdown_contents_container');
  if (showSignupDropdown === false) {
    let icon = document.querySelector('.drop-down-icon');
    let dropdown_content = document.querySelector('.dropdown_contents_container');
  
    icon.setAttribute('class', 'fas fa-chevron-up font-xsm chv drop-down-icon')
    dropdown_content.setAttribute('class', 'dropdown_contents_container nav-active')
  } else {
    icon.setAttribute('class', 'fas fa-chevron-down font-xsm chv drop-down-icon');
    dropdown_content.setAttribute('class', 'dropdown_contents_container nav-in-active');
  }
  showSignupDropdown = !showSignupDropdown;
}


// Get the modal
var dispatchModal = document.getElementById("dispatcherModal");
var customerModal = document.getElementById("customerModal");

// Get the button that opens the modal
let btn = document.getElementById("dispatchBtn");
let dispatch = document.getElementById("dispatchTwo");
let mobileDispatch = document.getElementById("dispatchMobile");
let footer = document.getElementById("footerBtn");
let customer = document.getElementById("customerBtn");
let customerTwo = document.getElementById("customerTwo");
let mobileCustomer = document.getElementById("customerMobile");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var close = document.getElementsByClassName("closed")[0];

// When the user clicks the button, open the modal
if (btn) {
  btn.onclick = function () {
    dispatchModal.style.display = "block";
  };
}

if (dispatch) {
  dispatch.onclick = function () {
    dispatchModal.style.display = "block";
  };
}

if (mobileDispatch) {
  mobileDispatch.onclick = function () {
    dispatchModal.style.display = "block";
  };
}
footer.onclick = function () {
  dispatchModal.style.display = "block";
};

if (customer) {
  customer.onclick = function () {
    customerModal.style.display = "block";
  };
}

if (customerTwo) {
  customerTwo.onclick = function () {
    customerModal.style.display = "block";
  };
}

if (mobileCustomer) {
  mobileCustomer.onclick = function () {
    customerModal.style.display = "block";
  };
}


// When the user clicks on <span> (x), close the modal
if (span) {
  span.onclick = function () {
    customerModal.style.display = "none";
  };
}

close.onclick = function () {
  dispatchModal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == dispatchModal || event.target == customerModal) {
    dispatchModal.style.display = "none";
    customerModal.style.display = "none";
  }
};
