function createAlarm(duration) {
  var alarmInterval = undefined;
  var isOn = false;
  function alarm(on) {
    // console.log("alarm state", on);
    if (on) {
      if (!isOn) {
        alarmInterval = setInterval(() => playSound("bump"), 600);
        isOn = true;
      }
    } else {
      clearInterval(alarmInterval);
      isOn = false;
    }
  }

  return alarm;
}

setAlarm = createAlarm(600);
