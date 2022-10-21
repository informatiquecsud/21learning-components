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
