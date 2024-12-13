<template>
  <div ref="matrixEl" v-if="config && matrix" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { theme } from 'ant-design-vue';
import { Heatmap } from '@antv/g2plot';
import Color from 'color';
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
    ping: API.Ping | undefined;
    updatedAt: Date | undefined;
  }[] = [];

  for (const { id: src, passive } of config.value?.nodes ?? []) {
    if (passive) {
      continue;
    }
    for (const { id: dst } of config.value?.nodes ?? []) {
      const report = matrix.value?.[src]?.[dst];
      data.push({
        src, dst,
        ping: report?.ping ?? undefined,
        updatedAt: report ? new Date(report.updatedAt) : undefined,
      });
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
    if (ping === undefined) {
      return 'transparent';
    } else if (ping === null || ping > 500) {
      return token.value.colorError;
    } else if (ping > 200) {
      const ratio = (ping - 200) / 100;
      return Color(token.value.colorWarning).mix(Color(token.value.colorError), ratio).hex();
    } else {
      const ratio = ping / 100;
      return Color(token.value.colorSuccess).mix(Color(token.value.colorWarning), ratio).hex();
    }
  },
  label: {
    style: {
      fill: '#000000',
      fontFamily: 'monospace',
    },
    formatter({ ping }) {
      if (ping === undefined) {
        return '/';
      } else if (ping === null) {
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
