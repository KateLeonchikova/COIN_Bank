export function setActiveLink(header, router) {
  let currentPath = router.getCurrentLocation().url || '/';

  if (!currentPath.startsWith('/')) {
    currentPath = `/${currentPath}`;
  }

  const links = header.querySelectorAll('.header__link');

  links.forEach((link) => {
    const href = link.getAttribute('href');

    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
