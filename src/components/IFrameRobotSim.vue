<template>
  <iframe
    class="robotsim-container"
    :src="src"
    frameborder="0"
    :width="width"
    :height="height"
  >
  </iframe>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IFrameRobotSim",
  props: {
    src: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
});
</script>

<style>
.robotsim-container {
  margin-top: 10px;
  margin-left: 10px;
  /*border: solid 1px red;*/
}
</style>
