<template>
  <q-splitter v-model="splitterLocation">
    <template v-slot:before>
      <q-header elevated>
        <q-toolbar>
          <q-btn color="green" class="q-ma-sm" @click="runCode"
            >Save & Run</q-btn
          >
          <q-btn
            color="white"
            text-color="black"
            class="q-ma-sm"
            @click="loadLastCode"
            >Reload</q-btn
          >
          <q-toolbar-title>PyRobotSim</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-card>
        <q-tabs
          v-model="activeFile"
          dense
          no-caps
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab
            v-for="(file, index) in editorFiles"
            :name="index"
            :key="index"
            :label="file.path"
          />
          <q-btn
            class="q-ma-sm"
            color="white"
            icon="add"
            label="New ..."
            text-color="black"
            @click="createFile"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeFile" animated>
          <Codemirror
            v-for="(file, index) in editorFiles"
            :name="index"
            :key="index"
            v-model:value="editorFiles[index].data"
            :options="cmOptions"
            border
            placeholder="test placeholder"
            :height="400"
            @change="change"
          />
        </q-tab-panels>
      </q-card>

      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="stdout" label="Stdout" />
          <q-tab name="stderr" label="Stderr" />
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
import { defineProps, ref, reactive, onMounted } from "vue";
import { loadScript } from "vue-plugin-load-script";
import { useQuasar } from "quasar";
import Codemirror from "codemirror-editor-vue3";
// import RobotSim from "./RobotSim/RobotSim.vue";
import IFrameRobotSim from "./IFrameRobotSim.vue";

const $q = useQuasar();

// language
import "codemirror/mode/python/python.js";

// theme
import "codemirror/theme/dracula.css";
import "codemirror/theme/rubyblue.css";
import "codemirror/theme/eclipse.css";

function createFile() {
  $q.dialog({
    title: "New file name",
    message: "What name should I give to the new file?",
    prompt: {
      model: "",
      type: "text", // optional
    },
    cancel: true,
    persistent: true,
  })
    .onOk((data) => {
      editorFiles.value.push({
        path: data,
        data: "",
      });
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
}

const editorFiles = ref([
  {
    path: "main.py",
    data: "",
  },
]);
const activeFile = ref(0);

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
const stderr = ref("");
const stderr_counter = ref(0);

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
      window.pyodide = pyodide;
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

const showError = (msg) => {
  stderr.value += "------------------------------------------------";
  stderr.value += msg;
};

const asyncifyPyCode = (code) => {
  // TODO: this is really hacky ... should be improved, may be by working with
  // the ast in pyodide
  return code
    .replaceAll(" def ", "async def ")
    .replaceAll("\ndef ", "\nasync def ")
    .replaceAll("delay(", "await delay(");
};

const writeFilesToFS = (files, pyodide) => {
  files.forEach((f) => {
    pyodide.FS.writeFile(f.path, f.data);
  });
};

const runCode = () => {
  localStorage.setItem("editorFiles", JSON.stringify(editorFiles.value));

  writeFilesToFS(editorFiles.value, pyodide);

  const codeToRun = asyncifyPyCode(editorFiles.value[activeFile.value].data);

  console.log("code", codeToRun);
  // pyodide.runPythonAsync(`async_pyodide.__js_run_async(${code.value})`).then(
  //   (value) => {},
  //   (reason) => {
  //     showError(reason);
  //   }
  // );
  pyodide.runPythonAsync(codeToRun);
};

const loadLastCode = () => {
  const data = localStorage.getItem("editorFiles");
  if (data === undefined) {
    return;
  }
  editorFiles.value = JSON.parse(data);
};

const loadModules = async (prefix, filepaths) => {
  const headers = new Headers();
  headers.append("pragma", "no-cache");
  headers.append("cache-control", "no-cache");
  filepaths.forEach((p) => {
    const uri = prefix + p;
    fetch(uri, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
    })
      .then((res) => res.text())
      .then((text) => {
        editorFiles.value.push({
          path: p,
          data: text,
        });
      })
      .catch((error) => {
        alert(`Unable to download module from ${uri}`);
      });
  });
};

onMounted(async () => {
  console.log("loading Pyodide");
  await initializePyodide();
  stdout.value = "";

  const githubUrl = `https://raw.githubusercontent.com/informatiquecsud/mbrobot/main/maqueen-plus/pyodide-robotsim/`;
  await loadModules(githubUrl, ["mbrobotplus.py", "delay.py", "microbit.py"]);
});
</script>

<style>
.CodeMirror {
  font-size: 1.5em;
}
</style>
