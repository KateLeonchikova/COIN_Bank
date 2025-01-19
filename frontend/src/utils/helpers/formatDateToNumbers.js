export function formatDateToNumbers(dateString) {
  const date = new Date(dateString);

  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  let yyyy = date.getFullYear();
  if (yyyy < 10) yyyy = '0' + yyyy;

  return dd + '.' + mm + '.' + yyyy;
}
