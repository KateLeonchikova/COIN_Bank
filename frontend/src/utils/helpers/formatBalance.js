export function formatBalance(number) {
  const [integerPart, decimalPart] = number.toFixed(2).split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  if (!decimalPart || decimalPart === '00') {
    return formattedInteger;
  }

  return `${formattedInteger},${decimalPart}`;
}
