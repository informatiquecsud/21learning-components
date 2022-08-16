<template>
  <q-scroll-area
    ref="stdoutScrollArea"
    :dark="true"
    :style="{ height: `${500}px` }"
  >
    <pre>{{ stdout }}</pre>
  </q-scroll-area>
</template>

<script setup>
import { defineProps, watch, ref, reactive, onMounted } from "vue";

const props = defineProps({
  stdout: String,
});

const stdoutProp = ref(props.stdout);
const stdoutScrollArea = ref(null);

onMounted(() => {});

watch(
  () => props.stdout,
  (newValue, oldValue) => {
    console.log("stdout changed");
    stdoutScrollArea.value.setScrollPercentage("vertical", 120);
  }
);
</script>
