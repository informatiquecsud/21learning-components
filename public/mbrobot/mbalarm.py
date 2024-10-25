from microbit import *
from delay import delay

OFF = 0
ON = 1

sleep = delay

set_alarm = setAlarm = iframe.contentWindow.setAlarm

playTone = iframe.contentWindow.playTone

def beep(freq=2000, duration=0.1):
    playTone(freq, "sine", duration)
