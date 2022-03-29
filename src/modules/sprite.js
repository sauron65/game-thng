import { canvas, gl } from "./modules/gl.js";
import { Vec2 } from "./vec2.js";
import { Mat3 } from "./m3.js";

export class Sprite extends Vec2 {
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
          this.d = 5;
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
      if (!this.cp3()) pO = false;
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
    gl.uniform4fv(program.colorLoc, this.color);
    gl.uniformMatrix3fv(program.matrixLoc, false, this.matrix);
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
    a.x = a.x;
    a.y = a.y;
    a.x = a.x;
    a.y = a.y;
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
      //    console.log(i, scene.length, this)
      if (this.col(scene[i]) && scene[i].id === "e2" && this.id === "p") {
        if (this.gravitySpeed > 0) {
          this.gravitySpeed = -16;
          this.y -= 10;
          if (key.up) {
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
