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
M_LEFT = 0
M_RIGHT = 2

# motor direction
D_FW = 0 if mode == REAL else 1
D_BW = 1 if mode == REAL else 2

def rotMot(side, d, s):
    i2c.write(0x10, bytearray([side, d, s]))

def stop():
    w(0, 0, 0, 0)

def rotateMotor(side, s):
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

def setLED(on):
    pin8.write_digital(on)
    pin12.write_digital(on)



class Motor:
    def __init__(self, id):
        self._id = 2 * id

    def rotate(self, s):
        v = abs(s)
        if s > 0:
            self._w(D_FW, v)
        elif s < 0:
            self._w(D_BW, v)
        else:
            self._w(D_FW, 0)


    def _w(self, d, s):
        try:
            i2c.write(0x10, bytearray([self._id, d, s]))
        except:
            print("Please switch on mbRobot!")
            while True:
                pass


motL = Motor(0)
motR = Motor(1)

