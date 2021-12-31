<script>
import WfMenu from './WfMenu.vue';

export default {
  components: {
    WfMenu,
  },
  data() {
    return {
      shown: false,
      position: [0, 0],
      // TODO: Get real data.
      workflows: [
        {name: 'Move to accounts'},
        {name: 'Mark as spam w/ message'},
      ],
    };
  },
  methods: {
    startWorkflow(e) {
      console.log(e);
    }
  },
}
</script>

<template>
  <wf-menu v-model="shown" :position="position" :workflows="workflows" @select="startWorkflow" />
</template>
