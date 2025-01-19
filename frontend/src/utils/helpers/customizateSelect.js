import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';

export function customizateSelect() {
  const sortSelect = document.querySelector('.accounts__choices');
  const currencySelects = document.querySelectorAll('.currency__choices');

  if (sortSelect) {
    new Choices(sortSelect, {
      searchEnabled: false,
      itemSelectText: '',
      classNames: {
        containerOuter: ['choices', 'accounts__choices'],
      },
    });
  }

  currencySelects.forEach((currencySelect) => {
    if (currencySelect) {
      new Choices(currencySelect, {
        searchEnabled: false,
        itemSelectText: '',
        classNames: {
          containerOuter: ['choices', 'currency__choices'],
        },
      });
    }
  });
}
