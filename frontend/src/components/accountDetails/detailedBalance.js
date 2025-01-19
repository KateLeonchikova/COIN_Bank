import { el } from 'redom';
import { createBackButton } from './backButton.js';
import { getAccount } from '../../utils/api/getAccount.js';
import { formatBalance } from '../../utils/helpers/formatBalance.js';
import { renderBalanceDynamics } from './balanceDynamics.js';
import { renderTransferHistory } from './transferHistory.js';
import { renderTransactionsBalanceDynamics } from './transactionsBalanceDynamics.js';

export async function renderDetailedBalance(id, router) {
  const accountData = await getAccount(id);

  const wrapper = el(
    'main',
    { class: 'main' },
    el(
      'div',
      { class: 'container' },
      el(
        'div',
        { class: 'balance__container' },
        el('h2', { class: 'balance__title' }, 'История баланса'),
        createBackButton(router, `/account/${id}`),
        el(
          'p',
          { class: 'balance__account' },
          `№ ${accountData.payload.account}`
        ),
        el(
          'div',
          { class: 'balance__content' },
          el('span', { class: 'balance__content-subtitle' }, 'Баланс:'),
          el(
            'span',
            { class: 'balance__content-value' },
            `${formatBalance(accountData.payload.balance)} ₽`
          )
        ),
        el(
          'div',
          { class: 'balance__annual' },
          renderBalanceDynamics(accountData.payload, 12)
        ),
        el(
          'div',
          { class: 'balance__transactions_annual' },
          renderTransactionsBalanceDynamics(accountData.payload, 12)
        ),
        el(
          'div',
          { class: 'balance__history' },
          renderTransferHistory(accountData.payload, 25, true)
        )
      )
    )
  );

  return wrapper;
}
