/*

*/

function mapLoad(scene) {
  scene.load.image("circle", "worlds/bg/circle.gif");
}

function mapCreate(scene) {
  const r = getRandomInt(300, 630);
  const phi = Math.random() * 2 * Math.PI;

  const x = Math.cos(phi) * r;
  const y = Math.sin(phi) * r;

  // const x = getRandomInt(300, 650) * (1 - 2 * getRandomInt(0, 1));
  // const y = getRandomInt(200, 450) * (1 - 2 * getRandomInt(0, 1));

  console.log("coordinates", x, y);

  new Picture(scene, "circle", 0, 0, 0, 8, 8);

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
