export const range = (args) => {
  let start, end, step;
  if (args.length === 1) {
    end = args[0];
    start = 0;
    step = 1;
  } else if (args.length === 2) {
    [start, end] = args;
    step = 1;
  } else if (args.length === 3) {
    [start, end, step] = args;
  }

  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};
