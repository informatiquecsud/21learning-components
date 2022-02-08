<template>
  <canvas :id="containerId" v-if="downloaded" />
  <div class="placeholder" v-else>Downloading ...</div>
</template>

<script setup>
import { defineProps, ref, onMounted, nextTick } from "vue";
import RobotSimulation from "./RobotSimulation.js";

let simulationInstance = null;

const downloaded = ref(true);
const containerId = ref("robotsim-container");

// onMounted(async () => {
//   const robotSimulation = await import(
//     /* webpackChunkName: "robotsim" */ "./RobotSimulation.js"
//   );
//   downloaded = true;
//   nextTick(() => {
//     simulationInstance = new RobotSimulation(600, 600, "game", "map.json");
//   });
// });

onMounted(() => {
  simulationInstance = new RobotSimulation(600, 600, "game", "map.json");
});
</script>

<style>
</style>