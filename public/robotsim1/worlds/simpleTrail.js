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
