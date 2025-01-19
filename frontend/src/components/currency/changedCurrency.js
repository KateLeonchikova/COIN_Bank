import { el, setChildren } from 'redom';
import { renderCurrencyAccounts } from './currencyAccounts.js';
import { exchangeCurrency } from '../../utils/api/changedCurrency';
import { getCurrencyAccounts } from '../../utils/api/getCurrencies';
import { getKnownCurrencies } from '../../utils/api/getKnownCurrencies';
import { createMaskedInput } from '../../utils/helpers/createMaskedInput.js';
import { setCachedData } from '../../utils/helpers/setCachedData.js';

let amountInputMask;

export async function renderChangedCurrency() {
  const wrapper = el(
    'div',
    { class: 'changed__currency-wrapper' },
    el('h3', { class: 'changed__currency-title' }, 'Обмен валюты'),
    el(
      'form',
      {
        class: 'changed__currency-form',
        onsubmit: (event) => {
          handleChangeCurrency(event);
        },
      },
      el(
        'div',
        { class: 'changed__currency-form-top' },
        el('label', { class: 'changed__currency-label' }, 'Из'),
        el('select', { class: 'currency__choices currency__choices-from' }),

        el('label', { class: 'changed__currency-label' }, 'в'),
        el('select', { class: 'currency__choices currency__choices-to' })
      ),
      el(
        'div',
        { class: 'changed__currency-form-bottom' },
        el('label', { class: 'changed__currency-sum' }, 'Сумма'),
        el('input', {
          class: 'changed__currency-input',
          onfocus: (event) => {
            event.target.classList.remove('error');
          },
        })
      ),
      el('button', { class: 'changed__currency-btn' }, 'Обменять')
    )
  );

  const currencyFrom = wrapper.querySelector('.currency__choices-from');
  const optionsFrom = await renderFromCurrency();

  setChildren(currencyFrom, optionsFrom);

  const currencyTo = wrapper.querySelector('.currency__choices-to');
  const optionsTo = await renderToCurrency();

  setChildren(currencyTo, optionsTo);

  amountInputMask = createMaskedInput(
    wrapper.querySelector('.changed__currency-input')
  );

  return wrapper;
}

async function renderFromCurrency() {
  const usersCurrencies = await getCurrencyAccounts();

  const currencies = Object.values(usersCurrencies.payload).map((currency) => {
    return el('option', `${currency.code}`);
  });

  return currencies;
}

async function renderToCurrency() {
  const allCurrencies = await getKnownCurrencies();
  let allCurrenciesArray = [];

  allCurrencies.payload.forEach((currency) => {
    allCurrenciesArray.push(el('option', `${currency}`));
  });

  return allCurrenciesArray;
}

async function handleChangeCurrency(event) {
  event.preventDefault();

  const currencyFrom = document.querySelector('.currency__choices-from').value;
  const currencyTo = document.querySelector('.currency__choices-to').value;
  const amountInput = document.querySelector('.changed__currency-input');

  const amount = amountInput.value.replace(/\s/g, '');

  if (currencyFrom === currencyTo) {
    alert('Нельзя обменять одну и ту же валюту.');
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    amountInput.classList.add('error');
    alert('Сумма перевода должна быть положительным числом.');
    return;
  }

  if (!(await checkUserBalance(currencyFrom, amount))) {
    amountInput.classList.add('error');
    alert(`Недостаточно средств для обмена ${amount} ${currencyFrom}.`);
    return;
  }

  console.log(
    `Попытка перевода из ${currencyFrom} в ${currencyTo}, сумма: ${amount}`
  );

  try {
    const response = await exchangeCurrency({
      from: currencyFrom,
      to: currencyTo,
      amount: amount,
    });

    if (response.error) {
      console.log('Ошибка при валютном обмене:', response.error);
      alert('Ошибка при валютном обмене: ' + response.error);
    } else {
      console.log('Валютный обмен успешно завершен!');
      alert('Валютный обмен успешно завершен!');

      setCachedData(response, 'currencyAccounts');

      const accountsWrapper = document.querySelector(
        '.currency__accounts-wrapper'
      );
      const newAccounts = await renderCurrencyAccounts();

      accountsWrapper.replaceWith(newAccounts);

      amountInput.value = '';
      if (amountInputMask) {
        amountInputMask.updateValue();
      }
    }
  } catch (error) {
    console.error('Ошибка при валютном обмене средств:', error);
    alert('Не удалось выполнить валютный обмен. Попробуйте снова.');
  }
}

async function checkUserBalance(currencyFrom, amount) {
  const usersCurrencies = await getCurrencyAccounts();
  const currency = usersCurrencies.payload[currencyFrom];

  if (!currency.amount || currency.amount < amount) {
    return false;
  }
  return true;
}
