<template>
  <div class="svg-ds-visu">
    <svg width="500px" height="300px">
      <g>
        <circle
          fill="transparent"
          v-bind="circle"
          :transform="`${rotateTransform(circle.rotate)}`"
        />
        <g v-for="mark in marks" :key="mark.id">
          <circle
            :cx="circle.cx"
            :cy="circle.cy - circle.r"
            r="3"
            fill="black"
            :transform="rotateTransform(mark.rotate)"
          ></circle>
          <text
            :x="circle.cx"
            :y="circle.cy - circle.r - 7"
            class="number-label"
            :transform="`rotate(${mark.rotate.angle}, ${circle.cx}, ${circle.cy})`"
            :stroke="`rgb(${(255 / modulus) * mark.id + 100}, 150, ${
              300 - (255 / modulus) * mark.id
            })`"
          >
            {{ mark.id }}
          </text>
          "
        </g>
      </g>
    </svg>
    <q-slider v-model="modulus" :min="1" :max="20" label></q-slider>
  </div>
  <pre>marks: {{ marks }}</pre>
  <pre>modulus: {{ modulus }}</pre>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { range } from "../lib/utils.js";

const marks = computed(() => {
  console.log(range([modulus.value]));
  return range([modulus.value]).map((i) => ({
    id: i,
    rotate: {
      angle: (360 / modulus.value) * i,
      centerX: circle.cx,
      centerY: circle.cy,
    },
  }));
});

const modulus = ref(10);

const circle = reactive({
  cx: 100,
  cy: 100,
  r: 50,
  stroke: "black",
  rotate: {
    angle: 0,
    centerX: 0,
    centerY: 0,
  },
});

const rotateTransform = (r) => {
  return `rotate(${r.angle}, ${r.centerX}, ${r.centerY})`;
};
</script>

<style lang="scss" scoped>
.svg-ds-visu {
  padding: 1rem;
}

svg {
  border: 1px solid black;
}

.number-label {
  color: black;
}
</style>
