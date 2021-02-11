// TODO set max iterations as parameter, crosshair as parameter

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

export const mandelbrotDeepVert = `
precision highp float;

attribute vec2 position;

// [sin, cos] of angle phi
// uniform vec2 rotator;
uniform float u_theta;
vec2 sincosT = vec2(sin(u_theta), cos(u_theta));

uniform vec2 center;
uniform vec2 size;
varying vec2 delta;

uniform vec2 u_xy;
uniform float u_zoom;

void main() {

  /*  window coordinates with new origin in complex space  */
  vec2 z = size * position;

  // delta is the array of pixels?
  delta = center + vec2(z.x * sincosT.y - z.y * sincosT.x, dot(z, sincosT));

  // delta = center + vec2(z.x * sincosT.y - z.y * sincosT.x, dot(z, sincosT));

  gl_Position = vec4(position, 0., 1.0);

}`;

// TODO: uniforms should also be typed (or at least declared)
const mandelbrotShaderDeep = (
  { maxI = 300, AA = 1, B = 64 }: RendererRenderValues,
  showCrosshair = true,
  crosshairShape = {
    stroke: 2,
    radius: 100,
  },
): string => `
// Adapted by Joao Maio/2021, based on work by @munrocket/deep-fractal
// GNU GPL 3.0

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

// https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
// prefer high float precision (lower than this may break colours on mobile)
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

// need to know the resolution of the canvas
uniform vec2  resolution;

// properties should be passed as uniforms
// uniform int   u_maxI;
uniform vec2  u_xy;
uniform float u_zoom;
uniform vec3  u_colour;
uniform float u_theta;
vec2 sincosT = vec2(sin(u_theta), cos(u_theta));

bool crosshair( float x, float y ) {
  float abs_x = abs(2.0*x - resolution.x);
  float abs_y = abs(2.0*y - resolution.y);

  return 
  // crosshair in centre of screen
  (abs_x <= cross_stroke || abs_y <= cross_stroke) &&
  // crosshair size / "radius"
  (abs_x <= cross_radius && abs_y <= cross_radius);
}

// ----- shader adapted from "deep-fractal" (@munrocket)

// #define imax ${1024}
#define square_radius ${3e5}.
// #define super_sampling ${0}
#define color_scheme ${0}
#define is_julia ${0}
const float logLogRR = log2(log2(square_radius));

varying vec2 delta;
varying vec2 texcoord;

// uniform vec2 rotator;
uniform vec2 size;
uniform vec2 pixelsize;
uniform float texsize;
uniform sampler2D orbittex;
uniform sampler2D exteriortex;

// this is a way to index into the "texture" matrix containing iteration data
vec4 unpackOrbit(int i) {
  float fi = float(i);
  vec2 texcoord = vec2(mod(fi, texsize), floor(fi / texsize)) / texsize;
  return texture2D(orbittex, texcoord);
}

// generic interpolation function?
float interpolate(float s, float s1, float s2, float s3, float d) {
  float d2 = d * d, d3 = d * d2;
  return 0.5 * (s * (d3 - d2) + s1 * (d + 4.*d2 - 3.*d3) + s2 * (2. - 5.*d2 + 3.*d3) + s3 * (-d + 2.*d2 - d3));
}

struct result {
  float time;
  float zz;
  float dzdz;
  float stripe;
  float argZ;
};

/*  fractal calculator with perturbation theory for mandelbrot & julia set */
result calculator(vec2 AAfloat) {
  // delta is calculated from the "centre" point
  float u = delta.x + AAfloat.x, v = delta.y + AAfloat.y;
  // float u = delta.x - u_xy.x + AAfloat.x, v = delta.y - u_xy.y + AAfloat.y;
  // float u = u_xy.x + AAfloat.x, v = u_xy.y + AAfloat.y;
  
  // float u = 0., v = 0.;
  float zz, time, temp, du = 0., dv = 0.;
  float stripe, s1, s2, s3;
  vec2 z, dz, O, dO;

  for (int i = 0; i < MAXI; i++) {
    /*  Recall global coordinates: Z = O + W, Z' = O' + W'  */
    vec4 values = unpackOrbit(i);
    O = values.xy;
    dO = values.zw;
    z = O + vec2(u, v);
    dz = dO + vec2(du, dv);
    zz = dot(z, z);

    /*  Calc derivative:  dW'(u,v) -> 2 * (O' * W + Z * W')  */
    temp = 2. * (dO.x * u - dO.y * v + z.x * du - z.y * dv);
    dv =   2. * (dO.x * v + dO.y * u + z.x * dv + z.y * du);
    du = temp;

    /*  Next step in the iterative process:  W(u,v) -> W^2 + 2 * O * W + <delta>  */
    temp = u * u - v * v + 2. * (u * O.x - v * O.y);
    v =    u * v + u * v + 2. * (v * O.x + u * O.y);
    u = temp;
    #if (!is_julia)
      u += delta.x;
      v += delta.y;
    #endif

    /*  Stripe average, a color algo based on statistcs  */
    #if (color_scheme == 0)
      stripe += z.x * z.y / zz * step(0.0, time);
      s3 = s2; s2 = s1; s1 = stripe;
    #endif

    /*  Loop in webgl1  */
      time += 1.;
      if (zz > square_radius) { break; }
  }

  time += clamp(1.0 + logLogRR - log2(log2(zz)), 0., 1.);
  #if (color_scheme == 0)
    stripe = interpolate(stripe, s1, s2, s3, fract(time));
  #endif
  return result(time, zz, dot(dz,dz), stripe, atan(z.y, z.x));
}

void main() {
  /*  Get result  */
  result R = calculator(vec2(0));

  /*  DEM (Distance Estimation) = 2 * |Z / Z'| * ln(|Z|)  */
  float dem = sqrt(R.zz / R.dzdz) * log2(R.zz);
  float dem_weight = 800. / min(size.x, size.y);

  /*  Adaptive supersampling with additional 4 points in SSAAx4 pattern */
  // #if (super_sampling == 1 && color_scheme != 1)
  #if (AA == 2 && color_scheme != 1)
    if (-log2(dem * dem_weight) > 0.5) {
      R.time /= 5.;
      R.zz /= 5.;
      R.dzdz /= 5.;
      R.stripe /= 5.;
      for (int i = 0; i < 4; i++) {
        vec2 offset = pixelsize * vec2(vec4(-1., 3., 3., 1.)[i], vec4(-3., -1., 1., 3.)[i]) / 4.;
        offset = vec2(offset.x * sincosT.y - offset.y * sincosT.x, dot(offset, sincosT));
        result RI = calculator(offset);
        R.time += RI.time / 5.;
        R.zz += RI.zz / 5.;
        R.dzdz += RI.dzdz / 5.;
        R.stripe += RI.stripe / 5.;
      }
    }
  #endif

  /*  Final coloring  */
  vec3 color;
  #if (color_scheme == 0)
    // // original colour scheme
    // col += 0.5 + 0.5*cos( 3.0 + l*0.15 + u_colour);

    // "wisps" / stripes
    // color += 0.7 + 2.5 * (R.stripe / clamp(R.time, 0., 200.)) * (1. - 0.6 * step(float(MAXI), 1. + R.time));

    // color = 0.5 + 0.5 * sin(color + vec3(4.0, 4.6, 5.2) + 50.0 * R.time / float(MAXI));
    color = 0.5 + 0.5 * cos(3.0 + u_colour + 50.0 * R.time / float(MAXI));
  #else
    vec2 texcoord = vec2(R.argZ / 2. / 3.14159265, log2(R.zz) / log2(square_radius) - 1.0);
    color = texture2D(exteriortex, texcoord).xyz;
  #endif

  #if show_crosshair
    if (crosshair(gl_FragCoord.x, gl_FragCoord.y)) {
      color = 1. - color;
    }
  #endif
  
  gl_FragColor = vec4(color, 1.);
}`;

export default mandelbrotShaderDeep;
