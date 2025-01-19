import IMask from 'imask';

export function createMaskedInput(element) {
  const maskOptions = {
    mask: Number,
    scale: 15,
    thousandsSeparator: ' ',
    radix: '.',
    mapToRadix: [','],
    min: 0,
  };

  const mask = IMask(element, maskOptions);

  return mask;
}
