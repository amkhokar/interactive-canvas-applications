Pts.namespace(this); // not needed if using npm package

var space = new CanvasSpace("#hello").setup({ retina: true });
var form = space.getForm();

space.add((time, ftime) => {
  form.fill("#f03").point(space.pointer, 10, "circle");
});



space.bindMouse().bindTouch().play();
