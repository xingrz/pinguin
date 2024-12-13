import { watch } from 'vue';
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core';

export function useRegularyInvoke(fn: () => any, interval: number): void {
  const { pause, resume } = useIntervalFn(fn, interval, {
    immediateCallback: true,
  });

  const visibility = useDocumentVisibility();
  watch(visibility, (value) => {
    if (value == 'hidden') {
      pause();
    } else {
      resume();
    }
  });
}
