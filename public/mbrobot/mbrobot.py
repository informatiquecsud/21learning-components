from os import uname

REAL = 0
SIM = 1
mode = REAL if uname().nodename == 'microbit' else SIM

if mode == REAL:
    import gc
    gc.collect()
    from microbit import i2c, pin1, pin2, pin8, pin12, pin13, pin14, sleep
    import machine
    delay = sleep
    _v = 50
    pin2.set_pull(pin2.NO_PULL)
else:
    from microbit import *
    from delay import delay
    _v = 60

_axe = 0.097
irLeft = pin13
irRight = pin14
ledLeft = pin8
ledRight = pin12
LEFT = 0
RIGHT = 2
ALL = 4

# motor direction
D_FW = 0 if mode == REAL else 1
D_BW = 1 if mode == REAL else 2

def rotMot(side, d, s):
    d = 0 if s == 0 else d
    try:
        i2c.write(0x10, bytearray([side, d, s]))
    except:
        print("Unsufficient power to control the motors")

def w(d1, d2, s1, s2):
    rotMot(LEFT, d1, s1)
    rotMot(RIGHT, d2, s2)

def setSpeed(speed):
    global _v
    if speed < 20: _v = speed + 5
    else: _v = speed

def forward():
    w(D_FW, D_FW, _v, _v)

def backward():
    w(D_BW, D_BW, _v, _v)

def stop():
    w(0, 0, 0, 0)

def right():
    dirL = D_FW if _v > 0 else D_BW
    dirR = D_BW if _v > 0 else D_FW
    w(dirL, dirR, _v * 800 // 1000, _v * 800 // 1000)

def left():
    dirR = D_FW if _v > 0 else D_BW
    dirL = D_BW if _v > 0 else D_FW
    w(dirL, dirR, _v * 800 // 1000, _v * 800 // 1000)

def arc(r, side):
    v = abs(_v)
    if r < _axe: v1 = 0
    else:
        f = (r - _axe) / (r + _axe) * (1 - v * v / 200000)
        v1 = int(f * v)
    if side == 'L': v1, v = v, v1
    if _v > 0: w(D_FW, D_FW, v, v1)
    else: w(D_BW, D_BW, v1, v)

def rightArc(r):
    arc(r, 'R')
def leftArc(r):
    arc(r, 'L')

def rotateMotor(s, side):
    v = abs(s)
    d = D_BW if s < 0 else D_FW
    rotMot(side, d, v)

def dist_real():
    pin1.write_digital(1)
    pin1.write_digital(0)
    p = machine.time_pulse_us(pin2, 1, 50000)
    cm = int(p / 58.2 + 0.5)
    return cm if cm > 0 else 255

def dist_sim():
    return sim.robots[0].getDistance()

getDistance = dist_real if mode == REAL else dist_sim

def setLED(on, what=ALL):
    if what in [LEFT, ALL]:
        pin8.write_digital(on)
    if what in [RIGHT, ALL]:
        pin12.write_digital(on)

'''
def set_alarm_real(state):
    pass

setAlarm = iframe.contentWindow.setAlarm if mode == SIM else set_alarm_real
'''
