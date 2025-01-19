import { el } from 'redom';
import { renderBalanceChart } from '../../utils/helpers/renderBalanceChart';
import { loadFonts } from '../../utils/helpers/loadFonts';

export function renderBalanceDynamics(data, numberOfMonths) {
  const wrapper = el(
    'div',
    { class: 'dynamics__wrapper' },
    el('h3', { class: 'dynamics__title' }, 'Динамика баланса'),
    el('canvas', { id: 'chartContainer' })
  );

  if (numberOfMonths <= 6) {
    wrapper.classList.add('focused__wrapper');
  }

  loadFonts()
    .then(() => {
      renderBalanceChart(data, numberOfMonths);
    })
    .catch((error) => {
      console.error('Ошибка загрузки шрифтов:', error);
    });

  return wrapper;
}
