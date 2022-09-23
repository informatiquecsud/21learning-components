/*

*/

function mapLoad(scene) {
  // scene.load.image("circle", "worlds/bg/circle-50cm.png");
}

function mapCreate(scene) {
  new maqueenLite(scene, "N°1", 0, 0, 0);

  const prisonWidth = 1200;
  const prisonHeight = 800;
  const holeWidth = 300;

  const wallN = new wallRect(
    scene,
    0,
    -prisonHeight / 2,
    30,
    prisonWidth,
    90
  ).body.setStatic(true);
  const wallW = new wallRect(
    scene,
    -prisonWidth / 2,
    0,
    30,
    prisonHeight
  ).body.setStatic(true);
  const wallE = new wallRect(scene, prisonWidth / 2, 0, 30, 800).body.setStatic(
    true
  );

  const wallS1Width = getRandomInt(50, 700);
  const wallS1X = -prisonWidth / 2 + wallS1Width / 2;
  const wallS1 = new wallRect(
    scene,
    wallS1X,
    prisonHeight / 2,
    30,
    wallS1Width,
    90
  ).body.setStatic(true);

  const wallS2Width = prisonWidth - wallS1Width - holeWidth;
  const wallS2X = prisonWidth / 2 - wallS2Width / 2;
  const wallS2 = new wallRect(
    scene,
    wallS2X,
    prisonHeight / 2,
    30,
    wallS2Width,
    90
  ).body.setStatic(true);
}

function sceneCreated({ overlayScene, robots }) {
  overlayScene.freeMode();
  overlayScene.zoomOut();
  overlayScene.zoomOut();
  overlayScene.zoomOut();

  //overlayScene.camera.scrollX += 200;
  robots[0].setPosition(0, 0);
  robots[0].setAngle(90);
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
  debug: false,
});
