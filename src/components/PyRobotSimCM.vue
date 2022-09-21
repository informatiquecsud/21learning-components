<template>
  <q-splitter v-model="vSplitterLocation" :limits="[0, 100]">
    <template v-slot:before>
      <q-header elevated>
        <q-toolbar>
          <q-btn color="green" class="q-ma-sm" @click="runCode">Run</q-btn>
          <q-btn
            v-if="false"
            color="white"
            text-color="black"
            class="q-ma-sm"
            @click="loadLastCode"
            >Reload</q-btn
          >
          <q-btn
            v-if="false"
            color="white"
            text-color="black"
            class="q-ma-sm"
            @click="asyncifyPyCode"
            >Asyncify</q-btn
          >
          <q-btn
            color="white"
            text-color="black"
            class="q-ma-sm"
            @click="shareAsURL"
            >Share</q-btn
          >
          <q-toolbar-title>PyRobotSim</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <div style="height: 100%">
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
            v-for="(file, index) in editorFiles.filter((f) => f.show)"
            :name="file.path"
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
        <pre v-if="false">{{ editorFiles }}</pre>
        <q-tab-panels v-model="activeFile" animated>
          <Codemirror
            v-for="(file, index) in editorFiles"
            :key="index"
            :name="file.path"
            v-model:value="file.data"
            :options="cmOptions"
            border
            placeholder="test placeholder"
            :style="{
              height: '800px',
            }"
            @change="onEditorChange"
          />
        </q-tab-panels>
      </div>
    </template>

    <template v-slot:after>
      <q-splitter horizontal unit="px" v-model="hSplitterLocation">
        <template v-slot:before>
          <i-frame-robot-sim
            :src="`robotsim1/index.html?${robotsimQueryParams}`"
            :width="700"
            :height="hSplitterLocation"
          ></i-frame-robot-sim>
        </template>

        <template v-slot:after>
          <div>
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
              <q-tab name="asyncifiedCode" label="Async" />
            </q-tabs>

            <q-separator />

            <q-tab-panels style="max-height: 200px" v-model="tab" animated>
              <q-tab-panel name="stdout">
                <PyStdout :stdout="stdout"></PyStdout>
              </q-tab-panel>

              <q-tab-panel name="stderr">
                <pre class="stderr-msg">{{ stderr }}</pre>
                <q-btn
                  v-if="stderr"
                  color="primary"
                  @click="tab = 'asyncifiedCode'"
                  >Mettre en évidence dans le code</q-btn
                >
              </q-tab-panel>
              <q-tab-panel name="repl"> REPL </q-tab-panel>
              <q-tab-panel name="asyncifiedCode">
                <Codemirror
                  v-model:value="asyncCode"
                  :options="{ ...cmOptions, readOnly: true }"
                  border
                  height="180px"
                  @change="change"
                />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </template>
      </q-splitter>
    </template>
  </q-splitter>
</template>

<script setup>
import { defineProps, ref, reactive, onMounted, computed } from "vue";
import { routerKey, useRoute, useRouter } from "vue-router";
import { loadScript } from "vue-plugin-load-script";
import { useQuasar } from "quasar";
import Codemirror from "codemirror-editor-vue3";
// import RobotSim from "./RobotSim/RobotSim.vue";
import IFrameRobotSim from "./IFrameRobotSim.vue";

import PyStdout from "./PyStdout.vue";

import { asyncifyPyCode } from "/public/pyodide/asyncify.js";

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

const route = useRoute();
const router = useRouter();

const editorFiles = ref([
  {
    path: "main.py",
    data: "",
    show: true,
  },
]);
const activeFile = ref("main.py");
const asyncCode = ref("");

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
const vSplitterLocation = ref(50);
const hSplitterLocation = ref(600);
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
const PYODIDE_VERSION = "v0.20.0";

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
        stdout: writeToStdout,
        stderr: (text) => {
          const lines = text.split("\n");
          const relevantMsg = lines[lines.length - 1];
          stderr.value = relevantMsg + "\n";
        },
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

const writeToStdout = (text) => {
  console.log(text);
  stdout.value += text + "\n";
  stdout_counter.value += 1;
  console.log("stdout", stdout.value);
};

const writeToStderr = (text) => {
  const lines = text.split("\n");
  const relevantMsg = lines[lines.length - 2];
  let errLineNoAsync = undefined;
  try {
    const whereLine = lines[lines.length - 3];
    const match = whereLine.match(/line (\d+)/);
    errLineNoAsync = match[1];
  } catch (e) {
    console.log(`Error: ${e}`);
    errLineNoAsync = null;
  }

  stderr.value = `Line ${errLineNoAsync} of async code: ${relevantMsg + "\n"}`;
  console.log("stderr", stderr.value);
  console.log("lines", lines);
};

const runTestCommand = () => {
  console.log(pyodide.runPython(`import sys\nprint(sys.version)`));
};

const showError = (msg) => {
  stderr.value += "------------------------------------------------";
  stderr.value += msg;
};

const betterAsyncify = (code) => {
  pyodide.runPythonAsync(`async_pyodide.__js_run_async(${code.value})`).then(
    (value) => {},
    (reason) => {
      writeToStderr(reason);
    }
  );
};

const writeFilesToFS = (files, pyodide) => {
  files.forEach((f) => {
    pyodide.FS.writeFile(f.path, f.data);
  });
};

const runCode = async () => {
  stdout.value = "";
  stderr.value = "";

  localStorage.setItem("editorFiles", JSON.stringify(editorFiles.value));

  writeFilesToFS(editorFiles.value, pyodide);
  console.log("files", editorFiles.value);

  const code = getActiveFile(activeFile.value).data;

  // const codeToRun = asyncifyPyCode(editorFiles.value[activeFile.value].data);

  // asyncifyPyCode(code, pyodide).then(
  //   (value) => {
  //     const codeToRun = value;
  //     asyncCode.value = codeToRun;
  //     console.log("code to run", codeToRun);
  //     pyodide.runPythonAsync(codeToRun);
  //   },
  //   (reason) => {
  //     writeToStderr(`Error while converting code to async code: ${reason}`);
  //   }
  // );
  let codeToRun;
  try {
    codeToRun = await asyncifyPyCode(code, pyodide);
    asyncCode.value = codeToRun;
    //console.log("res", codeToRun);
  } catch (error) {
    writeToStderr(`Error while converting code to async code: \n${error}`);
    tab.value = "stderr";
  }

  try {
    const res = await pyodide.runPythonAsync(codeToRun);
  } catch (error) {
    writeToStderr(`Error while running code on virtual robot.\n${error}`);
    tab.value = "stderr";
  }

  // .then(
  //   (value) => {
  //     const codeToRun = value;
  //     asyncCode.value = codeToRun;
  //     console.log("code to run", codeToRun);
  //     pyodide.runPythonAsync(codeToRun);
  //   },
  //   (reason) => {
  //     writeToStderr(`Error while converting code to async code: ${reason}`);
  //   }
  // );
};

const loadLastCode = () => {
  const data = localStorage.getItem("editorFiles");
  if (data === undefined) {
    return;
  }
  editorFiles.value = JSON.parse(data);
};

const shareAsURL = () => {
  const queryParams = { ...route.query, main: btoa(editorFiles.value[0].data) };
  router.replace({ query: queryParams });
};

const robotsimQueryParams = computed(() => {
  const queryParams = {
    world: route.query.world || "emptyWorld",
  };

  return Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
});

const loadModules = async (prefix, files) => {
  const headers = new Headers();
  headers.append("pragma", "no-cache");
  headers.append("cache-control", "no-cache");
  files.forEach((f) => {
    const uri = prefix + f.path;
    fetch(uri, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
    })
      .then((res) => res.text())
      .then((text) => {
        editorFiles.value.push({
          path: f.path,
          data: text,
          show: f.show,
        });
      })
      .catch((error) => {
        alert(`Unable to download module from ${uri}`);
      });
  });
};

const onEditorChange = (code) => {
  // bad practice to make the code available from outside if editor embedded in
  // iframe
  window.mainCode = code;
};

const getActiveFile = (path) =>
  editorFiles.value.find((file) => file.path === activeFile.value);

onMounted(async () => {
  console.log("loading Pyodide");
  await initializePyodide();
  stdout.value = "";

  if (route.query.main !== undefined) {
    editorFiles.value[0].data = atob(route.query.main);
  }

  if (route.query.vsplit !== undefined) {
    vSplitterLocation.value = Number(route.query.vsplit);
  }

  if (route.query.hsplit !== undefined) {
    hSplitterLocation.value = Number(route.query.hsplit);
  }

  const githubUrl = `https://raw.githubusercontent.com/informatiquecsud/mbrobot/main/maqueen-lite/pyodide-robotsim/`;
  const localUrl = `/mbrobot/`;
  await loadModules(localUrl, [
    { path: "mbrobot.py", show: true },
    { path: "mbrobot2.py", show: false },
    { path: "delay.py", show: false },
    { path: "microbit.py", show: false },
    { path: "mbrobotmot.py", show: false },
    { path: "mbalarm.py", show: false },
    { path: "music.py", show: false },
    { path: "worlds.py", show: false },

    // virtual worlds
    { path: "simple_trail.py", show: false },
  ]);
});
</script>

<style scoped>
.CodeMirror {
  font-size: 1.5em;
}

.stderr-msg {
  color: red;
  font-weight: bold;
  font-size: 1.2em;
}

.CodeMirror-code {
  font-size: 1.4em;
}
</style>
