<template>
  <div class="svg-ds-visu">
    <pre v-if="false">{{ theArray }}</pre>
    <pre v-if="false">{{ theArray && theArray.slice(0) }}</pre>
    <div class="abstract-view">
      Abstract view of the Queue :
      <pre>{{ abstractViewStr || "EmptyQueue" }}</pre>
    </div>
    <svg width="100%" height="400px">
      <g transform="translate(0 50) scale(1.1, 1.1)" v-for="(element, index) in theArray" class="" :key="index">
        <text class="array-index" text-anchor="middle" v-bind="{ x: 30 + 50 * index, y: 35, stroke: 'grey' }">
          {{ index }}
        </text>
        <rect @click="(e) => onElementClick(index, element)" v-bind="{
          x: 10 + 50 * index,
          y: 40,
          width: 40,
          height: 40,
          fill: 'white',
          stroke: 'black',
        }"></rect>
        <text :x="30 + 50 * index" y="65" text-anchor="middle">
          {{ theArray[index] }}
        </text>
        <TextArrow style="font-size: 0.8em" direction="right" text="Front" :shape="{
          length: 30,
        }" :pos="{
  x: frontPointerX,
  y: 90,
  angle: -90,
}" :attrs="{}"></TextArrow>
        <TextArrow style="font-size: 0.8em" direction="left" text="Rear" :shape="{
          length: 30,
        }" :pos="{
  x: rearPointerX,
  y: 20,
  angle: -90,
}" :attrs="{}"></TextArrow>
      </g>
      <Variable name="_size" :value="attrs._size" :pos="{ x: 50, y: 250 }"></Variable>
      <Variable name="_front" :value="attrs._front" :pos="{ x: 50, y: 300 }"></Variable>
      <Variable name="_rear" :value="attrs._rear" :pos="{ x: 50, y: 350 }"></Variable>
      <text x="50" y="230" font-family="Courrier New" font-size="20" fill="red" font-weight="bold"
        v-show="errorMsg !== ''">
        {{ errorMsg }}
      </text>
    </svg>
    <q-toolbar class="shadow-2 rounded-borders controls-toolbar">
      <q-btn color="primary" label="Enqueue" class="q-mr-sm" @click="onEnqueue" />

      <div>
        <q-input dense class="q-mt-sm q-mb-sm" outlined type="text" style="max-width: 100px" input-style="display: inline"
          v-model="itemToEnqueue" autofocus clearable placeholder="New value" @keyup.ctrl.enter="onEnqueue"
          @keyup.ctrl.delete="onDequeue" @keyup.esc="onReset">
        </q-input>
      </div>
      <q-space />

      <q-btn color="primary" label="Dequeue" @click="onDequeue" />
      <q-space />
      <q-btn label="Reset" @click="onReset" />

      <!--
        notice shrink property since we are placing it
        as child of QToolbar
      -->
    </q-toolbar>
    <pre v-if="false">
      {{ isFull }}
    {{ maxSize }}
    </pre>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
//import { range } from "../lib/utils.js";
import TextArrow from "./visu/TextArrow.vue";
import Variable from "./visu/Variable.vue";

const route = useRoute();

const maxSize = ref(2);

const theArray = ref(null);
const abstractView = ref([])

const itemToEnqueue = ref("");
const itemDequeued = ref("");

const rearPointerX = ref(30);
const frontPointerX = ref(30);

const animateInt = (obj, config) => {
  let { duration, from, to, steps } = config;

  // default values
  from = from || obj.value;
  steps = Math.abs(steps || to - from);
  duration = duration || 1000;

  const stepSize = (to - from) / steps;
  let nbStepsMade = 0;

  const interval = setInterval(() => {
    obj.value += stepSize;
    nbStepsMade += 1;
    if (nbStepsMade == steps) {
      clearInterval(interval);
    }
  }, duration / steps);
};

const isAnimationRunning = ref(false);

const attrs = reactive({
  _size: 0,
  _front: 0,
  _rear: 0,
});

const errorMsg = ref("");

const enqueue = (item) => {
  if (isFull.value) {
    errorMsg.value = "QueueOverflowError: unable to enqueue in full Queue";
    return;
  }
  errorMsg.value = "";
  attrs._size += 1;
  theArray.value[attrs._rear] = item;
  attrs._rear = (attrs._rear + 1) % maxSize.value;
};

const dequeue = () => {
  if (isEmpty.value) {
    errorMsg.value = "EmptyQueueError: unable to dequeue from empty Queue";
    return;
  }
  errorMsg.value = "";
  attrs._size -= 1;
  const item = theArray.value[attrs._front];
  attrs._front = (attrs._front + 1) % maxSize.value;

  return item;
};

const isFull = computed(() => {
  return attrs._size === maxSize.value;
});

const abstractViewStr = computed(() => {
  return abstractView.value.join(' | ')
})

const isEmpty = computed(() => {
  return attrs._size === 0;
});

const onElementClick = (index, element) => {
  alert(`boîte no ${index}`);
};

const onEnqueue = (event) => {
  enqueue(itemToEnqueue.value);
  itemToEnqueue.value = "";
};

const onDequeue = (event) => {
  const item = dequeue();
  itemDequeued.value = item;
};

watch(
  () => ({ ...attrs }),
  (newValue, oldValue) => {
    console.log(newValue, oldValue);

    const { _front, _rear, _size } = newValue

    const leftPart = theArray.value.slice(_front, _front + _size)
    const rightPart = (_rear <= _front) ? theArray.value.slice(0, _rear) : []
    abstractView.value = _size ? leftPart.concat(rightPart).reverse() : []



    if (newValue._rear !== oldValue._rear) {
      console.log("new value", newValue._rear);
      animateInt(rearPointerX, {
        from: 30 + oldValue._rear * 50,
        to: 30 + newValue._rear * 50,
        duration: 100,
      });
    }

    if (newValue._front !== oldValue._front) {
      console.log("new value", newValue._rear);
      animateInt(frontPointerX, {
        from: 30 + oldValue._front * 50,
        to: 30 + newValue._front * 50,
        duration: 100,
      });
    }
  }
);

const reset = () => {
  attrs._front = 0;
  attrs._rear = 0;
  attrs._size = 0;

  theArray.value = Array(maxSize.value);
};

const onReset = (event) => {
  reset();
};

onMounted(async () => {
  maxSize.value = Number(route.query.maxSize) || 5;
  theArray.value = Array(maxSize.value);
});
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

.abstract-view {
  font-size: larger;
  font-weight: 700;
  background-color: antiquewhite;
  padding: 1rem
}
</style>
