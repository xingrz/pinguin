import got from 'got';
import type { API } from '@pinguin/api';

import { API_SERVER } from '@/constants';

const api = got.extend({
  prefixUrl: `${API_SERVER}/api`,
});

export async function getConfig(): Promise<API.Config> {
  return await api.get('config').json();
}

export async function report(report: API.PingReport): Promise<void> {
  await api.post('ping', { json: report });
}
