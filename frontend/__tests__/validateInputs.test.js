import { validateInputs } from '../src/utils/helpers/validateInputs';

describe('validateInputs', () => {
  let input1, input2, btn;

  beforeEach(() => {
    input1 = document.createElement('input');
    input1.value = '';
    input2 = document.createElement('input');
    input2.value = 'developer';
    btn = document.createElement('button');
    btn.disabled = true;

    validateInputs([input1, input2], btn);
  });

  test('кнопка должна быть отключена, если хотя бы один ввод невалидный', () => {
    input1.value = 'dev';
    input1.dispatchEvent(new Event('blur'));
    expect(btn.disabled).toBe(true);
  });

  test('кнопка должна быть включена, если все вводы валидны', () => {
    input1.value = 'developer';
    input1.dispatchEvent(new Event('blur'));
    expect(btn.disabled).toBe(false);
  });

  test('должен добавлять класс error для невалидных вводов', () => {
    input1.value = 'dev';
    input1.dispatchEvent(new Event('blur'));
    expect(input1.classList.contains('error')).toBe(true);
  });

  test('должен удалять класс error для валидных вводов', () => {
    input1.value = 'developer';
    input1.dispatchEvent(new Event('blur'));
    expect(input1.classList.contains('error')).toBe(false);
  });
});
