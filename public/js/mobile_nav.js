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