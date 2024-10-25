/*
Example1 (robot following obstacle) :
*/

function mapLoad(scene, params) {
  // scene.load.image("circle", "worlds/bg/circle-50cm.png");
}

function mapCreate(scene, params) {
  // make the wall jump randomly
  // On renvoie un entier aléatoire entre une valeur min (incluse)
  // et une valeur max (exclue).
  // Attention : si on utilisait Math.round(), on aurait une distribution
  // non uniforme !
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const setAtRandomPosition = (rect) => {
    const { x, y } = rect.body;
    const robot = scene.robots[0];

    let newX = getRandomInt(x - 90, x + 90);
    if (newX < robot.x + 20) {
      newX = robot.x + 20;
    }

    rect.body.setPosition(newX, y);
  };

  // TODO: how to move the obstacle ?

  // new Picture(scene, "circle", 0, 0, 0, 1.1, 1.1);
  const obstacle1 = new wallRect(scene, 500, 0, 30, 200);
  obstacle1.body.setStatic(false);
  setInterval(() => setAtRandomPosition(obstacle1), 1500);
  console.log("obstacle", obstacle1);
}

function sceneCreated({ overlayScene, robots }) {
  overlayScene.freeMode();
  overlayScene.zoomIn();

  overlayScene.camera.scrollX += 200;
  robots[0].setPosition(0, 0);
  robots[0].setAngle(90);
}
