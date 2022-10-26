function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.round(Math.random() * (max - min)) + min;
}

/**
 * Creates an interval from the argument(s)
 *
 * Examples
 *
 * 1) randomInterval(10, 20) -> [10, 20]
 * 2) randomInterval(10) -> [10, 10]
 * 3) randomInterval([10, 20]) -> [10, 20]
 *
 **/
function randomInterval() {
  let min, max;
  if (arguments.length === 1) {
    const arg = arguments[0];
    if (arg instanceof Array && arg.length === 2) {
      [min, max] = arg;
    } else if (typeof arg === "number") {
      const value = arguments[0];
      [min, max] = [value, value];
    } else {
      throw Error(`Unable to parse arguments as interval: ${arguments}`);
    }
  } else if (arguments.length === 2) {
    [min, max] = [arguments[0], arguments[1]];
  }
  return [min, max];
}

function randintFromInterval([min, max]) {
  return getRandomInt(min, max);
}

function mapObject(obj, valueFunc) {
  return Object.fromEntries(
    Object.keys(obj).map((x) => [x, valueFunc(obj[x])])
  );
}

const radians = (deg) => (deg * Math.PI) / 180.0;

const maxRuns = (n, func) => {
  let nbRuns = 0;
  return () => {
    if (nbRuns < n) {
      func();
      nbRuns++;
    }
  };
};
