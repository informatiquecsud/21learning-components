async function mapLoad(scene) {}

function follow_line(scene) {
  let points = 0;
  new Picture(scene, "trail", 390, -120, 0, 0.5, 0.5);
  const checkpointCoordinates = [
    [0, -330],
    [460, -330],
    [460, -130],
    [700, -130],
  ];
  checkpointCoordinates.map(([x, y], index) => {
    new zoneCircle(
      scene,
      x,
      y,
      20,
      runMaxTimes(1, () => {
        points += 1;
        console.log(`Checkpoint ${index} : OK`);
      })
    );
  });

  console.log(`Total points: ${points}`);
}

function slalom(scene, nb, delta, start = 300, radius = 30) {
  for (let i = 0; i < nb; i++) {
    new wallCircle(scene, 0, -start - i * delta, radius);
  }
}

async function mapCreate(scene) {
  new maqueenLite(scene, "N°1", 0, 0, 0);
  slalom(scene, 3, 300, 300, 35);
}

function sceneCreated({ overlayScene, robots }) {
  overlayScene.freeMode();
  overlayScene.camera.scrollY -= 600;
  overlayScene.camera.rotation = Math.PI / 2;
}

sim = new simulation({
  width: 700,
  height: 500,
  id: "simulation",
  mapLoad,
  mapCreate,
  sceneCreated,
  zoom: 0.4,
  mouse: 1,
});

// Solution : https://21learning-components.surge.sh/#/component/PyRobotSim?world=slalom&main=ZnJvbSBtYnJvYm90MiBpbXBvcnQgKgoKaWYgbW9kZSA9PSBTSU06CiAgICByb2JvdC5zZXRQb3NpdGlvbigwLCAwKQogICAgcm9ib3Quc2V0QW5nbGUoMCkKCmZvcndhcmQoKQpkZWxheSgxMDAwKQoKbGVmdCgpCmRlbGF5KDU2MCkKc3RvcCgpCgpyaWdodEFyYygwLjI1KQpkZWxheSgzODAwKQpzdG9wKCkKCmxlZnRBcmMoMC4yNSkKZGVsYXkoNDIwMCkKc3RvcCgpCgpyaWdodEFyYygwLjI1KQpkZWxheSg0MjAwKQpzdG9wKCk=
