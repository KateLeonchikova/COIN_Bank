import { el } from 'redom';
import { handleLogOut } from '../utils/services/handleLogOut';

export function renderHeader() {
  const header = el(
    'header',
    { class: 'header' },
    el(
      'div',
      { class: 'container' },
      el(
        'div',
        { class: 'header__container' },
        el('p', { class: 'header__title' }, 'Coin.'),
        el(
          'nav',
          { class: 'header__nav' },
          el(
            'ul',
            { class: 'header__list' },
            el(
              'li',
              { class: 'header__item' },
              el('a', { class: 'header__link', href: '/banks' }, 'Банкоматы')
            ),
            el(
              'li',
              { class: 'header__item' },
              el('a', { class: 'header__link', href: '/accounts' }, 'Счета')
            ),
            el(
              'li',
              { class: 'header__item' },
              el('a', { class: 'header__link', href: '/currency' }, 'Валюта')
            ),
            el(
              'li',
              { class: 'header__item' },
              el(
                'a',
                {
                  class: 'header__link',
                  href: '#',
                  id: 'logout',
                  onclick: handleLogOut,
                },
                'Выйти'
              )
            )
          )
        ),
        el(
          'button',
          { class: 'header__burger_btn', id: 'burger' },
          el('span', { class: 'header__burger_span' }),
          el('span', { class: 'header__burger_span' }),
          el('span', { class: 'header__burger_span' })
        )
      )
    )
  );

  return header;
}
