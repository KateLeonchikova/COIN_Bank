export function handleLogOut(e) {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('accountsData');
  localStorage.removeItem('currencyAccounts');
  window.location.href = '/';
}
