function activateSubscribe() {
  console.log('active');
  // first get players.
  const all_email_submit_input = document.querySelectorAll('.subscribe_input_email');
  const all_subscribe_submit_btn = document.querySelectorAll('.subscribe_btn');;
  updateSubscribeBtn(all_subscribe_submit_btn, 'Subscribe');
}

function updateSubscribeBtn(elementArray, text) {
  Array.from(elementArray).forEach((element => element.innerHTML = text));
}

function subscribeUser(e) {
  try {
    e.preventDefault();
    console.log('working');
  } catch (err) {
    console.log(err);
  }
}
 
function activateClick(elementArray) {
  Array.from(elementArray).forEach(element => {
    element.addEventListener('click', subscribeUser);
  });
}
activateSubscribe();