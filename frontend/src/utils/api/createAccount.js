import { showSkeleton, hideSkeleton } from '../helpers/showAndHideSkeleton';
import { API_URL } from './apiConfig';

export async function createAccount() {
  const token = localStorage.getItem('token');
  showSkeleton();

  try {
    const response = await fetch(`${API_URL}/create-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при создании счёта');
    }

    const newAccount = await response.json();

    // обновляем кэш после создания нового счета
    const cacheKey = 'accountsData';
    const cachedData = localStorage.getItem(cacheKey);
    const accounts = cachedData ? JSON.parse(cachedData).payload : [];

    accounts.push(newAccount.payload);
    localStorage.setItem(cacheKey, JSON.stringify({ payload: accounts }));

    return newAccount;
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Не удалось создать счёт. Пожалуйста, попробуйте позже.');
  } finally {
    hideSkeleton();
  }
}
