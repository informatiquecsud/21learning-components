<template>
  <div class="svg-ds-visu">
    <svg width="100%" height="230px">
      <g
        transform="translate(0 50) scale(1.1, 1.1)"
        v-for="(element, index) in theArray"
        class=""
        :key="index"
      >
        <text
          class="array-index"
          v-bind="{ x: 25 + 50 * index, y: 35, stroke: 'grey' }"
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
        <TextArrow
          style="font-size: 0.8em"
          direction="right"
          text="Front"
          :shape="{
            length: 30,
          }"
          :pos="{
            x: 30,
            y: 90,
            angle: -90,
          }"
          :attrs="{}"
        ></TextArrow>
        <TextArrow
          style="font-size: 0.8em"
          direction="left"
          text="Rear"
          :shape="{
            length: 30,
          }"
          :pos="{
            x: 30,
            y: 20,
            angle: -90,
          }"
          :attrs="{}"
        ></TextArrow>
      </g>
    </svg>
    <div class="controls">
      <q-input outlined filled type="text" style="max-width: 200px">
        <template v-slot:prepend>
          <q-btn>Enqueue</q-btn>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import TextArrow from "./TextArrow.vue";

const theArray = ref(Array(6));

const onElementClick = (index, element) => {
  alert(`boîte no ${index}`);
};
</script>

<style lang="scss" scoped>
.svg-ds-visu {
  padding: 1rem;
}

svg {
  border: 1px dashed black;
}

.number-label {
  color: black;
}

.array-index {
  font-size: 0.7rem;
  font-weight: normal;
}
</style>
