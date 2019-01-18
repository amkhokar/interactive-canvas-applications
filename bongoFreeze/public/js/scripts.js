// ADD TRANSPARENCY OPTION FOR WAVE !
// ADD VOLUME BUTTONS !
// ADD BACKGROUND COLOR OPTION !




//initialize pts.js in global scope
Pts.quickStart("#pt", "rgba(193,205,193)");

(function () {

  var pts = new Group();

  // wave colors
  let colorArrayCurrent = [`rgba(10,10,10)`, `rgba(10,10,10)`, `rgba(10,10,10)`, `rgba(10,10,10)`, `rgba(10,10,10)`, `rgba(10,10,10)`, `rgba(10,10,10)`, `rgba(10,10,10)`];
  let colorArrayOpaque = [`rgba(10,10,10)`, `rgba(10,10,10)`, `rgba(10,10,10)`, `rgba(10,10,10)`, `rgba(10,10,10)`, `rgba(10,10,10)`, `rgba(10,10,10)`, `rgba(10,10,10)`];
  let colorArrayTransparent = [`rgba(10,10,10,0.2)`, `rgba(10,10,10,0.2)`, `rgba(10,10,10,0.2)`, `rgba(10,10,10,0.2)`, `rgba(10,10,10,0.2)`, `rgba(10,10,10,0.2)`, `rgba(10,10,10,0.2)`, `rgba(10,10,10,0.2)`];


  // background colors
  let colorArray = [`rgba(240,255,240)`, `rgba(245,255,250)`, `rgba(240,255,255)`, `rgba(240,248,255)`, `rgba(248,248,255)`, `rgba(245,245,245)`, `rgba(255,245,238)`, `rgba(245,245,220)`];
  let colorArrayTransparentExprimental = [`rgba(240,255,240)`, `rgba(245,255,250)`, `rgba(240,255,255)`, `rgba(240,248,255)`, `rgba(248,248,255)`, `rgba(245,245,245)`, `rgba(255,245,238)`, `rgba(245,245,220)`];

  let noiseLine = [];
  let noiseGrid = [];
  let soundMaker = function (colorString = "rgba(0,0,0)", colorString2 = "rgba(255, 255, 255)") {
    space.add({

      start: (bound) => {

        // Create a line and a grid, and convert them to `Noise` points
        let ln = Create.distributeLinear([new Pt(0, space.center.y), new Pt(space.width, space.center.y)], 30);
        let gd = Create.gridPts(space.innerBound, 20, 20);
        noiseLine = Create.noisePts(ln, 0.1, 0.1);
        noiseGrid = Create.noisePts(gd, 0.05, 0.1, 20, 20);
      },

      animate: (time, ftime) => {

        // Use pointer position to change speed
        let speed = space.pointer.$subtract(space.center).divide(space.center).abs();

        // Generate noise in a grid
        noiseGrid.map((p) => {
          p.step(0.01 * speed.x, 0.01 * (1 - speed.y));
          form.fillOnly(colorString2).point(p, Math.abs(p.noise2D() * space.size.x / 18));
        });

        // Generate noise in a line
        let nps = noiseLine.map((p) => {
          p.step(0.005 * (1 - speed.x), 0.005 * speed.y);
          return p.$add(0, p.noise2D() * space.center.y);
        });

        // Draw wave
        nps = nps.concat([space.size, new Pt(0, space.size.y)]);
        form.fillOnly(colorString).polygon(nps);
        form.fill("rgba(255, 0, 0)").points(nps, 5, "circle");
      }

    });
  }
  let soundMaker2 = function (colorString = "rgba(0,0,0)", colorString2 = "rgba(255, 255, 255)") {
    space.add({

      start: (bound) => {

        // Create a line and a grid, and convert them to `Noise` points
        let ln = Create.distributeLinear([new Pt(0, space.center.y), new Pt(space.width, space.center.y)], 30);
        let gd = Create.gridPts(space.innerBound, 20, 20);
        noiseLine = Create.noisePts(ln, 0.1, 0.1);
        noiseGrid = Create.noisePts(gd, 0.05, 0.1, 20, 20);
      },

      animate: (time, ftime) => {

        // Use pointer position to change speed
        let speed = space.pointer.$subtract(space.center.x).divide(space.center.y).abs();

        // Generate noise in a grid
        noiseGrid.map((p) => {
          p.step(0.01 * speed.x, 0.01 * (1 - speed.y));
          form.fillOnly(colorString2).point(p, Math.abs(p.noise2D() * space.size.x / 18));
        });

        // Generate noise in a line
        let nps = noiseLine.map((p) => {
          p.step(0.005 * (1 - speed.x), 0.005 * speed.y);
          return p.$add(0, p.noise2D() * space.center.y);
        });

        // Draw wave
        nps = nps.concat([space.size, new Pt(0, space.size.y)]);
        form.fillOnly(colorString).polygon(nps);
        form.fill("rgba(255, 0, 0)").points(nps, 5, "circle");
      }

    });
  }

  let windMillMaker = function () {
    let lines;

    // check intersect of a line with other lines
    let intersect = (ln, k) => {
      let ps = new Group();
      for (let i = 0, len = lines.length; i < len; i++) { // this loop can be optimized
        if (i !== k) {
          let ip = Line.intersectLine2D(lines[i], ln);
          if (ip) ps.push(ip);
        }
      }
      return ps;
    };

    space.add({

      // create a grid of lines
      start: (bound) => {
        pts = Create.gridPts(space.innerBound, 10, 10);
        lines = pts.map((p, i) => Line.fromAngle(p, i * Const.one_degree * 10, Math.random() * space.size.x / 5 + 20));
      },

      animate: (time, ftime) => {

        let speed = (space.pointer.x - space.center.x) / space.center.x;

        // rotate each line, then check and draw intersections
        lines.forEach((ln, i) => {
          ln[1].rotate2D(0.02 * speed, ln[0]);
          let ips = intersect(ln, i);

          form.stroke((ips.length > 0) ? "#fff" : "rgba(255,255,255,.3)", 2).line(ln);
          form.strokeOnly("#f03", 2).points(ips, 5, "circle");
        });

      }

    });

  }

  // white circle
  let whiteMaker = function () {
    space.add({
      start: (bound) => {
        follower = space.center;
      },

      animate: (time, ftime) => {
        form.fillOnly("#fff").point(space.pointer, 5, "circle");
      }
    });
  }

  // erasing completely
  let eraserMaker = function () {
    space.add({
      start: (bound) => {
        follower = space.center;
      },

      animate: (time, ftime) => {
        form.fillOnly("rgba(193,205,193)").point(space.pointer, 5000, "circle");
      }
    });
  }

  //drawing
  let defaultDrawingMaker = function (colorString) {
    space.add({
      animate: (time, ftime) => {

        // limit up to 10 points
        if (pts.length > 10 && pts.length % 3 === 0) pts.splice(0, 3);

        // tweak modulo for rotation speed
        for (let i = 4, len = pts.length; i < len; i += 3) {
          pts[i].rotate2D(((i % 5 === 0) ? 0.002 : -0.003), pts[i - 1]);

        }

        form.strokeOnly(colorString, 10, "round").line(Curve.bezier(pts));
        form.strokeOnly(colorString, 1).line(pts);
        form.fillOnly("#fff").points(pts, 1, "circle")
      },

      action: (type, px, py) => {

        if (type == "move") {
          let p = new Pt(px, py);

          if (pts.length < 1) {
            pts.push(p);
            return;
          }

          if (p.$subtract(pts.q1).magnitudeSq() > 900) {

            // the forth point
            if (pts.length === 4) {
              pts.push(p);
              pts.q3.to(Geom.interpolate(pts.q1, pts.q2, 2)); // third pt aligns with the fifth point

              // every third points afterwards
            } else if (pts.length > 4 && pts.length % 3 === 0) {
              pts.push(p);
              pts.push(Geom.interpolate(pts.q2, pts.q1, 2)); // add a new pt to align second-last pt

            } else {
              pts.push(p);
            }

          }
        }
      }
    });
  }
  let linearMaker = function (colorString, pointDensity) {
    space.add({
      start: (bound) => {
        pts = Create.distributeLinear(space.innerBound, pointDensity);
      },

      animate: (time, ftime) => {
        let perpend = new Group(space.center.$subtract(0.9), space.pointer).op(Line.perpendicularFromPt);
        pts.rotate2D(0.005, space.center);
        // pointDensity reps number of lines generated
        // rotate2d first param = speed of animation
        pts.forEach((p, i) => {
          let lp = perpend(p);
          let ratio = Math.min(1, 1 - lp.$subtract(p).magnitude() / (space.size.x / 2));
          let myColor = colorString + `${ratio}`;
          form.stroke(myColor, ratio * 2).line([p, lp]);
          form.fillOnly([myColor, myColor, myColor][i % 3]).point(p, 1);
        });
      },
    });
  }

  // random distribution
  let randomMaker = function (colorString, pointDensity) {
    space.add({
      start: (bound) => {
        pts = Create.distributeRandom(space.innerBound, pointDensity);
      },

      animate: (time, ftime) => {
        let perpend = new Group(space.center.$subtract(0.9), space.pointer).op(Line.perpendicularFromPt);
        pts.rotate2D(0.005, space.center);
        // perpendicular lines
        pts.forEach((p, i) => {
          let lp = perpend(p);
          let ratio = Math.min(1, 1 - lp.$subtract(p).magnitude() / (space.size.x / 2));
          let myColor = colorString + `${ratio}`;
          form.stroke(myColor, ratio * 2).line([p, lp]);
          form.fillOnly([myColor, myColor, myColor][i % 3]).point(p, 1);
        });
      },
    });
  }

  // make linear the default
  let defaultColorString = colorArrayCurrent[0];
  let defaultColorString2 = colorArray[3];
  let defaultAnimation = function () {
    soundMaker(defaultColorString, defaultColorString2);
  }


  const SoundPanels = {};
  const MainSong = new Audio("./audio/through.mp3");
  MainSong.loop = true;
  let switchToTransparentWave = function () {
    for (let i = 0; i < colorArrayCurrent.length; i++) {
      colorArrayCurrent[i] = colorArrayTransparent[i];
    }
    defaultAnimation = function () {
      soundMaker(colorArrayCurrent[7], colorArray[6]);
    }
  }
  let switchToOpaqueWave = function () {
    for (let i = 0; i < colorArrayCurrent.length; i++) {
      colorArrayCurrent[i] = colorArrayOpaque[i];
    }
  }

  // Page interactions which must wait for document
  $(document).ready(function () {
    defaultAnimation();
    space.bindTouch().play();
    space.refresh(false);
    const config = {
      isLensBlank: false,
      isLensEqual: false,
      isLensQ: false,
      isLensW: false,
      isLensE: false,
      isLensR: false,
      isRefresh: false,
      isPaused: true,
      firstPlay: true,
      freezeSpeed: 1,
      isFrozen: false
    }

    // Get page elements within document.ready
    let clearLens = function () {
      $(".lens").css("border", "1px solid white");
      document.body.className = "";
      config.isLensBlank = false;
      config.isLensEqual = false;
      config.isLensQ = false;
      config.isLensW = false;
      config.isLensE = false;
    }



    SoundPanels["1"] = new SoundPanel({
      removeBlankByDefault: true,
      offset: { x: 0, y: 0 },
      playOnPress: new Audio("./audio/bongo1.wav"),
      element: document.getElementById("1"),
      highlight: document.getElementById("1"),
      colorString: colorArrayCurrent[0],
      control: () => {
        defaultAnimation = function () {
          soundMaker(colorArrayCurrent[0], colorArray[7]);
        }

        if (config.isFrozen) {
          space.playOnce(config.freezeSpeed);
        }
      }
    });

    SoundPanels["2"] = new SoundPanel({
      removeBlankByDefault: true,
      playOnPress: new Audio("./audio/bongo2.wav"),
      element: document.getElementById("2"),
      highlight: document.getElementById("2"),
      colorString: colorArrayCurrent[1],
      control: () => {
        defaultAnimation = function () {
          soundMaker(colorArrayCurrent[1], colorArray[0]);
        }
        if (config.isFrozen) {
          space.playOnce(config.freezeSpeed);
        }

      }
    });

    SoundPanels["3"] = new SoundPanel({
      removeBlankByDefault: true,
      playOnPress: new Audio("./audio/bongo3.wav"),
      element: document.getElementById("3"),
      highlight: document.getElementById("3"),
      colorString: colorArrayCurrent[2],
      control: () => {
        defaultAnimation = function () {
          soundMaker(colorArrayCurrent[2], colorArray[1]);
        }
        if (config.isFrozen) {
          space.playOnce(config.freezeSpeed);
        }

      }
    });

    SoundPanels["4"] = new SoundPanel({
      removeBlankByDefault: true,
      playOnPress: new Audio("./audio/bongo4.wav"),
      element: document.getElementById("4"),
      highlight: document.getElementById("4"),
      colorString: colorArrayCurrent[3],
      control: () => {
        defaultAnimation = function () {
          soundMaker(colorArrayCurrent[3], colorArray[2]);
        }
        if (config.isFrozen) {
          space.playOnce(config.freezeSpeed);
        }

      }
    });

    SoundPanels["5"] = new SoundPanel({
      removeBlankByDefault: true,
      playOnPress: new Audio("./audio/bongo5.wav"),
      element: document.getElementById("5"),
      highlight: document.getElementById("5"),
      colorString: colorArrayCurrent[4],
      control: () => {
        defaultAnimation = function () {
          soundMaker(colorArrayCurrent[4], colorArray[3]);
        }
        if (config.isFrozen) {
          space.playOnce(config.freezeSpeed);
        }

      }
    });

    SoundPanels["6"] = new SoundPanel({
      removeBlankByDefault: true,
      playOnPress: new Audio("./audio/bongo_006v.wav"),
      element: document.getElementById("6"),
      highlight: document.getElementById("6"),
      colorString: colorArrayCurrent[5],
      control: () => {
        defaultAnimation = function () {
          soundMaker(colorArrayCurrent[5], colorArray[4]);
        }
        if (config.isFrozen) {
          space.playOnce(config.freezeSpeed);
        }

      }
    });

    SoundPanels["7"] = new SoundPanel({
      removeBlankByDefault: true,
      playOnPress: new Audio("./audio/bongo_006v.wav"),
      element: document.getElementById("7"),
      highlight: document.getElementById("7"),
      control: () => {
        defaultAnimation = function () {
          soundMaker(colorArrayCurrent[6], colorArray[5]);
        }
        if (config.isFrozen) {
          space.playOnce(config.freezeSpeed);
        }

      }
    });
    SoundPanels["8"] = new SoundPanel({
      removeBlankByDefault: true,
      playOnPress: new Audio("./audio/bongo_006v.wav"),
      element: document.getElementById("8"),
      highlight: document.getElementById("8"),
      control: () => {
        defaultAnimation = function () {
          soundMaker(colorArrayCurrent[7], colorArray[6]);
        }
        if (config.isFrozen) {
          space.playOnce(config.freezeSpeed);
        }

        //extra code
      }
    });

    // modifier buttons  9 +

    SoundPanels["9"] = new SoundPanel({
      removeBlankByDefault: true,
      element: document.getElementById("9"),
      control: () => {
        if (config.isRefresh) {
          document.getElementById("9").style.border = "1px solid white";
        }
        if (!config.isRefresh) {
          document.getElementById("9").style.border = "1px solid orange"
        }
        // space.bindMouse(!config.isRefresh);
        space.refresh(!config.isRefresh);
        config.isRefresh = !config.isRefresh;
        //extra code
      },

    });
    SoundPanels["10"] = new SoundPanel({
      removeBlankByDefault: true,
      element: document.getElementById("10"),
      control: () => {
        if (config.isFrozen) {
          space.playOnce(-1);
          document.getElementById("10").style.border = "1px solid white";
        }
        if (!config.isFrozen) {
          space.playOnce(config.freezeSpeed);
          document.getElementById("10").style.border = "1px solid orange";
        }
        config.isFrozen = !config.isFrozen;
      },

    });
    SoundPanels["11"] = new SoundPanel({
      removeBlankByDefault: false,
      element: document.getElementById("11"),
      control: () => {
        if (document.body.classList.contains("eraser")) {
          clearLens();
          document.body.classList.remove("eraser");
          document.getElementById("11").style.border = "1px solid white";
          config.isLensBlank = false;
        } else {
          clearLens();
          document.body.classList.add("eraser");
          document.getElementById("11").style.border = "1px solid violet";
          config.isLensBlank = true;
        }
      },

    });
    SoundPanels["12"] = new SoundPanel({
      removeBlankByDefault: true,
      element: document.getElementById("12"),
      control: () => {
        if (config.isPaused) {
          MainSong.play();
          space.resume();
          document.getElementById("12").classList.remove("paused");
          document.getElementById("12").classList.add("unpaused");
          config.isPaused = !config.isPaused;
        } else {
          MainSong.pause();
          space.pause(true);
          document.getElementById("12").classList.remove("unpaused");
          document.getElementById("12").classList.add("paused");
          config.isPaused = !config.isPaused;
        }
      },
    });
    SoundPanels["13"] = new SoundPanel({
      removeBlankByDefault: true,
      element: document.getElementById("13"),
      control: () => {
        if (document.body.classList.contains("lensEqual")) {
          clearLens();
          config.isLensEqual = false;
        } else {
          clearLens();
          document.getElementById("13").style.border = "1px solid blue";
          document.body.classList.add("lensEqual");
          config.isLensEqual = true;
        }
      },
    });
    SoundPanels["14"] = new SoundPanel({
      removeBlankByDefault: true,
      element: document.getElementById("14"),
      control: () => {
        if (document.body.classList.contains("lensQ")) {
          clearLens();
          config.isLensQ = false;
        } else {
          clearLens();
          document.getElementById("14").style.border = "1px solid blue";
          document.body.classList.add("lensQ");
          config.isLensQ = true;
        }
      },
    });
    SoundPanels["15"] = new SoundPanel({
      removeBlankByDefault: true,
      element: document.getElementById("15"),
      control: () => {
        if (document.body.classList.contains("lensW")) {
          clearLens();
          config.isLensW = false;
        } else {
          clearLens();
          document.getElementById("15").style.border = "1px solid blue";
          document.body.classList.add("lensW");
          config.isLensW = true;
        }
      },
    });
    SoundPanels["16"] = new SoundPanel({
      removeBlankByDefault: true,
      element: document.getElementById("16"),
      control: () => {
        if (document.body.classList.contains("lensE")) {
          clearLens();
          config.isLensE = false;
        } else {
          clearLens();
          document.getElementById("16").style.border = "1px solid blue";
          document.body.classList.add("lensE");
          config.isLensE = true;
        }  // yo my name is derek
      },
    });
    SoundPanels["17"] = new SoundPanel({
      removeBlankByDefault: true,
      element: document.getElementById("17"),
      control: () => {
        if (!config.isLensR) {
          switchToTransparentWave();
          document.getElementById("17").style.border = "1px solid orange";
          config.isLensR = true;
        } else {
          switchToOpaqueWave();
          document.getElementById("17").style.border = "1px solid white";
          config.isLensR = false;
        }
        if (config.isFrozen) {
          space.playOnce(100);
        }
      },
    });

    document.addEventListener("keydown", ({ which }) => {
      // If highlights contains eventcode, highlight that cell
      const key = keyBindings[which];
      const soundPanel = SoundPanels[key];
      if (!soundPanel) return;
      if (soundPanel.removeBlankByDefault) {
        document.getElementById("11").style.border = "1px solid white";
        document.body.classList.remove("eraser");
        config.isLensBlank = false;
      }
      if (soundPanel.removeBlankByDefault == false) {
        if (config.isLensBlank) {
          document.getElementById("11").style.border = "1px solid white";
          document.body.classList.add("eraser");
          config.isLensBlank = false;
        } else {
          clearLens();
          config.isLensBlank = true;
        }
      }

      if (soundPanel.playOnPress) playAudio(soundPanel.playOnPress);
      if (soundPanel.highlight) highlight(soundPanel.highlight);
      if (soundPanel.control) soundPanel.control();
      if (soundPanel.setText) {
        document.getElementById("change").textContent = soundPanel.setText;
      }
      space.removeAll();
      defaultAnimation();
      update();
    });

    document.addEventListener("keyup", ({ which }) => {
      const key = keyBindings[which];
      const soundPanel = SoundPanels[key];
      if (!soundPanel) return;
      if (soundPanel.highlight) unHighlight(soundPanel.highlight);
    });
  });


  const update = () => {
    window.requestAnimationFrame(update);
  };

  highlight = element => {
    element.style.border = "1px solid black";
  };

  unHighlight = element => {
    element.style.border = "1px solid white";
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
    83: "12",
    187: "13",
    81: "14",
    87: "15",
    69: "16",
    82: "17"
  };

  class SoundPanel {
    constructor(options) {
      Object.assign(this, options);
    }
  }
  MainSong.currentTime = 42;

})();