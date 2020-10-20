// TODO set max iterations as parameter

const smoothJuliaShader = `

#define AA 1
#define MAXI 500
#define B 64.0

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


float julia( vec2 z, vec2 c ) {
  #if 0
  {
      float c2 = dot(c, c);
      // skip computation inside M1 - http://iquilezles.org/www/articles/mset_1bulb/mset1bulb.htm
      if( 256.0*c2*c2 - 96.0*c2 + 32.0*c.x - 3.0 < 0.0 ) return 0.0;
      // skip computation inside M2 - http://iquilezles.org/www/articles/mset_2bulb/mset2bulb.htm
      if( 16.0*(c2+2.0*c.x+1.0) - 1.0 < 0.0 ) return 0.0;
  }
  #endif


  // const float B = 256.0;
  float l = 0.0;
  // vec2 z  = vec2(0.0);
  for( int i=0; i<MAXI; i++ )
  {
      z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;
      if( dot(z,z)>(B*B) ) break;
      l += 1.0;
  }

  if( l>float(MAXI)-1.0 ) return 0.0;
  
  // ------------------------------------------------------
  // smooth interation count
  //float sl = l - log(log(length(z))/log(B))/log(2.0);

  // equivalent optimized smooth interation count
  l = l - log2(log2(dot(z,z))) + 4.0;

  return l;
}

void main() {    
  // set the initial colour to black
  vec3 col = vec3(0.0);

  // adjust pixels to range from [-1, 1]
  vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;
  
  vec2 xy = p;
  vec2 c = u_pos;  

  // smoothing factor (original = 256.0)
  // const float B = 32.0;
  vec2  z = p;

  float l = julia(z, c);

  col += 0.5 + 0.5*cos( 3.0 + l*0.15 + vec3(0.0,0.6,1.0));

  // for( int i=0; i<200; i++ ) {
  //     // z = z*z + c		
  //     z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;

  //     if( dot(z,z)>(B*B) ) break;

  //     l += 1.0;
  // }
  
  // float al = smoothstep( -0.1, 0.0, 1.0);
  // log2 is undefined for dot(z,z) = 0; strange colouring in bulbs otherwise
  // float dz = dot(z,z);
  // if (dz > 1.0) {
  //     l = l - log2(log2(dz)) + 4.0; 
  //     //    a 0.405 multiplier here  vvvv  also looks good
  //     col += 0.5 + 0.5*cos( 3.0 +  l*0.15 + vec3(0.0, 0.6, 1.0));
  // }

  // Output to screen
  gl_FragColor = vec4( col, 1.0 );
  // gl_FragColor = vec4( vec3(1.0), 1.0 );
}
`;

export default smoothJuliaShader;
