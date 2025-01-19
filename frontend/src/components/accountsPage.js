import { el, setChildren } from 'redom';
import { getAccounts } from '../utils/api/getAccounts';
import { formatDateToText } from '../utils/helpers/formatDateToText.js';
import { formatBalance } from '../utils/helpers/formatBalance.js';
import { sortAccounts } from '../utils/helpers/sortAccounts.js';
import { handleAccountDetails } from '../utils/services/handleAccountDetails.js';

export async function renderAccountsPage(router) {
  const accounts = el(
    'main',
    { class: 'main' },
    el(
      'div',
      { class: 'container' },
      el(
        'div',
        { class: 'accounts__container' },
        el(
          'div',
          { class: 'accounts__top' },
          el('h2', { class: 'accounts__title' }, 'Ваши счета'),
          el(
            'div',
            { class: 'accounts__wrapper' },
            el(
              'select',
              {
                class: 'accounts__choices',
                onchange: (event) => handleSort(event, router),
              },
              el('option', { value: '' }, 'Сортировка'),
              el('option', { value: 'number' }, 'По номеру'),
              el('option', { value: 'balance' }, 'По балансу'),
              el('option', { value: 'date' }, 'По последней транзакции')
            ),
            el('button', { class: 'accounts__btn' }, 'Создать новый счёт')
          )
        ),
        el('div', { class: 'accounts__main' }, '')
      )
    )
  );

  setChildren(document.querySelector('.content__wrapper'), accounts);

  await renderAccount(accounts.querySelector('.accounts__main'), '', router);

  // подключение к WebSocket-серверу (для получения данных о поступлении средств)
  const socket = new WebSocket('ws://localhost:3000/currency-feed');

  socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server');
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'BALANCE_UPDATE') {
      const account = message.account;
      const newBalance = message.balance;
      const newtransactions = message.transactions;

      updateCache(account, newBalance, newtransactions);
      updateAccountDisplay(account, newBalance, newtransactions);
    }
  });

  return accounts;
}

export async function renderAccount(container, criteria = '', router) {
  container.innerHTML = '';

  const accountsData = await getAccounts();
  let accounts = accountsData.payload;

  if (criteria) {
    accounts = sortAccounts(accounts, criteria);
  }

  accounts.forEach((account) => {
    const card = el(
      'div',
      { class: 'card' },
      el('p', { class: 'card__account' }, `${account.account}`),
      el(
        'p',
        { class: 'card__balance', 'data-account': account.account },
        `${formatBalance(account.balance)} ₽`
      ),
      el(
        'div',
        { class: 'card__bottom' },
        el(
          'div',
          { class: 'card__transactions', 'data-account': account.account },
          el(
            'p',
            { class: 'card__transactions-subtitle' },
            'Последняя транзакция:'
          ),
          el(
            'p',
            { class: 'card__transactions-date' },
            account.transactions.length > 0 && account.transactions[0].date
              ? `${formatDateToText(account.transactions[0].date)}`
              : 'Нет транзакций'
          )
        ),
        el('button', { class: 'card__btn' }, 'Открыть')
      )
    );

    const button = card.querySelector('.card__btn');
    handleAccountDetails(button, router);

    container.appendChild(card);
  });
}

// обработчик события для селекта
async function handleSort(event, router) {
  const criteria = event.target.value;
  const accountsMain = document.querySelector('.accounts__main');
  await renderAccount(accountsMain, criteria, router);
}

// функция обновления кеша
function updateCache(account, newBalance, incomingTransactions) {
  const cacheKey = 'accountsData';
  const cachedData = JSON.parse(localStorage.getItem(cacheKey));

  if (cachedData) {
    const accountData = cachedData.payload.find(
      (acc) => acc.account === account
    );

    if (accountData) {
      accountData.balance = newBalance;

      const existingTransactions = accountData.transactions;

      incomingTransactions.forEach((incomingTransaction) => {
        const isDuplicate = existingTransactions.some((existingTransaction) => {
          return (
            existingTransaction.amount === incomingTransaction.amount &&
            existingTransaction.date === incomingTransaction.date
          );
        });

        if (!isDuplicate) {
          existingTransactions.push(incomingTransaction);
        }
      });

      localStorage.setItem(cacheKey, JSON.stringify(cachedData));
    }
  }
}

// функция для обновления отображения счета
function updateAccountDisplay(account, newBalance, newTransactions) {
  const balanceElement = document.querySelector(
    `.card__balance[data-account="${account}"]`
  );
  if (balanceElement) {
    balanceElement.textContent = `${formatBalance(newBalance)} ₽`;
  }

  const transactionDateElement = document.querySelector(
    `.card__transactions[data-account="${account}"] .card__transactions-date`
  );

  if (transactionDateElement) {
    if (newTransactions.length > 0) {
      const latestTransactionDate =
        newTransactions[newTransactions.length - 1].date;
      transactionDateElement.textContent = `${formatDateToText(
        latestTransactionDate
      )}`;
    } else {
      transactionDateElement.textContent = 'Нет транзакций';
    }
  }
}
