class wallRect {
  constructor(that, x, y, width, heigth) {
    this.body = that.matter.add
      .gameObject(that.add.rectangle(x, y, width, heigth, 0xff00000))
      .setStatic(true);

    that.walls.push(this.body);
  }
}

class markRect {
  constructor(that, x, y, width, height) {
    this.pic = "mark";
    this.pos = { x: x, y: y };
    this.scale = { x: width * 20, y: height * 20 };
    this.body = that.matter.add
      .image(y, x, "mark")
      .setScale(width, height)
      .setCollidesWith(0);

    that.marks.push(this);
  }
}
class Picture {
  constructor(that, key, x, y) {
    this.pic = String(key);
    this.pos = { x: x, y: y };
    this.scale = { x: 1, y: 1 };
    this.body = that.matter.add.image(x, y, key).setCollidesWith(0);

    that.marks.push(this);
  }
}

class Camera {
  constructor(that, simulation) {
    this.cam = simulation.cameras.main;
    this.follow = 0;
    this.cursor = that.add.text(0, 0, "<=", { color: "#000", fontSize: 20 });

    that.add
      .text(10, 10, "+", {
        color: "#000",
        backgroundColor: "#fff",
        padding: 1,
        fontSize: 40,
      })
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          (this.cam.zoom *= 1.2), (that.echelle.scale *= 1.2);
        },

        that.add
          .text(10, 60, "-", {
            color: "#000",
            backgroundColor: "#fff",
            padding: 1,
            fontSize: 40,
          })
          .setInteractive()
          .on("pointerdown", () => {
            (this.cam.zoom /= 1.2), (that.echelle.scale /= 1.2);
          }),

        that.buttons.push(
          that.add
            .text(10, 110, "Free", {
              color: "#000",
              backgroundColor: "#999",
              padding: 3,
            })
            .setInteractive()
            .on("pointerdown", () => {
              (this.follow = -1),
                this.cursor.setPosition(15 + that.buttons[0].width, 110),
                this.cam.stopFollow();
            })
        )
      );

    for (let i = 0; i < simulation.light.length; i++) {
      that.buttons.push(
        that.add
          .text(10, 140 + 30 * i, simulation.light[i].robot.state.id, {
            color: "#000",
            backgroundColor: "#999",
            padding: 3,
          })
          .setInteractive()
          .on("pointerdown", () => {
            (this.follow = i),
              this.cursor.setPosition(
                15 + that.buttons[i + 1].width,
                140 + 30 * i
              );
          })
      );
    }

    this.cursor.setPosition(15 + that.buttons[1].width, 140);
  }

  update(sim) {
    let inputs = sim.input.keyboard.addKeys({
      up: "up",
      down: "down",
      left: "left",
      right: "right",
    });

    if (this.follow == -1) {
      if (inputs.up.isDown) {
        this.cam.scrollY -= 5;
      } else if (inputs.down.isDown) {
        this.cam.scrollY += 5;
      }

      if (inputs.left.isDown) {
        this.cam.scrollX -= 5;
      } else if (inputs.right.isDown) {
        this.cam.scrollX += 5;
      }
    } else {
      this.cam.startFollow(sim.light[this.follow].robot.body);
    }
  }
}

export { wallRect, markRect, Picture, Camera };
