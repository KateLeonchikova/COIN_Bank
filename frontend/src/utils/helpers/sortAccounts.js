export function sortAccounts(accounts, criteria) {
  return accounts.sort((a, b) => {
    switch (criteria) {
      case 'number':
        return a.account.localeCompare(b.account);
      case 'balance':
        return a.balance - b.balance;
      case 'date': {
        const dateA =
          a.transactions.length > 0
            ? new Date(a.transactions[0].date)
            : new Date(0);
        const dateB =
          b.transactions.length > 0
            ? new Date(b.transactions[0].date)
            : new Date(0);
        return dateA - dateB;
      }
      default:
        return 0;
    }
  });
}
