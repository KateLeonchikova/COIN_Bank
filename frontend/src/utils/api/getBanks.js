import { showSkeleton, hideSkeleton } from '../helpers/showAndHideSkeleton';
import { setCachedData } from '../helpers/setCachedData';
import { getCachedData } from '../helpers/getCachedData';
import { API_URL } from './apiConfig';

export async function getBanks() {
  const token = localStorage.getItem('token');

  const cachedData = getCachedData('banksData');
  if (cachedData) {
    return cachedData;
  }

  showSkeleton();

  try {
    const response = await fetch(`${API_URL}/banks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        'Ошибка при получении данных о местоположении банкоматов'
      );
    }

    const data = await response.json();

    setCachedData(data, 'banksData');

    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  } finally {
    hideSkeleton();
  }
}
