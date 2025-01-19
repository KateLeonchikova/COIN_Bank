import { formatBalance } from '../src/utils/helpers/formatBalance';

describe('formatBalance', () => {
  test('форматирует число с двумя знаками после запятой', () => {
    expect(formatBalance(1234567.89)).toBe('1 234 567,89');
  });

  test('форматирует число без дробной части', () => {
    expect(formatBalance(1234567)).toBe('1 234 567');
  });

  test('форматирует число с дробной частью, равной 00', () => {
    expect(formatBalance(1234567.0)).toBe('1 234 567');
  });

  test('форматирует число с дробной частью, равной 01', () => {
    expect(formatBalance(1234567.01)).toBe('1 234 567,01');
  });

  test('форматирует число с большим количеством знаков после запятой', () => {
    expect(formatBalance(1234567.1234)).toBe('1 234 567,12');
  });

  test('форматирует отрицательное число', () => {
    expect(formatBalance(-1234567.89)).toBe('-1 234 567,89');
  });

  test('форматирует ноль', () => {
    expect(formatBalance(0)).toBe('0');
  });

  test('форматирует число, меньше единицы', () => {
    expect(formatBalance(0.99)).toBe('0,99');
  });

  test('форматирует число с пробелами в дробной части', () => {
    expect(formatBalance(1234.5678)).toBe('1 234,57');
  });
});
