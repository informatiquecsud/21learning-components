<template>
  <q-scroll-area
    ref="stdoutScrollArea"
    dark
    :visible="visible"
    :style="{ height: `${100}%` }"
  >
    <pre class="q-pb-lg" :style="{ maxWidth: '100%' }">{{ stdout + "\n" }}</pre>
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
    // trick to make it work even if the whole stdout comes at once
    setTimeout(() => {
      stdoutScrollArea.value.setScrollPercentage("vertical", 1.0);
    }, 50);
  }
);
</script>
