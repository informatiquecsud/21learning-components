import Phaser from "phaser";
import PhaserRaycaster from "phaser-raycaster";

import SimulationScene from "./scenes/SimulationScene.js";
import OverlayScene from "./scenes/OverlayScene.js";

class RobotSimulation {
  constructor(width, height, id, map, background = 0xcccac0) {
    this.Light;
    this.game = new Phaser.Game({
      width: width,
      height: height,
      backgroundColor: background,
      type: Phaser.CANVAS,
      canvas: document.getElementById(id),
      scene: [new SimulationScene(this, map), OverlayScene],
      physics: {
        default: "matter",
        matter: {
          gravity: { y: 0, x: 0 },
          debug: 0,
        },
      },
      plugins: {
        scene: [
          {
            key: "PhaserRaycaster",
            plugin: PhaserRaycaster,
            mapping: "raycasterPlugin",
          },
        ],
      },
    });
  }
}

export default RobotSimulation;
