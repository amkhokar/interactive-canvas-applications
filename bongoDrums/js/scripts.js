// Page interactions which must wait for documen
const SoundPanels = {};

$(document).ready(function() {
  const MainSong = new Audio("./audio/instrumental.mp3");
  // Get page elements within document.ready

  SoundPanels["1"] = new SoundPanel({
    playOnPress: new Audio("./audio/bongo1.wav"),
    element: document.getElementById("1"),
    highlight: document.getElementById("1"),
    offset: { x: 0, y: 0 }
  });

  SoundPanels["2"] = new SoundPanel({
    playOnPress: new Audio("./audio/bongo2.wav"),
    element: document.getElementById("2"),
    highlight: document.getElementById("2")
  });

  SoundPanels["3"] = new SoundPanel({
    playOnPress: new Audio("./audio/bongo3.wav"),
    element: document.getElementById("3"),
    highlight: document.getElementById("3")
  });

  SoundPanels["4"] = new SoundPanel({
    playOnPress: new Audio("./audio/bongo4.wav"),
    element: document.getElementById("4"),
    highlight: document.getElementById("4")
  });

  SoundPanels["5"] = new SoundPanel({
    playOnPress: new Audio("./audio/bongo5.wav"),
    element: document.getElementById("5"),
    highlight: document.getElementById("5")
  });

  SoundPanels["6"] = new SoundPanel({
    playOnPress: new Audio("./audio/bongo_006v.wav"),
    element: document.getElementById("6"),
    highlight: document.getElementById("6")
  });

  SoundPanels["7"] = new SoundPanel({
    element: document.getElementById("7"),
    highlight: document.getElementById("7"),
    control: () => {
      MainSong.play();
    }
  });
  SoundPanels["8"] = new SoundPanel({
    element: document.getElementById("8"),
    highlight: document.getElementById("8"),
    control: () => {
      MainSong.pause();
    }
  });
  SoundPanels["9"] = new SoundPanel({
    element: document.getElementById("9"),
    highlight: document.getElementById("9"),
    control: () => {
      MainSong.currentTime = 0;
      MainSong.play();
    }
  });

  document.addEventListener("keydown", ({ which }) => {
    // If highlights contains eventcode, highlight that cell
    const key = keyBindings[which];
    const soundPanel = SoundPanels[key];
    if (!soundPanel) return;
    if (soundPanel.playOnPress) playAudio(soundPanel.playOnPress);
    if (soundPanel.highlight) highlight(soundPanel.highlight);
    if (soundPanel.control) soundPanel.control();
    if (soundPanel.setText){
      document.getElementById("change").textContent = soundPanel.setText;
    } 
  });

  document.addEventListener("keyup", ({ which }) => {
    const key = keyBindings[which];
    const soundPanel = SoundPanels[key];
    if (!soundPanel) return;

    if (soundPanel.highlight) unHighlight(soundPanel.highlight);
  });
  update();
  
});

const update = () => {
  colorChanger();
  window.requestAnimationFrame(update);
};

let percentage = 0;
let colorDirection = true;

let sizeDirection = true;
let changeSize = function() {
  let selectedElement = document.getElementById(`change`);
  if (sizeDirection) {
    sizeDirection = false;
    selectedElement.style.color = "black";
  } else {
    sizeDirection = true;
    selectedElement.style.color = "white";
  }
};


let colorChanger = function() {
  if (percentage == 100) {
    colorDirection = false;
    changeSize();
  }
  if (percentage == 0) {
    colorDirection = true;
    changeSize();
  }
  if (colorDirection) {
    percentage++;
    let stringWithPercentage = `${percentage}` + "%";
    let changedProperty = `linear-gradient(to right, red, red ${stringWithPercentage}, orange,yellow,green,blue,indigo,violet)`;
    $("body").css("background-image", changedProperty);
  } else {
    percentage--;
    let stringWithPercentage = `${percentage}` + "%";
    let changedProperty = `linear-gradient(to left, red, red ${stringWithPercentage}, orange,yellow,green,blue,indigo,violet)`;
    $("body").css("background-image", changedProperty);
  }
};

highlight = element => {
  element.style.border = "3px solid white";
  element.style.color = "black";
};

unHighlight = element => {
  element.style.border = "3px solid white";
  element.style.color = "white";
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
  57: "9"
};

class SoundPanel {
  constructor(options) {
    Object.assign(this, options);
  }
}
