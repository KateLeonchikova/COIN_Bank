import { el } from 'redom';

export function validateInputs(inputs, btn) {
  inputs.forEach((input) => {
    const errorMessage = createErrorMessage(input);

    addValidationListeners(input, errorMessage, inputs, btn);
  });
}

// создание элемента для вывода ошибок
function createErrorMessage(input) {
  const errorMessage = el('span', { class: 'error-message' });
  input.parentElement.appendChild(errorMessage);
  return errorMessage;
}

// добавляем все необходимые слушатели для валидации
function addValidationListeners(input, errorMessage, inputs, btn) {
  input.addEventListener('keydown', preventSpaces);
  input.addEventListener('paste', handlePaste);
  input.addEventListener('blur', () => handleBlur(input, errorMessage));
  input.addEventListener('input', () =>
    handleInput(input, errorMessage, inputs, btn)
  );
}

// предотвращаем ввод пробелов
function preventSpaces(event) {
  if (event.key === ' ') {
    event.preventDefault();
  }
}

// обрабатываем вставку текста и удаляем пробелы
function handlePaste(event) {
  let pastedText = (event.clipboardData || window.clipboardData).getData(
    'text'
  );
  pastedText = pastedText.replace(/\s+/g, '');
  event.preventDefault();

  const input = event.target;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  input.setRangeText(pastedText, start, end, 'end');
}

// обрабатываем событие blur для валидации поля и вывода ошибки
function handleBlur(input, errorMessage) {
  const error = getValidationError(input);
  showOrHideError(input, errorMessage, error);
}

// обработка события input
function handleInput(input, errorMessage, inputs, btn) {
  if (input.classList.contains('error')) {
    input.classList.remove('error');
    errorMessage.textContent = '';
  }

  toggleSubmitButton(inputs, btn);
}

// универсальная функция для отображения или скрытия ошибок
function showOrHideError(input, errorMessage, error) {
  if (error) {
    input.classList.add('error');
    errorMessage.textContent = error;
  } else {
    input.classList.remove('error');
    errorMessage.textContent = '';
  }
}

// функция для получения типа ошибки
function getValidationError(input) {
  const value = input.value.trim();
  if (value.length < 6) {
    return 'Недостаточно символов. Минимум 6.';
  }
  return '';
}

// переключение состояния кнопки отправки в зависимости от валидации всех полей
function toggleSubmitButton(inputs, btn) {
  const allValid = inputs.every((input) => !getValidationError(input));
  btn.disabled = !allValid;
}
