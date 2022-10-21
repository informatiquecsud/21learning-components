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

// Solution : https://21learning-components.surge.sh/#/component/PyRobotSim?world=strips&robotType=LITE&hsplit=400&main=ZnJvbSBtYnJvYm90IGltcG9ydCAqCgppZiBtb2RlID09IFNJTToKICAgIHJvYm90LnNldFBvc2l0aW9uKDAsIDApCiAgICByb2JvdC5zZXRBbmdsZSg5MCkKCnN0YXRlID0gImJsYWNrIgpuYl9zdHJpcHMgPSAwCgpmb3J3YXJkKCkKd2hpbGUgVHJ1ZToKICAgIGRlbGF5KDQpCiAgICAKICAgIHZMID0gaXJMZWZ0LnJlYWRfZGlnaXRhbCgpCiAgICBkID0gZ2V0RGlzdGFuY2UoKQogICAgCiAgICAjIHByaW50KGYiR3JvdW5kIGNvbG9yOiB7dkx9XHQgRGlzdGFuY2U6IHtkfSIpCiAgICAKICAgIGlmIGQgPCA1OgogICAgICAgIHN0b3AoKQogICAgICAgIHByaW50KGYiU3RyaXAgY291bnQ6IHtuYl9zdHJpcHN9IikKICAgICAgICBicmVhawogICAgICAgIAogICAgICAgIAogICAgaWYgc3RhdGUgPT0gIndoaXRlIiBhbmQgdkwgPT0gMDoKICAgICAgICBuYl9zdHJpcHMgKz0gMQogICAgICAgIHByaW50KCJPbmUgbW9yZSBzdHJpcCIpCiAgICAgICAgCiAgICBpZiB2TCA9PSAxOgogICAgICAgIHN0YXRlID0gIndoaXRlIgogICAgZWxzZToKICAgICAgICBzdGF0ZSA9ICJibGFjayIKICAgICAgICAKICAgICAgICAKICAgICAgICA=&vsplit=50&level=2
