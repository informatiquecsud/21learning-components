/*

*/

function mapLoad(scene) {
  scene.load.image("bg", "worlds/bg/bg-shape-1.png");
}

function mapCreate(scene) {
  const [x, y, angle] = [0, 0, 0];

  robot = new maqueenLite(scene, "N°1", x, y, angle);
  robot.setPosition(-230, 50);
  robot.setAngle(-75);

  const scale = 0.5;
  const [picx, picy, picangle, scaleX, scaleY] = [0, 0, 0, scale, scale];
  const bg = new Picture(scene, "bg", picx, picy, picangle, scaleX, scaleY);
}

function sceneCreated({ overlayScene, robots }) {
  //  overlayScene.freeMode();
  overlayScene.zoomOut();
  overlayScene.zoomOut();

  //overlayScene.camera.scrollX += 200;
  // robots[0].setPosition(0, 0);
  // robots[0].setAngle(90);
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
