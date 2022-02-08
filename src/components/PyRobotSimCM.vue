<template>
  <q-splitter v-model="splitterLocation">
    <template v-slot:before>
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title>PyRobotSim</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <Codemirror
        v-model:value="code"
        :options="cmOptions"
        border
        placeholder="test placeholder"
        :height="400"
        @change="change"
      />

      <q-btn color="green" class="q-ma-sm">Exécuter</q-btn>
    </template>

    <template v-slot:after
      ><i-frame-robot-sim
        src="robotsim/index.html"
        :width="700"
        :height="700"
      ></i-frame-robot-sim>
    </template>
  </q-splitter>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";
import { loadScript } from "vue-plugin-load-script";
import Codemirror from "codemirror-editor-vue3";
// import RobotSim from "./RobotSim/RobotSim.vue";
import IFrameRobotSim from "./IFrameRobotSim.vue";

// language
import "codemirror/mode/python/python.js";

// theme
import "codemirror/theme/dracula.css";
import "codemirror/theme/rubyblue.css";
import "codemirror/theme/eclipse.css";

const cmOptions = {
  mode: "text/x-python", // Language mode
  theme: "eclipse", // Theme
  lineNumbers: true, // Show line number
  smartIndent: true, // Smart indent
  indentUnit: 4, // The smart indent unit is 2 spaces in length
  foldGutter: true, // Code folding
  styleActiveLine: true, // Display the style of the selected row
};
const props = defineProps({});
const splitterLocation = ref(50);
const code = ref("");

const pyodideLoaded = ref(false);
const errorMsg = ref(null);

const LOCAL_PYODIDE = false;

console.log("loadscript", loadScript);

const initializePyodide = async () => {
  try {
    if (LOCAL_PYODIDE) {
      window.languagePluginUrl = `${LOCAL_PYODIDE_SERVER_URL}`;
      await loadScript(`${LOCAL_PYODIDE_SERVER_URL}pyodide.js`);
    } else {
      window.languagePluginUrl =
        "https://cdn.jsdelivr.net/pyodide/v0.19.0/full/";
      const res = loadScript(
        "https://cdn.jsdelivr.net/pyodide/v0.19.0/full/pyodide.js"
      );
      res.then(() => {
        console.log("plugin loader", window.languagePluginLoader);
      });
      console.log("res", res);

      console.log("pyodide loading ...");
    }
    // wait for pyodide ready
    await window.languagePluginLoader;
    // load pandas lib
    // await window.pyodide.loadPackage(["pandas", "scikit-learn"]);
    pyodideLoaded.value = true;
  } catch (error) {
    console.log(error);
    errorMsg.value = error;
  }
};

const runTestCommand = () => {
  console.log(window.pyodide.runPython(`import sys\nprint(sys.version)`));
};

onMounted(async () => {
  console.log("loading Pyodide");
  await initializePyodide();
  console.log(window.pyodide);
  runTestCommand();
});
</script>

<style>
.CodeMirror {
  font-size: 1.5em;
}
</style>