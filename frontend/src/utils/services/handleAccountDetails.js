export function handleAccountDetails(button, router) {
  if (!button) {
    console.error('Кнопка не найдена');
    return;
  }

  if (button.dataset.listener === 'true') {
    return;
  }

  button.addEventListener('click', async () => {
    try {
      const card = button.closest('.card');
      const id = card.querySelector('.card__account').textContent;
      console.log('Navigating to account ID:', id);
      router.navigate(`/account/${id}`);
    } catch (error) {
      console.error('Ошибка при просмотре счёта:', error);
    }
  });
  button.dataset.listener = 'true';
}
