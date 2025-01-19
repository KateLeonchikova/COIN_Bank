export function monthlyBalance(data, numberOfMonths) {
  const monthNames = [
    'янв',
    'фев',
    'мар',
    'апр',
    'май',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
  ];

  let balanceHistory = [];
  const currentDate = new Date();

  let currentBalance = data.balance;

  for (let i = 0; i < numberOfMonths; i++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );

    balanceHistory.unshift({
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
      balance: currentBalance,
      income: 0,
      expense: 0,
    });
  }

  data.transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth();
    const transactionYear = transactionDate.getFullYear();

    let amount = parseFloat(
      transaction.amount.toString().replace(/[+\s-]/g, '')
    );

    for (let i = 0; i < balanceHistory.length; i++) {
      const balanceMonth = balanceHistory[i].month;
      const balanceYear = balanceHistory[i].year;

      if (
        transactionMonth === monthNames.indexOf(balanceMonth) &&
        transactionYear === balanceYear
      ) {
        if (transaction.from === data.account) {
          balanceHistory[i].expense += amount;
        } else {
          balanceHistory[i].income += amount;
        }

        balanceHistory[i].income = parseFloat(
          balanceHistory[i].income.toFixed(2)
        );
        balanceHistory[i].expense = parseFloat(
          balanceHistory[i].expense.toFixed(2)
        );
      }
    }
  });

  for (let i = balanceHistory.length - 2; i >= 0; i--) {
    balanceHistory[i].balance =
      balanceHistory[i + 1].balance -
      balanceHistory[i + 1].income +
      balanceHistory[i + 1].expense;

    balanceHistory[i].balance = parseFloat(
      balanceHistory[i].balance.toFixed(2)
    );
  }

  return balanceHistory;
}
