import { showSkeleton, hideSkeleton } from '../helpers/showAndHideSkeleton';
import { API_URL } from './apiConfig';

export async function transferFunds({ from, to, amount }) {
  const token = localStorage.getItem('token');
  showSkeleton();

  try {
    const response = await fetch(`${API_URL}/transfer-funds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
      body: JSON.stringify({ from, to, amount }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка при переводе средств');
    }

    const actualAccount = await response.json();

    // обновляем локальное хранилище
    const cacheKey = 'accountsData';
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const accountsData = JSON.parse(cachedData);
      const accounts = accountsData.payload;

      const fromAccount = accounts.find((account) => account.account === from);
      const toAccount = accounts.find((account) => account.account === to);

      if (fromAccount) {
        fromAccount.balance -= amount;
        fromAccount.transactions.push({
          amount: -amount,
          date: new Date().toISOString(),
          from,
          to,
        });
      }
      if (toAccount) {
        toAccount.balance += amount;
        toAccount.transactions.push({
          amount,
          date: new Date().toISOString(),
          from,
          to,
        });
      }

      localStorage.setItem(cacheKey, JSON.stringify({ payload: accounts }));
    }

    return actualAccount;
  } catch (error) {
    console.log('Ошибка:', error);
    alert(
      'Не удалось осуществить перевод средств. Пожалуйста, попробуйте позже.'
    );
    throw error;
  } finally {
    hideSkeleton();
  }
}
