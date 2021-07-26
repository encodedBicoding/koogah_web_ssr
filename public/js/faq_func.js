function toggleQuestion(name) {
  // get the actual clicked item;
  const item = document.getElementById(name);
  // get all faq_question_content;
  const faq_contents = document.querySelectorAll('.faq_question_content');
  faq_contents.forEach((content) => {
    if (content.parentElement.id !== name) {
      content.classList.remove('active');
      content.classList.add('inactive');
      content.parentElement.classList.add('inactive');
      content.parentElement.classList.remove('active')
    }
  });
  // get all faq icon;
  const faq_icons = document.querySelectorAll('.faq_icon');
  faq_icons.forEach((faq) => {
    if (faq.parentElement.id != name) {
      faq.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
  });


  // work on the exact clicked item;
  const item_content = item.children[1];
  const faq_icon = item.children[0].children[1];
  if (item_content.classList.contains('active')) {
    item_content.classList.remove('active');
    item_content.classList.add('inactive');
    item.classList.add('inactive');
    item.classList.remove('active');
    faq_icon.innerHTML = '<i class="fas fa-chevron-down"></i>';
  } else {
    item_content.classList.remove('inactive');
    item_content.classList.add('active');
    item.classList.remove('inactive');
    item.classList.add('active');
    faq_icon.innerHTML = '<i class="fas fa-chevron-up"></i>'
  }

}