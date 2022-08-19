function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapLoad(scene) {
  scene.load.image("trail", "assets/trail.png");
}

function mapCreate(scene) {
  new maqueenLite(scene, "N°1", 200, -100, 90);
  new Picture(scene, "trail", 300, 300, 0, 2, 2);
  const obstacle1 = new wallCircle(scene, 450, 200, 50);

}

sim = new simulation(800, 800, "simulation", mapLoad, mapCreate, 0.6, 1);

async function main() {
  await delay(500);
  setMbrobot();

  setSpeed(30);
  while (true) {
    const vL = irLeft.read_digital(),
      vR = irRight.read_digital();

    if (vL == 0 && vR == 0) {
      forward();
    } else if (vL == 1 && vR == 0) {
      rightArc(0.05);
    } else if (vL == 0 && vR == 1) {
      leftArc(0.05);
    }

    await delay(50);
  }
}

// main();
