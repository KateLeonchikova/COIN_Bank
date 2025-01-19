import { WS_URL } from './apiConfig';

export async function getChangedCurrency() {
  return new WebSocket(`${WS_URL}/currency-feed`);
}
