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
