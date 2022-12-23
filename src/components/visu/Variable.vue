<template>
  <g :transform="`translate(-30 1) translate(${pos.x} ${pos.y})`">
    <rect
      x="100"
      y="0"
      width="70"
      height="40"
      rx="6"
      ry="6"
      fill="#000000"
      stroke="#000000"
      pointer-events="all"
      transform="translate(2,3)"
      opacity="0.25"
    >
    </rect>
    <rect
      x="100"
      y="0"
      width="70"
      height="40"
      rx="6"
      ry="6"
      fill="rgb(255, 255, 255)"
      stroke="rgb(0, 0, 0)"
      pointer-events="all"
    >
    </rect>
    <path
      d="M 75 20 L 93.63 20"
      fill="none"
      stroke="rgb(0, 0, 0)"
      stroke-miterlimit="10"
      pointer-events="stroke"
    ></path>
    <path
      d="M 98.88 20 L 91.88 23.5 L 93.63 20 L 91.88 16.5 Z"
      fill="rgb(0, 0, 0)"
      stroke="rgb(0, 0, 0)"
      stroke-miterlimit="10"
      pointer-events="all"
    >
    </path>
    <text class="var-name" x="30" y="24">{{ name }}</text>
    <text class="var-value" x="110" y="24">{{ value }}</text>
  </g>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  name: String,
  value: String,
  attrs: Object,
  pos: Object,
  debug: Boolean,
});
</script>

<style scoped>
.var-name {
  font-family: "Consolas", "Courier New", Courier, monospace;
}
</style>
