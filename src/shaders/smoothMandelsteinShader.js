// TODO set max iterations as parameter

const smoothMandelsteinShader = `
#define maxI 200

// set high float precision (lower than this may break colours on mobile)
precision highp float;

// need to know the resolution of the canvas
uniform vec2 resolution;

// properties should be passed as uniforms
uniform int   u_maxI;  
uniform vec2  u_pos;
uniform float u_zoom;
uniform float u_theta;

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
// {
// 	vec2 uv = fragCoord.xy - iResolution.xy * 0.5;
// 	uv *= 2.5 / min( iResolution.x, iResolution.y );
// 	vec2 c = vec2( 0.37+cos(iTime*1.23462673423)*0.04, sin(iTime*1.43472384234)*0.10+0.50);
// 	vec2 z = uv;
// 	float scale = 0.01;
//  float l = 0.0;
// 	for ( int i = 0 ; i < maxI; i++ ) {
// 		z = c + vec2( z.x*z.x-z.y*z.y, 2.0*z.x*z.y );
// 		if ( dot( z, z ) > 4.0 ) {
// 			break;
// 		}
//         l += 1.0;
// 	}
//     float sl = l - log2(log2(dot(z,z))) + 4.0; 
// 	vec3 col = vec3(0.5) + 0.5*cos( 3.0 + sl*0.15 + vec3(0.0,0.6,1.0));
// 	fragColor = vec4(col, 0);
// }

void main() {    
  // set the initial colour to black
  vec3 col = vec3(0.0);

  // adjust pixels to range from [-1, 1]
  vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;
  
  vec2 xy = p;
  vec2 c = u_pos + xy/u_zoom;  

  // smoothing factor (original = 256.0)
  const float B = 32.0;
  float l = 0.0;
  vec2  z = p;
  for( int i=0; i<200; i++ ) {
      // z = z*z + c		
      z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;

      if( dot(z,z)>(B*B) ) break;

      l += 1.0;
  }
  
  // float al = smoothstep( -0.1, 0.0, 1.0);
  l = l - log2(log2(dot(z,z))) + 4.0; 
  // float sl = l - log2(log2(dot(z,z))) + 4.0; 
  // l = sl;
  //    a 0.405 multiplier here  vvvv  also looks good
  col += 0.5 + 0.5*cos( 3.0 +  l*0.15 + vec3(0.0, 0.6, 1.0));

  // Output to screen
  gl_FragColor = vec4( col, 1.0 );
  // gl_FragColor = vec4( vec3(1.0), 1.0 );
}
`;

export default smoothMandelsteinShader;
