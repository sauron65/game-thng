// this file exists so that the gl context can be used in other files

import { createShader, createProgram } from "./functions.js";

const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl2");

const colorVS = `
attribute vec2 a_position;

//uniform float u_layer
uniform mat3 u_matrix;
//uniform vec2 u_scale

void main() {
  // Multiply the position by the matrix.
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, /** /u_layer/**/ /**/0/**/, 1);
  // gl_Position = vec4((u_matrix * vec3(a_position * u_scale, 1)).xy, /** /u_layer/**/ /**/0/**/, 1);
}
`;
const colorFS = `
precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}
`;

// /**
//  * 
//  * @param {string} url 
//  * @returns Promise<ArrayBuffer>
//  */
// async function getFile(url) {
//   return await ((await fetch(url)).arrayBuffer());
// }

// /**
//  * 
//  * @param {ArrayBuffer} buffer 
//  * @returns WebGLTexture
//  */
// function getTexture(buffer) {
//   const dv = new DataView(buffer);

//   const width = dv.getUint16(0);
//   const height = dv.getUint16(2);
//   const pixels = new Uint8Array(buffer, 4);

//   const tex = gl.createTexture();
//   gl.bindTexture(gl.TEXTURE_2D, tex);
//   gl.texImage2D(
//     gl.TEXTURE_2D,
//     0,                 // level
//     gl.RGBA,           // internal format
//     width,                 // width
//     height,                 // height
//     0,                 // border
//     gl.RGBA,           // format
//     gl.UNSIGNED_BYTE,  // type
//     pixels,            // data
//   );
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

//   return tex;
// }

// const textureBuffers = await Promise.all([
//   getFile("/textures/stone.boi"),
//   getFile("/textures/mossyStone.boi"),
//   getFile("/textures/lava.boi"),
//   getFile("/textures/coin.boi")
// ]);

// /**
//  * @type {{
//  *   [x: string]: WebGLTexture
//  * }}
//  */
// const textures = {
//   "stone": getTexture(textureBuffers[0]),
//   "mossyStone": getTexture(textureBuffers[1]),
//   "lava": getTexture(textureBuffers[2]),
//   "coin": getTexture(textureBuffers[3])
// };

const tileProgram = {
  vertexShader: createShader(gl, gl.VERTEX_SHADER, colorVS),
  fragmentShader: createShader(gl, gl.FRAGMENT_SHADER, colorFS),
  program: null
};
tileProgram.program = createProgram(
  gl,
  tileProgram.vertexShader,
  tileProgram.fragmentShader
);
tileProgram.positionLoc = gl.getAttribLocation(
  tileProgram.program,
  "a_position"
);
tileProgram.colorLoc = gl.getUniformLocation(tileProgram.program, "u_color");
tileProgram.matrixLoc = gl.getUniformLocation(tileProgram.program, "u_matrix");

const tileBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, tileBuffer);
/*gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
 -25, -25,
  25, -25,
 -25,  25,
  25,  25
]), gl.STATIC_DRAW);*/
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -25, -25, 
     25, -25, 
    -25,  25, 
    -25,  25, 
     25, -25,
     25,  25]),
  gl.STATIC_DRAW
);

export { canvas, gl, tileProgram, tileBuffer };
