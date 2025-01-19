import { el, setChildren } from 'redom';
import { authorization } from '../utils/api/authorization';
import { validateInputs } from '../utils/helpers/validateInputs';

export function renderEnterPage(router) {
  const enterPage = el(
    'main',
    { class: 'main' },
    el(
      'div',
      { class: 'container' },
      el(
        'div',
        { class: 'main-container' },
        el(
          'div',
          { class: 'main__entrance' },
          el('h2', { class: 'main__title' }, 'Вход в аккаунт'),
          el(
            'form',
            { class: 'main__form', action: '#', method: 'POST' },
            el(
              'div',
              { class: 'main__form-content' },
              el('label', { for: 'login', class: 'input__label' }, 'Логин'),
              el('input', {
                type: 'text',
                class: 'input__control',
                id: 'login',
                required: true,
              })
            ),
            el(
              'div',
              { class: 'main__form-content' },
              el('label', { for: 'password', class: 'input__label' }, 'Пароль'),
              el('input', {
                type: 'password',
                class: 'input__control',
                id: 'password',
                required: true,
              })
            ),
            el(
              'button',
              {
                type: 'submit',
                class: 'btn-submit',
                id: 'btn-submit',
                disabled: 'true',
              },
              'Войти'
            )
          )
        )
      )
    )
  );

  setChildren(document.querySelector('.content__wrapper'), enterPage);

  const form = document.querySelector('.main__form');
  const login = document.getElementById('login');
  const password = document.getElementById('password');
  const btn = enterPage.querySelector('#btn-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const loginValue = login.value.trim();
    const passwordValue = password.value.trim();

    const result = await authorization(loginValue, passwordValue);

    if (result.success) {
      router.navigate('/accounts');
    } else {
      if (result.error === 'Invalid password') {
        alert('Неверный пароль!');
      } else if (result.error === 'No such user') {
        alert('Пользователь не найден!');
      } else {
        alert('Ошибка при авторизации: ' + result.error);
      }
    }
  });

  validateInputs([login, password], btn);

  return enterPage;
}
