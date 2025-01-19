import { el } from 'redom';
import { renderAccountDetails } from './accountDetails.js';
import { getAccount } from '../../utils/api/getAccount.js';
import { transferFunds } from '../../utils/api/transferFunds.js';
import { createMaskedInput } from '../../utils/helpers/createMaskedInput.js';

export function renderNewTransfer(accountFrom, router) {
  const savedAccounts = JSON.parse(localStorage.getItem('savedAccounts')) || [];

  const wrapper = el(
    'div',
    { class: 'transfer__wrapper' },
    el('h3', { class: 'transfer__title' }, 'Новый перевод'),
    el(
      'form',
      {
        class: 'transfer__form',
        onsubmit: (event) => {
          handleTransferSubmit(event, accountFrom, router, savedAccounts);
        },
      },
      el(
        'div',
        { class: 'transfer__form-content transfer__form-content-account' },
        el('label', { class: 'transfer__label' }, 'Номер счёта получателя'),
        el(
          'div',
          { class: 'transfer__input-account-wrapper' },
          el('input', {
            class: 'transfer__input transfer__input-account',
            placeholder: 'Введите номер счёта',
            oninput: (event) => {
              event.target.value = event.target.value.replace(/\D/g, '');
              toggleDropdown(
                event.target,
                document.querySelector('.dropdown'),
                savedAccounts
              );
            },
            onfocus: (event) => {
              toggleDropdown(
                event.target,
                document.querySelector('.dropdown'),
                savedAccounts
              );
              document
                .querySelector('.transfer__input-account-wrapper')
                .classList.add('open');
              event.target.classList.remove('error');
            },
            onkeydown: (event) => handleInputKeydown(event),
          }),
          el('div', {
            class: 'dropdown',
            onkeydown: (event) => handleInputKeydown(event),
          })
        )
      ),
      el(
        'div',
        { class: 'transfer__form-content' },
        el('label', { class: 'transfer__label' }, 'Сумма перевода'),
        el('input', {
          class: 'transfer__input transfer__input-amount',
          placeholder: 'Введите сумму перевода',
          onfocus: (event) => {
            event.target.classList.remove('error');
          },
        })
      ),
      el(
        'div',
        { class: 'transfer__form-content' },
        el('button', { class: 'transfer__btn', type: 'submit' }, 'Отправить')
      )
    )
  );

  createMaskedInput(wrapper.querySelector('.transfer__input-amount'));

  document.addEventListener('click', (event) => {
    const dropdown = document.querySelector('.dropdown');
    const accountInputWrapper = document.querySelector(
      '.transfer__input-account-wrapper'
    );

    if (dropdown && accountInputWrapper) {
      if (
        !accountInputWrapper.contains(event.target) &&
        !dropdown.contains(event.target)
      ) {
        accountInputWrapper.classList.remove('open');
        dropdown.style.display = 'none';
      }
    }
  });

  return wrapper;
}

async function handleTransferSubmit(event, accountFrom, router, savedAccounts) {
  event.preventDefault();

  const accountInput = document.querySelector('.transfer__input-account');
  const amountInput = document.querySelector('.transfer__input-amount');

  const accountTo = accountInput.value;
  let amount = amountInput.value.replace(/\s/g, '');

  if (!accountTo) {
    accountInput.classList.add('error');
    alert('Пожалуйста, введите номер счёта.');
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    amountInput.classList.add('error');
    alert('Сумма перевода должна быть положительным числом.');
    return;
  }

  console.log(`Попытка перевода на счёт: ${accountTo}, сумма: ${amount}`);

  try {
    const response = await transferFunds({
      from: accountFrom,
      to: accountTo,
      amount: parseFloat(amount),
    });

    if (response.error) {
      console.log('Ошибка при переводе средств:', response.error);
      alert('Ошибка при переводе: ' + response.error);
    } else {
      console.log('Перевод успешно завершен!');
      alert('Перевод успешно завершен!');

      const updatedAccountData = await getAccount(accountFrom);

      if (updatedAccountData) {
        console.log('Перевод успешен. Обновляем данные счёта.');

        renderAccountDetails(updatedAccountData.payload.account, router);
      }

      accountInput.value = '';
      amountInput.value = '';
    }
  } catch (error) {
    console.error('Ошибка при переводе средств:', error);
    alert('Не удалось выполнить перевод. Попробуйте снова.');
  }

  if (!savedAccounts.includes(accountTo)) {
    savedAccounts.push(accountTo);
    localStorage.setItem('savedAccounts', JSON.stringify(savedAccounts));
  }
}

function toggleDropdown(input, dropdown, savedAccounts) {
  dropdown.innerHTML = '';

  const filter = input.value.toLowerCase();
  const filteredAccounts = savedAccounts.filter((account) =>
    account.toLowerCase().includes(filter)
  );

  const accountsToShow = filter ? filteredAccounts : savedAccounts;

  if (accountsToShow.length) {
    accountsToShow.forEach((account) => {
      const option = el(
        'div',
        { class: 'custom-option', tabindex: '0' },
        account
      );

      option.onclick = () => {
        input.value = account;
        dropdown.style.display = 'none';
      };

      option.onkeydown = (event) => {
        if (event.key === 'Enter') {
          input.value = account;
          dropdown.style.display = 'none';
        }
      };

      option.onblur = (event) => {
        // Проверяем, ушёл ли фокус на элемент за пределами дропдауна
        setTimeout(() => {
          if (
            !dropdown.contains(document.activeElement) &&
            document.activeElement !== input
          ) {
            dropdown.style.display = 'none';
            document
              .querySelector('.transfer__input-account-wrapper')
              .classList.remove('open');
          }
        }, 100);
      };

      dropdown.appendChild(option);
    });
    dropdown.style.display = 'block';

    input.onblur = (event) => {
      setTimeout(() => {
        if (!dropdown.contains(document.activeElement)) {
          dropdown.style.display = 'none';
          document
            .querySelector('.transfer__input-account-wrapper')
            .classList.remove('open');
        }
      }, 100);
    };
  } else {
    dropdown.style.display = 'none';
  }
}

function handleInputKeydown(event) {
  const input = event.target;
  const dropdown = document.querySelector('.dropdown');
  const options = dropdown.querySelectorAll('.custom-option');
  let currentIndex = -1;

  options.forEach((option, index) => {
    if (option === document.activeElement) {
      currentIndex = index;
    }
  });

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      currentIndex = (currentIndex + 1) % options.length;
      options[currentIndex].focus();
      dropdown.style.display = 'block';
      break;

    case 'ArrowUp':
      event.preventDefault();
      currentIndex = (currentIndex - 1 + options.length) % options.length;
      options[currentIndex].focus();
      dropdown.style.display = 'block';
      break;

    case 'Escape':
      event.preventDefault();
      document
        .querySelector('.transfer__input-account-wrapper')
        .classList.remove('open');
      dropdown.style.display = 'none';

      break;

    case 'Enter':
      const selectedOption = document.activeElement;
      if (selectedOption.classList.contains('custom-option')) {
        input.value = selectedOption.textContent;
        dropdown.style.display = 'none';
        document
          .querySelector('.transfer__input-account-wrapper')
          .classList.remove('open');
      }
      break;
  }
}
