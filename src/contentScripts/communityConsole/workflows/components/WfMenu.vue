<script>
import {Corner} from '@material/menu-surface/constants.js';

export default {
  components: {},
  props: {
    modelValue: Boolean,
    position: Array,
    workflows: Array,
  },
  data() {
    return {
      corner: Corner.TOP_RIGHT,
    };
  },
  emits: [
    'update:modelValue',
    'select',
  ],
}
</script>

<template>
  <mcw-menu :model-value="modelValue" fixed :anchor-corner="corner"
      :style="{ left: 'unset', right: 'calc(100% - ' + position[0] + 'px)', top: position[1] + 'px' }"
      @update:model-value="$emit('update:modelValue', $event)" @select="$emit('select', $event)">
    <mcw-list-item v-for="wf in workflows">{{ wf.name }}</mcw-list-item>
  </mcw-menu>
</template>

<style scoped>
.mdc-list-item {
  /* These styles mimic the Community Console style. */
  font-family: 'Google Sans Text', 'Noto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  height: 40px!important;
}
</style>
