import { el } from 'redom';
import { formatBalance } from '../../utils/helpers/formatBalance.js';
import { formatDateToNumbers } from '../../utils/helpers/formatDateToNumbers.js';

export function renderTransferHistory(
  data,
  numberOfRecords = 25,
  usePagination = false
) {
  let currentPage = 1;
  const recordsPerPage = numberOfRecords;
  const totalRecords = data.transactions.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const table = el('table', { class: 'history__table' });

  const prevButton = el('button', {
    class: 'pagination__btn pagination__btn_prev',
    onclick: () => renderPage(currentPage - 1),
    disabled: currentPage === totalPages,
  });

  const nextButton = el('button', {
    class: 'pagination__btn pagination__btn_next',
    onclick: () => renderPage(currentPage + 1),
    disabled: currentPage === 1,
  });

  const pageInfo = el('div', { class: 'pagination__pages' });

  const paginationControls = el(
    'div',
    { class: 'pagination__controls' },
    prevButton,
    pageInfo,
    nextButton
  );

  const wrapper = el(
    'div',
    { class: 'history__wrapper focused__wrapper' },
    el('h3', { class: 'history__title' }, 'История переводов'),
    el('div', { class: 'history__content' }, table),
    usePagination ? paginationControls : null
  );

  if (usePagination) {
    wrapper.classList.remove('focused__wrapper');
  }

  function renderPaginationPages() {
    pageInfo.innerHTML = '';

    const pages = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(createPageButton(i));
      }
    } else {
      pages.push(createPageButton(1));

      let startPage, endPage;
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 5;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
        endPage = totalPages - 1;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }

      if (startPage > 2) {
        pages.push(el('span', { class: 'pagination__dots' }, '...'));
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(createPageButton(i));
      }

      if (endPage < totalPages - 1) {
        pages.push(el('span', { class: 'pagination__dots' }, '...'));
      }

      pages.push(createPageButton(totalPages));
    }

    pages.forEach((page) => pageInfo.appendChild(page));
  }

  function createPageButton(pageNumber) {
    return el(
      'button',
      {
        class: `pagination__page_btn ${
          pageNumber === currentPage ? 'active' : ''
        }`,
        onclick: () => renderPage(pageNumber),
      },
      pageNumber
    );
  }

  function renderPage(pageNumber) {
    currentPage = pageNumber;

    const start = totalRecords - currentPage * recordsPerPage;
    const end = totalRecords - (currentPage - 1) * recordsPerPage;
    const transactionsToShow = data.transactions
      .slice(Math.max(start, 0), Math.max(end, 0))
      .reverse();

    table.innerHTML = '';

    table.appendChild(
      el(
        'tr',
        { class: 'history__table-row' },
        el('th', { class: 'history__table-head' }, 'Счёт отправителя'),
        el('th', { class: 'history__table-head' }, 'Счёт получателя'),
        el('th', { class: 'history__table-head' }, 'Сумма'),
        el('th', { class: 'history__table-head' }, 'Дата')
      )
    );

    transactionsToShow.forEach((item) => {
      const isOutgoing = item.from === data.account;
      const amount = isOutgoing
        ? `- ${formatBalance(item.amount)}`
        : `+ ${formatBalance(item.amount)}`;

      const amountClass = isOutgoing
        ? 'transaction-outgoing'
        : 'transaction-incoming';

      const row = el(
        'tr',
        { class: 'history__table-row' },
        el('td', { class: 'history__table-cell' }, `${item.from}`),
        el('td', { class: 'history__table-cell' }, `${item.to}`),
        el(
          'td',
          { class: `history__table-cell ${amountClass}` },
          `${amount} ₽`
        ),
        el(
          'td',
          { class: 'history__table-cell' },
          `${formatDateToNumbers(item.date)}`
        )
      );
      table.appendChild(row);
    });

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    renderPaginationPages();
  }

  renderPage(currentPage);

  return wrapper;
}
