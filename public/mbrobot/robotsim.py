"""

Example usage 1:

::

    from mbrobot import *
    from robotsim import *

    makeSim(robot)
    print(getLocation())
    print(getX())

Usage 2 (with robot as argument without makeSim)

::

    from mbrobot import *
    from robotsim import *

    print(getLocation(robot))
    print(getX(robot))


"""

from js import window, document
from pyodide import to_js
import os

from collections import namedtuple

_platform = None
if os.uname().sysname == "Emscripten":
    _platform = "pyodide"
elif os.uname().sysname == "microbit":
    _platform = "microbit"

if _platform == "pyodide":
    iframe = document.querySelector("iframe.robotsim-container")
    sim_globals = iframe.contentWindow
    sim = sim_globals.sim
    game = sim.game
    scene = game.scene.scenes[0]
    robot = sim.robots[0]
    body = robot.body

    overlay = game.scene.scenes[1]
    camera = overlay.camera

Location = namedtuple("Location", "x y angle")


class NoRobotFoundError(RuntimeError):
    def __init__(self):
        super().__init__("Call makeSim(robot) or pass robot instance as argument")


def _to_display(n):
    return round(n, 1)


def getLocation(robot=None):
    return Location(
        x=_to_display(body.x), y=_to_display(body.y), angle=_to_display(body.angle)
    )


def setLocation(*args, **kwargs):
    if len(args) == 2:
        x, y = args
        angle = 0
    elif len(args) == 3:
        x, y, angle = args
    elif len(args) == 1:
        x = args[0]
        y, angle = 0, 0
    elif len(args) == 0:
        x = kwargs.get("x", 0)
        y = kwargs.get("y", 0)
        angle = kwargs.get("angle", 0)

    robot.setPosition(x, y)
    robot.setAngle(angle)


getLoc = getLocation


def getX(robot=None):
    return _to_display(body.x)


def getY(robot=None):
    return _to_display(body.y)


def getAngle(robot=None):
    return _to_display(body.angle)
