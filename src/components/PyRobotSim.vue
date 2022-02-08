<template>
  <q-splitter v-model="splitterLocation" disable>
    <template v-slot:before>
      <v-ace-editor
        v-model:value="code"
        @init="editorInit"
        lang="python3"
        style="height: 600px; font-size: 1.2 em"
      />
    </template>

    <template v-slot:after>
      <div class="q-pa-md">
        <div class="text-h4 q-mb-md">After</div>
        <div v-for="n in 20" :key="n" class="q-my-md">
          {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Quis praesentium cumque magnam odio iure quidem, quod illum numquam
          possimus obcaecati commodi minima assumenda consectetur culpa fuga
          nulla ullam. In, libero.
        </div>
      </div>
    </template>
  </q-splitter>
</template>

<script setup>
import { defineProps, ref } from "vue";

import { VAceEditor } from "vue3-ace-editor";

import ace from "ace-builds";

ace.config.set("basePath", "/ace/");

const editorInit = (editor) => {
  console.log(editor.config);
};

const props = defineProps({});
const splitterLocation = ref(50);
const code = ref("from math import pi, sin");
</script>
<style>
</style>