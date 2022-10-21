/*
Example1 (robot following obstacle) : https://21learning-components.surge.sh/#/component/PyRobotSim?world=experimentDistance&main=ZnJvbSBtYnJvYm90IGltcG9ydCAqCgppZiBtb2RlID09IFNJTToKICAgIHJvYm90LnNldFBvc2l0aW9uKDAsIDApCiAgICByb2JvdC5zZXRBbmdsZSg5MCkKCnNldFNwZWVkKDQwKQp3aGlsZSBUcnVlOgogICAgZCA9IGdldERpc3RhbmNlKCkKICAgIHByaW50KGQpCiAgICAKICAgIGlmIGQgPCAyMDoKICAgICAgICBiYWNrd2FyZCgpCiAgICBlbHNlOgogICAgICAgIGZvcndhcmQoKQogICAgCiAgICBkZWxheSgxMDAp
*/

function mapLoad(scene) {
  // scene.load.image("circle", "worlds/bg/circle-50cm.png");
}

function mapCreate(scene) {
  const obstacle1 = new wallRect(scene, 545, 0, 30, 200);
}

function sceneCreated({ overlayScene, robots }) {
  overlayScene.freeMode();
  //overlayScene.zoomOut();

  overlayScene.camera.scrollX += 200;
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
