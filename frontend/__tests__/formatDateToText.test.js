import { formatDateToText } from '../src/utils/helpers/formatDateToText';

describe('formatDateToText', () => {
  test('форматирует дату в текстовый формат (полная дата)', () => {
    expect(formatDateToText('2024-10-15')).toBe('15 октября 2024');
  });

  test('форматирует дату с днем, меньше 10', () => {
    expect(formatDateToText('2023-01-05')).toBe('5 января 2023');
  });

  test('форматирует дату с месяцем, где 30 дней', () => {
    expect(formatDateToText('2023-04-30')).toBe('30 апреля 2023');
  });

  test('форматирует дату в високосном году', () => {
    expect(formatDateToText('2024-02-29')).toBe('29 февраля 2024');
  });

  test('форматирует дату с одним числом дня и месяца', () => {
    expect(formatDateToText('2024-1-1')).toBe('1 января 2024');
  });

  test('форматирует дату с временем', () => {
    expect(formatDateToText('2024-10-15T12:34:56')).toBe('15 октября 2024');
  });
});
