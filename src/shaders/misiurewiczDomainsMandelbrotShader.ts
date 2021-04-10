import { RendererRenderValues } from '../common/render';

const makeCrosshair = (stroke: number, radius: number) => ({
  stroke,
  radius,
});

export const standardCrosshair = makeCrosshair(2, 100);
export const miniCrosshair = makeCrosshair(1, 30);

export interface MandelbrotShaderParams {
  maxI: number;
  /** Radial boundary */
  B: number;
  /** Anti-aliasing samples */
  AA: number;
}

const misiurewiczDomainsMandelbrotShader = (
  { maxI = 300, AA = 1, B = 64 }: RendererRenderValues,
  showCrosshair = true,
  crosshairShape = {
    stroke: 2,
    radius: 100,
  },
): string => {
  return `
// Adapted by Joao Maio/2019, based on work by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// See here for more information on smooth iteration count:
// http://iquilezles.org/www/articles/mset_smooth/mset_smooth.htm

#define false 0
#define true 1

// render parameters
#define AA ${AA}
#define MAXI ${maxI}
#define B ${B.toFixed(1)}

// crosshair parameters
#define show_crosshair ${showCrosshair}
#define cross_stroke ${crosshairShape.stroke.toFixed(1)}
#define cross_radius ${crosshairShape.radius.toFixed(1)}

// set high float precision (lower than this may break colours on mobile)
precision highp float;

// need to know the resolution of the canvas
uniform vec2 resolution;

// properties should be passed as uniforms
uniform int   u_maxI;  
uniform vec2  u_xy;
uniform float u_zoom;
uniform float u_theta;

bool crosshair( float x, float y ) {
  float abs_x = abs(2.0*x - resolution.x);
  float abs_y = abs(2.0*y - resolution.y);

  return 
  // crosshair in centre of screen
  (abs_x <= cross_stroke || abs_y <= cross_stroke) &&
  // crosshair size / "radius"
  (abs_x <= cross_radius && abs_y <= cross_radius);
}

float mandelbrot( in vec2 c ) {
    float minMag = 999999999.0;
    int minI=0;
    vec2 z  = vec2(0.0);
    for( int i=0; i<MAXI; i++ )
    {
        vec2 z0 = z;
        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;
        float dist = distance(z0, z);
        if (i > 0 && dist < minMag){
          minI = i;
          minMag = dist;
        }
        if( dot(z,z)>(B*B) ) {
          return float(minI);
        }
    }
    
    return 0.0;
}

void main() {    
    // set the initial colour to black
    vec3 col = vec3(0.0);

    // anti-aliasing
    #if AA>1
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        // vec2 p = (-iResolution.xy + 2.0*(fragCoord.xy+vec2(float(m),float(n))/float(AA)))/iResolution.y;
        vec2 p = (2.0*(gl_FragCoord.xy + vec2(float(m), float(n)) / float(AA) ) - resolution.xy)/resolution.y;
        float w = float(AA*m+n);
    #else    
        // adjust pixels to range from [-1, 1]
        vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;
    #endif

    float sinT = sin(u_theta);
    float cosT = cos(u_theta);

    vec2 xy = vec2( p.x*cosT - p.y*sinT, p.x*sinT + p.y*cosT );
    // c is based on offset and grid position, z_0 = 0
    vec2 c = u_xy + xy/u_zoom;
    
    float l = mandelbrot(c);
    col += 0.5 + 0.5*cos( 3.0 + l*0.15 + vec3(0.0,0.6,1.0));

    // antialiasing
    #if AA>1
    }
    col /= float(AA*AA);
    #endif

    #if show_crosshair
    if (crosshair(gl_FragCoord.x, gl_FragCoord.y)) {
        col = 1. - col;
    }
    #endif

    // Output to screen
    gl_FragColor = vec4( col, 1.0 );
}
    `;
};

export default misiurewiczDomainsMandelbrotShader;
