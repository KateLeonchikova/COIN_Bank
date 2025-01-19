import { monthlyBalance } from './monthlyBalance';
import { formatBalance } from '../helpers/formatBalance';

export function renderBalanceChart(data, numberOfMonths) {
  const canvas = document.getElementById('chartContainer');

  const parent = canvas.parentElement;

  const canvasWidth = parent.clientWidth;
  const canvasHeight = 196;

  const scale = window.devicePixelRatio || 1;
  canvas.width = canvasWidth * scale;
  canvas.height = canvasHeight * scale;

  const ctx = canvas.getContext('2d');

  ctx.scale(scale, scale);

  let barWidth, fontSize, textMargin, barMargin, axisOffsetY;

  if (numberOfMonths <= 6) {
    if (window.innerWidth <= 576) {
      barWidth = 20;
      fontSize = '12px';
      textMargin = 10;
      barMargin = 8;
      axisOffsetY = 20;
    } else if (window.innerWidth <= 767) {
      barWidth = 40;
      fontSize = '14px';
      textMargin = 10;
      barMargin = 25;
      axisOffsetY = 25;
    } else {
      barWidth = 50;
      fontSize = '20px';
      textMargin = 24;
      barMargin = 35;
      axisOffsetY = 30;
    }
  } else {
    if (window.innerWidth <= 460) {
      barWidth = 10;
      fontSize = '8px';
      textMargin = 5;
      barMargin = 5;
      axisOffsetY = 15;
    } else if (window.innerWidth <= 576) {
      barWidth = 20;
      fontSize = '12px';
      textMargin = 10;
      barMargin = 8;
      axisOffsetY = 20;
    } else if (window.innerWidth <= 767) {
      barWidth = 30;
      fontSize = '14px';
      textMargin = 10;
      barMargin = 15;
      axisOffsetY = 25;
    } else if (window.innerWidth <= 992) {
      barWidth = 30;
      fontSize = '18px';
      textMargin = 18;
      barMargin = 25;
      axisOffsetY = 25;
    } else {
      barWidth = 50;
      fontSize = '20px';
      textMargin = 24;
      barMargin = 35;
      axisOffsetY = 30;
    }
  }

  const width = canvasWidth;
  const height = canvasHeight;

  const chartWidth = width;
  const chartHeight = height - axisOffsetY;

  let balanceHistory = monthlyBalance(data, numberOfMonths);
  const maxBalance = Math.max(...balanceHistory.map((item) => item.balance));

  ctx.font = `500 ${fontSize} WorkSansMedium`;
  const maxBalanceTextWidth = ctx.measureText(
    `${formatBalance(maxBalance)} ₽`
  ).width;
  const axisOffsetX = maxBalanceTextWidth + textMargin;

  const totalBarsWidth = barWidth * balanceHistory.length;
  const totalGapsWidth =
    chartWidth - axisOffsetX - totalBarsWidth - 2 * barMargin;
  const gap = totalGapsWidth / (balanceHistory.length - 1);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#000';

  ctx.lineWidth = 1;
  ctx.strokeRect(
    0.5,
    0.5,
    width - axisOffsetX - 0.5,
    height - axisOffsetY - 0.5
  );

  // Подпись оси Y: 0 и maxBalance
  ctx.fillStyle = '#000';
  ctx.textAlign = 'left';
  ctx.font = `500 ${fontSize} WorkSansMedium`;

  ctx.fillText('0 ₽', width - axisOffsetX + textMargin, height - axisOffsetY);
  ctx.fillText(
    `${formatBalance(maxBalance)} ₽`,
    width - axisOffsetX + textMargin,
    20
  );

  // Рисуем столбцы
  balanceHistory.forEach((item, index) => {
    const barHeight = (item.balance / maxBalance) * chartHeight;

    const x = index * (barWidth + gap) + barMargin;
    const y = height - axisOffsetY - barHeight;

    // Рисуем столбец
    ctx.fillStyle = '#116acc';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Подпись месяцев
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.font = `700 ${fontSize} WorkSansBold`;
    ctx.fillText(item.month, x + barWidth / 2, height - 8);
  });

  return data;
}
