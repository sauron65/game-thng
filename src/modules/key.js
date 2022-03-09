let key = {};
window.addEventListener("keydown", function (event) {
  key.event = event;
  let keys = event.which;
  let r = true;
  switch (keys) {
    case 39:
      key.right = true;
      event.preventDefault();
      break;
    case 37:
      key.left = true;
      event.preventDefault();
      break;
    case 38:
      key.up = true;
      event.preventDefault();
      break;
    case 40:
      key.down = true;
      event.preventDefault();
      break;
    case 87:
      key.w = true;
      event.preventDefault();
      break;
    case 83:
      key.s = true;
      event.preventDefault();
      break;
    case 65:
      key.a = true;
      event.preventDefault();
      break;
    case 68:
      key.d = true;
      event.preventDefault();
      break;
    case 67:
      key.c = true;
      event.preventDefault();
      break;
    case 16:
      if (event.location == 2) {
        key.shiftr = true;
      } else {
        key.shiftl = true;
      }
      event.preventDefault();
      break;
    case 17:
      if (event.location == 2) {
        key.ctlr = true;
      } else {
        key.ctll = true;
      }
      event.preventDefault();
      break;
    case 18:
      if (event.location == 2) {
        key.altr = true;
      } else {
        key.altl = true;
      }
      event.preventDefault();
      break;
    case 91:
      key.cmdl = true;
      event.preventDefault();
      break;
    case 93:
      key.cmdr = true;
      event.preventDefault();
    case 73:
      key.i = true;
      event.preventDefault();
      break;
    case 32:
      key.space = true;
      event.preventDefault();
      break;
    default:
      break;
  }
});
window.addEventListener("keyup", function (event) {
  let keys = event.which;
  let r = false;
  switch (keys) {
    case 39:
      key.right = false;
      event.preventDefault();
      break;
    case 37:
      key.left = false;
      event.preventDefault();
      break;
    case 38:
      key.up = false;
      event.preventDefault();
      break;
    case 40:
      key.down = false;
      event.preventDefault();
      break;
    case 87:
      key.w = false;
      event.preventDefault();
      break;
    case 83:
      key.s = false;
      event.preventDefault();
      break;
    case 65:
      key.a = false;
      event.preventDefault();
      break;
    case 68:
      key.d = false;
      event.preventDefault();
      break;
    case 67:
      key.c = false;
      event.preventDefault();
      break;
    case 16:
      if (event.location == 2) {
        key.shiftr = false;
      } else {
        key.shiftl = false;
      }
      event.preventDefault();
      break;
    case 17:
      if (event.location == 2) {
        key.ctlr = false;
      } else {
        key.ctll = false;
      }
      event.preventDefault();
      break;
    case 18:
      if (event.location == 2) {
        key.altr = false;
      } else {
        key.altl = false;
      }
      event.preventDefault();
      break;
    case 91:
      key.cmdl = false;
      event.preventDefault();
      break;
    case 93:
      key.cmdr = false;
      event.preventDefault();
    case 73:
      key.i = false;
      event.preventDefault();
      break;
    case 32:
      key.space = false;
      event.preventDefault();
      break;
    default:
      break;
  }
});

export { key };