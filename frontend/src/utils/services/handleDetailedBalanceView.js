export function handleDetailedBalanceView(btn, router, id) {
  if (!btn) {
    console.error('Просмотр не доступен');
    return;
  }

  if (btn.dataset.listener === 'true') {
    return;
  }

  btn.addEventListener('click', async () => {
    try {
      console.log('Navigating to detailed balance view');
      router.navigate(`/account/${id}/detailed-balance`);
    } catch (error) {
      console.error('Ошибка при просмотре истории баланса:', error);
    }
  });
  btn.dataset.listener = 'true';
}
