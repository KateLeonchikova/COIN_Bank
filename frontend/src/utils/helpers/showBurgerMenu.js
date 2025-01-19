export function showBurgerMenu() {
  document.getElementById('burger').addEventListener('click', () => {
    document.querySelector('.header').classList.toggle('open');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelector('.header').classList.remove('open');
    }
  });

  document.querySelector('.header__nav').addEventListener('click', (e) => {
    e._isClickWithInMenu = true;
  });

  document.getElementById('burger').addEventListener('click', (e) => {
    e._isClickWithInMenu = true;
  });

  document.body.addEventListener('click', (e) => {
    if (e._isClickWithInMenu) return;

    document.querySelector('.header').classList.remove('open');
  });
}
