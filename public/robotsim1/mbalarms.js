function createAlarm(duration) {
  var alarmInterval = undefined;
  function alarm(on) {
    // console.log("alarm state", on);
    if (on) {
      alarmInterval = setInterval(() => playSound("bump"), 600);
    } else {
      clearInterval(alarmInterval);
    }
  }

  return alarm;
}

setAlarm = createAlarm(600);
