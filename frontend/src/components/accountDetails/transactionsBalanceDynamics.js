import { el } from 'redom';
import { renderTransactionsBalanceChart } from '../../utils/helpers/renderTransactionsBalanceChart';
import { loadFonts } from '../../utils/helpers/loadFonts';

export function renderTransactionsBalanceDynamics(data, numberOfMonths) {
  const wrapper = el(
    'div',
    { class: 'transactions__dynamics_wrapper' },
    el(
      'h3',
      { class: 'transactions__dynamics_title' },
      'Соотношение входящих исходящих транзакций'
    ),
    el('canvas', { id: 'chartWrapper' })
  );

  loadFonts()
    .then(() => {
      renderTransactionsBalanceChart(data, numberOfMonths);
    })
    .catch((error) => {
      console.error('Ошибка загрузки шрифтов:', error);
    });

  return wrapper;
}
