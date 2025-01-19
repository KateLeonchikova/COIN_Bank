import { showSkeleton, hideSkeleton } from '../helpers/showAndHideSkeleton';
import { API_URL } from './apiConfig';

export async function exchangeCurrency({ from, to, amount }) {
  const token = localStorage.getItem('token');
  showSkeleton();

  try {
    const response = await fetch(`${API_URL}/currency-buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
      body: JSON.stringify({ from, to, amount }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка при совершении валютного обмена');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log('Ошибка:', error);
    alert('Не удалось осуществить обмен валют. Пожалуйста, попробуйте позже.');
    throw error;
  } finally {
    hideSkeleton();
  }
}
