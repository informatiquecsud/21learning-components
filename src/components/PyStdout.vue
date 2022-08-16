<template>
  <q-scroll-area
    ref="stdoutScrollArea"
    dark
    :visible="visible"
    :style="{ height: `${250}px` }"
  >
    <pre class="q-pb-lg" :style="{ maxWidth: '100%' }">{{
      stdout + "\n\n\n\n"
    }}</pre>
  </q-scroll-area>
</template>

<script setup>
import { defineProps, watch, ref, reactive, onMounted } from "vue";

const props = defineProps({
  stdout: String,
});

const visible = true;

const stdoutProp = ref(props.stdout);
const stdoutScrollArea = ref(null);

onMounted(() => {});

watch(
  () => props.stdout,
  (newValue, oldValue) => {
    console.log("stdout changed");
    stdoutScrollArea.value.setScrollPercentage("vertical", 1.0);
  }
);
</script>
