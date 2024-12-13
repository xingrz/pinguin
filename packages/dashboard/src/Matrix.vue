<template>
  <div ref="matrixEl" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { theme } from 'ant-design-vue';
import { Heatmap } from '@antv/g2plot';
import type { API } from '@pinguin/api';

import { useRegularyInvoke } from '@/composables/useRegularlyInvoke';
import { usePlot } from '@/composables/usePlot';

import { getConfig, getPings } from '@/api';

const REFRESH_INTERVAL = 10 * 1000;

const config = ref<API.Config>();
const matrix = ref<API.PingMatrix>();

useRegularyInvoke(async () => {
  config.value = await getConfig();
  matrix.value = await getPings();
}, REFRESH_INTERVAL);

const sequence = computed(() => {
  const data: {
    src: string;
    dst: string;
    ping: API.Ping;
    updatedAt: Date;
  }[] = [];

  for (const { id: src, passive } of config.value?.nodes ?? []) {
    if (passive) {
      continue;
    }

    for (const { id: dst } of config.value?.nodes ?? []) {
      const report = matrix.value?.[src]?.[dst];
      if (report) {
        data.push({
          src,
          dst,
          ping: report.ping,
          updatedAt: new Date(report.updatedAt),
        });
      }
    }
  }

  return data;
});

const { token } = theme.useToken();

const { el: matrixEl } = usePlot(sequence, (el, data) => new Heatmap(el, {
  autoFit: true,
  animation: false,
  pixelRatio: window.devicePixelRatio,
  data: data,
  yField: 'src',
  xField: 'dst',
  colorField: 'ping',
  color({ ping }) {
    if (ping == null) {
      return token.value.colorError;
    } else if (ping < 100) {
      return token.value.colorSuccess;
    } else if (ping < 200) {
      return token.value.colorWarning;
    } else {
      return token.value.colorError;
    }
  },
  shape: 'circle',
  sizeRatio: 0.75,
  label: {
    style: {
      fill: '#000000',
      fontFamily: 'monospace',
    },
    formatter({ ping }) {
      if (ping == null) {
        return 'FAIL';
      } else {
        return String(ping);
      }
    },
  },
  xAxis: {
    grid: null,
    title: { text: 'dst' },
  },
  yAxis: {
    grid: null,
    title: { text: 'src' },
  },
  tooltip: false,
}));
</script>
