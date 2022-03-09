attribute vec2 a_position;

//uniform float u_layer
uniform mat3 u_matrix;
//uniform vec2 u_scale

void main() {
  // Multiply the position by the matrix.
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, /** /u_layer/**/ /**/0/**/, 1);
  // gl_Position = vec4((u_matrix * vec3(a_position * u_scale, 1)).xy, /** /u_layer/**/ /**/0/**/, 1);
  vec4 v = vec4(1,1,1,1);
}