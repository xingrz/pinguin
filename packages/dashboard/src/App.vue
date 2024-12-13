<template>
  <a-config-provider>
    <div :class="$style.container">
      <matrix />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import {
  ConfigProvider as AConfigProvider,
} from 'ant-design-vue';

import Matrix from '@/Matrix.vue';
</script>

<style lang="scss" module>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 0;
}
</style>
