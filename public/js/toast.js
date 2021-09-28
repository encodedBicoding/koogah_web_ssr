let timeInterval;
function showToast(
  type,
  message,
  duration,
  position,
  isInverted,
) {
  const toast = document.querySelector('.toast');
  let countdown = duration ? duration : 4;
  // type = error, success;
  // position = bottom, top_right, top_left; bottom_left
  // message: string
  if (!position) {
    position = 'top_right';
  }
  if (!type) {
    type = 'error';
  }
  if (!isInverted) {
    isInverted = false
  } else {
    isInverted = true;
  }

  const toastContent = document.createElement('div');
  toastContent.setAttribute('class', `toast_content ${type} ${position} ${isInverted ? 'bg_invert': ''}`);
  if (toast.children.length > 0) {
    Array.from(toast.children).forEach((child) => toast.removeChild(child));
  }
  toastContent.innerHTML = `
    <div class="toast_text ${position}">
      <p>${message}</p>
    </div>
    <div class="toast_close" onclick=closeToast()>close</div>
  `;
  toast.setAttribute('class', `toast show ${position}`);
  toast.appendChild(toastContent);

  timeInterval = setInterval(() => {
    if (countdown === 0) {
      toast.setAttribute('class', 'toast remove');
      clearInterval(timeInterval);
    } else {
      countdown--
    }
  }, 1000);

}
function closeToast() {
  const toast = document.querySelector('.toast');
  toast.setAttribute('class', 'toast remove');
  clearInterval(timeInterval);
}

// MARKET PLACE NOTIFICATION TOAST
function showMarketPlaceToast(
  type,
  message,
  duration,
  position,
  isInverted,
) {
  const toast = document.querySelector('.marketplace_toast');
  let countdown = duration ? duration : 3;
  // type = error, success;
  // position = bottom, top_right, top_left; bottom_left
  // message: string
  if (!position) {
    position = 'bottom_left';
  }
  if (!type) {
    type = 'neutral';
  }
  if (!isInverted) {
    isInverted = false
  } else {
    isInverted = true;
  }

  const toastContent = document.createElement('div');
  toastContent.setAttribute('class', `toast_content ${type} ${position} ${isInverted ? 'bg_invert': ''}`);
  if (toast.children.length > 0) {
    Array.from(toast.children).forEach((child) => toast.removeChild(child));
  }
  toastContent.innerHTML = `
    <div class="toast_text ${position}">
      <p>${message}</p>
    </div>
    <div class="toast_close" onclick=closeMarketPlaceToast()>close</div>
  `;
  toast.setAttribute('class', `marketplace_toast show ${position}`);
  toast.appendChild(toastContent);

  timeInterval = setInterval(() => {
    if (countdown === 0) {
      toast.setAttribute('class', 'marketplace_toast remove');
      clearInterval(timeInterval);
    } else {
      countdown--
    }
  }, 1000);

}
function closeMarketPlaceToast() {
  const toast = document.querySelector('.marketplace_toast');
  toast.setAttribute('class', 'marketplace_toast remove');
  clearInterval(timeInterval);
}