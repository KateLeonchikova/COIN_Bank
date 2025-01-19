import { formatDateToNumbers } from '../src/utils/helpers/formatDateToNumbers';

describe('formatDateToNumbers', () => {
  test('форматирует дату в формате YYYY-MM-DD', () => {
    expect(formatDateToNumbers('2024-10-15')).toBe('15.10.2024');
  });

  test('форматирует дату в формате DD/MM/YYYY', () => {
    expect(formatDateToNumbers('2024/10/15')).toBe('15.10.2024');
  });

  test('форматирует дату в формате DD.MM.YYYY', () => {
    expect(formatDateToNumbers('2024.10.15')).toBe('15.10.2024');
  });

  test('форматирует дату с одним числом дня и месяца', () => {
    expect(formatDateToNumbers('2024-1-5')).toBe('05.01.2024');
  });

  test('форматирует дату с нулевым днем и месяцем', () => {
    expect(formatDateToNumbers('2024-01-01')).toBe('01.01.2024');
  });

  test('форматирует дату с временем', () => {
    expect(formatDateToNumbers('2024-10-15T12:34:56')).toBe('15.10.2024');
  });
});
