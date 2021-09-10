window.onload = function () {
  const mobileResendCode = document.getElementById('mob_resend_code');
  let count = 20;
  // mobile resend code;
  const query = new URLSearchParams(window.location.href);
  const account = query.get('code').toLowerCase();
  const token = query.get('key');
  // sendMobileVerificationCode(account, token);
  // get all inputs;
  const mobCodeOne = document.getElementById('mob_code_one');
  const mobCodeTwo = document.getElementById('mob_code_two');
  const mobCodeThree = document.getElementById('mob_code_three');
  const mobCodeFour = document.getElementById('mob_code_four');
  const mobCodeFive = document.getElementById('mob_code_five');

  mobCodeOne.addEventListener('keyup', (e) => mobCodeInputAction(e, 'one'));
  mobCodeTwo.addEventListener('keyup', (e) => mobCodeInputAction(e, 'two'));
  mobCodeThree.addEventListener('keyup', (e) => mobCodeInputAction(e, 'three'));
  mobCodeFour.addEventListener('keyup', (e) => mobCodeInputAction(e, 'four'));
  mobCodeFive.addEventListener('keyup', (e) => mobCodeInputAction(e, 'five'));

  function mobCodeInputAction(e, id) {
    const value = e.target.value;
    if (id === 'one') {
      if (!value) return;
      e.target.nextElementSibling.focus();
    }
    if (id !== 'one' && id !== 'five') {
      if (!value) {
        e.target.previousElementSibling.focus()
      } else {
        e.target.nextElementSibling.focus();
      }
    }
    if (id === 'five') {
      if (value) {
        e.target.blur();
      } else {
        e.target.previousElementSibling.focus()
      }
    }
    // get all mob code;
    let values = [];
    const allMobCodes = document.getElementsByName('mob_code');
    Array.from(allMobCodes).forEach((mob) => {
      if (mob.value) {
        values.push(mob.value);
      }
      if (values.length == 5) {
        verifyMobileCode(values);
      }
    })
  
  
  }
  
  async function verifyMobileCode(code) {
    try {
      showLoader();
      const cd = code.join('');
      const host = window.location.origin;
      let response = await fetch(`${host}/api/register/mobile/code?token=${token}&code=${cd}&account=${account}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((resp) => resp.json());
      hideLoader();
        if (response.status === 200) {
          showModal();
          buildRegisterSuccessModal(
            response.message,
            () => {
              hideModal();
              goHome();
            }
          );
        } else {
          showToast(
            'error',
            response.error.message ? response.error.message : response.error,
            null,
            null,
            true
          );
        }
    } catch {
      console.log('error');
    }
  }

  function reloadState(
    newState,
    element,
    parentElement,
    type
  ) {
    if (parentElement.children.length > 0) {
      Array.from(parentElement.children).forEach((child) => parentElement.removeChild(child));
    }
    if (type === 'html') {
      element.innerHTML = newState;
    } else {
      element.innerText = newState;
    }
    parentElement.appendChild(element);
  }

  function delayCodeResend() {
    let p = document.createElement('p');
    p.setAttribute('class', 'text-center');
    mobileResendCode.removeEventListener('click', sendMobileVerificationCode);
    let interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        reloadState(
          'Resend Code',
          p,
          mobileResendCode,
          'text'
        );
        mobileResendCode.addEventListener('click', () => sendMobileVerificationCode(account, token));
      } else {
        reloadState(
          `Retry in ${count}s`,
          p,
          mobileResendCode,
          'text'
        );
      }
    }, 1000);
  }

  async function sendMobileVerificationCode(account, token) {
    try {
      const host = window.location.origin;
      delayCodeResend();
      let response = await fetch(`${host}/api/register/mobile/verify?account=${account}&token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((resp) => resp.json());
      if (response.status === 200) {
        showToast(
          'success',
          response.message,
          null,
          null,
          true
        );
      } else {
        showToast(
          'error',
          response.error.message ? response.error.message : response.error,
          null,
          null,
          true
        );
      }
    } catch (err) {
      
    }
  }
  function goHome() {
    window.location.href = '/';
  }
}

