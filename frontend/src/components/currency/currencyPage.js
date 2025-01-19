import { el } from 'redom';
import { renderCurrencyAccounts } from './currencyAccounts';
import { renderCurrenciesChanges } from './currenciesChanges';
import { renderChangedCurrency } from './changedCurrency';

export async function renderCurrencyPage() {
  const wrapper = el(
    'main',
    { class: 'main' },
    el(
      'div',
      { class: 'container' },
      el(
        'div',
        { class: 'currency__container' },
        el('h2', { class: 'currency__title' }, 'Валютный обмен'),
        el(
          'div',
          { class: 'currency__wrapper' },
          await renderCurrencyAccounts(),
          await renderCurrenciesChanges(),
          await renderChangedCurrency()
        )
      )
    )
  );

  return wrapper;
}
