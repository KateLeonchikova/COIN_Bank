import { renderEnterPage } from '../src/components/enterPage';

describe('Проверка DOM-дерева и логики страницы входа', () => {
  let contentWrapper;

  beforeEach(() => {
    document.body.innerHTML = '<div class="content__wrapper"></div>';
    contentWrapper = document.querySelector('.content__wrapper');
    renderEnterPage({});
  });

  test('Должно быть два поля ввода для логина и пароля', () => {
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');

    expect(loginInput).not.toBeNull();
    expect(passwordInput).not.toBeNull();
  });

  test('Кнопка должна быть неактивна при загрузке страницы', () => {
    const submitButton = document.getElementById('btn-submit');

    expect(submitButton).not.toBeNull();
    expect(submitButton.disabled).toBe(true);
  });
});
