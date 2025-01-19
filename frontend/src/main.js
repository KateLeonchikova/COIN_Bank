import './assets/scss/main.scss';
import 'babel-polyfill';
import Navigo from 'navigo';
import { el, setChildren } from 'redom';

import { renderHeader } from './components/header';
import { renderEnterPage } from './components/enterPage';
import { renderAccountsPage } from './components/accountsPage';
import { renderAccountDetails } from './components/accountDetails/accountDetails';
import { renderDetailedBalance } from './components/accountDetails/detailedBalance';
import { renderCurrencyPage } from './components/currency/currencyPage';
import { renderBanksPage } from './components/banks/banksPage';

import { authorization } from './utils/api/authorization';
import { customizateSelect } from './utils/helpers/customizateSelect';
import { setActiveLink } from './utils/helpers/setActiveLink';
import { handleCreateAccount } from './utils/services/handleCreateAccount';
import { showBurgerMenu } from './utils/helpers/showBurgerMenu';

const router = new Navigo('/');
const bodyWrapper = el('div', { class: 'body__wrapper' });
const contentWrapper = el('div', { class: 'content__wrapper' });
setChildren(document.body, bodyWrapper);
setChildren(bodyWrapper, contentWrapper);

function initialize(contentRenderer, options = {}) {
  const header = renderHeader();
  setChildren(bodyWrapper, header, contentWrapper);
  setActiveLink(header, router);
  setChildren(contentWrapper, contentRenderer);

  if (options.hideHeader) {
    document.querySelector('.header__list').classList.add('hidden');
    document.querySelector('.header__burger_btn').classList.add('hidden');
  }

  if (options.afterRender) {
    options.afterRender();
  }
}

router
  .on({
    '/': () => {
      initialize(renderEnterPage(router), { hideHeader: true });
      authorization(router);
    },
    '/accounts': async () => {
      initialize(await renderAccountsPage(router), {
        afterRender: () => {
          handleCreateAccount(router);
          customizateSelect();
          showBurgerMenu();
        },
      });
    },
    '/account/:id': async (params) => {
      const accountId = params.data.id;
      initialize(await renderAccountDetails(accountId, router), {
        afterRender: () => showBurgerMenu(),
      });
    },
    '/account/:id/detailed-balance': async (params) => {
      const accountId = params.data.id;
      initialize(await renderDetailedBalance(accountId, router), {
        afterRender: () => showBurgerMenu(),
      });
    },
    '/currency': async () => {
      setChildren(bodyWrapper, []);
      initialize(await renderCurrencyPage(), {
        afterRender: () => {
          showBurgerMenu(), customizateSelect();
        },
      });
    },
    '/banks': () => {
      initialize(renderBanksPage(), {
        afterRender: () => showBurgerMenu(),
      });
    },
  })
  .resolve();
