function mapLoad(scene, params) {
  scene.load.image("circle", "worlds/bg/circle-50cm.png");
}

function mapCreate(scene, params) {
  new Picture(scene, "circle", 0, 0, 0, 1.1, 1.1);
}

function sceneCreated({ overlayScene, robots }) {
  overlayScene.freeMode();
  overlayScene.zoomIn();
  // overlayScene.camera.scrollY -= 200;
  robots[0].setPosition(230, 0);
}
