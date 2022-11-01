/*

*/

function mapLoad(scene, queryParams) {
  scene.load.image("bg", "worlds/bg/bg-shape-1.png");
  //scene.load.image("bg", "worlds/bg/blackarea.gif");
}

function mapCreate(scene, queryParams) {
  const [x, y, angle] = [0, 0, 0];

  const robot = scene.robots[0];

  robot.setPosition(-55, 118);
  robot.setAngle(-30);

  const scale = 0.3;
  const [picx, picy, picangle, scaleX, scaleY] = [0, 0, 0, scale, scale];
  const bg = new Picture(scene, "bg", picx, picy, picangle, scaleX, scaleY);
}

function sceneCreated({ overlayScene, robots }) {
  //  overlayScene.freeMode();
  overlayScene.zoomIn();

  //overlayScene.camera.scrollX += 200;
  // robots[0].setPosition(0, 0);
  // robots[0].setAngle(90);
}
