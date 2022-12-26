<template>
  <div class="svg-ds-visu">
    <svg width="100%" height="400px">
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
      <Variable
        name="_size"
        :value="attrs._size"
        :pos="{ x: 50, y: 250 }"
      ></Variable>
      <Variable
        name="_front"
        :value="attrs._front"
        :pos="{ x: 50, y: 300 }"
      ></Variable>
      <Variable
        name="_rear"
        :value="attrs._rear"
        :pos="{ x: 50, y: 350 }"
      ></Variable>
    </svg>
    <q-toolbar class="shadow-2 rounded-borders controls-toolbar">
      <q-btn color="primary" label="Enqueue" class="q-mr-sm" />

      <div>
        <q-input
          dense
          class="q-mt-sm q-mb-sm"
          outlined
          type="text"
          style="max-width: 50px"
          input-style="display: inline"
          q-model="itemToEnqueue"
          autofocus
          clearable
        >
          <template q-slot:prepend>
            <q-btn label="Enqueue" />
          </template>
        </q-input>
      </div>
      <q-space />

      <q-btn color="primary" label="Dequeue" />
      <q-space />
      <q-btn label="Reset" />

      <!--
        notice shrink property since we are placing it
        as child of QToolbar
      -->
    </q-toolbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
//import { range } from "../lib/utils.js";
import TextArrow from "./visu/TextArrow.vue";
import Variable from "./visu/Variable.vue";

const theArray = ref(Array(6));

const itemToEnqueue = ref("");

const attrs = reactive({
  _size: 0,
  _front: 0,
  _rear: 0,
});

const push = (item) => {
  _size.value += 1;
};

const onElementClick = (index, element) => {
  alert(`boîte no ${index}`);
};
</script>

<style lang="scss" scoped>
.svg-ds-visu {
  padding: 1rem;
}

svg {
  border: 0px dashed black;
}

.number-label {
  color: black;
}

.array-index {
  font-size: 0.7rem;
  font-weight: normal;
}

.controls-toolbar {
  min-width: 380px;
}
</style>
