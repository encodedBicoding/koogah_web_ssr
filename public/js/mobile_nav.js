window.onload = function () {
  try {
    const nav_icon_btn = document.querySelector('.nav_icon_btn');
    const nav_items_container = document.querySelector('.nav_items_container');
    if (nav_icon_btn !== null) {
      nav_icon_btn.classList.add('inactive');
      nav_icon_btn.innerHTML = '<i class="fas fa-bars"></i>'
      nav_icon_btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (nav_items_container.classList.contains('active')) {
          nav_items_container.classList.remove('active');
          nav_items_container.classList.add('inactive')
          nav_icon_btn.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
          nav_items_container.classList.remove('inactive');
          nav_items_container.classList.add('active');
          nav_icon_btn.innerHTML = '<i class="fas fa-times"></i>';
        }
      })
    }
  } catch (err) {
    console.log(err);

  }
}

// Get the modal
var dispatchModal = document.getElementById("dispatcherModal");
var customerModal = document.getElementById("customerModal");

// Get the button that opens the modal
var btn = document.getElementById("dispatchBtn");
let customer = document.getElementById("customerBtn")

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  dispatchModal.style.display = "block";
}

customer.onclick = function() {
  customerModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  dispatchModal.style.display = "none";
  customerModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == dispatchModal || event.target == customerModal) {
    dispatchModal.style.display = "none";
    customerModal.style.display = "none";
  }
}
