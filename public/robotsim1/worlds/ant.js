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
      angle: [10, 50],
    },
    3: {
      nbParts: 12,
      width: [20, 60],
      length: [80, 160],
      spacing: [40, 160],
      side: [0, 1],
      angle: [30, 60],
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

// Solution 1 : https://21learning-components.surge.sh/#/component/PyRobotSim?world=ant&level=2&zoom=-2&main=ZnJvbSBtYnJvYm90IGltcG9ydCAqCgpkZWYga2VlcF9vbl90cmFjayh2TCwgdlIpOgogICAgaWYgdkwgPT0gMCBhbmQgdlIgPT0gMDoKICAgICAgICBmb3J3YXJkKCkKICAgIGVsaWYgdkwgPT0gMCBhbmQgdlIgPT0gMToKICAgICAgICBsZWZ0QXJjKDAuMikKICAgIGVsaWYgdkwgPT0gMSBhbmQgdlIgPT0gMDoKICAgICAgICByaWdodEFyYygwLjIpCiAgICAgICAgCnN0YXRlID0gImluaXQiCndoaWxlIFRydWU6CiAgICAjIDAgPT4gbm9pciAvIDEgPT4gYmxhbmMKICAgIHZMID0gaXJMZWZ0LnJlYWRfZGlnaXRhbCgpCiAgICB2UiA9IGlyUmlnaHQucmVhZF9kaWdpdGFsKCkKICAgIAogICAgcHJpbnQodkwsIHZSLCBzdGF0ZSkKCiAgICBpZiB2TCA9PSAxIGFuZCB2UiA9PSAxOgogICAgICAgIGlmIHN0YXRlID09ICJpbml0IjoKICAgICAgICAgICAgZm9yd2FyZCgpCiAgICAgICAgZWxpZiBzdGF0ZSA9PSAiZm9sbG93aW5nIjoKICAgICAgICAgICAgc3RhdGUgPSAianVzdF9sb3N0X3RyYWNrIgogICAgICAgIGVsaWYgc3RhdGUgPT0gImp1c3RfbG9zdF90cmFjayI6CiAgICAgICAgICAgIGxlZnQoKQogICAgICAgICAgICBkZWxheSgzMDApCiAgICAgICAgICAgIHN0YXRlID0gInNlYXJjaGluZyIKICAgICAgICBlbGlmIHN0YXRlID09ICJzZWFyY2hpbmciOgogICAgICAgICAgICByaWdodEFyYygwLjIpCiAgICBlbHNlOgogICAgICAgIHN0YXRlID0gImZvbGxvd2luZyIKICAgICAgICBrZWVwX29uX3RyYWNrKHZMLCB2UikKCiAgICBkZWxheSgyMCk=&vsplit=50&hsplit=600
// Solution 2 (more strategies): https://21learning-components.surge.sh/#/component/PyRobotSim?world=ant&level=3&zoom=-2&main=ZnJvbSBtYnJvYm90IGltcG9ydCAqCgpkZWYga2VlcF9vbl90cmFjayh2TCwgdlIpOgogICAgaWYgKHZMLCB2UikgPT0gKDAsIDEpOgogICAgICAgIGxlZnRBcmMoMC4xKQogICAgZWxpZiAodkwsIHZSKSA9PSAoMSwgMCk6CiAgICAgICAgcmlnaHRBcmMoMC4xKQogICAgZWxpZiAodkwsIHZSKSA9PSAoMCwgMCk6CiAgICAgICAgZm9yd2FyZCgpCgpkZWYgc2VhcmNoX3doaWxlX3JlYWRpbmdfc2Vuc29ycyh0aW1lX3R1cm4sIHRpbWVfZm9yd2FyZCwgcGF1c2UpOgogICAgbGVmdCgpCiAgICBkZWxheSg0ICogdGltZV90dXJuKQogICAgCiAgICB0dXJucyA9IDAKICAgIAogICAgd2hpbGUgVHJ1ZToKICAgICAgICBpdGVyYXRpb25zID0gMAogICAgICAgIHN0YXRlID0gInNlYXJjaGluZ19mb3J3YXJkIgogICAgICAgIAogICAgICAgICMgdGhlIHZhbHVlIDEuNCBoYXMgdG8gYmUgYWRqdXN0ZWQgLi4uCiAgICAgICAgZm9yIF8gaW4gcmFuZ2UoaW50KHRpbWVfZm9yd2FyZCAvIHBhdXNlIC8gMS40KSk6CiAgICAgICAgICAgIHZMID0gaXJMZWZ0LnJlYWRfZGlnaXRhbCgpCiAgICAgICAgICAgIHZSID0gaXJSaWdodC5yZWFkX2RpZ2l0YWwoKQogICAgICAgICAgICAKICAgICAgICAgICAgZm9yd2FyZCgpCiAgICAgICAgICAgIAogICAgICAgICAgICBpZiAodkwsIHZSKSAhPSAoMSwgMSk6CiAgICAgICAgICAgICAgICByZXR1cm4gImZvdW5kIgogICAgICAgICAgICAKICAgICAgICAgICAgaXRlcmF0aW9ucyArPSAxICAKICAgICAgICAgICAgZGVsYXkocGF1c2UpCiAgICAgICAgICAgIAogICAgICAgIGJhY2t3YXJkKCkKICAgICAgICBkZWxheSh0aW1lX2ZvcndhcmQpCiAgICAgICAgCiAgICAgICAgcmlnaHQoKQogICAgICAgIGRlbGF5KHRpbWVfdHVybikKICAgICAgICAKCmRlZiBzdHJhdGVneTEodkwsIHZSKToKICAgIGdsb2JhbCBzdGF0ZQogICAgCiAgICBpZiBzdGF0ZSA9PSAiZm9sbG93aW5nIjoKICAgICAgICBzdGF0ZSA9ICJqdXN0X2xvc3RfdHJhY2siCiAgICBlbGlmIHN0YXRlID09ICJqdXN0X2xvc3RfdHJhY2siOgogICAgICAgIGZvcndhcmQoKQogICAgICAgIGRlbGF5KDMwKQogICAgICAgIHN0YXRlID0gInNlYXJjaGluZyIKICAgIGVsaWYgc3RhdGUgPT0gInNlYXJjaGluZyI6CiAgICAgICAgc2VhcmNoX3doaWxlX3JlYWRpbmdfc2Vuc29ycyg1MCwgODAwLCAxMCkKICAgICAgICAKZGVmIHN0cmF0ZWd5Mih2TCwgdlIpOgogICAgZ2xvYmFsIHN0YXRlCiAgICAKICAgIGlmIHN0YXRlID09ICJmb2xsb3dpbmciOgogICAgICAgIHN0YXRlID0gImp1c3RfbG9zdF90cmFjayIKICAgIGVsaWYgc3RhdGUgPT0gImp1c3RfbG9zdF90cmFjayI6CiAgICAgICAgbGVmdCgpCiAgICAgICAgZGVsYXkoMTUwKQogICAgICAgIHN0YXRlID0gInNlYXJjaGluZyIKICAgIGVsaWYgc3RhdGUgPT0gInNlYXJjaGluZyI6CiAgICAgICAgcmlnaHRBcmMoMC4zKQoKc2V0U3BlZWQoNzApCnN0YXRlID0gImluaXQiCndoaWxlIFRydWU6CiAgICB2TCA9IGlyTGVmdC5yZWFkX2RpZ2l0YWwoKQogICAgdlIgPSBpclJpZ2h0LnJlYWRfZGlnaXRhbCgpCiAgICBkID0gZ2V0RGlzdGFuY2UoKQogICAgCiAgICBwcmludCh2TCwgdlIsIGQsIHN0YXRlKQogICAgCiAgICBpZiBzdGF0ZSA9PSAiaW5pdCI6CiAgICAgICAgZm9yd2FyZCgpCiAgICAgICAgCiAgICBpZiAodkwsIHZSKSA9PSAoMSwgMSk6CiAgICAgICAgc3RyYXRlZ3kxKHZMLCB2UikKICAgIGVsc2U6ICMgc2kgdW4gZGVzIGNhcHRldXJzIGVzdCBzdXIgZHUgbm9pcgogICAgICAgIGlmIHN0YXRlIGluICgiaW5pdCIsICJzZWFyY2hpbmciKToKICAgICAgICAgICAgc3RhdGUgPSAiZm9sbG93aW5nIgogICAgICAgIGVsaWYgc3RhdGUgaW4gKCJmb2xsb3dpbmciKToKICAgICAgICAgICAga2VlcF9vbl90cmFjayh2TCwgdlIpCiAgICAgICAgICAgIAogICAgZGVsYXkoMTApCg==&vsplit=50&hsplit=600
