import { canvas, gl, tileProgram, tileBuffer } from "./modules/gl.js";
import { Vec2 } from "./modules/vec2.js";
import { Mat3 } from "./modules/mat3.js";
import {
  resizeCanvasToDisplaySize,
} from "./modules/functions.js";
import { key } from "./modules/key.js";

const π = Math.PI;
if (!gl) {
  document.querySelector("p").textContent = "Your browser does not support WebGL 2";
  throw new Error("no WebGL 2");
}

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let jh = -16;
let rjh = -16;
let scrollx = 0, scrolly = 0;
let g = false;
let health = 50;
let score = 0;
let ptimer = 0;
let p = true;
let coins = 0;
let pO = false;
let gamepad_connected = false;

/**
 * @type {Gamepad}
 */

let gamepad;
const progress = document.querySelector("#progress");
function gameOver() {
  g = true;
  ////ctx.setTransform(1, 0, 0, 1, 0, 0);
  ////ctx.font = "100px arial";
  ////ctx.fillStyle = "white";
  ////ctx.textAlign = "center";
  ////ctx.textBaseline = "middle";
  ////ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
};
class Sprite extends Vec2 {
  constructor(color, width, height, weight) {
    super(0, 0);
    //alert(color)
    this.color = color;
    this.width = width;
    this.height = height;
    this.gravity = weight || 0;
    this.gravitySpeed = 0;
    this.id = arguments[4] || "";
    this.type = "";
    this.c = true;
    this.f = 0;
    this.d = rand(-1, 1) * 10;
    if (this.d === 0) {
      this.d = 10;
    }
    this.matrix = Mat3.identity();
    // console.log("("+this.width+","+this.height+")")
  }
  update(delta) {
    // this.gravitySpeed += this.gravity;

    //ctx.fillStyle = this.color;
    let gamepads;
    if (gamepad_connected) {
      gamepads = navigator.getGamepads();
      gamepad = gamepads[0];
      //console.log(gamepad.axes)
    }

    if (this.id === "e1") {
      // let d = rand(-10, 10);
      this.x += this.d;
      if (this.cp()) {
        this.x -= this.d;
        this.d = rand(-1, 1) * 10;
        if (this.d === 0) {
          this.d = 10;
        }
      }
    }
    if (this.id === "e2") {
      // let d = rand(-10, 10);
      this.x += this.d;
      if (this.cp()) {
        this.x -= this.d;
        this.d = rand(-1, 1) * 5;
        if (this.d === 0) {
          this.d = 10;
        }
      }
    }
    if (this.id === "p") {
      let d = 300 * delta;
      if (gamepad_connected && gamepad.axes[0] !== 0) {
        d *= Math.abs(gamepad.axes[0]);
      }
      /*if (this.cp3()) {
          pO = true;
        }*/
      if (gamepad_connected ? key.a || gamepad.buttons[2].pressed : key.a) {
        d *= 2;
      }
      d = Math.floor(d);
      if (gamepad_connected ? key.right || gamepad.axes[0] > 0 : key.right) {
        // if (!pO) {
        this.x += d;
        scrollx -= d;
        // }
        if (/*pO*/ this.cp3()) {
          this.x -= d;
          scrollx += d;
        }
        if (this.te()) {
          health--;
          if (health <= 0) {
            gameOver();
          }
        }
      }
      if (gamepad_connected ? key.left || gamepad.axes[0] < 0 : key.left) {
        //  if (!pO) {
        this.x -= d;
        scrollx += d;
        //  }
        if (/*pO*/ this.cp3()) {
          this.x += d;
          scrollx -= d;
        }
        if (this.te()) {
          health -= ptimer * 10;
          if (health <= 0) {
            gameOver();
          }
        }
      }
      if (!this.cp3()) pO = false;
    }
    if (
      this.id === "p" &&
      (gamepad_connected ? key.up || gamepad.buttons[0].pressed : key.up)
    ) {
      this.y++;
      if (this.cp()) {
        this.gravitySpeed = jh;
        if (key.a) {
          this.gravitySpeed = rjh;
        }
        if (this.cd() && !gamepad_connected) {
          newLevel();
        }
      }
      this.y--;
    }
    if (this.id === "p" || this.id === "e1" || this.id === "e2") {
      // if (!pO) {
      this.y += this.gravitySpeed;
      if (this.cp2()) {
        if (this.gravitySpeed < 0) {
          this.f = 1;
        } else {
          this.f = -1;
        }
        while (this.cp2()) {
          this.y += this.f;
        }
        this.gravitySpeed = 0;
      } else {
        this.gravitySpeed += this.gravity;
      }
      //}
    }
    //alert(this.color)
    /*ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );*/
  }
  render() {
    this.matrix = Mat3.translate(
      Mat3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight),
      this.x + scrollx,
      this.y + scrolly
    );
    //this.matrix = Mat3.rotate(this.matrix, angleInRadians);
    //this.matrix = Mat3.scale(this.matrix, scale[0], scale[1]);
    gl.uniform4fv(tileProgram.colorLoc, this.color);
    gl.uniformMatrix3fv(tileProgram.matrixLoc, false, this.matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return this;
  }
  pos(x, y) {
    this.set(x, y);
    //console.log("("+this.x+","+this.y+")")

    return this;
  }
  col(a) {
    let t1, b1, r1, l1, t2, b2, r2, l2;
    let b = this;
    // a.x = a.x;
    // a.y = a.y;
    // a.x = a.x;
    // a.y = a.y;
    if (a.c) {
      t1 = a.y - a.height / 2;
      b1 = a.y + a.height / 2;
      r1 = a.x + a.width / 2;
      l1 = a.x - a.width / 2;
    } else {
      t1 = a.y;
      b1 = a.y + a.height;
      r1 = a.x + a.width;
      l1 = a.x;
    }
    if (b.c) {
      t2 = b.y - b.height / 2;
      b2 = b.y + b.height / 2;
      r2 = b.x + b.width / 2;
      l2 = b.x - b.width / 2;
    } else {
      t2 = b.y;
      b2 = b.y + b.height;
      r2 = b.x + b.width;
      l2 = b.x;
    }
    if (t1 > b2 || r1 < l2 || b1 < t2 || l1 > r2) {
      return false;
    }
    return true;
  }
  cp() {
    /*for (let i = gh[currentLevel].length - 1; i >= 0; i--) {
      if (this.col(gh[currentLevel][i])) {
        return true;
      }
    }
    for (let i = lh[currentLevel].length - 1; i >= 0; i--) {
      if (this.col(lh[currentLevel][i]) && this.id === "p") {
        gameOver();
        return false;
      }
    }
    return false;*/

  }
  cp2() {
    ptimer++;
    if (ptimer > 1000) {
      ptimer = 0;
      p = false;
    }
    for (let i = scene.length - 1; i >= 0; i--) {
      //    console.log(i, scene.length, this)
      if (this.col(scene[i]) && scene[i].id === "e2" && this.id === "p") {
        if (this.gravitySpeed > 0) {
          this.gravitySpeed = -16;
          this.y -= 10;
          if (
            gamepad_connected ? key.up || gamepad.buttons[0].pressed : key.up
          ) {
            this.gravitySpeed = -32;
            this.y -= 10;
          }
          /*if (Math.random() > 0.5) {
              scene.splice(Math.floor(Math.random() * (scene.length - 1)), 5);
            } else {
              tiles.splice(Math.floor(Math.random() * (tiles.length - 1)), 5);
            }*/
          scene.splice(i, 1);
          score += 10;
          if (ptimer < 1001 && p) {
            health += ptimer / 200;
          }
          p = true;
        } else {
          health--;
          if (health <= 0) {
            gameOver();
          }
          scene.splice(i, 1);
        }
        return false;
      }
      for (let i = scene.length - 1; i >= 0; --i) {
        if (scene[i].id === "c" && this.col(scene[i])) {
          coins++;
          score += 5;
          scene.splice(i, 1);
        }
      }
    }
    for (let i = gh[currentLevel].length - 1; i >= 0; --i) {
      if (this.col(gh[currentLevel][i])) {
        return true;
      }
    }
    for (let i = scene.length - 1; i >= 0; --i) {
      if (scene[i].id === "c" && this.col(scene[i])) {
        coins++;
        scene.splice(i, 1);
      }
    }
    for (let i = lh[currentLevel].length - 1; i >= 0; --i) {
      if (this.col(lh[currentLevel][i]) && this.id === "p") {
        gameOver();
        return false;
      }
    }
    return false;
  }
  cp3() {
    for (let i = scene.length - 1; i >= 0; --i) {
      if (scene[i].id === "c" && this.col(scene[i])) {
        coins++;
        scene.splice(i, 1);
      }
    }
    for (let i = gh[currentLevel].length - 1; i >= 0; --i) {
      if (this.col(gh[currentLevel][i])) {
        return true;
      }
    }
    for (let i = lh[currentLevel].length - 1; i >= 0; --i) {
      if (this.col(lh[currentLevel][i]) && this.id === "p") {
        gameOver();
        return false;
      }
    }
    return;
  }
  st(i) {
    this.type = i;
    return this;
  }
  te() {
    for (let i = scene.length - 1; i >= 0; --i) {
      if (scene[i].id === "e1") {
        if (this.col(scene[i])) {
          return true;
        }
      }
    }
  }
  cd() {
    for (let i = scene.length - 1; i >= 0; --i) {
      if (scene[i].id === "d1") {
        if (this.col(scene[i])) {
          return true;
        }
      }
      if (scene[i].id === "d2") {
        if (this.col(scene[i])) {
          scene[i].color = [1, 1.54545454545, 0, 1];
          scene[i].render();
          g = true;
          //  //ctx.fillText("WARP",500,500)

          setTimeout(function () {
            g = false;
          }, 1200);
          currentLevel -= 2;
          alert("U WARP BACK A LEVEL!!");
          return true;
        }
      }
    }
  }
}
function drawTile(color, x, y) {
  gl.uniform4fv(tileProgram.colorLoc, color);
  gl.uniformMatrix3fv(
    tileProgram.matrixLoc,
    false,
    Mat3.translate(
      Mat3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight),
      x + scrollx,
      y + scrolly
    )
  );
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
function rand(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
}
const scene = [];
const tiles = [];
const frontTiles = [];
/**
 * @type {number[]}
 */
let hitBoxTiles;
let currentLevel = 0;
const player = new Sprite([0, 0, 1, 1], 40, 40, 1, "p");
//player.id="p"
const gh = [
  [
    { width: 50 * 6, height: 50 * 6, y: 50 * 4, x: 0 },
    { width: 50 * 1, height: 50 * 6, y: 50 * 0, x: 0 },
    { width: 50 * 9, height: 50 * 6, x: 50 * 9, y: 50 * 4 },
    { width: 50 * 1, height: 50 * 1, x: 50 * 8, y: 50 * 5 },

    { width: 50 * 1, height: 50 * 5, x: 50 * 18, y: 50 * 5 },
    { width: 50 * 1, height: 50 * 4, x: 50 * 19, y: 50 * 6 },
    { width: 50 * 1, height: 50 * 3, x: 50 * 20, y: 50 * 7 },
    { width: 50 * 31, height: 50 * 2, x: 50 * 21, y: 50 * 8 },
    { width: 50 * 2, height: 50 * 2, x: 50 * 54, y: 50 * 8 },
    { width: 50 * 1, height: 50 * 5, x: 50 * 55, y: 50 * 4 },
    { width: 50 * 20, height: 50 * 8, x: 50 * 55, y: 50 * 6 },
    { width: 50 * 1, height: 50 * 1, x: 50 * 51, y: 50 * 7 },
  ],
  [
    { width: 50 * 1, height: 50 * 9, y: 50 * 0, x: 0 },
    { width: 50 * 5, height: 50 * 1, y: 50 * 5, x: 0 },
    { width: 50 * 3, height: 50 * 1, x: 50 * 6, y: 50 * 4 },
    { width: 50 * 5, height: 50 * 1, x: 50 * 11, y: 50 * 2 },
    //{ width: 50 * 1, height: 50 * 5, x: 50 * 18, y: 50 * 5 },
    //{ width: 50 * 1, height: 50 * 4, x: 50 * 19, y: 50 * 6 },
    //{ width: 50 * 1, height: 50 * 3, x: 50 * 20, y: 50 * 7 },
    { width: 50 * 56, height: 50 * 1, x: 50 * 0, y: 50 * 9 },
    //{ width: 50 * 2, height: 50 * 2, x: 50 * 54, y: 50 * 8 },
    { width: 50 * 1, height: 50 * 5, x: 50 * 55, y: 50 * 4 },
    { width: 50 * 8, height: 50 * 1, x: 50 * 20, y: 50 * 3 },
  ],
];
const lh = [
  [
    { width: 50 * 3, height: 50 * 2, y: 50 * 8, x: 50 * 6 },
    { width: 50 * 2, height: 50 * 2, y: 50 * 8, x: 50 * 52 },
  ],
  [
    // { width: 50 * 3, height: 50 * 2, y: 50 * 8, x: 50 * 6 },
    //{ width: 50 * 2, height: 50 * 2, y: 50 * 8, x: 50 * 52 }
  ],
];
const d = [];
const d2 = [];
function parseLayer(layer, width, height, background) {
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      switch (layer[y * width + x]) {
        case 1:
          (background ? tiles : frontTiles).push({
            color: [0.5, 0.5, 0.5, 1],
            x: x * 50 + 25,
            y: y * 50 + 25,
          });
          //console.log("b" + x);
          break;
        case 3:
          (background ? tiles : frontTiles).push({
            color: [1, 0, 0, 1],
            x: x * 50 + 25,
            y: y * 50 + 25,
          });
          //console.log("l");
          break;
        case 4:
          player.pos(x * 50 + 25, y * 50 + 25);
          break;
        case 6:
          scene.push(
            new Sprite([1, 1, 1, 1], 50, 50, 1, "e1").pos(
              x * 50 + 25,
              y * 50 + 24
            )
          );
          break;
        case 7:
          scene.push(
            new Sprite([0, 0.5, 0, 1], 50, 50, 1, "e2").pos(
              x * 50 + 25,
              y * 50 + 24
            )
          );
          break;
        case 8:
          scene.push(
            new Sprite([0.647, 0.164, 0.164, 1], 50, 50, 0, "d1").pos(
              x * 50 + 25,
              y * 50 + 25
            )
          );
          d.push(scene.length - 1);
          break;
        case "/":
          scene.push(
            new Sprite([0, 0, 0, 1], 50, 50, 0, "d2").pos(
              x * 50 + 25,
              y * 50 + 25
            )
          );
          //   d2.push(scene.length - 1);
          break;
        case 5:
          scene.push(
            new Sprite([1, 0.843, 0, 1], 25, 25, 0, "c").pos(
              x * 50 + 25,
              y * 50 + 25
            )
          );
          break;
        default:
          break;
      }
    }
  }
}
function createLevel() {
  scene.splice(0, scene.length);
  d.splice(0, d.length);
  tiles.splice(0, tiles.length);
  frontTiles.splice(0, frontTiles.length);
  scrollx = 0;
  scrolly = 0;
  key.right = false;
  key.left = false;
  key.up = false;
  // scene.push(player)
  const levelWorker = new Worker("/level_worker.js");
  levelWorker.postMessage({
    type: "level",
    file: `/level${currentLevel + 1}.json`,
  });
  levelWorker.onmessage = function (e) {
    if (e.data.type === "level") {
      progress.innerText = "";
      let layer = e.data.background;
      parseLayer(layer, e.data.width, e.data.height, true);
      layer = e.data.foreground;
      parseLayer(layer, e.data.width, e.data.height, false);
      layer = e.data.entities;
      parseLayer(layer, e.data.width, e.data.height, false);
      hitBoxTiles = e.data.hitboxes;
    } else if (e.data.type === "progress") {
      progress.innerText = `${
        (e.data.receivedLength / e.data.contentLength ?? 0) * 100
      }%`;
    }
  };
  /*for (let y = 0; y < levels[currentLevel].length; y++) {
      for (let x = 0; x < levels[currentLevel][y].length; x++) {
        switch (levels[currentLevel][y].charAt(x)) {
          case "b":
            tiles.push({
              color: [0.5, 0.5, 0.5, 1],
              x: x * 50 + 25,
              y: y * 50 + 25
            });
            //console.log("b" + x);
            break;
          case "l":
            scene.push(
              new Sprite([1, 0, 0, 1], 50, 50, 0).pos(x * 50 + 25, y * 50 + 25)
            );
            //console.log("l");
            break;
          case "p":
            player.pos(x * 50 + 25, y * 50 + 25);
            break;
          case "{":
            scene.push(
              new Sprite([1, 1, 1, 1], 50, 50, 1, "e1").pos(
                x * 50 + 25,
                y * 50 + 24
              )
            );
            break;
          case "e":
            scene.push(
              new Sprite([0, 0.5, 0, 1], 50, 50, 1, "e2").pos(
                x * 50 + 25,
                y * 50 + 24
              )
            );
            break;
          case "#":
            scene.push(
              new Sprite([0.647, 0.164, 0.164, 1], 50, 50, 0, "d1").pos(
                x * 50 + 25,
                y * 50 + 25
              )
            );
            d.push(scene.length - 1);
            break;
          case "/":
            scene.push(
              new Sprite([0, 0, 0, 1], 50, 50, 0, "d2").pos(
                x * 50 + 25,
                y * 50 + 25
              )
            );
            //   d2.push(scene.length - 1);
            break;
          case "c":
            scene.push(
              new Sprite([1, 0.843, 0, 0], 25, 25, 0, "c").pos(
                x * 50 + 25,
                y * 50 + 25
              )
            );
            break;
          default:
            break;
        }
      }
    }*/
  scene.push(player);
}
function Aihitbox() {
  for (let i = 0; i < scene.length; i++) {}
}
function newLevel() {
  currentLevel++;
  if (coins <= 0) {
    coins--;
  }
  if (currentLevel > 2 - 1) {
    //ctx.setTransform(1, 0, 0, 1, 0, 0);
    //ctx.font = "100px arial";
    //ctx.fillStyle = "white";
    //ctx.textAlign = "center";
    //ctx.textBaseline = "middle";
    //ctx.fillText("YOU BEAT THE GAME", canvas.width / 2, canvas.height / 2);
    /*ctx.fillText(
      "COINS: %" + Math.round((c / 17) * 100),
      canvas.width / 2,
      canvas.height / 2 + 100
    );*/
    //ctx.fillText("HEALF: " + health, canvas.width / 2, canvas.height / 2 + 200);
    g = true; //+(health/10)+(score/100)
  } else {
    createLevel();
    g = false;
  }
}
createLevel();
//alert(scene.length)
gl.useProgram(tileProgram.program);
gl.enableVertexAttribArray(tileProgram.positionLoc);
gl.bindBuffer(gl.ARRAY_BUFFER, tileBuffer);
gl.vertexAttribPointer(tileProgram.positionLoc, 2, gl.FLOAT, false, 0, 0);

// FPS
// https://stackoverflow.com/a/16447895/13938811

const fpsElem = document.querySelector("#fps");
const avgElem = document.querySelector("#avg");

const frameTimes = [];
let frameCursor = 0;
let numFrames = 0;
const maxFrames = 20;
let totalFPS = 0;

let then = 0;
function render(now) {
  now *= 0.001; // convert to seconds
  const delta = now - then; // compute time since last frame
  then = now; // remember time for next frame
  const fps = 1 / delta; // compute frames per second
  fpsElem.textContent = fps;
  // add the current fps and remove the oldest fps
  totalFPS += fps - (frameTimes[frameCursor] || 0);

  // record the newest fps
  frameTimes[frameCursor++] = fps;

  // needed so the first N frames, before we have maxFrames, is correct.
  numFrames = Math.max(numFrames, frameCursor);

  // wrap the cursor
  frameCursor %= maxFrames;

  const averageFPS = totalFPS / numFrames;

  avgElem.textContent = averageFPS; // update avg display
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //ctx.setTransform(1, 0, 0, 1, 0, 0);
  //ctx.clearRect(0, 0, 1000, 500);
  //ctx.translate(scrollx, scrolly);

  //entities - update
  for (let i = 0; i < scene.length; ++i) {
    const s = scene[i];
    if (!(s.x + scrollx < -200 || s.x + scrollx > gl.canvas.width + 200)) {
      s.update(delta);
      //console.log(scene[i].x+","+scene[i].x)
    }
  }

  //background tiles
  for (let i = 0; i < tiles.length; ++i) {
    const t = tiles[i];
    if (!(t.x + scrollx < -25 || t.x + scrollx > gl.canvas.width + 25)) {
      drawTile(t.color, t.x, t.y);
    }
  }

  //entities
  for (let i = 0; i < scene.length; ++i) {
    const s = scene[i];
    if (!(s.x + scrollx < -200 || s.x + scrollx > gl.canvas.width + 200)) {
      s.render();
      //console.log(scene[i].x+","+scene[i].x)
    }
  }

  //foreground tiles
  for (let i = 0; i < frontTiles.length; ++i) {
    const t = frontTiles[i];
    if (!(t.x + scrollx < -25 || t.x + scrollx > gl.canvas.width + 25)) {
      drawTile(t.color, t.x, t.y);
    }
  }

  //ctx.setTransform(1, 0, 0, 1, 0, 0);
  //ctx.textBaseline = "alphabetic";
  //ctx.textAlign = "start";
  //ctx.fillStyle = "white";
  //ctx.font = "25px arial";
  //ctx.fillText("health:", 10, 25);
  //ctx.fillStyle = "red";
  //ctx.fillRect(90, 5, health * 10, 25);
  //ctx.fillStyle = "white";
  //ctx.font = "25px arial";
  //ctx.fillText("score: " + score, 700, 25);
  //ctx.fillStyle = "white";
  //ctx.font = "25px arial";
  //ctx.fillText("level: " + (currentLevel + 1) + " y:" + player.y, 700, 50);
  if (!g) {
    try {
      requestAnimationFrame(render);
    } catch (e) {
      alert(e);
      requestAnimationFrame(render);
    }
  }
  if (player.y > 550) {
    player.y = -50;
    player.gravitySpeed = 0;
  }
}
//console.log(scene.length)
window.onload = function () {
  window.addEventListener("gamepadconnected", function (e) {
    console.log("connect", e.gamepad);
    gamepad_connected = true;
  });
  window.addEventListener("gamepaddisconnected", function (e) {
    console.log("connect", e.gamepad);
    gamepad_connected = true;
  });
  requestAnimationFrame(render);
  document.addEventListener(
    "keydown",
    function (e) {
      if (e.key === "Enter") {
        toggleFullScreen();
      }
      if (e.key === "Escape") {
        e.preventDefault();
      }
    },
    false
  );
};
window.scene = scene;
window.Sprite = Sprite;
window.Vec2 = Vec2;
window.gl = gl;
window.p = p;
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
