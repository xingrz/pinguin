import ping from 'ping';
import type { API } from '@pinguin/api';

import { DEFAULT_COUNT, DEFAULT_INTERVAL, NODE_ID } from '@/constants';
import { getConfig, report } from '@/api';
import { parseDuration } from '@/utils';

let config: API.Config;

async function run() {
  try {
    config = await getConfig();
    const count = config.agent?.count ?? DEFAULT_COUNT;

    for (const node of config.nodes) {
      const response = await ping.promise.probe(node.address, {
        extra: [
          `-c ${count}`,
        ],
      });

      const result = response.alive ? parseFloat(response.avg) : null;

      await report({
        src: NODE_ID,
        dst: node.id,
        ping: result,
      });

      console.log(`Pinged ${node.id}: ${result}`);
    }
  } catch (e) {
    console.error(e);
  }

  const interval = parseDuration(config.agent?.interval ?? DEFAULT_INTERVAL);
  setTimeout(run, interval);
}

run();
