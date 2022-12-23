<template>
  <g style="" v-bind="attrs" :transform="transform">
    <g v-bind="myShape">
      <path
        :d="path"
        fill="#f8cecc"
        stroke="#b85450"
        stroke-miterlimit="10"
        pointer-events="all"
      />
      <g :transform="textTransform">
        <text class="arrow-text" v-bind="textAttrs">{{ text }}</text>
      </g>
    </g>
    <circle v-if="debug" :cx="0" :cy="0" r="3" fill="red"></circle>
    <circle v-if="debug" :cx="rotCenter.x" :cy="rotCenter.y" r="3"></circle>
  </g>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  direction: String,
  text: String,
  shape: Object,
  fill: String,
  attrs: Object,
  pos: Object,
  debug: Boolean,
});

const transform = computed(() => {
  const { x, y, angle } = props.pos;
  const { length, headLength, headWidth } = myShape.value;
  const transform = `
    translate(${x} ${y})
    rotate(${angle}, ${rotCenter.value.x}, ${rotCenter.value.y})`;
  //console.log("transform", transform);
  return transform;
});

const rotCenter = computed(() => {
  return {
    y: 0,
    x: 0,
  };
});

const arrowDirection = computed(() => {
  return props.direction === "left" ? 0 : 180;
});

const myShape = computed(() => {
  let { headWidth, width, length, headLength } = props.shape;

  width = width || 15;
  headLength = headLength || 20;
  headWidth = headWidth || 40;

  const headOffset = (headWidth - width) / 2;
  const totalLength = length + headLength;
  const s = {
    headWidth,
    width,
    length,
    headLength,
    headOffset,
    totalLength,
  };
  // console.log("computed shape", s);
  return s;
});

const textAttrs = computed(() => {
  return {
    x: 15,
    y: 3,
  };
});

const toLeft = computed(() => props.direction === "left");

const textTransform = computed(() => {
  const { headLength } = myShape.value;
  const dx = toLeft.value ? 0 : -headLength - props.text.length * 7;

  return `translate(${dx})`;
});

const path = computed(() => {
  const s = myShape.value;
  // console.log("inner shape", s);

  const dir = arrowDirection.value === 0 ? 1 : -1;

  const d = `
    M 0 0
    l ${dir * s.headLength} -${s.headWidth / 2}
    l 0 ${s.headOffset}
    l ${dir * s.length} 0
    l 0 ${s.width}
    l ${-dir * s.length} 0
    l 0 ${s.headOffset}
    Z`;

  return d;
});
</script>

<style scoped>
.arrow-text1 {
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-size: 1rem;
}
</style>
