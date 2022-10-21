/*

*/

function mapLoad(scene, queryParams) {
  // scene.load.image("circle", "worlds/bg/circle-50cm.png");
}

function mapCreate(scene, queryParams) {
  xWall1 = getRandomInt(-600, -200);
  xWall2 = xWall1 + 800;

  const wall1 = new wallRect(scene, xWall1, 0, 30, 500);
  wall1.body.setStatic(true);

  const wall2 = new wallRect(scene, xWall2, 0, 30, 500);
  wall2.body.setStatic(true);
}

function sceneCreated({ overlayScene, robots }) {
  overlayScene.freeMode();
  overlayScene.zoomOut();

  //overlayScene.camera.scrollX += 200;
  robots[0].setPosition(0, 0);
  robots[0].setAngle(90);
}
