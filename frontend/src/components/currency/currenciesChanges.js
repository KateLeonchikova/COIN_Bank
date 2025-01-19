import { el, setChildren } from 'redom';
import { getKnownCurrencies } from '../../utils/api/getKnownCurrencies';
import { getChangedCurrency } from '../../utils/api/getChangedCurrency';

export async function renderCurrenciesChanges() {
  const wrapper = el(
    'div',
    { class: 'currencies__changes-wrapper' },
    el(
      'h3',
      { class: 'currencies__changes-title' },
      'Изменение курсов в реальном времени'
    ),
    el('ul', { class: 'currencies__changes-list' })
  );

  const listData = wrapper.querySelector('.currencies__changes-list');
  const items = await createItem();

  setChildren(listData, items);

  return wrapper;
}

async function createItem() {
  const currencies = await getKnownCurrencies();
  const currencyPairs = {};

  currencies.payload.forEach((currency1, index1) => {
    currencies.payload.slice(index1 + 1).forEach((currency2) => {
      const pairKey = `${currency1}/${currency2}`;

      const pairElement = el(
        'li',
        { class: 'currencies__changes-item' },
        el(
          'span',
          { class: 'currencies__changes-item-pair' },
          `${currency1}/${currency2}`
        ),
        el('span', { class: 'currencies__changes-item-value' }, '-')
      );

      currencyPairs[pairKey] = pairElement;
    });
  });

  // подключение к WebSocket для получения изменений курсов
  const socket = await getChangedCurrency();

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'EXCHANGE_RATE_CHANGE') {
      const { from, to, rate, change } = data;
      const changeDirection =
        change > 0
          ? 'rate__increase'
          : change < 0
          ? 'rate__decrease'
          : 'rate__not-changed';

      const pairKey = `${from}/${to}`;

      if (currencyPairs[pairKey]) {
        const pairElement = currencyPairs[pairKey];
        const valueElement = pairElement.querySelector(
          '.currencies__changes-item-value'
        );

        if (valueElement) {
          valueElement.textContent = `${rate.toFixed(2)}`;

          pairElement.classList.remove(
            'rate__increase',
            'rate__decrease',
            'rate__not-changed'
          );

          pairElement.classList.add(changeDirection);
        }
      }
    }
  };

  return Object.values(currencyPairs);
}
