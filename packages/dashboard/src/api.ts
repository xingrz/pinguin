import ky from 'ky';
import type { API } from '@pinguin/api';

const api = ky.extend({
  prefixUrl: '/api',
});

export async function getConfig(): Promise<API.Config> {
  return await api.get('config').json();
}

export async function getPings(): Promise<API.PingMatrix> {
  return await api.get('ping').json();
}
