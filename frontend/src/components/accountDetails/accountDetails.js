import { el, setChildren } from 'redom';

import { renderBalanceDynamics } from './balanceDynamics.js';
import { renderTransferHistory } from './transferHistory.js';
import { renderNewTransfer } from './newTransfer.js';
import { createBackButton } from './backButton.js';

import { handleDetailedBalanceView } from '../../utils/services/handleDetailedBalanceView.js';

import { getAccount } from '../../utils/api/getAccount.js';
import { formatBalance } from '../../utils/helpers/formatBalance.js';

export async function renderAccountDetails(accountId, router) {
  const accountData = await getAccount(accountId);

  const mainElement = el('main', { class: 'main' });

  const details = el(
    'div',
    { class: 'container' },
    el(
      'div',
      { class: 'details__container' },
      el('h2', { class: 'details__title' }, 'Просмотр счёта '),
      createBackButton(router, '/accounts'),
      el(
        'p',
        { class: 'details__account' },
        `№ ${accountData.payload.account}`
      ),
      el(
        'div',
        { class: 'details__balance' },
        el('span', { class: 'details__balance-subtitle' }, 'Баланс:'),
        el(
          'span',
          { class: 'details__balance-value' },
          `${formatBalance(accountData.payload.balance)} ₽`
        )
      ),
      renderNewTransfer(accountData.payload.account, router),
      renderBalanceDynamics(accountData.payload, 6),
      renderTransferHistory(accountData.payload, 10, false)
    )
  );

  mainElement.innerHTML = '';
  setChildren(mainElement, details);
  setChildren(document.querySelector('.content__wrapper'), mainElement);

  const dynamicContainer = document.querySelector('.dynamics__wrapper');
  const historyContainer = document.querySelector('.history__wrapper');
  handleDetailedBalanceView(dynamicContainer, router, accountId);
  handleDetailedBalanceView(historyContainer, router, accountId);

  return mainElement;
}
