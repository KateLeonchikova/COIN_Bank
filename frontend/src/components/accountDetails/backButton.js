export function createBackButton(router, path) {
  const backButton = document.createElement('button');
  backButton.textContent = 'Вернуться назад';
  backButton.classList.add('details__btn-back');

  backButton.addEventListener('click', () => {
    router.navigate(path);
  });

  return backButton;
}
