import type { API } from '@pinguin/api';

import { DEFAULT_INTERVAL } from '@/constants';
import { getConfig } from '@/api';
import { parseDuration } from '@/utils';

let config: API.Config;

async function run() {
  try {
    config = await getConfig();
  } catch (e) {
    console.error(e);
  }

  const interval = parseDuration(config.agent?.interval ?? DEFAULT_INTERVAL);
  setTimeout(run, interval);
}

run();
