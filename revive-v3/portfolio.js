(() => {
  'use strict';
  const dialog = document.querySelector('#photoDialog');
  // Links still open the image directly when dialog support or JavaScript is unavailable.
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const links = [...document.querySelectorAll('[data-photo]')];
  const image = dialog.querySelector('#photoFull');
  const position = dialog.querySelector('#photoPosition');
  const caption = dialog.querySelector('#photoCaption');
  const close = dialog.querySelector('.photo-close');
  let current = 0, opener = null;
  function show(index) {
    current = (index + links.length) % links.length;
    const source = links[current].querySelector('img');
    image.alt = source.alt;
    image.src = links[current].href;
    position.textContent = `${current + 1} / ${links.length}`;
    caption.textContent = source.alt;
  }
  links.forEach((link,index) => link.addEventListener('click',event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault(); opener = link; show(index); dialog.showModal();
    document.body.classList.add('photo-viewing'); close.focus();
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.querySelector('.photo-prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.photo-next').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('photo-viewing'); image.removeAttribute('src'); opener?.focus({preventScroll:true}); });
  image.addEventListener('error', () => { caption.textContent = 'This photograph could not load. Please try again or choose the next photo.'; });
})();
