precision mediump float;

// need to know the resolution of the canvas
uniform vec2 resolution;

// zoom, pos should be passed as uniforms
uniform float u_zoom;
uniform int   u_maxI;
uniform vec2  u_pos;

void main() {    
    vec3 col = vec3(0.0);

    vec2 p = (-resolution.xy + 2.0*gl_FragCoord.xy)/resolution.y;
    
    float theta = 0.;
    
    float zoo = 1.;
    float coa = cos(theta);
    float sia = sin(theta);
    
//    zoo = pow(zoo,8.0);
    
    vec2 xy = vec2(p.x*coa-p.y*sia, p.x*sia+p.y*coa);
    vec2 c = u_pos + xy*zoo;
    
    

    const float B = 256.0;
    float l = 0.0;
    vec2 z  = vec2(0.0);
    for( int i=0; i<200; i++ )
    {
        // z = z*z + c		
        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;

        if( dot(z,z)>(B*B) ) break;

        l += 1.0;
    }
    
    float sl = l - log2(log2(dot(z,z))) + 4.0; 
    col += 0.5 + 0.5*cos( 3.0 +  sl*0.15 + vec3(0.0,0.6,1.0));

    // Output to screen
    gl_FragColor = vec4( col, 1.0 );
}