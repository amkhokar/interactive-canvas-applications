//initialize pts.js in global scope
Pts.quickStart("#pt", "#123");

(function () {

  var pts = new Group();
  var colorArray = [`rgba(0,0,0,`, `rgba(0,0,255,`, `rgba(0,255,0,`, `rgba(0,255,255,`, `rgba(102,0,102,`, `rgba(255,255,255,`]

  // 100 points


  // white circle

  var whiteMarker = function() {

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
  var eraserMaker = function () {

    space.add({
      start: (bound) => {
        follower = space.center;
      },

      animate: (time, ftime) => {
        form.fillOnly("hsl(210, 50%, 13%)").point(space.pointer, 5000, "circle");
      }

    });
  }

  //drawing
  var defaultDrawingColor = "blue"
  var defaultDrawingMaker = function (colorString){
    space.add({
      animate: (time, ftime) => {

        // limit up to 50 points
        if (pts.length > 10 && pts.length % 3 === 0) pts.splice(0, 3);

        // rotate the control points slowly
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
  var linearMaker = function (colorString, pointDensity) {
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
          var ratio = Math.min(1, 1 - lp.$subtract(p).magnitude() / (space.size.x / 2));
          var myColor = colorString + `${ratio}`;
          form.stroke(myColor, ratio * 2).line([p, lp]);
          form.fillOnly([myColor, myColor, myColor][i % 3]).point(p, 1);
        });
      },
    });
  }

  // random distribution
  var randomMaker = function (colorString, pointDensity) {
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
          var ratio = Math.min(1, 1 - lp.$subtract(p).magnitude() / (space.size.x / 2));
          var myColor = colorString + `${ratio}`;
          form.stroke(myColor, ratio * 2).line([p, lp]);
          form.fillOnly([myColor, myColor, myColor][i % 3]).point(p, 1);
        });
      },
    });
  }

  // make linear the default 
  var defaultDrawingColor = "white";
  var defaultAnimation = function(){
    defaultDrawingMaker(defaultDrawingColor);
  }

  defaultAnimation();
  space.bindMouse().bindTouch().play();
  space.pause(true);
  space.resume();
  
  // linearMaker(colorArray[5], 50);
  // randomMaker(colorArray[5], 50);
  // defaultDrawingMaker();
  // whiteMarker();
  // add hover and touch functionality
  const SoundPanels = {};
  const MainSong = new Audio("./audio/instrumental5.mp3");
  
  // Page interactions which must wait for document
  $(document).ready(function () {
     let isPaused = true; 

    // Get page elements within document.ready
    
    SoundPanels["1"] = new SoundPanel({
      offset: { x: 0, y: 0 },
      playOnPress: new Audio("./audio/bongo1.wav"),
      element: document.getElementById("1"),
      highlight: document.getElementById("1"),
      colorString: colorArray[0],
      control: () => {
        space.removeAll();
        defaultDrawingMaker(defaultDrawingColor);
      }
    });

    SoundPanels["2"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo2.wav"),
      element: document.getElementById("2"),
      highlight: document.getElementById("2"),
      colorString: colorArray[1],
      control: () => {
        space.removeAll();
        whiteMarker();
      }
    });

    SoundPanels["3"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo3.wav"),
      element: document.getElementById("3"),
      highlight: document.getElementById("3"),
      colorString: colorArray[2],
      control: () => {
        space.removeAll();
        randomMaker(colorArray[2], 10);
      }
    });

    SoundPanels["4"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo4.wav"),
      element: document.getElementById("4"),
      highlight: document.getElementById("4"),
      colorString: colorArray[3],
      control: () => {
        space.removeAll();
        linearMaker(colorArray[3], 10);
      }
    });

    SoundPanels["5"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo5.wav"),
      element: document.getElementById("5"),
      highlight: document.getElementById("5"),
      colorString: colorArray[4],
      control: () => {
        space.removeAll();
        randomMaker(colorArray[4], 10);
      }
    });

    SoundPanels["6"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo_006v.wav"),
      element: document.getElementById("6"),
      highlight: document.getElementById("6"),
      colorString: colorArray[5],
      control: () => {
        space.removeAll();
        linearMaker(colorArray[0], 10);
      }
    });

    SoundPanels["7"] = new SoundPanel({
      element: document.getElementById("7"),
      highlight: document.getElementById("7"),
      control: () => {
        // extra code
      }
    });
    SoundPanels["8"] = new SoundPanel({
      element: document.getElementById("8"),
      highlight: document.getElementById("8"),
      control: () => {
        //extra code
      }
    });
    SoundPanels["9"] = new SoundPanel({
      element: document.getElementById("9"),
      highlight: document.getElementById("9"),
      control: () => {
        space.removeAll();
        space.refresh(true);
        defaultAnimation();
        //extra code 
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
      eraserMaker();
      },

    });
    SoundPanels["12"] = new SoundPanel({
      element: document.getElementById("12"),
      control: () => {
        if (isPaused) {
        document.getElementById("12").style.border = "3px solid white";
          firstPlay = true; 
          MainSong.play();
          space.resume();
          isPaused = !isPaused;
        } else {
          document.getElementById("12").style.border = "3px solid black";
          MainSong.pause();
          space.pause(true);
          isPaused = !isPaused;
        }
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
    });
  });


  const update = () => {
    space.refresh(false);
    window.requestAnimationFrame(update);
  };

  highlight = element => {
    element.style.border = "3px solid black";
    element.style.color = "red";
  };

  unHighlight = element => {
      element.style.border = "3px solid white";
      element.style.color = "black";
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