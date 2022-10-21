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
  slalom(scene, 3, 300, 300, 35);
}

function sceneCreated({ overlayScene, robots }) {
  overlayScene.freeMode();
  overlayScene.camera.scrollY -= 600;
  overlayScene.camera.rotation = Math.PI / 2;
}
