<template>
  <div class="svg-ds-visu">
    <svg width="500px" height="300px">
      <g v-for="(element, index) in theArray" class="" :key="index">
        <text
          class="array-index"
          v-bind="{ x: 25 + 50 * index, y: 30, stroke: 'grey' }"
        >
          {{ index }}
        </text>
        <rect
          @click="(e) => onElementClick(index, element)"
          v-bind="{
            x: 10 + 50 * index,
            y: 40,
            width: 40,
            height: 40,
            fill: 'white',
            stroke: 'black',
          }"
        ></rect>
      </g>
      <TextArrow></TextArrow>
    </svg>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
//import { range } from "../lib/utils.js";
import TextArrow from "./visu/TextArrow.vue";

const theArray = ref([1, 2, 3, 6, 3]);

const onElementClick = (index, element) => {
  alert(`boîte no ${index}`);
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

.array-index {
  font-size: 0.7rem;
  font-weight: normal;
}
</style>
