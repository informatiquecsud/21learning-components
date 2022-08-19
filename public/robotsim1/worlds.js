function createSimulation(
  width,
  height,
  id,
  mapLoad,
  mapCreate,
  zoom = 0.8,
  mouse = true,
  debug = false,
  background = 0xcccac0
) {
  return new simulation(
    width,
    height,
    id,
    mapLoad,
    mapCreate,
    zoom,
    mouse,
    debug,
    background
  );
}

function translate(tx, ty, coords) {
  return coords.map(([x, y]) => [x + tx, y + ty]);
}

function runMaxTimes(n, f) {
  let counter = 0;
  return (...args) => {
    if (counter < n) {
      counter += 1;
      return f(...args);
    } else {
      return null;
    }
  };
}
