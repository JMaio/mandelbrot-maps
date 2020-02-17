export const fullVertexShader = `
attribute vec4 position;

void main() {
  gl_Position = position;
}
`;

// This "position" array specifies the vertex positions of the element 
// to be displayed by the vertex shader. It represents two triangles,
// each filling half of the screen diagonally, and together filling the
// full canvas space to allow the fragment shader to act on the full canvas.
export const fullscreenVertexArray = {
  position: {
    numComponents: 3,
    data: [
    -1, -1, 0, 
     1, -1, 0, 
    -1,  1, 0, 
    -1,  1, 0, 
     1, -1, 0, 
     1,  1, 0
  ]},
};
