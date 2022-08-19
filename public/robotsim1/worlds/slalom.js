function mapLoad(scene) {}

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

function slalom(scene, nb, delta, radius = 30) {
  for (let i = 0; i < nb; i++) {
    new wallCircle(scene, 0, -200 - i * delta, radius);
  }
}

function mapCreate(scene) {
  new maqueenLite(scene, "N°1", 0, 0, 0);
  slalom(scene, 3, 300);
}

function sceneCreated(simulation) {
  const scene = simulation.scenes[0];
  console.log("scene", simulation.scenes);
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

// Solution : http://localhost:8080/#/component/PyRobotSim?main=ZnJvbSBtYnJvYm90MiBpbXBvcnQgKgoKaWYgbW9kZSA9PSBTSU06CiAgICByb2JvdC5zZXRQb3NpdGlvbigwLCAwKQogICAgcm9ib3Quc2V0QW5nbGUoMCkKICAgIFRJTUVfOTAgPSA1NjAKZWxzZToKICAgIFRJTUVfOTAgPSA1NDUKCmZvcndhcmQoKQpkZWxheSgyMDAwKQoKcmlnaHQoKQpkZWxheShUSU1FXzkwKQoKZm9yd2FyZCgpCmRlbGF5KDI0NTApCgpyaWdodCgpCmRlbGF5KFRJTUVfOTApCgpmb3J3YXJkKCkKZGVsYXkoMTEwMCkKCmxlZnQoKQpkZWxheShUSU1FXzkwKQoKZm9yd2FyZCgpCmRlbGF5KDEzMDApCgpzdG9wKCkK
