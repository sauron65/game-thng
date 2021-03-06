import { canvas, gl, program, tileBuffer, tileProgram, uvBuffer, textures } from "./modules/gl.js";
import { Vec2 } from "./modules/vec2.js";
import { Mat3 } from "./modules/mat3.js";
import {
  resizeCanvasToDisplaySize,
} from "./modules/functions.js";
import { key } from "./modules/key.js";
import { mouse } from "./modules/mouse.js";

const π = Math.PI;
if (!gl) {
  document.querySelector("p").textContent = "Your browser does not support WebGL 2. (Recomended) Use a recent version of Chrome/Edge"/* + ", or Safari 15+"*/;
  throw new Error("no WebGL 2");
}

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const canvas2 = document.createElement("canvas");
canvas2.style = `position: absolute; left: 0px; top: 0px; width: ${window.innerWidth}px; height: ${window.innerHeight}px; zIndex: 1;`;
document.body.appendChild(canvas2);
const ctx = canvas2.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

let jh = -16;
let rjh = -18;
let scrollx = 0, scrolly = 0;
let g = false;
let screen = "title";
let health = 50;
let score = 0;
let ptimer = 0;
let p = true;
let coins = 0;
let pO = false;
let gamepad_connected = false;

globalThis.screen = screen;

/**
 * @type {Gamepad}
 */

let gamepad;
const progress = document.querySelector("#progress");
function gameOver() {
  g = true;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = "100px arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  setTimeout(function () {
    g = false;
    globalThis.screen = "title";
    health = 50;
    ptimer = 0;
    coins = 0;
    score = 0;
    currentLevel = 0;
    requestAnimationFrame(render);
  }, 5000)
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
    this.d = rand(-1, 1) * 400;
    if (this.d === 0) {
      this.d = 384;
    }
    this.matrix = Mat3.identity();
    // console.log("("+this.width+","+this.height+")")
  }
  update(delta) {
    // this.gravitySpeed += this.gravity;

    //ctx.fillStyle = this.color;

    if (this.id === "e1") {
      // let d = rand(-10, 10);
      this.x += this.d * delta;
      if (this.cp()) {
        this.x -= this.d * delta;
        this.d = rand(-1, 1) * 400;
        if (this.d === 0) {
          this.d = 384;
        }
      }
    }
    if (this.id === "e2") {
      // let d = rand(-10, 10);
      this.x += this.d * delta;
      if (this.cp()) {
        this.x -= this.d * delta;
        this.d = rand(-1, 1) * 400;
        if (this.d === 0) {
          this.d = 384;
        }
      }
      this.y++
      if (!this.cp()) {
        this.x -= this.d * delta;
        this.d = rand(-1, 1) * 400;
        if (this.d === 0) {
          this.d = 384;
        }
      }
      this.y--
      if (this.ce2()) {
        this.x -= this.d * delta;
        this.d = -this.d;
      }
    }
    if (this.id === "p") {
      let d = 384 * delta;
      if (gamepad_connected && !key.right && !key.left) {
        d *= Math.abs(gamepad.axes[0]);
      }
      /*if (this.cp3()) {
          pO = true;
        }*/
      if (gamepad_connected ? key.a || gamepad.buttons[2].pressed : key.a) {
        d *= 2;
      }
      d = Math.floor(d);
      if (gamepad_connected ? key.right || (gamepad.axes[0] > 0) : key.right) {
        // if (!pO) {
        this.x += d;
        scrollx -= d;
        // }
        if (/*pO*/ this.cp3()) {
          this.x -= d;
          scrollx += d;
        }
      }
      if (gamepad_connected ? key.left || (gamepad.axes[0] < 0) : key.left) {
        //  if (!pO) {
        this.x -= d;
        scrollx += d;
        //  }
        if (/*pO*/ this.cp3()) {
          this.x += d;
          scrollx -= d;
        }
      }
      if (!this.cp3()) pO = false;
      if (this.te()) {
        health--
        if (health <= 0) {
          gameOver();
        }
      }
    }
    if (
      this.id === "p" &&
      (gamepad_connected ? key.space || gamepad.buttons[0].pressed : key.space)
    ) {
      this.y++;
      if (this.cp()) {
        this.gravitySpeed = jh;
        if (key.a || gamepad_connected ? key.a || gamepad.buttons[2].pressed : key.a) {
          this.gravitySpeed = rjh;
        }
      }
      this.y--;
    }
    if (this.id === "p" && key.up && this.cd()) {
      newLevel()
    }
    if (this.id === "p" && gamepad_connected && gamepad.axes[1] < -0.6) {
      if (this.cd()) {
        newLevel();
      }
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
    //gl.uniform4fv(program.colorLoc, this.color);
    gl.uniform1i(tileProgram.textureLoc, this.color);
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
    //const tile = solidTileAt(this.x, this.y);

    const left = this.x - this.width / 2;
    const right = this.x + this.width / 2 - 1;
    const top = this.y - this.height / 2;
    const bottom = this.y + this.height / 2 - 1;

    if (solidTileAt(left, top) === 1 || solidTileAt(right, top) === 1 || solidTileAt(right, bottom) === 1 || solidTileAt(left, bottom) === 1) {
      return true
    } else if ((solidTileAt(left, top) === 2 || solidTileAt(right, top) === 2 || solidTileAt(right, bottom) === 2 || solidTileAt(left, bottom) === 2) && this.id === "p") {
      gameOver();
      return false;
    }

    return false;
  }
  cp2() {
    ptimer++;
    if (ptimer > 1000) {
      ptimer = 0;
      p = false;
    }
    for (let i = scene.length - 1; i >= 0; i--) {
      if (scene[i] && this.id === "p" && this.col(scene[i]) && scene[i].id === "e2") {
        if (this.gravitySpeed > 1) {
          this.gravitySpeed = -16;
          this.y -= 10;
          if (
            gamepad_connected ? key.space || gamepad.buttons[0].pressed : key.space
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
          health-= 5;
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
    /*for (let i = gh[currentLevel].length - 1; i >= 0; --i) {
      if (this.col(gh[currentLevel][i])) {
        return true;
      }
    }*/
    for (let i = scene.length - 1; i >= 0; --i) {
      if (scene[i].id === "c" && this.col(scene[i])) {
        coins++;
        scene.splice(i, 1);
      }
    }
    /*for (let i = lh[currentLevel].length - 1; i >= 0; --i) {
      if (this.col(lh[currentLevel][i]) && this.id === "p") {
        gameOver();
        return false;
      }
    } */
    const left = this.x - this.width / 2;
    const right = this.x + this.width / 2 - 1;
    const top = this.y - this.height / 2;
    const bottom = this.y + this.height / 2 - 1;

    if (solidTileAt(left, top) === 1 || solidTileAt(right, top) === 1 || solidTileAt(right, bottom) === 1 || solidTileAt(left, bottom) === 1) {
      return true
    } else if ((solidTileAt(left, top) === 2 || solidTileAt(right, top) === 2 || solidTileAt(right, bottom) === 2 || solidTileAt(left, bottom) === 2) && this.id === "p") {
      gameOver();
      return false;
    }
    return false;
  }
  cp3() {
    const left = this.x - this.width / 2;
    const right = this.x + this.width / 2 - 1;
    const top = this.y - this.height / 2;
    const bottom = this.y + this.height / 2 - 1;

    if (solidTileAt(left, top) === 1 || solidTileAt(right, top) === 1 || solidTileAt(right, bottom) === 1 || solidTileAt(left, bottom) === 1) {
      return true
    } else if ((solidTileAt(left, top) === 2 || solidTileAt(right, top) === 2 || solidTileAt(right, bottom) === 2 || solidTileAt(left, bottom) === 2) && this.id === "p") {
      gameOver();
      return false;
    }
    return;
  }
  ce2() {
    for (let i = scene.length - 1; i >= 0; i--) {
      if (scene[i].id === "e2" && scene[i] !== this && this.col(scene[i])) {
        return true;
      }
    }
    return false;
  }
  /**
   * @param {string} i 
   */
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
          currentLevel += 1;
          return true;
        }
      }
    }
  }
}

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, textures["stone"]);

gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, textures["mossyStone"]);

gl.activeTexture(gl.TEXTURE2);
gl.bindTexture(gl.TEXTURE_2D, textures["lava"]);

gl.activeTexture(gl.TEXTURE3);
gl.bindTexture(gl.TEXTURE_2D, textures["player"]);

gl.activeTexture(gl.TEXTURE4);
gl.bindTexture(gl.TEXTURE_2D, textures["coin"]);

gl.activeTexture(gl.TEXTURE5);
gl.bindTexture(gl.TEXTURE_2D, textures["e1"]);

gl.activeTexture(gl.TEXTURE6);
gl.bindTexture(gl.TEXTURE_2D, textures["e2"]);

gl.activeTexture(gl.TEXTURE7);
gl.bindTexture(gl.TEXTURE_2D, textures["door"]);

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
function drawTile(id, x, y) {
  gl.uniform1i(tileProgram.textureLoc, id);
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

function solidTileAt(x, y) {
  const col = Math.floor(x / tileSize[0]);
  const row = Math.floor(y / tileSize[1]);

  return hitBoxTiles[row * levelSize.x + col];
}

function rand(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
}

/**
 * @type {Sprite[]}
 */
const scene = [];
/**
 * @type {({
 *   color: number[];
 *   x: number;
 *   y: number;
 * })[]}
 */
const tiles = [];
/**
 * @type {{
 *   color: number[];
 *   x: number;
 *   y: number;
 * }}
 */
const frontTiles = [];
/**
 * @type {number[]}
 */
let hitBoxTiles;
let currentLevel = 0;

/**
 * @type {{
 *   x: number;
 *   y: number 
 * }}
 */
let levelSize = { x: null, y: null };

/**
 * @type {[number, number]}
 */
let tileSize;

const player = new Sprite(3, 48, 48, 1, "p");
//player.id="p"

const d = [];
const d2 = [];
function parseLayer(layer, width, height, background) {
  console.log(width, height)
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      switch (layer[y * width + x]) {
        case 1:
          (background ? tiles : frontTiles).push({
            id: 0,
            x: x * 64 + 32,
            y: y * 64 + 32,
          });
          //console.log("b" + x);
          break;
        case 2:
          (background ? tiles : frontTiles).push({
            id: 1,
            x: x * 64 + 32,
            y: y * 64 + 32,
          });
          break;
        case 3:
          (background ? tiles : frontTiles).push({
            id: 2,
            x: x * 64 + 32,
            y: y * 64 + 32,
          });
          //console.log("l");
          break;
        case 4:
          player.pos(x * 64 + 32, y * 64 + 32);
          break;
        case 6:
          scene.push(
            new Sprite(5, 48, 48, 1, "e1").pos(
              x * 64 + 32,
              y * 64 + 31
            )
          );
          break;
        case 7:
          scene.push(
            new Sprite(6, 48, 48, 1, "e2").pos(
              x * 64 + 32,
              y * 64 + 31
            )
          );
          break;
        case 8:
          scene.push(
            new Sprite(7, 64, 64, 0, "d1").pos(
              x * 64 + 32,
              y * 64 + 32
            )
          );
          d.push(scene.length - 1);
          break;
        case 9:
          scene.push(
            new Sprite(7, 64, 64, 0, "d2").pos(
              x * 64 + 32,
              y * 64 + 32
            )
          );
          d2.push(scene.length - 1);
          break;
        case 5:
          console.count("coins")
          scene.push(
            new Sprite(4, 32, 32, 0, "c").pos(
              x * 64 + 32,
              y * 64 + 32
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
  key.space = false;
  progress.innerText = "0%";
  const levelWorker = new Worker("./level_worker.js");
  levelWorker.postMessage({
    type: "level",
    file: `./levels/level${currentLevel + 1}.json`,
  });
  levelWorker.onmessage = function (e) {
    if (e.data.type === "level") {
      let layer = e.data.background;
      parseLayer(layer, e.data.width, e.data.height, true);
      layer = e.data.foreground;
      parseLayer(layer, e.data.width, e.data.height, false);
      layer = e.data.entities;
      parseLayer(layer, e.data.width, e.data.height, false);
      hitBoxTiles = e.data.hitboxes;
      levelSize.x = e.data.width;
      levelSize.y = e.data.height;
      tileSize = e.data.tileSize;
      progress.innerText = "";
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
}
function newLevel() {
  currentLevel++;
  if (coins <= 0) {
    coins--;
  }
  if (currentLevel > 4 - 1) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.font = "100px arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("YOU BEAT THE GAME", canvas.width / 2, canvas.height / 2);
    ctx.fillText(
      "COINS: %" + Math.round((coins / 106) * 100),
      canvas.width / 2,
      canvas.height / 2 + 100
    );
    ctx.fillText("HEALTH: " + health, canvas.width / 2, canvas.height / 2 + 200);
    g = true; //+(health/10)+(score/100)
  } else {
    createLevel();
    g = false;
  }
}
//alert(scene.length)
// gl.useProgram(program.program);
// gl.enableVertexAttribArray(program.positionLoc);
// gl.bindBuffer(gl.ARRAY_BUFFER, tileBuffer);
// gl.vertexAttribPointer(program.positionLoc, 2, gl.FLOAT, false, 0, 0);
progress.innerText = "";
gl.useProgram(tileProgram.program);
gl.enableVertexAttribArray(tileProgram.positionLoc);
gl.bindBuffer(gl.ARRAY_BUFFER, tileBuffer);
gl.vertexAttribPointer(tileProgram.positionLoc, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(tileProgram.uvLoc);
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
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
  // add the current fps and remove the oldest fps
  totalFPS += fps - (frameTimes[frameCursor] || 0);

  // record the newest fps
  frameTimes[frameCursor++] = fps;

  // needed so the first N frames, before we have maxFrames, is correct.
  numFrames = Math.max(numFrames, frameCursor);

  // wrap the cursor
  frameCursor %= maxFrames;

  const averageFPS = totalFPS / numFrames;

  if (Number.isNaN(averageFPS) || !isFinite(fps)) {
    location.reload();
  }

  avgElem.textContent = averageFPS; // update avg display
  fpsElem.textContent = fps;
  ctx.clearRect(0, 0, canvas2.width, canvas2.height);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let gamepads;
  if (gamepad_connected) {
    gamepads = navigator.getGamepads();
    gamepad = gamepads[0];
    //console.log(gamepad.axes)
  }
  
  if (globalThis.screen === "play") {
    //ctx.translate(scrollx, scrolly);
    if (progress.innerText === "") {
      //entities - update
      player.update(delta);
      for (let i = 0; i < scene.length; ++i) {
        const s = scene[i];
        if (!(s.x + scrollx < -200 || s.x + scrollx > gl.canvas.width + 200)) {
          s.update(delta);
          //console.log(scene[i].x+","+scene[i].x)
        }
      }

      //background tiles
    
      gl.vertexAttribPointer(tileProgram.uvLoc, 2, gl.FLOAT, false, 0, 0);
      for (let i = 0; i < tiles.length; ++i) {
        const t = tiles[i];
        if (!(t.x + scrollx < -32 || t.x + scrollx > gl.canvas.width + 32)) {
          drawTile(t.id, t.x, t.y);
        }
      }

      //entities
      // gl.useProgram(program.program);
      // gl.enableVertexAttribArray(program.positionLoc);
      // gl.bindBuffer(gl.ARRAY_BUFFER, tileBuffer);
      //gl.vertexAttribPointer(program.positionLoc, 2, gl.FLOAT, false, 0, 0);
      for (let i = 0; i < scene.length; ++i) {
        const s = scene[i];
        if (!(s.x + scrollx < -200 || s.x + scrollx > gl.canvas.width + 200)) {
          s.render();
          //console.log(scene[i].x+","+scene[i].x)
        }
      }
      player.render();

      //foreground tiles
      /*gl.useProgram(tileProgram.program);
      gl.enableVertexAttribArray(tileProgram.positionLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, tileBuffer);
      gl.vertexAttribPointer(tileProgram.positionLoc, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(tileProgram.uvLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);*/
      gl.vertexAttribPointer(tileProgram.uvLoc, 2, gl.FLOAT, false, 0, 0);
      for (let i = 0; i < frontTiles.length; ++i) {
        const t = frontTiles[i];
        if (!(t.x + scrollx < -32 || t.x + scrollx > gl.canvas.width + 32)) {
          drawTile(t.id, t.x, t.y);
        }
      }
    }
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "start";
    ctx.fillStyle = "white";
    ctx.font = "25px arial";
    ctx.fillText("health:", 10, 25);
    ctx.fillStyle = "red";
    ctx.fillRect(90, 5, health * 10, 25);
    ctx.fillStyle = "white";
    ctx.font = "25px arial";
    ctx.fillText("score: " + score, 700, 25);
    ctx.fillStyle = "white";
    ctx.font = "25px arial";
    ctx.fillText(`level: ${currentLevel + 1} y: ${player.y} x: ${player.x}`, 700, 50);
  } else if (globalThis.screen === "title") {
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "100px arial";
    ctx.fillText("Squario's Adventures in 2D", canvas2.width / 2, (canvas2.height / 2) - (canvas2.height / 5));

    ctx.fillStyle = "grey";
    ctx.fillRect((canvas2.width / 2) - 250,  (canvas2.height / 2) - 25, 500, 50);
    ctx.fillStyle = "black";
    ctx.font = "30px arial";
    ctx.fillText("START (A ON CONTROLLER)", canvas2.width / 2, (canvas2.height / 2));
    //console.log(gamepad_connected, gamepad);

    if (
        gamepad_connected ? 
        (Sprite.prototype.col.bind(mouse)({ x: (canvas2.width / 2) - 250,  y: (canvas2.height / 2) - 25, width: 500, height: 50}) && mouse.click) || gamepad.buttons[0].pressed : (Sprite.prototype.col.bind(mouse)({ x: (canvas2.width / 2) - 250,  y: (canvas2.height / 2) - 25, width: 500, height: 50}) && mouse.click)
      ) {
      globalThis.screen = "play";
      createLevel();
    }
  }

  if (!g) {
    try {
      requestAnimationFrame(render);
    } catch (e) {
      alert(e);
      requestAnimationFrame(render);
    }
  }
  if (player.y > 704) {
    player.y = -64;
    player.gravitySpeed = 0;
  }
}
//console.log(scene.length)
window.addEventListener("gamepadconnected", function (e) {
  console.log("connect", e.gamepad);
  gamepad_connected = true;
});
window.addEventListener("gamepaddisconnected", function (e) {
  console.log("disconnect", e.gamepad);
  gamepad_connected = false;
});
window.addEventListener("resize", function (e) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  canvas2.style = `position: absolute; left: 0px; top: 0px; width: ${window.innerWidth}px; height: ${window.innerHeight}px; zIndex: 1;`;
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
})
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
globalThis.scene = scene;
globalThis.Sprite = Sprite;
globalThis.Vec2 = Vec2;
globalThis.gl = gl;
globalThis.p = p;

const { body } = document;

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    body.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
