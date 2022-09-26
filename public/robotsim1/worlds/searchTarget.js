/*

*/

function mapLoad(scene) {
  scene.load.image("circle", "worlds/bg/circle.gif");
}

function mapCreate(scene) {
  new maqueenLite(scene, "N°1", 0, 0, 0);

  const x = getRandomInt(300, 800) * (1 - 2 * getRandomInt(0, 1));
  const y = getRandomInt(200, 450) * (1 - 2 * getRandomInt(0, 1));

  console.log("coordinates", x, y);

  new Picture(scene, "circle", 0, 0, 0, 10, 10);

  const target = new wallCircle(scene, x, y, 40);
  target.body.setStatic(false);
}

function sceneCreated({ overlayScene, robots }) {
  overlayScene.zoomOut();
  overlayScene.zoomOut();
  overlayScene.zoomOut();
  //overlayScene.freeMode();
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
