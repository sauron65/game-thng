const mouse = { x: 0, y: 0, width: 1, height: 1, click: false };

window.addEventListener("mousemove", function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

window.addEventListener("mousedown", function (event) {
  mouse.click = true;
});

window.addEventListener("mouseup", function (event) {
  mouse.click = false;
});

export { mouse };