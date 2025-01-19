import { el, setChildren } from 'redom';
import { getCurrencyAccounts } from '../../utils/api/getCurrencies';

export async function renderCurrencyAccounts() {
  const wrapper = el(
    'div',
    { class: 'currency__accounts-wrapper' },
    el('h3', { class: 'currency__accounts-title' }, 'Ваши валюты'),
    el('ul', { class: 'currency__accounts-list' })
  );

  const listData = wrapper.querySelector('.currency__accounts-list');
  const items = await createItem();

  setChildren(listData, items);

  return wrapper;
}

async function createItem() {
  const data = await getCurrencyAccounts();

  const filteredData = Object.values(data.payload).filter(
    (item) => item.amount > 0
  );

  const items = filteredData.map((item) => {
    return el(
      'li',
      { class: 'currency__accounts-item' },
      el('span', { class: 'currency__accounts-code' }, `${item.code}`),
      el('span', { class: 'currency__accounts-amount' }, `${item.amount}`)
    );
  });

  return items;
}
