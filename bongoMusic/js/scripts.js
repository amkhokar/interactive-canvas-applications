// ADD TRANSPARENCY OPTION FOR WAVE ! 
// ADD VOLUME BUTTONS !
// ADD BACKGROUND COLOR OPTION ! 




//initialize pts.js in global scope
Pts.quickStart("#pt", "#123");

(function () {

  var pts = new Group();
  var ps = new Group();
  var colorArrayTransparent = [`rgba(0,0,0,0.1`, `rgba(0,0,255,0.1`, `rgba(0,255,0,0.1`, `rgba(0,255,255,0.1`, `rgba(102,0,102,0.1`, `rgba(255,255,255,0.1`];
  var colorArray = [`rgba(0,0,0)`, `rgba(0,0,255)`, `rgba(0,255,0)`, `rgba(0,255,255)`, `rgba(102,0,102)`, `rgba(255,255,255)`];

  let noiseLine = [];
  let noiseGrid = [];
  var soundMaker = function(colorString, colorString2="orange") {
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
        p.step(0.01 * (1 - speed.x), 0.05 * speed.y);
        return p.$add(0, p.noise2D() * space.center.y);
      });

      // Draw wave
      nps = nps.concat([space.size, new Pt(0, space.size.y)]);
      form.fillOnly(colorString).polygon(nps);
      form.fill("red").points(nps, 2, "circle");
    }

  });
}

  var windMillMaker = function() {
    var lines;

    // check intersect of a line with other lines
    var intersect = (ln, k) => {
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
  var whiteMaker = function() {

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
  var defaultDrawingMaker = function (colorString){
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
let defaultColorString = "black";
let defaultColorString2 ="white";
let defaultAnimation = function(){
    soundMaker(defaultColorString, defaultColorString2);
  }
  defaultAnimation();
  const SoundPanels = {};
  const MainSong = new Audio("./audio/instrumental5.mp3");
  
  // Page interactions which must wait for document
  $(document).ready(function () {
    space.play();
    space.refresh(false);
    let isRefresh = false; 
    let isPaused = true; 
    let firstPlay = true;
    // Get page elements within document.ready
    
    SoundPanels["1"] = new SoundPanel({
      offset: { x: 0, y: 0 },
      playOnPress: new Audio("./audio/bongo1.wav"),
      element: document.getElementById("1"),
      highlight: document.getElementById("1"),
      colorString: colorArrayTransparent[0],
      control: () => {
        defaultAnimation = function() {
          soundMaker(colorArrayTransparent[0], colorArray[5]);
        }
      }
    });

    SoundPanels["2"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo2.wav"),
      element: document.getElementById("2"),
      highlight: document.getElementById("2"),
      colorString: colorArrayTransparent[1],
      control: () => {
          defaultAnimation = function(){
            soundMaker(colorArrayTransparent[1], colorArray[0]); 
        }
      }
    });

    SoundPanels["3"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo3.wav"),
      element: document.getElementById("3"),
      highlight: document.getElementById("3"),
      colorString: colorArrayTransparent[2],
      control: () => {
          defaultAnimation = function(){
            soundMaker(colorArrayTransparent[2], colorArray[1]);      
        }
      }
    });

    SoundPanels["4"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo4.wav"),
      element: document.getElementById("4"),
      highlight: document.getElementById("4"),
      colorString: colorArrayTransparent[3],
      control: () => {
          defaultAnimation = function(){
            soundMaker(colorArrayTransparent[3], colorArray[2]);      
        }
      }
    });

    SoundPanels["5"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo5.wav"),
      element: document.getElementById("5"),
      highlight: document.getElementById("5"),
      colorString: colorArrayTransparent[4],
      control: () => {
          defaultAnimation = function(){
            soundMaker(colorArrayTransparent[4], colorArray[3]);      
        }
      }
    });

    SoundPanels["6"] = new SoundPanel({
      playOnPress: new Audio("./audio/bongo_006v.wav"),
      element: document.getElementById("6"),
      highlight: document.getElementById("6"),
      colorString: colorArrayTransparent[5],
      control: () => {
          defaultAnimation = function(){
            soundMaker(colorArrayTransparent[5], colorArray[4]);      
        }
      }
    });

    SoundPanels["7"] = new SoundPanel({
      element: document.getElementById("7"),
      highlight: document.getElementById("7"),
      control: () => {
          defaultAnimation = function(){
            soundMaker(colorArrayTransparent[5], colorArray[0]);      
        }
      }
    });
    SoundPanels["8"] = new SoundPanel({
      element: document.getElementById("8"),
      highlight: document.getElementById("8"),
      control: () => {

        space.resume();

        //extra code
      }
    });
    SoundPanels["9"] = new SoundPanel({
      element: document.getElementById("9"),
      control: () => {
        if (isRefresh) {
          document.getElementById("9").style.border = "3px solid white";
        } 
        if (!isRefresh) {
          document.getElementById("9").style.border = "3px solid black"
        }
        // space.bindMouse(!isRefresh);
        space.refresh(!isRefresh);
        isRefresh = !isRefresh;
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
        space.clear();
      },

    });
    SoundPanels["12"] = new SoundPanel({
      element: document.getElementById("12"),
      control: () => {
        if (isPaused) {
        document.getElementById("12").style.border = "3px solid white"; 
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
      space.removeAll();
      defaultAnimation();
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