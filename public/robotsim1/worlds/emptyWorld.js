function mapLoad(scene) {}

function mapCreate(scene) {
  new maqueenLite(scene, "N°1", 0, 0, 0);
}

function sceneCreated({ overlayScene, robots }) {
  overlayScene.freeMode();
  overlayScene.camera.scrollY -= 200;
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
