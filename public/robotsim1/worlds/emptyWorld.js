function mapLoad(scene) {}

function mapCreate(scene) {
  new maqueenLite(scene, "N°1", 0, 0, 0);
}

// simulation(width, height, id, mapLoad, mapCreate, zoom, mouse);
sim = new simulation(700, 500, "simulation", mapLoad, mapCreate, 0.6, 1);

// Solution : http://localhost:8080/#/component/PyRobotSim?main=ZnJvbSBtYnJvYm90MiBpbXBvcnQgKgoKaWYgbW9kZSA9PSBTSU06CiAgICByb2JvdC5zZXRQb3NpdGlvbigwLCAwKQogICAgcm9ib3Quc2V0QW5nbGUoMCkKICAgIFRJTUVfOTAgPSA1NjAKZWxzZToKICAgIFRJTUVfOTAgPSA1NDUKCmZvcndhcmQoKQpkZWxheSgyMDAwKQoKcmlnaHQoKQpkZWxheShUSU1FXzkwKQoKZm9yd2FyZCgpCmRlbGF5KDI0NTApCgpyaWdodCgpCmRlbGF5KFRJTUVfOTApCgpmb3J3YXJkKCkKZGVsYXkoMTEwMCkKCmxlZnQoKQpkZWxheShUSU1FXzkwKQoKZm9yd2FyZCgpCmRlbGF5KDEzMDApCgpzdG9wKCkK
