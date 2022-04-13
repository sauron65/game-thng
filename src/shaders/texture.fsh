#version 300 es
precision highp float;
 
in vec2 v_uv;
 
uniform sampler2D u_texture;
 
out vec4 glFragColor;
 
void main() {
  //vec4 color = texture(u_texture, v_uv);
  glFragColor =  texture(u_texture, v_uv);//vec4(color.rgb, color.a * 0.5);
}