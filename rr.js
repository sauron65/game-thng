import * as fs from "fs/promises";

const width = 16;
const height = 16;
const a = new ArrayBuffer((width * height * 4) + 32);
const dv = new DataView(a);

dv.setUint16(0, width);
dv.setUint16(2, height);

for (let i = 0; i < 256 * 4; i += 4) {
  dv.setUint8(4 + i, 128);
  dv.setUint8(5 + i, 128);
  dv.setUint8(6 + i, 128);
  dv.setUint8(7 + i, 255);
}
await fs.writeFile('./x.boi', dv);