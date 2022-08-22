from microbit import *
from delay import delay

_axe = 0.097


def w(d1, d2, s1, s2):
    i2c.write(0x10, [0, d1, s1])
    i2c.write(0x10, [2, d2, s2])


def setSpeed(speed):
    if speed < 20:
        _v = speed + 5
    else:
        _v = speed


def forward():
    w(1, 1, _v, _v)


def backward():
    w(2, 2, _v, _v)


def stop():
    w(0, 0, 0, 0)


def right():
    d1 = 2
    d2 = 1
    if v > 0:
        d1 = 1
        d2 = 2
    w(d1, d2, round(_v * 0.9), round(_v * 0.9))


def left():
    d1 = 1
    d2 = 2
    if _v > 0:
        d1 = 2
        d2 = 1
    w(d1, d2, round(_v * 0.9), round(_v * 0.9))


def rightArc(r):
    v = abs(_v)

    if r < _axe:
        v1 = 0
    else:
        f = ((r - _axe) / (r + _axe)) * (1 - (v * v) / 20000)
        v1 = round(f * v)
    if _v > 0:
        w(1, 1, v, v1)
    else:
        w(2, 2, v1, v)


def leftArc(r):
    v = abs(_v)

    if r < _axe:
        v1 = 0
    else:
        f = ((r - _axe) / (r + _axe)) * (1 - (v * v) / 20000)
        v1 = round(f * v)
    if _v > 0:
        w(1, 1, v1, v)
    else:
        w(2, 2, v, v1)


def getDistance():
    return sim.robots[0].getDistance()


def setLED(on):
    pin8.write_digital(on)
    pin12.write_digital(on)



_v = 50
irLeft = pin13
irRight = pin14
ledLeft = pin8
ledRight = pin12