/*

*/

function mapLoad(scene, queryParams) {
  const params = new URL(window.location.href).searchParams;
  const bgSrc = params.get("bg");

  try {
    console.log("bgSrc", bgSrc);
    bgURL = new URL(bgSrc).toString();
  } catch {
    bgURL = `worlds/bg/${bgSrc}`;
  }

  scene.load.image("bg", bgURL);
}

function mapCreate(scene, queryParams) {
  const [x, y, angle] = [0, 0, 0];
  const params = new URL(window.location.href).searchParams;

  const scale = Number(params.get("bgScale")) || 1;
  const scaleX = Number(params.get("bgScaleX")) || scale;
  const scaleY = Number(params.get("bgScaleY")) || scale;
  const bgX = Number(params.get("bgX")) || 0;
  const bgY = Number(params.get("bgY")) || 0;
  const bgAngle = Number(params.get("bgAngle")) || 0;
  const bg = new Picture(scene, "bg", bgX, bgY, bgAngle, scaleX, scaleY);
}

function sceneCreated({ overlayScene, robots }) {
  //  overlayScene.freeMode();
  //overlayScene.zoomIn();
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
