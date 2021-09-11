const modal = document.querySelector('.d-modal');
// MODAL
function showModal() {
  if (modal.classList.contains('hide')) {
    modal.classList.remove('hide');
  }
  if (!modal.classList.contains('show')) {
    modal.classList.add('show');
  }
}

function hideModal() {
  if (modal.classList.contains('show')) {
    modal.classList.remove('show');
  }
  if (!modal.classList.contains('hide')) {
    modal.classList.add('hide');
  }
}

function clearModalChildren() {
  if (modal.children.length > 0) {
    Array.from(modal.children).forEach(child => modal.removeChild(child));
  }
}

function buildGetEstimateModal(data, action) {
  if (!action) {
    action = hideModal;
  }
  clearModalChildren();
  const modal_container = document.createElement('div');
  modal_container.classList.add('d-modal-container');
  modal_container.innerHTML = `
  <div class="d-modal-content-holder">
    <div class="d-modal-pri-cont">
      <h2 class="brand">Estimate Delivery</h2>
      <div class="est_details_container">
         <div class="row-space-between mg_top_btm">
            <p class="font-bold">Delivery Price: </p>
            <p class="font-bold est_response">₦${Intl.NumberFormat('en-IN').format(Number(data.delivery_price))}</p>
         </div>
         <div class="row-space-between mg_top_btm">
            <p class="font-bold">Pickup State: </p>
            <p class="est_response">${data.from_state}</p>
         </div>
         <div class="row-space-between mg_top_btm wd-100">
            <p class="font-bold">DropOff State: </p>
            <div class="est_response">
              <p class="wd-100">${data.to_state}</p>
            </div>
         </div>
         <div class="row-space-between mg_top_btm">
          <p class="font-bold">Pickup City: </p>
          <p class="est_response">${data.from_town}</p>
          </div>
        <div class="row-space-between mg_top_btm">
          <p class="font-bold">DropOff City: </p>
          <p class="est_response">${data.to_town}</p>
        </div>
         <div class="row-space-between mg_top_btm">
            <p class="font-bold">Distance: </p>
            <p class="est_response">${data.distance}km</p>
         </div>
         <div class="row-space-between mg_top_btm">
            <p class="font-bold">Package Weight: </p>
            <p class="est_response">${data.weight}kg</p>
         </div>
         <div class="row-space-between mg_top_btm">
            <p class="font-bold">Estimated Package Value: </p>
            <p class="est_response">${data.value}</p>
         </div>
      </div>
    </div>
    <div class="btn_col_outline modal_close">
      <p>Seen</p>
    </div>
  </div>
  `;
  modal.appendChild(modal_container);
  document.querySelector('.modal_close').addEventListener('click', action);
}

 

function buildRegisterSuccessModal(message, action) {
  if (!action) {
    action = hideModal;
  }
  clearModalChildren();
  const modal_container = document.createElement('div');
  modal_container.classList.add('d-modal-container');
  modal_container.innerHTML = `
  <div class="d-modal-content-holder">
    <div class="d-modal-pri-cont">
      <h2 class="brand">Thank You!</h2>
      <div class="text-center-cont">
         <p class="text-center">${message}</p>
      </div>
      <div class="btn_col_outline modal_close">
        <p>Okay</p>
      </div>
    </div>
    <div class="d-modal-img-cont">
      <img src="../images/email_response_img.png" alt="Register on Koogah as a logistics company" width="100%" height="100%"/>
    </div>
  </div>
  `;
  modal.appendChild(modal_container);
  document.querySelector('.modal_close').addEventListener('click', action);
}

function buildErrorModal(message, action) {
  if (!action) {
    action = hideModal;
  }
  clearModalChildren();
  const modal_container = document.createElement('div');
  modal_container.classList.add('d-modal-container');
  modal_container.innerHTML = `
  <div class="d-modal-content-holder">
    <div class="d-modal-pri-cont">
      <h2 class="brand">Thank You!</h2>
      <div class="text-center-cont">
         <p class="text-center">${message}</p>
      </div>
      <div class="btn_col_outline modal_close">
        <p>Okay</p>
      </div>
    </div>
    <div class="d-modal-img-cont">
      <img src="../images/email_response_img.png" alt="Register on Koogah as a logistics company" width="100%" height="100%"/>
    </div>
  </div>
  `;
  modal.appendChild(modal_container);
  document.querySelector('.modal_close').addEventListener('click', action);
}
