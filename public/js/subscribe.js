function activateSubscribe() {
  let input_email = '';
  // first get players.
  const all_email_submit_input = document.querySelectorAll('.subscribe_input_email');
  const all_subscribe_submit_btn = document.querySelectorAll('.subscribe_btn');;
  updateSubscribeBtn(all_subscribe_submit_btn, 'Subscribe');
  activateClick(all_subscribe_submit_btn);

  Array.from(all_email_submit_input).forEach((ele) => {
    ele.addEventListener('keyup', (e) => {
      input_email = e.currentTarget.value;
    });
  });

  function updateSubscribeBtn(elementArray, text) {
    Array.from(elementArray).forEach((element => element.innerHTML = text));
  }
  function resetSubscriptionInput() {
    input_email = '';
    Array.from(all_email_submit_input).forEach((ele) => {
      ele.value = '';
    });
  };

  async function subscribeUser(e) {
    try {
      e.preventDefault();
      if (input_email.length <= 0) {
        alert('please input email address');
        return false;
      } else {
        updateSubscribeBtn(all_subscribe_submit_btn, 'Loading...');
        await fetch(
          `/subscribe/email-list/${input_email}`,
          {
            method: 'GET',
            credentials: 'same-origin',
            mode: 'cors',
          }
        ).then(resp => resp.json())
          .then(result => {
            updateSubscribeBtn(all_subscribe_submit_btn, 'Subscribe');
            if (result.status === 200) {
              resetSubscriptionInput();
              alert(result.message);
            } else {
              alert(result.error);
            }
          }).catch(err => {
            console.log(err);
          })
      }
    } catch (err) {
      console.log(err);
    }
  }
   
  function activateClick(elementArray) {
    Array.from(elementArray).forEach(element => {
      element.addEventListener('click', subscribeUser);
    });
  }
}
activateSubscribe();