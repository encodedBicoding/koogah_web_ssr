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
            <p class="font-bold est_response font-bg">₦${Intl.NumberFormat('en-US').format(Number(data.delivery_price))}</p>
         </div>
         <div class="row-space-between mg_top_btm">
            <p class="font-bold">Pickup Address: </p>
            <div class="est_response">
              <p class="est_response">${data.pickup_address}</p>
            </div>
         </div>
         <div class="row-space-between mg_top_btm wd-100">
            <p class="font-bold">DropOff Address: </p>
            <div class="est_response">
              <p class="wd-100">${data.dropoff_address}</p>
            </div>
         </div>
         <div class="row-space-between mg_top_btm">
            <p class="font-bold">Distance: </p>
            <p class="est_response">${data.distance}km</p>
         </div>
         <div class="row-space-between mg_top_btm">
            <p class="font-bold">Estimated Value: </p>
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
         <br/>
         <p class="text-center font-xsm">If you signed up as a customer or a dispatcher, please download our mobile app on your device to login.</p>
         <p class="text-center font-xsm">Search for either <b>Koogah</b> or <b>Koogah dispatcher</b><p>
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

function buildNoticeModal(
  message,
  action,
  actionText = 'Okay',
  showCloseButton = true,
  title = 'Notice!'
) {
  if (!action) {
    action = hideModal;
  }
  clearModalChildren();
  const modal_container = document.createElement('div');
  modal_container.classList.add('d-modal-container');
  modal_container.innerHTML = `
  <div class="d-modal-content-holder">
    <div class="d-modal-pri-cont">
      <h3 class="font_secondary_dark">${title}</h3>
      <div class="text-center-cont">
         <p class="text-center font-small">${message}</p>
      </div>
      ${
      showCloseButton ?
      `<div class="fl-row-center-space-btwn">
        <div class="btn_bg_dark modal_close mgrt-mm font-small">
          <p>Close</p>
        </div>
        <div class="btn_col_outline btn_action">
          <p class="font-small">${actionText}</p>
        </div>
      </div>`
      :
      `<div class="btn_col_outline btn_action">
        <p class="font-small">${actionText}</p>
      </div>
      `
      }
    </div>
  </div>
  `;
  modal.appendChild(modal_container);
  if (showCloseButton) {
    document.querySelector('.modal_close').addEventListener('click', hideModal);
  }
  document.querySelector('.btn_action').addEventListener('click', action);
}
