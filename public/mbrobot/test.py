from mbrobot import *

cmds = [
    [forward],
    [backward],
    [stop],
    [right],
    [left],
    [rightArc, 0.2],
    [leftArc, 0.2],
    [stop],
    [rotateMotor, 60, LEFT],
    [rotateMotor, -60, LEFT],
    [stop],
    [rotateMotor, 60, RIGHT],
    [rotateMotor, -60, RIGHT],
    [stop],
]

cmds = cmds[-3:]

for cmd in cmds:
    print("running", cmd)
    f, *args = cmd
    f(*args)
    delay(1000)
    stop()
    delay(500)



