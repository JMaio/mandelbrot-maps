// TODO set max iterations as parameter

import { RendererRenderValues } from '../common/render';

const newSmoothJuliaShader = ({
  maxI = 300,
  AA = 1,
  B = 64,
}: RendererRenderValues): string => `

#define AA ${AA}
#define MAXI ${maxI}
#define B ${B.toFixed(1)}

// https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
// prefer high float precision (lower than this may break colours on mobile)
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

// need to know the resolution of the canvas
uniform vec2 resolution;

// properties should be passed as uniforms
uniform int   u_maxI;
uniform vec2  u_xy;
uniform vec2  u_c;
uniform float u_zoom;
uniform float u_theta;
uniform vec3  u_colour;

float julia( vec2 z, vec2 c ) {

  float l = 0.0;
  for( int i=0; i<MAXI; i++ )
  {
      z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;
      if( dot(z,z)>(B*B) ) break;
      l += 1.0;
  }

  // maxed out iterations
  if( l>float(MAXI)-1.0 ) return 0.0;

  // equivalent optimized smooth interation count
  l = l - log2(log2(dot(z,z))) + 4.0;

  return l;
}

void main() {    
  // set the initial colour to black
  vec3 col = vec3(0.0);

  // anti-aliasing
  #if AA>1
  for( int m=0; m<AA; m++ )
  for( int n=0; n<AA; n++ )
  {
      vec2 p = (2.0*(gl_FragCoord.xy + vec2(float(m), float(n)) / float(AA) ) - resolution.xy)/resolution.y;
      float w = float(AA*m+n);
  #else    
      // adjust pixels to range from [-1, 1]
      vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;
  #endif
  
  // constant "c" to add, based on mandelbrot position
  vec2 c = u_c;

  float sinT = sin(u_theta);
  float cosT = cos(u_theta);

  vec2 xy = vec2( p.x*cosT - p.y*sinT, p.x*sinT + p.y*cosT );
  // c is based on offset and grid position, z_0 = 0
  vec2 z = u_xy + xy/u_zoom;

  float l = julia(z, c);
  // col += 0.5 + 0.5*cos( 3.0 + l*0.15 + vec3(0.0,0.6,1.0));
  col += 0.5 + 0.5*cos( 3.0 + l*0.15 + u_colour);


  // antialiasing
  #if AA>1
  }
  col /= float(AA*AA);
  #endif

  // Output to screen
  gl_FragColor = vec4( col, 1.0 );
}
`;

export default newSmoothJuliaShader;
