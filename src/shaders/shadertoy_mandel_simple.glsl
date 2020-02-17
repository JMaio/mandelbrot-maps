#define maxI 100 + int(iTime) // increase iterations with time / zoom
#define zoom 0.5
#define aspectRatio iResolution.y/iResolution.x

// centre position
//#define pos vec2(-0.734501991282908, 0.1950545797808222)
#define pos vec2(-1., 0.)

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from -2 to 2 horizontally)
    vec2 relPos = (fragCoord/iResolution.x - vec2(0.5, 0.5 * aspectRatio) + pos);
    vec2 uv = relPos / (1. + zoom*iTime * ((fragCoord - iResolution.x/2.) / iResolution.x)); //+ ((fragCoord - iResolution.xx * vec2(1., aspectRatio)) / iResolution.x) / zoom; //(zoom * (1. + iTime*iTime));
    
    // starting positions
    vec2 c = vec2(uv.x, uv.y);
    vec2 z = vec2(0, 0);
    // count the iterations
    int draw = 0;
    
    for (; draw < maxI; draw++) {
        z = vec2(z[0] * z[0] - z[1] * z[1], 2. * z[0] * z[1]);
        z += c;
        if ( z[0] * z[0] + z[1] * z[1] > 4.) break;
    }
    
    // colour will be grey
    float col = cos(1. - float(draw) / float(maxI));
    
//    if (uv.x < 0. && uv.y < .0) {
//    	  col = .5;
//    }

    // Output to screen
    fragColor = vec4(col, col, col, 1.0);
}