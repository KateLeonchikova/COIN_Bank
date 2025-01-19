import { isInputValid } from '../src/utils/helpers/validateInputs';

describe('Проверка логина и пароля', () => {
  test('должен возвращать true для корректного ввода', () => {
    const input = { value: 'developer' };
    expect(isInputValid(input)).toBe(true);
  });

  test('должен возвращать false для ввода менее 6 символов', () => {
    const input = { value: 'dev' };
    expect(isInputValid(input)).toBe(false);
  });

  test('должен возвращать false для ввода с пробелами', () => {
    const input = { value: 'dev eloper' };
    expect(isInputValid(input)).toBe(false);
  });

  test('должен возвращать false для пустого ввода', () => {
    const input = { value: '' };
    expect(isInputValid(input)).toBe(false);
  });

  test('должен возвращать false для ввода, содержащего только пробелы', () => {
    const input = { value: '      ' };
    expect(isInputValid(input)).toBe(false);
  });
});
