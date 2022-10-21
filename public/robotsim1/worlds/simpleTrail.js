function mapLoad(scene) {
  scene.load.image("trail", "worlds/bg/trail-01.png");
}

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

function mapCreate(scene) {
  follow_line(scene);
}

function sceneCreated({ overlayScene, robots }) {
  overlayScene.freeMode();
  overlayScene.camera.scrollY -= 200;
  overlayScene.camera.scrollX += 400;
}

// simulation(width, height, id, mapLoad, mapCreate, zoom, mouse);
sim = new simulation({
  width: 700,
  height: 500,
  id: "simulation",
  mapLoad,
  mapCreate,
  sceneCreated,
  zoom: 0.6,
  mouse: 1,
});
// Solution : https://21learning-components.surge.sh/#/component/PyRobotSim?world=simpleTrail&main=ZnJvbSBtYnJvYm90MiBpbXBvcnQgKgoKaWYgbW9kZSA9PSBTSU06CiAgICByb2JvdC5zZXRQb3NpdGlvbigwLCAwKQogICAgcm9ib3Quc2V0QW5nbGUoMCkKICAgIFRJTUVfOTAgPSA2MzAKZWxzZToKICAgIFRJTUVfOTAgPSA1NDUKCmZvcndhcmQoKQpkZWxheSgyMzAwKQoKcmlnaHQoKQpkZWxheShUSU1FXzkwKQoKZm9yd2FyZCgpCmRlbGF5KDI4MDApCgpyaWdodCgpCmRlbGF5KFRJTUVfOTApCgpmb3J3YXJkKCkKZGVsYXkoMTMwMCkKCmxlZnQoKQpkZWxheShUSU1FXzkwKQoKZm9yd2FyZCgpCmRlbGF5KDE1MDApCgpzdG9wKCkK
