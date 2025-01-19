import { el } from 'redom';

const skeletonContainer = el(
  'div',
  { class: 'skeleton-container hidden' },
  el('span', { class: 'skeleton' }),
  el('span', { class: 'skeleton' }),
  el('span', { class: 'skeleton' })
);

document.body.appendChild(skeletonContainer);

export function showSkeleton() {
  skeletonContainer.classList.remove('hidden');
}

export function hideSkeleton() {
  skeletonContainer.classList.add('hidden');
}
