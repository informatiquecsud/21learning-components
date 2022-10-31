/*

*/

function mapLoad(scene) {}

function mapCreate(scene, params) {
  const prisonWidth = parseInt(params.get("prisonWidth")) || 1200;
  const prisonHeight = parseInt(params.get("prisonHeight")) || 800;
  const holeWidth =
    parseInt(params.get("holeWidth")) || Math.max(prisonWidth / 4, 200);

  // set robot at random position and orientation
  const rangeX = parseInt((prisonWidth - prisonWidth / 6 - holeWidth / 2) / 2);
  const rangeY = parseInt((prisonHeight - prisonWidth / 6) / 2);

  const x = getRandomInt(-rangeX, rangeX);
  const y = getRandomInt(-rangeY, rangeY);
  const alpha = getRandomInt(-200, 200);

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

  const wallE = new wallRect(
    scene,
    prisonWidth / 2,
    0,
    30,
    prisonHeight
  ).body.setStatic(true);

  const wallS1Width = getRandomInt(50, prisonWidth / 2);
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
  // robots[0].setPosition(0, 0);
  // robots[0].setAngle(90);
}
