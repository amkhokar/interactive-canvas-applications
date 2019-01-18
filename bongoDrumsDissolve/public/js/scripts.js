//initialize pts.js in global scope
Pts.quickStart("#pt", "#123");

(function () {

  var pts = new Group();
  var colorArray = [`rgba(0,0,0,`, `rgba(0,0,255,`, `rgba(0,255,0,`, `rgba(0,255,255,`, `rgba(102,0,102,`, `rgba(255,255,255,`]

  // 100 points
  var secondAdd = function (colorString, pointDensity) {
    space.add({
      start: (bound) => {
        pts = Create.distributeRandom(space.innerBound, pointDensity);
      },

      animate: (time, ftime) => {
        let perpend = new Group(space.center.$subtract(0.9), space.pointer).op(Line.perpendicularFromPt);
        pts.rotate2D(0.0100, space.center);
        // perpendicular lines
        pts.forEach((p, i) => {
          let lp = perpend(p);
          var ratio = Math.min(1, 1 - lp.$subtract(p).magnitude() / (space.size.x / 2));
          var myColor = colorString + `${ratio}`;
          form.stroke(myColor, ratio * 2).line([p, lp]);
          form.fillOnly(["#f03", "#09f", "#0c6"][i % 3]).point(p, 1);
        });
      },
    });
  }
  var firstAdd = function (colorString, pointDensity) {
    space.add({
      start: (bound) => {
        pts = Create.distributeLinear(space.innerBound, pointDensity);
      },

      animate: (time, ftime) => {
        let perpend = new Group(space.center.$subtract(1), space.pointer).op(Line.perpendicularFromPt);
        pts.rotate2D(100, space.center);
        // perpendicular lines
        pts.forEach((p, i) => {
          let lp = perpend(p);
          var ratio = Math.min(1, 1 - lp.$subtract(p).magnitude() / (space.size.x / 2));
          var myColor = colorString + `${ratio}`;
          form.stroke(myColor, ratio * 2).line([p, lp]);
          form.fillOnly(["#f03", "#09f", "#0c6"][i % 3]).point(p, 1);
        });
      },
    });
  }


  secondAdd('rgba(255,255,255,', 10);
  // add hover and touch functionality
  // Page interactions which must wait for document
  const SoundPanels = {};

  $(document).ready(function () {
    let currentTimeVariable = 0;

    let countDown = function () {
      if (currentTimeVariable === 60) {
        currentTimeVariable = 0;
      }
      currentTimeVariable++;
    }

    let firstPlay = false;
    let firstDiff = false;
    const MainSong = new Audio("./audio/instrumental.mp3");
    // Get page elements within document.ready

    SoundPanels["1"] = new SoundPanel({
      offset: { x: 0, y: 0 },
      playOnPress: new Audio("./audio/bongo1.wav"),
      element: document.getElementById("1"),
      highlight: document.getElementById("1"),
      colorString: colorArray[0],
      control: () => {
        space.pause();
        space.removeAll();
        secondAdd(colorArray[0], 10);
        space.resume();
      }
    });

    SoundPanels["2"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo2.wav"),
      element: document.getElementById("2"),
      highlight: document.getElementById("2"),
      colorString: colorArray[1],
      control: () => {
        space.pause();
        space.removeAll();
        firstAdd(colorArray[1], 10);
        space.resume();
      }
    });

    SoundPanels["3"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo3.wav"),
      element: document.getElementById("3"),
      highlight: document.getElementById("3"),
      colorString: colorArray[2],
      control: () => {
        space.pause();
        space.removeAll();
        firstAdd(colorArray[2], 10);
        space.resume();
      }
    });

    SoundPanels["4"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo4.wav"),
      element: document.getElementById("4"),
      highlight: document.getElementById("4"),
      colorString: colorArray[3],
      control: () => {
        space.pause();
        space.removeAll();
        secondAdd(colorArray[3], 10);
        space.resume();
      }
    });

    SoundPanels["5"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo5.wav"),
      element: document.getElementById("5"),
      highlight: document.getElementById("5"),
      colorString: colorArray[4],
      control: () => {
        space.pause();
        space.removeAll();
        firstAdd(colorArray[4], 10);
        space.resume();
      }
    });

    SoundPanels["6"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo_006v.wav"),
      element: document.getElementById("6"),
      highlight: document.getElementById("6"),
      colorString: colorArray[5],
      control: () => {
        space.pause();
        space.removeAll();
        secondAdd(colorArray[5], 10);
        space.resume();
      }
    });

    SoundPanels["7"] = new SoundPanel({
      element: document.getElementById("7"),
      highlight: document.getElementById("7"),
      control: () => {
        MainSong.play();
        space.resume();
      }
    });
    SoundPanels["8"] = new SoundPanel({
      element: document.getElementById("8"),
      highlight: document.getElementById("8"),
      control: () => {
        MainSong.pause();
        space.pause(true);
        space.refresh(true);
      }
    });
    SoundPanels["9"] = new SoundPanel({
      element: document.getElementById("9"),
      highlight: document.getElementById("9"),
      control: () => {
        MainSong.currentTime = 0;
        MainSong.play();
        if (!firstPlay) {
          space.play();
          space.refresh(false);
          firstPlay = true;
        } else {
          space.resume();
          space.refresh(true);
        }
      },

    });
    SoundPanels["10"] = new SoundPanel({
      element: document.getElementById("10"),
      highlight: document.getElementById("10"),
      control: () => {
        history.go(0);
      },

    });
    SoundPanels["11"] = new SoundPanel({
      element: document.getElementById("11"),
      highlight: document.getElementById("11"),
      control: () => {
        if (!firstDiff) {
          secondAdd(colorArray[0], 20);
          firstDiff = true;
          firsplay = true;
          space.refresh(true);
          space.removeAll();
        }
      },

    });
    SoundPanels["12"] = new SoundPanel({
      element: document.getElementById("12"),
      highlight: document.getElementById("12"),
      control: () => {
        space.replay();
      },

    });

    document.addEventListener("keydown", ({ which }) => {
      // If highlights contains eventcode, highlight that cell
      const key = keyBindings[which];
      const soundPanel = SoundPanels[key];
      if (!soundPanel) return;
      if (soundPanel.playOnPress) playAudio(soundPanel.playOnPress);
      if (soundPanel.highlight) highlight(soundPanel.highlight);
      if (soundPanel.control) soundPanel.control();
      if (soundPanel.setText) {
        document.getElementById("change").textContent = soundPanel.setText;
      }
      update();
    });

    document.addEventListener("keyup", ({ which }) => {
      const key = keyBindings[which];
      const soundPanel = SoundPanels[key];
      if (!soundPanel) return;
      if (soundPanel.highlight) unHighlight(soundPanel.highlight);
      firstDiff = !firstDiff;
      firstPlay = !firstPlay;
    });
  });


  const update = () => {
    space.pause();
    space.refresh();
    space.resume();
    window.requestAnimationFrame(update);
  };

  highlight = element => {
    if (element == document.getElementById("9") || element == document.getElementById("7")) {
      document.getElementById("8").style.border = "3px solid white";
      document.getElementById("8").style.color = "black";
    }
    element.style.border = "3px solid black";
    element.style.color = "red";
  };

  unHighlight = element => {
    if (element != document.getElementById("8")) {
      element.style.border = "3px solid white";
      element.style.color = "black";
    }
  };

  const playAudio = audio => {
    audio.currentTime = 0;
    audio.play();
  };

  const keyBindings = {
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    48: "10",
    189: "11",
    83: "12"
  };

  class SoundPanel {
    constructor(options) {
      Object.assign(this, options);
    }
  }

})();