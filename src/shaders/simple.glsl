// #version 300 es

// sample code from https://gpfault.net/posts/mandelbrot-webgl.txt.html

/* Fragment shader that renders Mandelbrot set */
precision mediump float;

/* Width and height of screen in pixels */ 
uniform vec2 u_resolution;

/* Point on the complex plane that will be mapped to the center of the screen */
uniform vec2 u_zoomCenter;

/* Distance between left and right edges of the screen. This essentially specifies
   which points on the plane are mapped to left and right edges of the screen.
  Together, u_zoomCenter and u_zoomSize determine which piece of the complex
   plane is displayed. */
uniform float u_zoomSize;

/* How many iterations to do before deciding that a point is in the set. */
uniform int u_maxIterations;

vec2 f(vec2 z, vec2 c) {
	return z*z + c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  
  /* Decide which point on the complex plane this fragment corresponds to.*/
  vec2 c = u_zoomCenter + (uv * 4.0 - vec2(2.0)) * (u_zoomSize / 4.0);
  
  /* Now iterate the function. */
  vec2 z = vec2(0.0);
  bool escaped = false;
  for (int i = 0; i < 10000; i++) {
    /* Unfortunately, GLES 2 doesn't allow non-constant expressions in loop
       conditions so we have to do this ugly thing instead. */
    if (i > u_maxIterations) break;
    z = f(z, c);
    if (length(z) > 2.0) {
      escaped = true;
      break;
    }
  }
  gl_FragColor = escaped ? vec4(1.0) : vec4(vec3(0.0), 1.0);
}