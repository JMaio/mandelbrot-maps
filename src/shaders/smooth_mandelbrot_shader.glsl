// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.


// See here for more information on smooth iteration count:
//
// http://iquilezles.org/www/articles/mset_smooth/mset_smooth.htm

// set high float precision (lower than this may break colours on mobile)
precision highp float;

// need to know the resolution of the canvas
uniform vec2 resolution;

// properties should be passed as uniforms
uniform int   u_maxI;  
uniform vec2  u_pos;
uniform float u_zoom;
uniform float u_theta;

void main() {    
    // set the initial colour to black
    vec3 col = vec3(0.0);

    // vec2 p = (-resolution.xy + 2.0*vec2(gl_FragCoord.x, -gl_FragCoord.y))/resolution.y;
    // adjust pixels to range from [-1, 1]
    vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;
    
    // float theta = 0.7;
    
    // calculate sin/cos (tbd)
    // float coa = cos(theta);
    // float sia = sin(theta);
    // float coa = cos(u_theta);
    // float sia = sin(u_theta);    
    
    // #if AA>1
    // for( int m=0; m<AA; m++ )
    // for( int n=0; n<AA; n++ )
    // {
    //     vec2 p = (-iResolution.xy + 2.0*(fragCoord.xy+vec2(float(m),float(n))/float(AA)))/iResolution.y;
    //     float w = float(AA*m+n);
    //     float time = iTime + 0.5*(1.0/24.0)*w/float(AA*AA);


    // use to rotate viewer (tbd)
    // vec2 xy = vec2(p.x*coa-p.y*sia, p.x*sia+p.y*coa);
    vec2 xy = p;
    vec2 c = u_pos + xy/u_zoom;
    // vec2 c = 2. * u_pos / (resolution.y * u_zoom) + xy/u_zoom;
    // vec2 c = (2. * u_pos/(resolution.y * u_zoom)) + xy/(u_zoom);

    // smoothing factor (original = 256.0)
    const float B = 32.0;
    float l = 0.0;
    vec2 z  = vec2(0.0);
    for( int i=0; i<600; i++ )
    {
        // z = z*z + c		
        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;

        if( dot(z,z)>(B*B) ) break;

        l += 1.0;
    }
    
    // float al = smoothstep( -0.1, 0.0, 1.0);
    // log2 is undefined for dot(z,z) = 0; strange colouring in bulbs otherwise
    float dz = dot(z,z);
    if (dz > 1.0) {
        l = l - log2(log2(dz)) + 4.0; 
        //    a 0.405 multiplier here  vvvv  also looks good
        col += 0.5 + 0.5*cos( 3.0 +  l*0.15 + vec3(0.0, 0.6, 1.0));
    }

    // add crosshair
    // float thresh = 1.0;
    // if (abs(2.0*gl_FragCoord.x - resolution.x) <= thresh || abs(2.0*gl_FragCoord.y - resolution.y) <= thresh) {
    //     col = .5 - col;
    // }

    // Output to screen
    gl_FragColor = vec4( col, 1.0 );
}