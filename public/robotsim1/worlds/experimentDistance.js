/*
Example : http://localhost:8080/#/component/PyRobotSim?world=experimentDistance&main=ZnJvbSBtYnJvYm90IGltcG9ydCAqCgp3aGlsZSBUcnVlOgogICAgZCA9IGdldERpc3RhbmNlKCkKICAgIAogICAgcHJpbnQoZCkKICAgIAogICAgZGVsYXkoMTAwKQ==
*/

function mapLoad(scene) {
  // scene.load.image("circle", "worlds/bg/circle-50cm.png");
}

function mapCreate(scene) {
  // moving wall that oscillates around (300, 0) \pm (150, 0) in front of the
  // robot to demonstrate the us sensor
  let vx = 2;
  const move = (rect) => {
    const { x, y } = rect.body;
    if (Math.abs(x - 500) > 150) {
      vx *= -1;
    }
    rect.body.setVelocity(vx, 0);
    //console.log("coucou", rect.body);
  };

  // TODO: how to move the obstacle ?

  new maqueenLite(scene, "N°1", 0, 0, 0);
  // new Picture(scene, "circle", 0, 0, 0, 1.1, 1.1);
  const obstacle1 = new wallRect(scene, 500, 0, 30, 200);
  obstacle1.body.setStatic(false);
  setInterval(() => move(obstacle1), 100);
  console.log("obstacle", obstacle1);
}

function sceneCreated({ overlayScene, robots }) {
  overlayScene.freeMode();
  overlayScene.zoomIn();

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
