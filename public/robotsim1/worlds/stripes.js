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
  // const nbStripes = queryParams.get('nbStripes') || ;
  let x = createStripes(scene, {
    width: [10, 30],
    n: [5, 20],
    height: 500,
    gap: [10, 70],
  });

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

// Solution : https://21learning-components.surge.sh/#/component/PyRobotSim?world=slalom&main=ZnJvbSBtYnJvYm90MiBpbXBvcnQgKgoKaWYgbW9kZSA9PSBTSU06CiAgICByb2JvdC5zZXRQb3NpdGlvbigwLCAwKQogICAgcm9ib3Quc2V0QW5nbGUoMCkKCmZvcndhcmQoKQpkZWxheSgxMDAwKQoKbGVmdCgpCmRlbGF5KDU2MCkKc3RvcCgpCgpyaWdodEFyYygwLjI1KQpkZWxheSgzODAwKQpzdG9wKCkKCmxlZnRBcmMoMC4yNSkKZGVsYXkoNDIwMCkKc3RvcCgpCgpyaWdodEFyYygwLjI1KQpkZWxheSg0MjAwKQpzdG9wKCk=
