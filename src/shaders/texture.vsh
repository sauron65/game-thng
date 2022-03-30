#version 300 es
in vec2 a_position;
in vec2 a_uv;
 
uniform mat3 u_matrix;
 
out vec2 v_uv;
 
void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, /** /u_layer/**/ /**/0/**/, 1);
 
  v_uv = a_uv;
}