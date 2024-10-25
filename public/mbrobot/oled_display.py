# I2C LCD library for the micro:bit
# Thanks to adafruit_Python_SSD1306 library by Dmitrii (dmitryelj@gmail.com)
# Thanks to lopyi2c.py
# Author: fizban99
# v0.1 beta
# Only supports display type I2C128x64

from microbit import Image, i2c
from ustruct import pack_into
from utime import ticks_ms

_char_byte_cache = {}


def _get_char_cols(char):

    if char in _char_byte_cache:
        return _char_byte_cache[char]

    cols = [0] * 10
    for c in range(0, 5):
        col = 0
        for r in range(1, 6):
            p = Image(char).get_pixel(c, r - 1)
            col = col | (1 << r) if (p != 0) else col

        cols[c*2:c*2+1] = [col, col]
    _char_byte_cache[char] = cols
    return cols


class SSD1306:
    # LCD Control constants
    ADDR = 0x3C

    def __init__(self):
        self._d = bytearray(513)  # send byte plus pixels
        self._d[0] = 0x40
        self.zoom = 1

    def cmd(self, c):
        try:
            i2c.write(self.ADDR, b'\x00' + bytearray(c))
        except Exception as e:
            print("Error: ", str(e))

    def init(self):
        cmd = [
            [0xAE],                     # SSD1306_DISPLAYOFF
            [0xA4],                     # SSD1306_DISPLAYALLON_RESUME
            [0xD5, 0xF0],               # SSD1306_SETDISPLAYCLOCKDIV
            [0xA8, 0x3F],               # SSD1306_SETMULTIPLEX
            [0xD3, 0x00],               # SSD1306_SETDISPLAYOFFSET
            [0 | 0x0],                  # line #SSD1306_SETSTARTLINE
            [0x8D, 0x14],               # SSD1306_CHARGEPUMP
            # 0x20 0x00 horizontal addressing
            [0x20, 0x00],               # SSD1306_MEMORYMODE
            [0x21, 0, 127],             # SSD1306_COLUMNADDR
            [0x22, 0, 63],              # SSD1306_PAGEADDR
            [0xa0 | 0x1],               # SSD1306_SEGREMAP
            [0xc8],                     # SSD1306_COMSCANDEC
            [0xDA, 0x12],               # SSD1306_SETCOMPINS
            [0x81, 0xCF],               # SSD1306_SETCONTRAST
            [0xd9, 0xF1],               # SSD1306_SETPRECHARGE
            [0xDB, 0x40],               # SSD1306_SETVCOMDETECT
            [0xA6],                     # SSD1306_NORMALDISPLAY
            [0xd6, 1],                  # zoom on
            [0xaf]                      # SSD1306_DISPLAYON
        ]
        for c in cmd:
            self.cmd(c)

    def set_pos(self, col=0, page=0):
        self.cmd([0xb0 | page])  # page number
        # take upper and lower value of col * 2
        c1, c2 = col * 2 & 0x0F, col >> 3
        self.cmd([0x00 | c1])  # lower start column address
        self.cmd([0x10 | c2])  # upper start column address

    def clear(self, c=0):
        self.set_pos()
        for i in range(1, 513):
            self._d[i] = 0
        self.draw_screen()

    def set_zoom(self, v):
        if self.zoom != v:
            self.cmd([0xd6, v])  # zoom on/off
            self.cmd([0xa7 - v])  # inverted display
            self.zoom = v

    def draw_screen(self):
        self.set_zoom(1)
        self.set_pos()
        i2c.write(self.ADDR, self._d)

    def set_px(self, x, y, color, draw=1):
        # every pixel is stretched vertically => have to copy each pixel twice side by side
        # to make each pixel map to 4x4 pixels
        page, shift_page = divmod(y, 8)
        ind = x * 2 + page * 128 + 1
        b = self._d[ind] | (
            1 << shift_page) if color else self._d[ind] & ~ (1 << shift_page)
        pack_into(">BB", self._d, ind, b, b)
        if draw:
            self.set_pos(x, page)
            i2c.write(0x3c, bytearray([0x40, b, b]))

    def show_values(self, **v):
        t0 = ticks_ms()
        if len(v) > 4:
            raise ValueError("Can show at most 4 values")
        i = 0
        for k, x in v.items():
            self.add_text(0, i, "{}={}    ".format(k, x))
            i += 1
        t1 = ticks_ms()
        return t1 - t0

    def show(self, img, x, y):
        for ix in range(img.width()):
            for iy in range(img.height()):
                self.set_px(x + ix, y + iy, int(img.get_pixel(ix, iy)), draw=0)
        self.draw_screen()

    def get_px(self, x, y):
        page, shift_page = divmod(y, 8)
        ind = x * 2 + page * 128 + 1
        b = (self._d[ind] & (1 << shift_page)) >> shift_page
        return b

    def add_text(self, x: int, y: int, text: str, draw: bool = 1, shrink: bool = False):
        nb_cols = 24 if shrink else 12
        shrink = bool(shrink) + 1
        for i in range(0, min(len(text), nb_cols - x)):
            cols = _get_char_cols(text[i])
            # each char written twice, shifted by one
            # zoom factor => 2 in each direction
            ind = x * 10 // shrink + y * 128 + i * 11 // shrink + 1
            for offset in range(0, 10, shrink):
                self._d[ind + offset // shrink] = cols[offset]
            ind += offset // shrink
            self._d[ind + 1] = 0

        if draw == 1:
            self.set_zoom(1)
            self.set_pos(x * 5, y)
            ind0 = x * 10 + y * 128 + 1
            i2c.write(self.ADDR, b'\x40' + self._d[ind0:ind + 1])


# def test():
#     oled_display = SSD1306()
#     oled_display.init()
#     for i in range(250):
#         oled_display.clear_oled()
#         oled_display.set_px(10, 10, 1)
#         oled_display.set_px(20, 20, 0, 0)
#         oled_display.draw_screen()

oled_display = SSD1306()
oled_display.init()
oled_display.clear()
