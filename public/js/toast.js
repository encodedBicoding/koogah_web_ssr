let timeInterval;
function showToast(
  type,
  message,
  duration,
  position,
  isInverted,
) {
  const toast = document.querySelector('.toast');
  let countdown = duration ? duration : 7;
  // type = error, success;
  // position = bottom, top_right, top_left;
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

  timeInterval = setInterval(() => {
    if (countdown === 0) {
      toast.setAttribute('class', 'toast remove');
      clearInterval(timeInterval);
    } else {
      toastContent.innerHTML = `
      <div class="toast_text ${position}">
        <p>${message}</p>
      </div>
      <div class="toast_close" onclick=closeToast()>close</div>
    `;
      toast.setAttribute('class', `toast show ${position}`);
      countdown--
    }
  }, 1000);

  toast.appendChild(toastContent);

}
function closeToast() {
  const toast = document.querySelector('.toast');
  toast.setAttribute('class', 'toast remove');
  clearInterval(timeInterval);
}