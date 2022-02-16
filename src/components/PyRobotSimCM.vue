<template>
  <q-splitter v-model="splitterLocation">
    <template v-slot:before>
      <q-header elevated>
        <q-toolbar>
          <q-btn color="green" class="q-ma-sm" @click="runCode">Exécuter</q-btn>
          <q-btn
            color="white"
            text-color="black"
            class="q-ma-sm"
            @click="loadLastCode"
            >Dernier code</q-btn
          >
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
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="stdout" label="Sortie" />
          <q-tab name="stderr" label="Erreurs" />
          <q-tab name="repl" label="REPL" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="stdout">
            <pre :key="stdout_counter">{{ stdout }}</pre>
          </q-tab-panel>

          <q-tab-panel name="stderr">
            <pre>{{ stderr }}</pre>
          </q-tab-panel>
          <q-tab-panel name="repl"> REPL </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </template>

    <template v-slot:after
      ><i-frame-robot-sim
        src="robotsim1/TM_code/index.html"
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
const tab = ref("stdout");
const stdout = ref("");
const stdout_counter = ref(0);

const pyodideLoaded = ref(false);
const errorMsg = ref(null);

let pyodide = null;

const LOCAL_PYODIDE = false;
const PYODIDE_VERSION = "v0.19.0";

const initializePyodide = async () => {
  try {
    if (LOCAL_PYODIDE) {
      window.languagePluginUrl = `${LOCAL_PYODIDE_SERVER_URL}`;
      await loadScript(`${LOCAL_PYODIDE_SERVER_URL}pyodide.js`);
    } else {
      window.languagePluginUrl = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;
      await loadScript(
        `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/pyodide.js`
      );

      // Je ne sais pas encore comment gérer le stdin => le message se met dans le stdout ...
      // bonnes infos sur https://github.com/pyodide/pyodide/issues/550#issuecomment-903182645

      // autres ressources intéressantes pour gérer les entrées / sorties et
      // pour tester du code Python (faire un test runner)
      // https://github.com/magurofly/atcoder-easy-test/tree/main/v2/src
      // Sujet : japanese coding contest site (code runners : Brython / Pyodide)

      pyodide = await loadPyodide({
        indexURL: languagePluginUrl,
        stdin: window.prompt,
        stdout: (text) => {
          console.log(text);
          stdout.value += text + "\n";
          stdout_counter.value += 1;
          console.log("stdout", stdout.value);
        },
        stderr: (text) => (stderr.value += text + "\n"),
      });
      console.log("pyodide loading ...", pyodide);
    }
    // load pandas lib
    // await pyodide.loadPackage(["pandas", "scikit-learn"]);
    pyodideLoaded.value = true;
  } catch (error) {
    console.log(error);
    errorMsg.value = error;
  }
};

const runTestCommand = () => {
  console.log(pyodide.runPython(`import sys\nprint(sys.version)`));
};

const runCode = () => {
  localStorage.setItem("lastCodeRun", code.value);
  pyodide.runPython(code.value);
};

const loadLastCode = () => {
  const contents = localStorage.getItem("lastCodeRun");
  if (contents === undefined) {
    contents = "";
  }
  code.value = contents;
};

onMounted(async () => {
  console.log("loading Pyodide");
  await initializePyodide();
  stdout.value = "";
});
</script>

<style>
.CodeMirror {
  font-size: 1.5em;
}
</style>
