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


from os import uname
from collections import namedtuple
import re

Location = namedtuple("Location", "x y angle")


class NoRobotFoundError(RuntimeError):
    def __init__(self):
        super().__init__("Call makeSim(robot) or pass robot instance as argument")


_robot = None


def makeSim(robot):
    global _robot, _body
    _robot = robot
    _body = robot.body


def _to_display(n):
    return round(n, 1)


def getLocation(robot=None):
    return Location(
        x=_to_display(_body.x), y=_to_display(_body.y), angle=_to_display(_body.angle)
    )


getLoc = getLocation


def getRobot(robot):
    try:
        global _robot
        return robot or _robot
    except:
        raise NoRobotFoundError


def getBody(robot):
    try:
        global _robot
        return robot and robot.body or _robot.body
    except:
        raise NoRobotFoundError


def getX(robot=None):
    return _to_display(getBody(robot).x)


def getY(robot=None):
    return _to_display(getBody(robot).y)


def getAngle(robot=None):
    return _to_display(getBody(robot).angle)
