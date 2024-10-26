<template>
  <q-splitter v-model="vSplitterLocation" :limits="[0, 100]">
    <template v-slot:before>
      <q-header elevated>
        <q-toolbar>
          <q-btn color="green" class="q-ma-sm" @click="runCode">Simulate<q-tooltip>
              Run the code on the simulator
            </q-tooltip></q-btn>
          <q-btn color="orange" class="q-ma-sm" @click="flashCode">Flash<q-tooltip>
              Flash the code to the robot (work in progress)
            </q-tooltip></q-btn>
          <q-btn color="red" class="q-ma-sm" @click="resetWorld">stop & reset<q-tooltip>
              Reloads the simulator entirely to stop the program and reset the world in its initial state
            </q-tooltip></q-btn>
          <q-btn v-if="false" color="white" text-color="black" class="q-ma-sm" @click="asyncifyPyCode">Asyncify</q-btn>
          <q-btn color="white" text-color="black" class="q-ma-sm" @click="shareAsURL">Share<q-tooltip>
              Copy a shareable link to the virtual world into clipboard. This is
              usefull to embed the virtual world in any webpage using an iframe.
            </q-tooltip></q-btn>
          <q-btn v-if="true" color="white" text-color="black" class="q-ma-sm" @click="loadLastCode">Restore</q-btn>
          <q-toolbar-title>PyRobotSim</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <div style="height: 100%">
        <q-tabs v-model="activeFile" dense no-caps class="text-grey" active-color="primary" indicator-color="primary"
          align="justify">
          <q-tab v-for="(file, index) in editorFiles.filter((f) => f.show)" :name="file.path" :key="index"
            :label="file.path" />
          <q-btn class="q-ma-sm" color="white" icon="add_circle_outline" label="" text-color="black"
            @click="createFile" />
        </q-tabs>

        <q-separator />
        <pre v-if="false">{{ editorFiles }}</pre>
        <q-item v-if="activeFile === 'main.py'">
          <q-item-section avatar>History</q-item-section>
          <q-item-section>
            <q-slider class="q-pl-md q-pr-md" v-model="editorFiles[activeFileIndex].activeRevision" :min="0"
              :max="editorFiles[activeFileIndex].revisions.length - 1" :step="1" label snap markers color="light-green"
              @update:model-value="(value) => {
                editorFiles[activeFileIndex].activeRevision = value;
                const { revisions, activeRevision } =
                  editorFiles[activeFileIndex];
                editorFiles[activeFileIndex].data = revisions[activeRevision];
              }
                " />
          </q-item-section>
        </q-item>
        <q-tab-panels v-model="activeFile" animated>
          <Codemirror v-for="(file, index) in editorFiles" :key="index" :name="file.path" v-model:value="file.data"
            :options="cmOptions" border placeholder="test placeholder" :style="{
              height:
                activeFile === 'main.py'
                  ? 'calc(100vh - 159px)'
                  : 'calc(100vh - 111px)',
            }" @change="onEditorChange" />
        </q-tab-panels>
      </div>
    </template>

    <template v-slot:after>
      <q-splitter horizontal unit="px" v-model="hSplitterLocation">
        <template v-slot:before>
          <i-frame-robot-sim :src="`robotsim1/index.html?${robotsimQueryParams}`" width="100%"
            :height="robotsimIFrameHeight"></i-frame-robot-sim>
        </template>

        <template v-slot:after>
          <div>
            <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary"
              align="justify">
              <q-tab name="stdout" label="Stdout" />
              <q-tab name="stderr" label="Stderr" />
              <q-tab name="repl" label="REPL" />
              <q-tab name="asyncifiedCode" label="Async" />
            </q-tabs>

            <q-separator />

            <q-tab-panels :style="{
              minHeight: '100px',
              height: `calc(100vh - ${hSplitterLocation}px - 97px)`,
              border: 'solid 0px red',
            }" v-model="tab" animated>
              <q-tab-panel name="stdout" :style="{
                minHeight: '100px',
                height: `calc(100vh - ${hSplitterLocation}px - 97px)`,
                border: 'solid 0px red',
              }">
                <PyStdout :stdout="stdout"></PyStdout>
              </q-tab-panel>

              <q-tab-panel name="stderr">
                <pre class="stderr-msg">{{ stderr }}</pre>
                <q-btn v-if="stderr" color="primary" @click="tab = 'asyncifiedCode'">Highlight in the async code
                  (WIP)</q-btn>
              </q-tab-panel>
              <q-tab-panel name="repl">Not implemented yet ...</q-tab-panel>
              <q-tab-panel name="asyncifiedCode" :style="{ padding: '1px' }">
                <Codemirror v-model:value="asyncCode" :options="{ ...cmOptions, readOnly: true }" border
                  height="calc(100%)" @change="change" />
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

// keymap
import "codemirror/keymap/sublime.js"

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
    revisions: [""],
    activeRevision: 0,
    show: true,
  },
]);
const activeFile = ref("main.py");
const asyncCode = ref("");

const activeFileIndex = computed(() => {
  return editorFiles.value.findIndex((item) => item.path === activeFile.value);
});

const cmOptions = {
  mode: "text/x-python", // Language mode
  theme: "eclipse", // Theme
  lineNumbers: true, // Show line number
  smartIndent: true, // Smart indent
  indentUnit: 4, // The smart indent unit is 2 spaces in length
  indentWithTabs: false,
  foldGutter: true, // Code folding
  styleActiveLine: true, // Display the style of the selected row
  keyMap: "sublime",
  extraKeys: {
    'Tab': 'indentMore'
  }
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

const writeToStderr = (error) => {
  const lastFileIndex = error.message.lastIndexOf('File "');
  const studentMessage = error.message.slice(lastFileIndex);

  stderr.value = studentMessage;
};

/*
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
*/

const runTestCommand = () => {
  console.log(pyodide.runPython(`import sys\nprint(sys.version)`));
};

const showError = (msg) => {
  stderr.value += "------------------------------------------------";
  stderr.value += msg;
};

const betterAsyncify = (code) => {
  pyodide.runPythonAsync(`async_pyodide.__js_run_async(${code.value})`).then(
    (value) => { },
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

const resetWorld = async () => {

  addRevision();

  location.reload();
};


const flashCode = async () => {
  $q.dialog({
    title: "Flash",
    message: `This feature is still unimplemented. Use <a target="_blank" href="https://dev.webtigerpython.21-learning.com/">WebTigerPython</a> instead to run the code on the real robot!`,
    html: true,
    cancel: false,
    persistent: false,
    color: "primary",
  })
    .onOk((data) => {

    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

const addRevision = async () => {
  let { revisions, activeRevision } = editorFiles.value[0];

  if (revisions[revisions.length - 1] !== editorFiles.value[0].data) {
    revisions.push(editorFiles.value[0].data);
    editorFiles.value[0].activeRevision = revisions.length - 1;
  }

  localStorage.setItem("editorFiles", JSON.stringify(editorFiles.value));

  writeFilesToFS(editorFiles.value, pyodide);
  console.log("files", editorFiles.value);

};

const runCode = async () => {
  stdout.value = "";
  stderr.value = "";

  addRevision();

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

    const res = await pyodide.runPythonAsync(codeToRun);
    //console.log("res", codeToRun);
  } catch (error) {
    console.log("error", error);
    writeToStderr(error);
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

function base64ToBytes(base64) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function bytesToBase64(bytes) {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  return btoa(binString);
}

const loadLastCode = () => {
  const data = localStorage.getItem("editorFiles");
  if (data === undefined) {
    return;
  }
  editorFiles.value = JSON.parse(data);
};

const shareAsURL = () => {
  const queryParams = {
    ...route.query,
    main: btoa(editorFiles.value[0].data),
    vsplit: parseInt(vSplitterLocation.value),
    hsplit: parseInt(hSplitterLocation.value),
  };
  router.replace({ query: queryParams });
  const url = window.location.href;

  const inIframe = () => window.self !== window.top;
  if (inIframe()) {
    $q.dialog({
      title: "Share code and virtual world",
      message: `Shareable URL:`,
      prompt: {
        model: `${url}`,
        type: "text", // optional
      },
      cancel: false,
      persistent: false,
    })
      .onOk((data) => {
      })
      .onCancel(() => {
        // console.log('>>>> Cancel')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });

  }
  navigator.clipboard.writeText(url);

};

const robotsimIFrameHeight = computed(() => {
  return hSplitterLocation.value - 34 || 600;
});

const robotsimQueryParams = computed(() => {
  const simHeight =
    parseInt(route.query.simHeight) || parseInt(route.query.hsplit) - 67 || 500;
  console.log("simHeight", simHeight);
  const queryParams = {
    ...route.query,
    world: route.query.world || "emptyWorld",
    simHeight: simHeight,
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

    editorFiles.value[0].data = new TextDecoder().decode(base64ToBytes(route.query.main));
    editorFiles.value[0].revisions[0] = editorFiles.value[0].data;
  }

  if (route.query.vsplit !== undefined) {
    vSplitterLocation.value = Number(route.query.vsplit);
  }

  if (route.query.hsplit !== undefined) {
    hSplitterLocation.value = Number(route.query.hsplit);
  }

  const editorFilesString = route.query.files || "";
  const editorFilesToShow = editorFilesString.split(",");

  const files = [
    { path: "mbrobot.py", show: false },
    { path: "maqueen_plus.py", show: false },
    { path: "oled_display.py", show: false },
    { path: "robotsim.py", show: false },
    { path: "mbrobot2.py", show: false },
    { path: "delay.py", show: false },
    { path: "microbit.py", show: false },
    { path: "mbrobotmot.py", show: false },
    { path: "mbalarm.py", show: false },
    { path: "music.py", show: false },
    { path: "worlds.py", show: false },

    // virtual worlds
    { path: "simple_trail.py", show: false },
  ];

  files.forEach((file) => {
    if (editorFilesToShow.indexOf(file.path) !== -1) {
      file.show = true;
    }
  });

  const githubUrl = `https://raw.githubusercontent.com/informatiquecsud/mbrobot/main/maqueen-lite/pyodide-robotsim/`;
  const localUrl = `/mbrobot/`;
  await loadModules(localUrl, files);
});
</script>

<style>
.CodeMirror {
  font-size: 1.5rem !important;
}

.stderr-msg {
  color: rgb(175, 38, 38);
  font-weight: bold;
  font-size: 1.2rem;
}

.CodeMirror-code {
  font-size: 1rem;
}
</style>
