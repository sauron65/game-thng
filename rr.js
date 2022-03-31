import * as fs from "fs/promises";
import { Buffer } from "buffer";

const width = 16;
const height = 16;
const a = new ArrayBuffer((width * height * 4) + 32);
const dv = new DataView(a);

dv.setUint16(0, width);
dv.setUint16(2, height);

const arr = [];

for (let i = 0; i < 256 * 4; i += 4) {
  const v = (Math.random() * 30) + 225;
  if ((i >= 32 * 4) && (i < (256 * 4) - (32 * 4)) && ((i % 64) > 4) && ((i % 64) < 56)) {
    arr.push(v);
    dv.setUint8(4 + i, v);
    dv.setUint8(5 + i, v/* moss -> ((Math.round(i / 4) - (Math.random() * 256)) < 4) && (Math.random() < 0.6) ? ((v + 40 > 255) ? 255 : v + 40) :*//*lava ->*/  /*v + 31 > 255 ? 255 : v + 31*/);
    dv.setUint8(6 + i, v);
    dv.setUint8(7 + i, 255);
  } else {
    dv.setUint8(4 + i, 0);
    dv.setUint8(5 + i, 0);
    dv.setUint8(6 + i, 0);
    dv.setUint8(7 + i, 0);
  }
}
console.log(Math.min(...arr), Math.max(...arr));
await fs.writeFile('./x.boi', dv);