//first draft (almost a year old)
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var jh = -16;
var rjh = -16;
var scrollx = 0,
  scrolly = 0;
var g = false;
var health = 50;
var score = 0;
var ptimer = 0;
var p = true;
var c = 0;
var pO = false;
var gameOver = function() {
  g = true;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = "100px arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
};
class Sprite {
  constructor(color, width, height, weight) {
    //alert(color)
    this.color = color;
    this.width = width;
    this.height = height;
    this.gravity = weight || 0;
    this.gravitySpeed = 0;
    this.x = this.y = 0;
    this.id = "" || arguments[4];
    this.type = "";
    this.c = true;
    this.f = 0;
    this.d = rand(-1, 1) * 10;
    if (this.d === 0) {
      this.d = 10;
    }
    // console.log("("+this.width+","+this.height+")")
  }
  render() {
    // this.gravitySpeed += this.gravity;

    ctx.fillStyle = this.color;
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
      let d = 5;
      if (this.cp3()) {
        pO = true;
      }
      if (key.a) {
        d = 10;
      }
      if (key.right) {
        if (!pO) {
          this.x += d;
          scrollx -= d;
        }
        if (pO) {
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
      if (key.left) {
        if (!pO) {
          this.x -= d;
          scrollx += d;
        }
        if (pO) {
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
      if (!this.cp3())
      pO=false
    }
    if (this.id === "p" && key.up) {
      this.y++;
      if (this.cp()) {
        this.gravitySpeed = jh;
        if (key.a) {
          this.gravitySpeed = rjh;
        }
      }
      this.y--;
      if (this.cd()) {
        newLevel();
      }
    }
    if (this.id === "p" || this.id === "e1" || this.id === "e2") {
      if (!pO) {
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
    }
    }
    //alert(this.color)
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    return this;
  }
  pos(x, y) {
    this.x = x;
    this.y = y;
    //console.log("("+this.x+","+this.y+")")

    return this;
  }
  col(a) {
    let t1, b1, r1, l1, t2, b2, r2, l2;
    let b = this;
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
    for (let i = gh[currentLevel].length - 1; i >= 0; i--) {
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
    return false;
  }
  cp2() {
    ptimer++;
    if (ptimer > 1000) {
      ptimer = 0;
      p = false;
    }
    for (let i = scene.length - 1; i >= 0; i--) {
      if (this.col(scene[i]) && scene[i].id === "e2" && this.id === "p") {
        if (this.gravitySpeed > 0) {
          this.gravitySpeed = -16;
          this.y -= 10;
          if (key.up) {
            this.gravitySpeed = -32;
            this.y -= 10;
          }
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
      for (let i = scene.length - 1; i >= 0; i--) {
        if (scene[i].id === "c" && this.col(scene[i])) {
          c++;
          score += 5;
          scene.splice(i, 1);
        }
      }
    }
    for (let i = gh[currentLevel].length - 1; i >= 0; i--) {
      if (this.col(gh[currentLevel][i])) {
        return true;
      }
    }
    for (let i = scene.length - 1; i >= 0; i--) {
      if (scene[i].id === "c" && this.col(scene[i])) {
        c++;
        scene.splice(i, 1);
      }
    }
    for (let i = lh[currentLevel].length - 1; i >= 0; i--) {
      if (this.col(lh[currentLevel][i]) && this.id === "p") {
        gameOver();
        return false;
      }
    }
    return false;
  }
  cp3() {
    for (let i = scene.length - 1; i >= 0; i--) {
      if (scene[i].id === "c" && this.col(scene[i])) {
        c++;
        scene.splice(i, 1);
      }
    }
    for (let i = gh[currentLevel].length - 1; i >= 0; i--) {
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
    return;
  }
  st(i) {
    this.type = i;
    return this;
  }
  te() {
    for (let i = scene.length - 1; i >= 0; i--) {
      if (scene[i].id === "e1") {
        if (this.col(scene[i])) {
          return true;
        }
      }
    }
  }
  cd() {
    for (let i = scene.length - 1; i >= 0; i--) {
      if (scene[i].id === "d1") {
        if (this.col(scene[i])) {
          return true;
        }
      }
      if (scene[i].id === "d2") {
        if (this.col(scene[i])) {
          scene[i].color = "orange";
          scene[i].render();
          g = true;
          //  ctx.fillText("WARP",500,500)

          setTimeout(function() {
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
function rand(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
}
var scene = [];
var currentLevel = 0;
var player = new Sprite("blue", 40, 40, 1, "p");
//player.id="p"
var gh = [
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
    { width: 50 * 1, height: 50 * 1, x: 50 * 51, y: 50 * 7 }
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
    { width: 50 * 8, height: 50 * 1, x: 50 * 20, y: 50 * 3 }
  ]
];
var lh = [
  [
    { width: 50 * 3, height: 50 * 2, y: 50 * 8, x: 50 * 6 },
    { width: 50 * 2, height: 50 * 2, y: 50 * 8, x: 50 * 52 }
  ],
  [
    // { width: 50 * 3, height: 50 * 2, y: 50 * 8, x: 50 * 6 },
    //{ width: 50 * 2, height: 50 * 2, y: 50 * 8, x: 50 * 52 }
  ]
];
var d = [];
var d2 = [];
function createLevel() {
  scene = [];
  d = [];
  scrollx = 0;
  scrolly = 0;
  key.right = false;
  key.left = false;
  key.up = false;
  // scene.push(player)
  for (let y = 0; y < levels[currentLevel].length; y++) {
    for (let x = 0; x < levels[currentLevel][y].length; x++) {
      switch (levels[currentLevel][y].charAt(x)) {
        case "b":
          scene.push(
            new Sprite("grey", 50, 50, 0).pos(x * 50 + 25, y * 50 + 25).st("g")
          );
          //console.log("b" + x);
          break;
        case "l":
          scene.push(
            new Sprite("red", 50, 50, 0).pos(x * 50 + 25, y * 50 + 25)
          );
          //console.log("l");
          break;
        case "p":
          player.pos(x * 50 + 25, y * 50 + 25);
          break;
        case "{":
          scene.push(
            new Sprite("white", 50, 50, 1, "e1").pos(x * 50 + 25, y * 50 + 24)
          );
          break;
        case "e":
          scene.push(
            new Sprite("green", 50, 50, 1, "e2").pos(x * 50 + 25, y * 50 + 24)
          );
          break;
        case "#":
          scene.push(
            new Sprite("brown", 50, 50, 0, "d1").pos(x * 50 + 25, y * 50 + 25)
          );
          d.push(scene.length - 1);
          break;
        case "/":
          scene.push(
            new Sprite("black", 50, 50, 0, "d2").pos(x * 50 + 25, y * 50 + 25)
          );
          //   d2.push(scene.length - 1);
          break;
        case "c":
          scene.push(
            new Sprite("gold", 25, 25, 0, "c").pos(x * 50 + 25, y * 50 + 25)
          );
          break;
        default:
          break;
      }
    }
  }
  scene.push(player);
}
function Aihitbox() {
  for (let i = 0; i < scene.length; i++) {}
}
function newLevel() {
  currentLevel++;
  if (c <= 0) {
    c--;
  }
  if (currentLevel > levels.length - 1) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.font = "100px arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("YOU BEAT THE GAME", canvas.width / 2, canvas.height / 2);
    ctx.fillText(
      "COINS: %" + Math.round((c / 17) * 100),
      canvas.width / 2,
      canvas.height / 2 + 100
    );
    ctx.fillText("HEALF: " + health, canvas.width / 2, canvas.height / 2 + 200);
    g = true; //+(health/10)+(score/100)
  } else {
    createLevel();
    g = false;
  }
}
createLevel();
//alert(scene.length)
function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, 1000, 500);
  ctx.translate(scrollx, scrolly);
  for (let i = 0; i < scene.length; i++) {
    scene[i].render();
    //console.log(scene[i].x+","+scene[i].x)
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
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
  ctx.fillText("level: " + (currentLevel + 1) + " y:" + player.y, 700, 50);
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
render();
