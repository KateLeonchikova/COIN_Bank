import { createAccount } from '../api/createAccount';
import { renderAccount } from '../../components/accountsPage';

export function handleCreateAccount(router) {
  const btn = document.querySelector('.accounts__btn');

  if (!btn) {
    console.error('Кнопка для создания нового счета не найдена');
    return;
  }

  btn.addEventListener('click', async () => {
    const accountsMain = document.querySelector('.accounts__main');

    try {
      await createAccount();
      await renderAccount(accountsMain, '', router);
    } catch (error) {
      console.error('Ошибка при создании счёта:', error);
    }
  });
}
