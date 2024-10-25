############################################################
# Original Maqueen:Plus driver reverse engineered from
# https://github.com/DFRobot/pxt-DFRobot-Maqueenplus
# Author : Cédric Donner, cedonner@gmail.com
# Original Repo : https://github.com/informatiquecsud/mbrobot/blob/main/maqueen-plus/microbit_V2/src/
# Date : 2022-2024
# other source of "documentation" : https://github.com/DFRobot/DFRobot_Maqueenplus
############################################################

from os import uname

REAL = 0
SIM = 1
mode = REAL if uname().nodename == "microbit" else SIM

if mode == REAL:
    import gc

    gc.collect()
    from machine import time_pulse_us
    from microbit import pin1, pin2, i2c
    from utime import sleep_ms

    _v = 50
    pin2.set_pull(pin2.NO_PULL)
    delay = sleep_ms
else:
    from microbit import *
    from delay import delay

    _v = 60

    delay


def sleep(ms: int) -> None:
    """
    sleep the program during `ms` milliseconds
    >>> sleep(1000) # sleep for 1 second
    """
    return delay(ms)


# to improve minification with WebTP private global vars minification
_bytearray = bytearray
_write = i2c.write
_read = i2c.read

# Convenience constants
OFF = 0
ON = 1

#############################################################
# Control the US Sensor
#############################################################


class URM10Sensor:
    def __init__(self, max_distance=250):
        self.max_distance = max_distance

    def get_distance(self, pinTrig=None, pinEcho=None):
        pinTrig = pinTrig or pin1
        pinEcho = pinEcho or pin2

        pinTrig.write_digital(1)
        sleep_ms(10)
        pinTrig.write_digital(0)
        pinEcho.read_digital()
        t = time_pulse_us(pinEcho, 1)
        d = int(t / 58.8)
        return min(self.max_distance, d)


if mode == REAL:
    _us_sensor = URM10Sensor()
    getDistance = _us_sensor.get_distance
else:
    getDistance = sim.robots[0].getDistance


def get_distance():
    """
    Returns the distance read from the ultrasonic sensor in [cm] = the distance
    from the robot to the nearest object right in front of it.

    >>> d = get_distance()
    13
    """
    return getDistance()


def _get_sides(args, kw):
    left, right, both = [kw.get(x, None) for x in ["left", "right", "both"]]
    N = len(args)
    if N == 1:
        left = right = args[0]
    elif N == 2:
        left, right = args
    elif N > 2:
        raise TypeError("Cannot take more than 2 positional args")
    return left, right, both


#############################################################
# Control the front LEDs
#############################################################
_i2c_leds = 0x10

# SIDES
LEFT, RIGHT, ALL, BOTH = [0, 2, 4, 4]

# LED colors
OFF, RED, GREEN, YELLOW, BLUE, PINK, CYAN, WHITE = list(range(8))


def set_leds(*args, **kwargs):
    """
    Usage
    >>> set_leds(left=RED, right=GREEN)
    >>> set_leds(left=RED)
    >>> set_leds(right=RED)
    >>> set_leds(both=RED)
    >>> set_leds(both=OFF)
    >>> set_leds(OFF)
    >>> set_leds(ON)
    >>> set_leds(RED)
    """

    left, right, both = [8 if s == 0 else s for s in _get_sides(args, kwargs)]

    # if side not in [LEFT, RIGHT, BOTH]:
    #     raise ValueError("side has to be LEFT, RIGHT or BOTH")
    # if state not in [0, 1, 2, 3, 4, 5, 6, 7, 8]:
    #     raise ValueError("state has to be OFF, RED, GREEN, YELLOW, BLUE, PINK, CYAN, or WHITE")

    if left and right:
        _write(_i2c_leds, _bytearray([0x0B, left, right]))
    elif both:
        _write(_i2c_leds, _bytearray([0x0B, both, both]))
    elif left:
        _write(_i2c_leds, _bytearray([0x0B, left]))
    elif right:
        _write(_i2c_leds, _bytearray([0x0C, right]))


setLED = set_leds

set_leds(both=OFF)

#############################################################
# Control the motors
#############################################################


_i2c_motors = 0x10

# wheel diameter
_w_diam = 4.2
pi = 3.14159
_deg_cm = pi * _w_diam / 360


def cm2deg(cm):
    """
    Converts wheel travel distance in [cm] to rotation in degrees
    >>> cm2deg(10)
    272.8373
    """
    # 13.51 is pi * 4.25, which is the diameter of the wheels
    return cm / _deg_cm


def deg2cm(deg):
    """
    Converts wheel rotation in degrees to travel distance in [cm]
    >>> deg2cm(180)
    4911.071
    """
    return deg * _deg_cm


def set_motors(*args, **kw):
    """
    Sets the individual motor power level (0=stop, min=-240, max=240)
    >>> set_motors(left=50)
    >>> set_motors(left=50, right=-50)
    >>> set_motors(both=100)
    """
    DIR_FW = 1
    DIR_BW = 2

    left, right, both = _get_sides(args, kw)

    pL, pR, pB = [0 if x is None else abs(x) for x in [left, right, both]]
    dirL, dirR, dirB = [
        0 if x is None or x == 0 else DIR_FW if x > 0 else DIR_BW
        for x in [left, right, both]
    ]

    if left is not None and right is not None:
        _write(_i2c_motors, _bytearray([0x00, dirL, pL, dirR, pR]))
    elif left is not None:
        _write(_i2c_motors, _bytearray([0x00, dirL, pL]))
    elif right is not None:
        _write(_i2c_motors, _bytearray([0x02, dirR, pR]))
    elif both is not None:
        cmd = [0x00, dirB, pB, dirB, pB]
        _write(_i2c_motors, _bytearray(cmd))


def stop():
    """
    stops both motors
    >>> stop()
    """
    set_motors(both=0)


stop_motors = stop


class Motor:

    powers = [0, 0]
    dirs = [1, 1]

    def __init__(self, motor_id):
        self.id = motor_id

    def rotate(self, p):
        """ """
        if p < 0:
            Motor.powers[self.id] = -p
            Motor.dirs[self.id] = 2
        else:
            Motor.powers[self.id] = p
            Motor.dirs[self.id] = 1

        pL, pR = Motor.powers
        dL, dR = Motor.dirs
        _motor_cmd(dL, pL, dR, pR)

    def reset_deg(self):
        buf = _bytearray([0x04 + self.id * 2, 0])
        _write(_i2c_motors, buf)

    def read_direction(self):
        _write(_i2c_motors, _bytearray([0]))
        buf = _read(_i2c_motors, 4)
        dir = buf[self.id * 2]
        return dir if dir < 2 else -1

    def read_deg(self):
        _write(_i2c_motors, _bytearray([4]))
        buf = _read(_i2c_motors, 4)

        value = buf[self.id * 2] << 8 | buf[self.id * 2 + 1]
        return value * 360 / 79


def read_encoders():
    _write(_i2c_motors, _bytearray([4]))
    buf = _read(_i2c_motors, 4)

    return buf


# Maqueen Plus motor control
# direction: 0=>stop // 1=>forward // 2=>back
# speed/power：0..255
debug = False


def rotate_to(tL, tR, **kwargs):
    dimm_factor = kwargs.get("dimm_factor", 0.97)
    dirL, dirR = [1 if x > 0 else 2 for x in [tL, tR]]
    sgnL, sgnR = [1 if x > 0 else -1 for x in [tL, tR]]

    # tL and tR have to be > 0
    tL = abs(tL)
    tR = abs(tR)

    stop()
    delay(20)
    motor_left.reset_deg()
    motor_right.reset_deg()

    # need ~50 ms time for motor controller to reset angle counter
    # remark: don't remember where this comes from ..., maybe wrong
    delay(50)

    # prevents a too big overshooting
    reduction = (tL - sgnL * int(0.1 * _p)) / tL * dimm_factor
    print(reduction)
    tL *= reduction
    tR *= reduction

    if abs(tL) < abs(tR):
        pL, pR = _p * (1 - abs(tR - tL) / tR), _p
    elif abs(tL) > abs(tR):
        pL, pR = _p, _p * (1 - abs(tR - tL) / tL)
    else:
        pL = pR = _p

    # TODO: provide a callback to do other stuff while forwarding
    while True:
        degL, degR = motor_left.read_deg(), motor_right.read_deg()
        if degL > tL and degR > tR:
            break
        if debug:
            print(dirL, int(pL), dirR, int(pR))
        _motor_cmd(dirL, int(pL), dirR, int(pR))
        delay(10)

    # overcome motor / robot inertia with counter current
    inverse_dirL, inverse_dirR = [3 - d for d in [dirL, dirR]]
    _motor_cmd(inverse_dirL, 255, inverse_dirR, 255)
    delay(25)
    _motor_cmd(0, 0, 0, 0)

    degL = sgnL * motor_left.read_deg()
    degR = sgnR * motor_right.read_deg()
    if debug:
        print("motor degrees; ", degL, degR)
    return degL, degR


def _motor_cmd(dirL, pL, dirR, pR):
    try:
        buf = _bytearray([0x00, dirL, pL, dirR, pR])
        _write(_i2c_motors, buf)
    except:
        print("Please switch on robot to use motors!")


def forward(cm=None, **kwargs):
    """
    When used without argument, makes the robot travel on a straight trajectory
    until another command is sent to the motors (non blocking). Typically used
    in combination with `sleep(ms)` to set the duration of `forward`. When used
    with the `cm` parameter, uses the motor encoders to travel `cm` centimeters
    on a straight trajectory (blocking)
    >>> forward()
    >>> sleep(1000)
    >>> stop()
    >>> forward(cm=20)
    """
    if cm:
        deg = cm2deg(cm)
        return rotate_to(deg, deg, **kwargs)
    else:
        _motor_cmd(1, _p, 1, _p)


def backward(cm=None, **kwargs):
    """
    When used without argument, makes the robot travel on a straight trajectory
    until another command is sent to the motors (non blocking). Typically used
    in combination with `sleep(ms)` to set the duration of `forward`. When used
    with the `cm` parameter, uses the motor encoders to travel `cm` centimeters
    on a straight trajectory (blocking)
    >>> backward()
    >>> sleep(1000)
    >>> stop()
    >>> backward(cm=20)
    """
    if cm:
        deg = cm2deg(cm)
        return rotate_to(-deg, -deg, **kwargs)
    else:
        _motor_cmd(2, _p, 2, _p)


def left(deg=None, **kwargs):
    """
    When used without argument, makes the robot turn to the left in non blocking
    mode with rotation center between both wheels until another motor command is
    sent. When used with the deg=... parameter, rotates the robot ``deg``
    degrees in blocking mode.
    >>> left()
    >>> sleep(1000)
    >>> stop()
    >>> left(deg=90)
    """
    if deg:
        return rotate_to(-2 * deg, 2 * deg, **kwargs)
    else:
        _motor_cmd(2, _p, 1, _p)


def right(deg=None, **kwargs):
    """
    When used without argument, makes the robot turn to the right in non
    blocking mode with rotation center between both wheels until another motor
    command is sent. When used with the deg=... parameter, rotates the robot
    ``deg`` degrees in blocking mode.
    >>> right()
    >>> sleep(1000)
    >>> stop()
    >>> right(deg=90)
    """
    if deg:
        return rotate_to(2 * deg, -2 * deg, **kwargs)
    else:
        _motor_cmd(1, _p, 2, _p)


# def stop():
# _motor_cmd(0, 0, 0, 0)


def set_pid(switch):
    """
    Activates PID control. Usefull for speeds < 30. Without PID, the robot does
    not move for speeds < 30.
    >>> set_pid(ON)
    >>> set_pid(OFF)
    """
    # PID parameters open:0 close:1
    _write(_i2c_motors, _bytearray([0x0A, switch]))


setPID = set_PID = set_pid


def set_speed(power: int) -> None:
    """
    Sets the power (integer from 0=stop to 250=max speed) on the DC motors that
    drive the wheels when using driving functions `forward()`, `backward()`,
    `left_arc()` and `right_arc()`.
    >>> set_speed(30)
    >>> set_speed(250)
    """
    global _p
    _p = power


def _set_motor(dL, dR, pL, pR):
    _motor_cmd(dL, pL, dR, pR)


def _v1_helper(r, v):
    if r < _axle_track:
        v1 = 0
    else:
        f = (r - _axle_track) / (r + _axle_track) * (1 - v * v / 200000)
        v1 = int(f * v)
    # if 0 < v1 < 18:
    #    v1 = int(20 + 18 / 5)
    return v1


def right_arc(r):
    """
    Drive the robot along an arc of radius ``r`` in [m] oriented to the right.

    >>> right_arc(0.3)
    """
    v = abs(_p)
    v1 = _v1_helper(r, v)
    if _p > 0:
        _set_motor(1, 1, v, v1)
    else:
        _set_motor(2, 2, v1, v)


def left_arc(r):
    """
    Drive the robot along an arc of radius ``r`` in [m] oriented to the left.

    >>> right_arc(0.3)
    """
    v = abs(_p)
    v1 = _v1_helper(r, v)
    if _p > 0:
        _set_motor(1, 1, v1, v)
    else:
        _set_motor(2, 2, v, v1)


motL = left_motor = motor_left = Motor(0)
"""left motor"""
motR = right_motor = motor_right = Motor(1)
"""right motor"""
# default power
_p = 50
# axle track
_axle_track = 0.095


#############################################################
# Control the patrol IR sensors
#############################################################


_i2c_patrol = 0x10


class IR:
    L3, L2, L1, R1, R2, R3 = list(range(6))
    masks = [1 << i for i in range(6)]


class IRSensor:

    def __init__(self, index):
        self.index = index

    def read_digital(self):
        byte = ir_read_values_as_byte()
        return (byte & IR.masks[self.index]) >> self.index

    def is_dark(self):
        return self.read_digital()

    def get_value(self):
        data = ir_read_all_values_as_bytearray()
        return data[self.index * 2 + 1] << 8 | data[self.index * 2 + 2]


# def are_all_dark(values, sensors):
#     mask = 0
#     for s in sensors:
#         mask |= s
#     return ~values & mask


# def are_all_light(values, sensors):
#     '''
#     Returns `True` if all IR sensors listed in `sensors` are
#     detecting a light ground.

#     >>> are_all_light
#     '''
#     mask = 0
#     for s in sensors:
#         mask |= s
#     return values & mask


# def ir_get_values_from(values, sensors):
#     result = []
#     for s in sensors:
#         result.append((values & IR.masks[s]) >> s)
#     return result


def bits(values: int, length: int) -> list[int]:
    """returns a list of bits from a number"""
    result = [0] * length
    for i in range(0, 6):
        result[i] = values & 1
        values >>= 1
    return result


def ir_read_values() -> list[int]:
    return bits(ir_read_values_as_byte(), 6)


def ir_read_values_as_byte():
    try:
        _write(_i2c_patrol, _bytearray([0x1D]))
        buf = _read(_i2c_patrol, 1)
        return buf[0]
    except:
        # sometimes, there is an error reading the sensor
        return -1


def ir_read_all_values_as_bytearray():
    # byte 0 : contains the bits for 0/1 values from each IR sensor
    # bytes 1-12 : contains 2bytes grayscale values for each IR sensor
    # use address 0x1E to ask only for grayscale values
    try:
        _write(_i2c_patrol, _bytearray([0x1D]))
        buf = _read(_i2c_patrol, 13)
        return buf
    except:
        buf = _bytearray(13)
        for i, v in enumerate(buf):
            buf[i] = 0xFF
        # TODO: why return every thing 0xff?
        return buf


# ir sensors
ir_L1 = IRSensor(IR.L1)
"""IR sensor L1"""
ir_R1 = IRSensor(IR.R1)
"""IR sensor R1"""
ir_L2 = IRSensor(IR.L2)
"""IR sensor L2"""
ir_L3 = IRSensor(IR.L3)
"""IR sensor L3"""
ir_R2 = IRSensor(IR.R2)
"""IR sensor R2"""
ir_R3 = IRSensor(IR.R3)
"""IR sensor R3"""
ir_left = ir_L1
"""Alias for IR sensor L1"""
ir_right = ir_R1
"""Alias for IR sensor R1"""
