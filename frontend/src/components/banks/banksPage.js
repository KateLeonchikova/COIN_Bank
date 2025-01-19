import { el } from 'redom';
import { renderMap } from './renderMap';

export function renderBanksPage() {
  const wrapper = el(
    'main',
    { class: 'main' },
    el(
      'div',
      { class: 'container' },
      el(
        'div',
        { class: 'banks__wrapper' },
        el('h2', { class: 'banks__title' }, 'Карта банкоматов'),
        el('div', { class: 'banks__map', id: 'map' })
      )
    )
  );

  setTimeout(renderMap, 0);
  return wrapper;
}
