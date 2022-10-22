async function mapLoad(scene) {}

const createStripes = (scene, { width, n, height, gap }) => {
  const nbStripes = getRandomInt(n[0], n[1]);

  let x = getRandomInt(100, 200);
  let y = 0;

  for (let i = 0; i < nbStripes; i++) {
    let stripeWidth = getRandomInt(width[0], width[1]);
    let mark = sim.markRect(x, y, stripeWidth, height, 0);

    x += getRandomInt(gap[0], gap[1]) + stripeWidth;
  }

  return x;
};

async function mapCreate(scene, queryParams) {
  let level = parseInt(queryParams.get("level")) || 0;
  const customLevelConfig = {};
  // Example: level=3&stripWidth=[20,20]&nbStrips=[5,10]&stripGap=[50,50]&stripHeight=800
  if (level === 3) {
    try {
      customLevelConfig.width = JSON.parse(queryParams.get("stripWidth"));
      customLevelConfig.n = JSON.parse(queryParams.get("nbStrips"));
      customLevelConfig.gap = JSON.parse(queryParams.get("stripGap"));
      customLevelConfig.height = parseInt(queryParams.get("stripHeight"));

      const { width, n, gap, height } = customLevelConfig;
      if (!(width && n && gap && height)) {
        throw new Error("Error while parsing strips level parameters");
      }
    } catch (e) {
      console.log(`${e}. Loading level 0 !`);
      level = 0;
    }
  }

  const levelConfigs = {
    0: {
      width: [20, 20],
      n: [5, 20],
      height: 500,
      gap: [40, 40],
    },
    1: {
      width: [10, 30],
      n: [5, 20],
      height: 500,
      gap: [10, 70],
    },
    2: {
      width: [4, 20],
      n: [12, 35],
      height: 500,
      gap: [5, 40],
    },
    3: customLevelConfig,
  };
  console.log("custom config", customLevelConfig);
  let x = createStripes(scene, levelConfigs[level]);

  x += getRandomInt(100, 300);
  sim.wallRect(x, 0, 40, 400, 0);
}

function sceneCreated({ overlayScene, robots }) {
  const { camera } = overlayScene;
  overlayScene.freeMode();
  camera.scrollX += 600;
  camera.scrollY += 0;
  camera.zoom = 0.4;
  const robot = robots[0];
  robot.setPosition(0, 0);
  robot.setAngle(90);

  console.log("robot", robot);
}

// Solution : https://21learning-components.surge.sh/#/component/PyRobotSim?world=strips&robotType=LITE&hsplit=400&main=ZnJvbSBtYnJvYm90IGltcG9ydCAqCgpkZWYgYmxpbmsobik6CiAgICBmb3IgXyBpbiByYW5nZShuKToKICAgICAgICBzZXRMRUQoMSkKICAgICAgICBkZWxheSg1MDApCiAgICAgICAgc2V0TEVEKDApCiAgICAgICAgZGVsYXkoNTAwKQoKaWYgbW9kZSA9PSBTSU06CiAgICByb2JvdC5zZXRQb3NpdGlvbigwLCAwKQogICAgcm9ib3Quc2V0QW5nbGUoOTApCgpzdGF0ZSA9ICJibGFjayIKbmJfc3RyaXBzID0gMAoKZm9yd2FyZCgpCndoaWxlIFRydWU6CiAgICBkZWxheSg0KQogICAgCiAgICB2TCA9IGlyTGVmdC5yZWFkX2RpZ2l0YWwoKQogICAgZCA9IGdldERpc3RhbmNlKCkKICAgIAogICAgIyBwcmludChmIkdyb3VuZCBjb2xvcjoge3ZMfVx0IERpc3RhbmNlOiB7ZH0iKQogICAgCiAgICBpZiBkIDwgNToKICAgICAgICBzdG9wKCkKICAgICAgICBwcmludChmIlN0cmlwIGNvdW50OiB7bmJfc3RyaXBzfSIpCiAgICAgICAgYmxpbmsobmJfc3RyaXBzKQogICAgICAgIGJyZWFrCiAgICAgICAgCiAgICAgICAgCiAgICBpZiBzdGF0ZSA9PSAid2hpdGUiIGFuZCB2TCA9PSAwOgogICAgICAgIG5iX3N0cmlwcyArPSAxCiAgICAgICAgcHJpbnQoIk9uZSBtb3JlIHN0cmlwIikKICAgICAgICAKICAgIGlmIHZMID09IDE6CiAgICAgICAgc3RhdGUgPSAid2hpdGUiCiAgICBlbHNlOgogICAgICAgIHN0YXRlID0gImJsYWNrIgogICAgICAgIAogICAgICAgIAogICAgICAgIA==&vsplit=50&level=2
