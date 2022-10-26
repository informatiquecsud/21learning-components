async function mapLoad(scene) {}

const createAntTrack = (scene, opts) => {
  // maps the opts object to a corresponding interval object
  const intervals = mapObject(opts, randomInterval);

  let x = 100,
    y = 0,
    totalAngle = 0;

  const nbParts = randintFromInterval(intervals.nbParts);
  for (let i = 0; i < nbParts; i++) {
    const { length, angle, spacing, width, side } = mapObject(
      intervals,
      randintFromInterval
    );

    // draw a random rectMark with correct width, length and angle
    totalAngle += angle * Math.pow(-1, side);
    const cx = x + 0.5 * length * Math.cos(radians(totalAngle));
    const cy = y + 0.5 * length * Math.sin(radians(totalAngle));
    sim.markRect(cx, cy, length, width, totalAngle);

    // leave a gap from this mark to the next
    x = x + (length + spacing) * Math.cos(radians(totalAngle));
    y = y + (length + spacing) * Math.sin(radians(totalAngle));
  }

  // put a detection zone
  sim.zoneRect(
    x,
    y,
    200,
    200,
    totalAngle,
    maxRuns(1, () => alert("Bingo !!!")),
    0xff0000,
    0.5
  );
};

async function mapCreate(scene, queryParams) {
  let level = parseInt(queryParams.get("level")) || 0;

  const levelConfigs = {
    0: {
      nbParts: 6,
      width: 40,
      length: [120, 160],
      spacing: 140,
      side: 0,
      angle: [20, 40],
    },
    1: {
      nbParts: 8,
      width: 40,
      length: [120, 160],
      spacing: 140,
      side: 1,
      angle: [20, 40],
    },
    2: {
      nbParts: 10,
      width: 30,
      length: [80, 160],
      spacing: [120, 160],
      side: [0, 1],
      angle: [10, 60],
    },
  };

  let x = createAntTrack(scene, levelConfigs[level]);
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

// Solution : https://21learning-components.surge.sh/#/component/PyRobotSim?world=ant&level=2&zoom=-2&main=ZnJvbSBtYnJvYm90IGltcG9ydCAqCgpkZWYga2VlcF9vbl90cmFjayh2TCwgdlIpOgogICAgaWYgdkwgPT0gMCBhbmQgdlIgPT0gMDoKICAgICAgICBmb3J3YXJkKCkKICAgIGVsaWYgdkwgPT0gMCBhbmQgdlIgPT0gMToKICAgICAgICBsZWZ0QXJjKDAuMikKICAgIGVsaWYgdkwgPT0gMSBhbmQgdlIgPT0gMDoKICAgICAgICByaWdodEFyYygwLjIpCiAgICAgICAgCnN0YXRlID0gImluaXQiCndoaWxlIFRydWU6CiAgICAjIDAgPT4gbm9pciAvIDEgPT4gYmxhbmMKICAgIHZMID0gaXJMZWZ0LnJlYWRfZGlnaXRhbCgpCiAgICB2UiA9IGlyUmlnaHQucmVhZF9kaWdpdGFsKCkKICAgIAogICAgcHJpbnQodkwsIHZSLCBzdGF0ZSkKCiAgICBpZiB2TCA9PSAxIGFuZCB2UiA9PSAxOgogICAgICAgIGlmIHN0YXRlID09ICJpbml0IjoKICAgICAgICAgICAgZm9yd2FyZCgpCiAgICAgICAgZWxpZiBzdGF0ZSA9PSAiZm9sbG93aW5nIjoKICAgICAgICAgICAgc3RhdGUgPSAianVzdF9sb3N0X3RyYWNrIgogICAgICAgIGVsaWYgc3RhdGUgPT0gImp1c3RfbG9zdF90cmFjayI6CiAgICAgICAgICAgIGxlZnQoKQogICAgICAgICAgICBkZWxheSgyMDApCiAgICAgICAgICAgIHN0YXRlID0gInNlYXJjaGluZyIKICAgICAgICBlbGlmIHN0YXRlID09ICJzZWFyY2hpbmciOgogICAgICAgICAgICByaWdodEFyYygwLjIyKQogICAgZWxzZToKICAgICAgICBzdGF0ZSA9ICJmb2xsb3dpbmciCiAgICAgICAga2VlcF9vbl90cmFjayh2TCwgdlIpCgogICAgZGVsYXkoMjAp&vsplit=50&hsplit=600
