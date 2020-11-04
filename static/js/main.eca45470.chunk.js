(this["webpackJsonpmandelbrot-maps"]=this["webpackJsonpmandelbrot-maps"]||[]).push([[0],{210:function(e){e.exports=JSON.parse('{"a":"https://forms.gle/BeiSq3CxhEFwZkQ86"}')},229:function(e,t,n){e.exports=n(242)},234:function(e,t,n){},235:function(e,t,n){},242:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(11),i=n.n(r),c=(n(234),n(7)),l=n(293),s=n(270),u=n(16),m=n(24),d=(n(235),[-.7746931,.1242266]),f={xy:[0,0],z:1,theta:0},g={default:{xy:{mass:1,tension:500,friction:75},zoom:{mass:1,tension:300,friction:40},rot:{mass:1,tension:400,friction:75}},user:{xy:{mass:1,tension:2e3,friction:100},zoom:{mass:1,tension:700,friction:60},rot:{mass:1,tension:400,friction:75}}},p=n(218),b=n(267),h=n(271),v=n(274),w=n(107),x=n.n(w),y=n(45);function E(e){var t=e.domTarget,n=e.controls,a=e.screenScaleMultiplier,o=e.setDragging,r=Object(c.a)(n.xyCtrl,2),i=r[0].xy,l=r[1],s=Object(c.a)(n.zoomCtrl,2),u=s[0],d=u.z,f=u.minZoom,p=u.maxZoom,b=s[1],h=Object(c.a)(n.rotCtrl,2),v=h[0].theta,w=h[1],E=.003,O=.001;return{handlers:{onDragStart:function(e){var t=e.event;return null===t||void 0===t?void 0:t.preventDefault()},onPinchStart:function(e){var t=e.event;return null===t||void 0===t?void 0:t.preventDefault()},onPinch:function(e){var t=Object(c.a)(e.vdva,2),n=t[0],a=(t[1],e.down),o=Object(c.a)(e.da,2),r=(o[0],o[1]),l=e.first,s=Object(c.a)(e.movement,2),u=(s[0],s[1],e.origin,e.memo),m=void 0===u?{xy:i.getValue(),z:d.getValue(),t:v.getValue(),a:0}:u;l&&(m.a=r);var h,y=d.getValue()*(1+.06*n),E=x.a.clamp(y,f.getValue(),p.getValue());return b({z:E,config:a?g.user.zoom:g.default.zoom}),w({theta:m.t+(h=r-m.a,h*Math.PI/180),config:a?g.user.rot:g.default.rot}),m},onWheel:function(e){var t=Object(c.a)(e.movement,2)[1],n=e.active,a=e.shiftKey,o=e.memo,r=void 0===o?{zoom:d.getValue(),t:v.getValue()}:o;if(a){var i=r.t+.0015*t;w({theta:i,config:n?g.user.rot:g.default.rot})}else{var l=r.zoom*(1-t*(t<0?E:O));b({z:x.a.clamp(l,f.getValue(),p.getValue()),config:n?g.user.zoom:g.default.zoom})}return r},onDrag:function(e){var n,r=e.down,s=e.movement,u=Object(c.a)(e.direction,2),f=(u[0],u[1],e.velocity,e.pinching),p=(e.last,e.cancel),b=e.memo,h=void 0===b?{xy:i.getValue(),theta:v.getValue()}:b;f&&p&&p();var w=((null===(n=t.current)||void 0===n?void 0:n.height)||100)*d.getValue()*a,x=Object(m.vScale)(-2/w,s),E=Object(c.a)(x,2),O=[E[0],-E[1]],j=v.getValue();return l({xy:Object(y.a)(h.xy,Object(m.vRotate)(j,O)),config:r?g.user.xy:g.default.xy}),o(r),h}},config:{eventOptions:{passive:!1,capture:!1},domTarget:t}}}function O(e,t){var n=t.xy,a=t.z,o=t.theta,r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];void 0!==n&&e.xyCtrl[1]({xy:Object(m.vScale)(1/1e-7,n),config:g.default.xy,immediate:r}),void 0!==a&&e.zoomCtrl[1]({z:a,config:g.default.zoom,immediate:r}),void 0!==o&&e.rotCtrl[1]({theta:o,config:g.default.rot,immediate:r})}var j=function(e){var t=Object(a.useState)(d[0]),n=Object(c.a)(t,2),r=n[0],i=n[1],l=Object(a.useState)(d[1]),u=Object(c.a)(l,2),m=u[0],f=u[1],g=Object(a.useState)(85),w=Object(c.a)(g,2),x=w[0],y=w[1],E=Object(a.useState)(.6),j=Object(c.a)(E,2),z=j[0],A=j[1];return o.a.createElement(p.a,{in:e.show},o.a.createElement(b.a,{style:{width:"auto",zIndex:1300,position:"relative",padding:8,display:"flex",flexDirection:"column",flexShrink:1}},o.a.createElement(s.a,{container:!0,direction:"column",alignItems:"center"},o.a.createElement(h.a,{size:"small",style:{width:"12ch"},onChange:function(e){return i(Number(e.target.value))},type:"number",defaultValue:r,inputProps:{step:.01},label:"x"}),o.a.createElement(h.a,{size:"small",style:{width:"12ch"},onChange:function(e){return f(Number(e.target.value))},type:"number",defaultValue:m,inputProps:{step:.01},label:"y"}),o.a.createElement(s.a,{container:!0,direction:"row",justify:"space-around"},o.a.createElement(h.a,{size:"small",style:{width:"5ch"},onChange:function(e){return y(Number(e.target.value))},type:"number",defaultValue:x,inputProps:{min:0},label:"zoom"}),o.a.createElement(h.a,{size:"small",style:{width:"5ch"},onChange:function(e){return A(Number(e.target.value))},type:"number",defaultValue:z,inputProps:{step:.1},label:"theta"})),o.a.createElement(v.a,{style:{marginTop:12},onClick:function(){return O(e.mandelbrot,{xy:[r,m],z:x,theta:z})}},"Go"))))},z=n(109),A=function(e){return o.a.createElement(p.a,{in:e.show},o.a.createElement(b.a,{style:{width:"auto",zIndex:1300,position:"relative",padding:"6px 12px",marginBottom:8}},o.a.createElement(z.a,{align:"right",style:{fontFamily:"monospace",fontSize:"1.2rem"}},o.a.createElement(u.a.span,null,e.mandelbrot.xy.interpolate((function(e,t){return"".concat((1e-7*e).toFixed(7)," : x")}))),o.a.createElement("br",null),o.a.createElement(u.a.span,null,e.mandelbrot.xy.interpolate((function(e,t){return"".concat((1e-7*t).toFixed(7)," : y")}))),o.a.createElement("br",null),o.a.createElement(u.a.span,null,e.mandelbrot.zoom.interpolate((function(e){return"".concat(e.toFixed(2)," : z")}))),o.a.createElement("br",null),o.a.createElement(u.a.span,null,e.mandelbrot.theta.interpolate((function(e){return"".concat(e.toFixed(3)," : t")}))))))},C=n(87),S=n(296),k=n(4),_=n(279),W=n(275),I=n(277),P=n(278),R=n(276),M=n(211),N=n.n(M),T=n(280),F=n(281),B=n(294),D=n(282),V=n(88),L=n(283),G=n(284),X=n(285),U=n(286),q=n(287),H=n(288),J=n(213),Z=n.n(J),K=n(212),Q=n.n(K),Y=n(295),$=n(210);var ee=Object(k.a)((function(e){return Object(S.a)({root:{margin:0,padding:e.spacing(2),display:"flex",flexDirection:"row"},image:{marginTop:"auto",marginBottom:"auto",marginRight:8,height:50},closeButton:{marginLeft:"auto",color:e.palette.grey[500]}})}))((function(e){var t=e.children,n=e.classes,a=e.onClose,r=Object(C.a)(e,["children","classes","onClose"]);return o.a.createElement(W.a,Object.assign({disableTypography:!0,className:n.root},r),o.a.createElement("img",{src:"logo-512.png",alt:"Mandelbrot Maps logo",className:n.image}),o.a.createElement(z.a,{variant:"h1",style:{fontSize:24,marginTop:"auto",marginBottom:"auto"}},t),a?o.a.createElement(R.a,{"aria-label":"close",className:n.closeButton,onClick:a},o.a.createElement(N.a,null)):null)})),te=Object(k.a)((function(e){return{root:{padding:e.spacing(3)}}}))(I.a),ne=Object(k.a)((function(e){return{root:{margin:0,padding:e.spacing(1)}}}))(P.a);function ae(e){return o.a.createElement(Y.a,Object.assign({elevation:6,variant:"filled"},e))}function oe(e){var t=Object(c.a)(e.ctrl,2),n=t[0],r=t[1],i=Object(a.useState)(!1),l=Object(c.a)(i,2),s=l[0],u=l[1],m=function(){return r(!1)},d=function(e){var t="";e.screen.width&&(t+=(e.screen.width?e.screen.width:"")+" x "+(e.screen.height?e.screen.height:""));var n,a,o,r=navigator.appVersion,i=navigator.userAgent,c=navigator.appName,l=""+parseFloat(navigator.appVersion),s=parseInt(navigator.appVersion,10);-1!=(a=i.indexOf("Opera"))&&(c="Opera",l=i.substring(a+6),-1!=(a=i.indexOf("Version"))&&(l=i.substring(a+8))),-1!=(a=i.indexOf("OPR"))?(c="Opera",l=i.substring(a+4)):-1!=(a=i.indexOf("Edge"))?(c="Microsoft Edge",l=i.substring(a+5)):-1!=(a=i.indexOf("MSIE"))?(c="Microsoft Internet Explorer",l=i.substring(a+5)):-1!=(a=i.indexOf("Chrome"))?(c="Chrome",l=i.substring(a+7)):-1!=(a=i.indexOf("Safari"))?(c="Safari",l=i.substring(a+7),-1!=(a=i.indexOf("Version"))&&(l=i.substring(a+8))):-1!=(a=i.indexOf("Firefox"))?(c="Firefox",l=i.substring(a+8)):-1!=i.indexOf("Trident/")?(c="Microsoft Internet Explorer",l=i.substring(i.indexOf("rv:")+3)):(n=i.lastIndexOf(" ")+1)<(a=i.lastIndexOf("/"))&&(c=i.substring(n,a),l=i.substring(a+1),c.toLowerCase()==c.toUpperCase()&&(c=navigator.appName)),-1!=(o=l.indexOf(";"))&&(l=l.substring(0,o)),-1!=(o=l.indexOf(" "))&&(l=l.substring(0,o)),-1!=(o=l.indexOf(")"))&&(l=l.substring(0,o)),s=parseInt(""+l,10),isNaN(s)&&(l=""+parseFloat(navigator.appVersion),s=parseInt(navigator.appVersion,10));var u=/Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(r),m=!!navigator.cookieEnabled;"undefined"!=typeof navigator.cookieEnabled||m||(document.cookie="testcookie",m=-1!=document.cookie.indexOf("testcookie"));var d="-",f=[{s:"Windows 10",r:/(Windows 10.0|Windows NT 10.0)/},{s:"Windows 8.1",r:/(Windows 8.1|Windows NT 6.3)/},{s:"Windows 8",r:/(Windows 8|Windows NT 6.2)/},{s:"Windows 7",r:/(Windows 7|Windows NT 6.1)/},{s:"Windows Vista",r:/Windows NT 6.0/},{s:"Windows Server 2003",r:/Windows NT 5.2/},{s:"Windows XP",r:/(Windows NT 5.1|Windows XP)/},{s:"Windows 2000",r:/(Windows NT 5.0|Windows 2000)/},{s:"Windows ME",r:/(Win 9x 4.90|Windows ME)/},{s:"Windows 98",r:/(Windows 98|Win98)/},{s:"Windows 95",r:/(Windows 95|Win95|Windows_95)/},{s:"Windows NT 4.0",r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},{s:"Windows CE",r:/Windows CE/},{s:"Windows 3.11",r:/Win16/},{s:"Android",r:/Android/},{s:"Open BSD",r:/OpenBSD/},{s:"Sun OS",r:/SunOS/},{s:"Chrome OS",r:/CrOS/},{s:"Linux",r:/(Linux|X11(?!.*CrOS))/},{s:"iOS",r:/(iPhone|iPad|iPod)/},{s:"Mac OS X",r:/Mac OS X/},{s:"Mac OS",r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},{s:"QNX",r:/QNX/},{s:"UNIX",r:/UNIX/},{s:"BeOS",r:/BeOS/},{s:"OS/2",r:/OS\/2/},{s:"Search Bot",r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}];for(var g in f){var p=f[g];if(p.r.test(i)){d=p.s;break}}var b="-";switch(/Windows/.test(d)&&(b=/Windows (.*)/.exec(d)[1],d="Windows"),d){case"Mac OS X":b=/Mac OS X (10[\.\_\d]+)/.exec(i)[1];break;case"Android":b=/Android ([\.\_\d]+)/.exec(i)[1];break;case"iOS":b=(b=/OS (\d+)_(\d+)_?(\d+)?/.exec(r))[1]+"."+b[2]+"."+(0|b[3])}var h,v,w,x,y=i.substring(i.indexOf("(")+1,i.indexOf(")")),E=y.substring(y.lastIndexOf(";")+1),O=document.createElement("canvas");try{v=(h=O.getContext("webgl")||O.getContext("experimental-webgl")).getExtension("WEBGL_debug_renderer_info"),w=h.getParameter(v.UNMASKED_VENDOR_WEBGL),x=h.getParameter(v.UNMASKED_RENDERER_WEBGL)}catch(j){}return{browser:c,browserVersion:s,browserRelease:l,device:E,os:d,osVersion:b,mobile:u,platform:navigator.platform,screen:t,dpr:+e.devicePixelRatio.toFixed(3),gpu:x,gpuVendor:w,userAgent:navigator.userAgent}}(window);return o.a.createElement(_.a,{onClose:m,"aria-labelledby":"customized-dialog-title",open:n,maxWidth:"md"},o.a.createElement(ee,{id:"customized-dialog-title",onClose:m},"Mandelbrot Maps"),o.a.createElement(te,{dividers:!0,style:{maxWidth:700}},o.a.createElement(z.a,{gutterBottom:!0},"Mandelbrot Maps is an interactive fractal explorer built using React and WebGL."),o.a.createElement(z.a,{gutterBottom:!0},"Developed by"," ",o.a.createElement(T.a,{href:"https://jmaio.github.io/",target:"_blank"},"Joao Maio")," ","in 2019/2020 as part of an Honours Project at The University of Edinburgh, under the supervision of Philip Wadler."),o.a.createElement(z.a,{gutterBottom:!0},"The project was simultaneously undertaken by Freddie Bawden, also under the supervision of Philip Wadler. Freddie's version of the project is available at:"," ",o.a.createElement(T.a,{href:"http://mmaps.freddiejbawden.com/",target:"_blank"},"mmaps.freddiejbawden.com")),o.a.createElement(z.a,{gutterBottom:!0},"The"," ",o.a.createElement(T.a,{href:"https://homepages.inf.ed.ac.uk/wadler/mandelbrot-maps/index.html",target:"_blank"},"original Mandelbrot Maps project")," ","was developed by Iain Parris in 2008 as a Java Applet."),o.a.createElement(z.a,{gutterBottom:!0},"Mandelbrot set shader code adapted from"," ",o.a.createElement(T.a,{href:"https://www.shadertoy.com/view/4df3Rn"},"Mandelbrot - smooth")," by"," ",o.a.createElement(T.a,{href:"http://iquilezles.org/",target:"_blank"},"Inigo Quilez"),"."),o.a.createElement(F.a,{style:{marginTop:30,marginBottom:30}}),o.a.createElement(B.a,{style:{display:"flex"}},o.a.createElement(D.a,{component:V.a,style:{width:"auto",margin:"auto",maxWidth:460}},o.a.createElement(L.a,{size:"small","aria-label":"a dense table"},o.a.createElement(G.a,null,o.a.createElement(X.a,null,o.a.createElement(U.a,{align:"center",colSpan:2,variant:"head"},"Device properties"))),o.a.createElement(q.a,null,Object.entries(d).map((function(e){var t=Object(c.a)(e,2),n=t[0],a=t[1];return o.a.createElement(X.a,{key:n},o.a.createElement(U.a,null,n),o.a.createElement(U.a,{align:"right",style:{fontFamily:"monospace"}},String(a)))})))))),o.a.createElement(F.a,{style:{marginTop:30,marginBottom:30}}),o.a.createElement(B.a,{style:{display:"flex"}},o.a.createElement(z.a,{variant:"overline",align:"center",style:{margin:"auto"}},"Build:",o.a.createElement(z.a,{style:{fontFamily:"monospace"}},"2020-11-04T18:36:12.028Z")))),o.a.createElement(ne,null,o.a.createElement(v.a,{onClick:function(){!function(e){console.log(s);try{navigator.clipboard.writeText(e),u(!0)}catch(t){window.prompt("Auto copy to clipboard failed, copy manually from below:",e)}}(JSON.stringify(d))},color:"primary",variant:"outlined",startIcon:o.a.createElement(Q.a,null)},"Copy"),o.a.createElement(H.a,{open:s,autoHideDuration:5e3},o.a.createElement(ae,{onClose:function(){return u(!1)},severity:"info"},"Device properties copied!")),o.a.createElement(T.a,{href:$.a,target:"_blank",rel:"noopener",style:{textDecoration:"none"}},o.a.createElement(v.a,{autoFocus:!0,color:"primary",variant:"outlined",startIcon:o.a.createElement(Z.a,null)},"Feedback"))))}var re=function(e){var t=e.maxI,n=void 0===t?300:t,a=e.AA,o=void 0===a?1:a,r=e.B,i=void 0===r?64:r;return"\n#version 300 es\n// specify OpenGL ES 3.0\n\n#define AA ".concat(o,"\n#define MAXI ").concat(n,"\n#define B ").concat(i.toFixed(1),'\n\n// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices\n// A good pattern for "always give me the highest precision":\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  // set high float precision (lower than this may break colours on mobile)\n  precision highp float;\n#else\n  precision mediump float;\n#endif\n\n// output fragment colour\nout vec4 fragColor;\n\n// need to know the resolution of the canvas\nuniform vec2 resolution;\n\n// properties should be passed as uniforms\nuniform int   u_maxI;\nuniform vec2  u_xy;\nuniform vec2  u_c;\nuniform float u_zoom;\nuniform float u_theta;\n\nfloat julia( vec2 z, vec2 c ) {\n\n  float l = 0.0;\n  for( int i=0; i<MAXI; i++ )\n  {\n      z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;\n      if( dot(z,z)>(B*B) ) break;\n      l += 1.0;\n  }\n\n  // maxed out iterations\n  if( l>float(MAXI)-1.0 ) return 0.0;\n\n  // equivalent optimized smooth interation count\n  l = l - log2(log2(dot(z,z))) + 4.0;\n\n  return l;\n}\n\nvoid main() {    \n  // set the initial colour to black\n  vec3 col = vec3(0.0);\n\n  // anti-aliasing\n  #if AA>1\n  for( int m=0; m<AA; m++ )\n  for( int n=0; n<AA; n++ )\n  {\n      vec2 p = (2.0*(gl_FragCoord.xy + vec2(float(m), float(n)) / float(AA) ) - resolution.xy)/resolution.y;\n      float w = float(AA*m+n);\n  #else    \n      // adjust pixels to range from [-1, 1]\n      vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;\n  #endif\n  \n  // constant "c" to add, based on mandelbrot position\n  vec2 c = u_c;\n\n  float sinT = sin(u_theta);\n  float cosT = cos(u_theta);\n\n  vec2 xy = vec2( p.x*cosT - p.y*sinT, p.x*sinT + p.y*cosT );\n  // c is based on offset and grid position, z_0 = 0\n  vec2 z = u_xy + xy/u_zoom;\n\n  float l = julia(z, c);\n  col += 0.5 + 0.5*cos( 3.0 + l*0.15 + vec3(0.0,0.6,1.0));\n\n  // antialiasing\n  #if AA>1\n  }\n  col /= float(AA*AA);\n  #endif\n\n  // Output to screen\n  fragColor = vec4( col, 1.0 );\n}\n')},ie=n(297),ce=n(298),le=function(e){return{showMinimap:{k:"showMinimap",label:"Minimap",checked:e.showMinimap,control:o.a.createElement(ie.a,null)},showCrosshair:{k:"showCrosshair",label:"Crosshair",checked:e.showCrosshair,control:o.a.createElement(ie.a,null)},showCoordinates:{k:"showCoordinates",label:"Show coordinates",checked:e.showCoordinates,control:o.a.createElement(ie.a,null)},maxI:{k:"maxI",label:"Iterations",value:e.maxI,labelPlacement:"top",style:{marginLeft:0,marginRight:0},control:o.a.createElement(ce.a,{min:10,max:1e3,step:10,valueLabelDisplay:"auto",marks:[{value:10,label:10},{value:250,label:250},{value:500,label:500},{value:750,label:750},{value:1e3,label:1e3}]})},useDPR:{k:"useDPR",label:"Use pixel ratio (".concat(+window.devicePixelRatio.toFixed(3),")"),checked:e.useDPR,control:o.a.createElement(ie.a,null)},useAA:{k:"useAA",label:"Anti-aliasing (slow)",checked:e.useAA,control:o.a.createElement(ie.a,null)},showFPS:{k:"showFPS",label:"Show FPS",checked:e.showFPS,control:o.a.createElement(ie.a,null)}}},se={showMinimap:!0,showCrosshair:!0,showCoordinates:!0,maxI:250,showFPS:!1,useDPR:!1,useAA:!1},ue=Object(a.createContext)({settings:se,setSettings:function(){},settingsWidgets:le(se)}),me=function(e){var t=e.children,n=Object(a.useState)(se),r=Object(c.a)(n,2),i=r[0],l=r[1];return o.a.createElement(ue.Provider,{value:{settings:i,setSettings:l,settingsWidgets:le(i)}},t)},de=n(110),fe=n(217),ge=n(17),pe=Object(fe.a)({props:{MuiSwitch:{color:"primary"},MuiButton:{variant:"outlined"}},palette:{primary:{main:ge.a.blue[700]},secondary:{main:ge.a.red[700]},info:{main:ge.a.blue[700]}}}),be=pe,he=n(65),ve=n(40),we={position:{numComponents:3,data:[-1,-1,0,1,-1,0,-1,1,0,-1,1,0,1,-1,0,1,1,0]}},xe=o.a.forwardRef((function(e,t){var n=t,r=Object(a.useRef)(),i=Object(a.useRef)(),c=Object(a.useRef)(),l=Object(a.useRef)(),s=e.u,d=e.fps,f=Object(a.useCallback)((function(){return e.mini?1:e.u.zoom.getValue()}),[e.mini,e.u.zoom]),g=Object(a.useRef)(f()),p=e.useDPR?window.devicePixelRatio:1;Object(a.useEffect)((function(){var e,t,a;r.current=n.current.getContext("webgl2"),console.log(null===(e=r.current)||void 0===e?void 0:e.getShaderPrecisionFormat(null===(t=r.current)||void 0===t?void 0:t.FRAGMENT_SHADER,null===(a=r.current)||void 0===a?void 0:a.HIGH_FLOAT))}),[n]),Object(a.useEffect)((function(){c.current=ve.a(r.current,we)}),[r]),Object(a.useEffect)((function(){g.current=e.u.zoom.getValue()}),[e.u]),Object(a.useEffect)((function(){l.current=ve.b(r.current,["\n#version 300 es\n// specify OpenGL ES 3.0\n\nin vec4 position;\n\nvoid main() {\n  gl_Position = position;\n}\n",e.fragShader])}),[r,e.fragShader]);var b=Object(a.useRef)(0),h=Object(a.useRef)(0),v=Object(a.useRef)(0),w=Object(a.useCallback)((function(e){var t;ve.d(n.current,p),r.current.viewport(0,0,n.current.width,n.current.height);var a={resolution:[n.current.width,n.current.height],u_zoom:f(),u_c:void 0===s.c?0:Object(m.vScale)(1e-7,s.c.getValue()),u_xy:Object(m.vScale)(1e-7,s.xy.getValue()),u_maxI:s.maxI,u_theta:null===(t=s.theta)||void 0===t?void 0:t.getValue()};r.current.useProgram(l.current.program),ve.e(r.current,l.current,c.current),ve.f(l.current,a),ve.c(r.current,c.current),void 0!==d&&(h.current++,v.current+=e-b.current,b.current=e,v.current>=1e3&&(d((h.current*(1e3/v.current)).toFixed(1)),h.current=0,v.current-=1e3)),i.current=requestAnimationFrame(w)}),[r,s,f,p,d,1e3,n]);return Object(a.useEffect)((function(){return i.current=requestAnimationFrame(w),function(){return cancelAnimationFrame(i.current)}}),[w]),o.a.createElement(u.a.canvas,{className:"renderer",ref:t,style:Object(he.a)({cursor:e.dragging?"grabbing":"grab"},e.style)})}));xe.displayName="WebGLCanvas";var ye=xe,Ee=function(e){var t=e.canvasRef,n=e.onClick,a=e.show,r=Object(C.a)(e,["canvasRef","onClick","show"]);return o.a.createElement(p.a,{in:a},o.a.createElement(de.a,{style:{position:"absolute",zIndex:1300,margin:"0.5rem",left:0,bottom:0,height:100,width:100,borderRadius:8,boxShadow:"0px 2px 10px 1px rgba(0, 0, 0, 0.4)",overflow:"hidden"},onClick:n},o.a.createElement(ye,Object.assign({mini:!0,ref:t},r,{style:{borderRadius:8,cursor:"pointer"}}))))};function Oe(e){var t=Object(a.useRef)(null),n=Object(a.useRef)(null),r=Object(c.a)(e.controls.xyCtrl,1)[0].xy,i=Object(c.a)(e.controls.zoomCtrl,2),l=i[0].z,s=i[1],u=Object(c.a)(e.controls.rotCtrl,1)[0].theta,m=e.maxI,d=e.useAA?2:1,f=re({maxI:m,AA:d}),g=re({maxI:m,AA:2}),p={zoom:l,xy:r,c:e.c,theta:u,maxI:m},b=Object(a.useState)(!1),h=Object(c.a)(b,2),v=h[0],w=h[1],x=E({domTarget:t,controls:e.controls,screenScaleMultiplier:1e-7/(e.useDPR?window.devicePixelRatio:1),setDragging:w}),O=Object(y.b)(x.handlers,x.config);return Object(a.useEffect)((function(){O()}),[O]),o.a.createElement(ue.Consumer,null,(function(a){var r=a.settings;return o.a.createElement("div",{className:"renderer",style:{position:"relative"}},o.a.createElement(ye,{id:"julia",fragShader:f,useDPR:e.useDPR,u:p,ref:t,dragging:v}),o.a.createElement(Ee,{fragShader:g,useDPR:r.useDPR,u:p,canvasRef:n,onClick:function(){return s({z:1})},show:r.showMinimap}))}))}var je=function(e,t){return{stroke:e,radius:t}},ze=je(2,100),Ae=je(1,30),Ce=function(e){var t=e.maxI,n=void 0===t?300:t,a=e.AA,o=void 0===a?1:a,r=e.B,i=void 0===r?64:r,c=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],l=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{stroke:2,radius:100};return"\n#version 300 es\n// specify OpenGL ES 3.0\n\n// Adapted by Joao Maio/2019, based on work by inigo quilez - iq/2013\n// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\n\n// See here for more information on smooth iteration count:\n// http://iquilezles.org/www/articles/mset_smooth/mset_smooth.htm\n\n#define false 0\n#define true 1\n\n// render parameters\n#define AA ".concat(o,"\n#define MAXI ").concat(n,"\n#define B ").concat(i.toFixed(1),"\n\n// crosshair parameters\n#define show_crosshair ").concat(c,"\n#define cross_stroke ").concat(l.stroke.toFixed(1),"\n#define cross_radius ").concat(l.radius.toFixed(1),'\n\n// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices\n// A good pattern for "always give me the highest precision":\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  // set high float precision (lower than this may break colours on mobile)\n  precision highp float;\n#else\n  precision mediump float;\n#endif\n\n// output fragment colour\nout vec4 fragColor;\n\n// need to know the resolution of the canvas\nuniform vec2 resolution;\n\n// properties should be passed as uniforms\nuniform int   u_maxI;  \nuniform vec2  u_xy;\nuniform float u_zoom;\nuniform float u_theta;\n\nbool crosshair( float x, float y ) {\n  float abs_x = abs(2.0*x - resolution.x);\n  float abs_y = abs(2.0*y - resolution.y);\n\n  return \n  // crosshair in centre of screen\n  (abs_x <= cross_stroke || abs_y <= cross_stroke) &&\n  // crosshair size / "radius"\n  (abs_x <= cross_radius && abs_y <= cross_radius);\n}\n\nfloat mandelbrot( in vec2 c ) {\n    {\n        float c2 = dot(c, c);\n        // skip computation inside M1 - http://iquilezles.org/www/articles/mset_1bulb/mset1bulb.htm\n        if( 256.0*c2*c2 - 96.0*c2 + 32.0*c.x - 3.0 < 0.0 ) return 0.0;\n        // skip computation inside M2 - http://iquilezles.org/www/articles/mset_2bulb/mset2bulb.htm\n        if( 16.0*(c2+2.0*c.x+1.0) - 1.0 < 0.0 ) return 0.0;\n    }\n\n    float l = 0.0;\n    vec2 z  = vec2(0.0);\n    for( int i=0; i<MAXI; i++ )\n    {\n        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;\n        if( dot(z,z)>(B*B) ) break;\n        l += 1.0;\n    }\n\n    // maxed out iterations\n    if( l>float(MAXI)-1.0 ) return 0.0;\n    \n    // optimized smooth interation count\n    l = l - log2(log2(dot(z,z))) + 4.0;\n\n    return l;\n}\n\nvoid main() {    \n    // set the initial colour to black\n    vec3 col = vec3(0.0);\n\n    // anti-aliasing\n    #if AA>1\n    for( int m=0; m<AA; m++ )\n    for( int n=0; n<AA; n++ )\n    {\n        // vec2 p = (-iResolution.xy + 2.0*(fragCoord.xy+vec2(float(m),float(n))/float(AA)))/iResolution.y;\n        vec2 p = (2.0*(gl_FragCoord.xy + vec2(float(m), float(n)) / float(AA) ) - resolution.xy)/resolution.y;\n        float w = float(AA*m+n);\n    #else    \n        // adjust pixels to range from [-1, 1]\n        vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;\n    #endif\n\n    float sinT = sin(u_theta);\n    float cosT = cos(u_theta);\n\n    vec2 xy = vec2( p.x*cosT - p.y*sinT, p.x*sinT + p.y*cosT );\n    // c is based on offset and grid position, z_0 = 0\n    vec2 c = u_xy + xy/u_zoom;\n    \n    float l = mandelbrot(c);\n    col += 0.5 + 0.5*cos( 3.0 + l*0.15 + vec3(0.0,0.6,1.0));\n\n    // antialiasing\n    #if AA>1\n    }\n    col /= float(AA*AA);\n    #endif\n\n    #if show_crosshair\n    if (crosshair(gl_FragCoord.x, gl_FragCoord.y)) {\n        col = 1. - col;\n    }\n    #endif\n\n    // Output to screen\n    fragColor = vec4( col, 1.0 );\n}\n')},Se=function(e){return o.a.createElement(p.a,{in:e.show},o.a.createElement(b.a,{style:{position:"fixed",top:0,left:0,padding:"4px 12px",margin:6,fontFamily:"monospace",borderRadius:100,fontSize:"1.8rem",zIndex:1300,userSelect:"none"}},o.a.createElement(u.a.div,null,e.fps)))};function ke(e){var t=Object(a.useRef)(null),n=Object(a.useRef)(null),r=Object(c.a)(e.controls.xyCtrl,1)[0].xy,i=Object(c.a)(e.controls.zoomCtrl,2),l=i[0].z,s=i[1],u=Object(c.a)(e.controls.rotCtrl,1)[0].theta,m=e.maxI,d=e.useAA?2:1,f=Ce({maxI:m,AA:d},e.showCrosshair,ze),g=Ce({maxI:m,AA:2},e.showCrosshair,Ae),p=Object(a.useState)(!1),b=Object(c.a)(p,2),h=b[0],v=b[1],w=E({domTarget:t,controls:e.controls,screenScaleMultiplier:1e-7/(e.useDPR?window.devicePixelRatio:1),setDragging:v}),x=Object(y.b)(w.handlers,w.config);Object(a.useEffect)((function(){x()}),[x]);var O=Object(a.useState)(""),j=Object(c.a)(O,2),z=j[0],A=j[1];return o.a.createElement(ue.Consumer,null,(function(e){var a=e.settings;return o.a.createElement("div",{className:"renderer",style:{position:"relative"}},o.a.createElement(Se,{fps:z,show:a.showFPS}),o.a.createElement(ye,{id:"mandelbrot",fragShader:f,useDPR:a.useDPR,u:{zoom:l,xy:r,theta:u,maxI:m},ref:t,fps:A,dragging:h}),o.a.createElement(Ee,{fragShader:g,useDPR:a.useDPR,u:{zoom:l,xy:r,theta:u,maxI:m},canvasRef:n,show:a.showMinimap,onClick:function(){return s({z:1})}}))}))}var _e=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function We(e){if("serviceWorker"in navigator){if(new URL("/mandelbrot-maps",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/mandelbrot-maps","/service-worker.js");_e?(!function(e,t){fetch(e).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):Ie(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):Ie(t,e)}))}}function Ie(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}var Pe=function(){var e=o.a.useState(!1),t=Object(c.a)(e,2),n=t[0],r=t[1],i=o.a.useState(null),l=Object(c.a)(i,2),s=l[0],u=l[1],m=function(e){console.log("Out of date version detected! Triggering snackbar."),r(!0),u(e.waiting)};Object(a.useEffect)((function(){console.log("Registering Service Worker for update detection..."),We({onUpdate:m})}),[]);return o.a.createElement(H.a,{open:n,anchorOrigin:{vertical:"top",horizontal:"center"}},o.a.createElement(Y.a,{severity:"info",action:o.a.createElement(v.a,{color:"inherit",variant:"outlined",size:"small",onClick:function(){s&&s.postMessage({type:"SKIP_WAITING"}),r(!1),window.location.reload()}},"Update")},"A new version is available!"))},Re=n(25),Me=n(289),Ne=n(290),Te=n(251),Fe=n(248),Be=n(291),De=n(292),Ve=n(215),Le=n.n(Ve),Ge=n(214),Xe=n.n(Ge),Ue=n(216),qe=n.n(Ue),He=Object(Me.a)((function(e){return{root:{position:"absolute",bottom:e.spacing(2),right:e.spacing(2),display:"flex",flexDirection:"column",zIndex:2},button:{padding:"6px 12px",marginTop:10},sliderControl:{width:30}}})),Je=function(){return o.a.createElement(F.a,{style:{marginTop:10,marginBottom:4}})},Ze=function(e){return o.a.createElement(z.a,{variant:"overline",style:{fontSize:14,marginBottom:4}},e.title)};function Ke(e){var t=He(),n=Object(a.useState)(),r=Object(c.a)(n,2),i=r[0],l=r[1],u=function(){return o.a.createElement(v.a,{startIcon:o.a.createElement(Xe.a,null),color:"secondary","aria-controls":"reset",onClick:function(){e.reset()},className:t.button},"Reset")},m=function(){return o.a.createElement(v.a,{startIcon:o.a.createElement(Le.a,null),color:"primary","aria-controls":"about",onClick:function(){e.toggleInfo(),l(void 0)},className:t.button},"About")};return o.a.createElement("div",{className:t.root},o.a.createElement(Ne.a,{"aria-controls":"menu","aria-haspopup":"true","aria-label":"settings",size:"small",onClick:function(e){return l(e.currentTarget)}},o.a.createElement(qe.a,null)),o.a.createElement(Te.a,{open:Boolean(i)},o.a.createElement(Fe.a,{id:"menu",anchorEl:i,keepMounted:!0,open:Boolean(i),onClose:function(){return l(void 0)},anchorOrigin:{horizontal:"right",vertical:"bottom"},transformOrigin:{vertical:"bottom",horizontal:"right"}},o.a.createElement(s.a,{container:!0,direction:"column",style:{paddingLeft:"1.5em",paddingRight:"1.5em",paddingTop:"1em",paddingBottom:"1em"}},o.a.createElement(s.a,{item:!0,container:!0,alignItems:"center",justify:"space-around"},o.a.createElement(s.a,{item:!0},o.a.createElement(z.a,{variant:"h1",style:{fontSize:20,padding:10}},"Configuration"))),o.a.createElement(ue.Consumer,null,(function(e){var t=e.setSettings;return function(e){return[{name:"Interface",widgets:[e.showMinimap,e.showCrosshair,e.showCoordinates]},{name:"Graphics",widgets:[e.maxI,e.useDPR,e.useAA,e.showFPS]}]}(e.settingsWidgets).map((function(e){return o.a.createElement(s.a,{item:!0,key:e.name},o.a.createElement(Je,null),o.a.createElement(Ze,{title:e.name}),o.a.createElement(Be.a,null,e.widgets.map((function(e){return o.a.createElement(De.a,Object.assign({key:"".concat(e.label,"-control"),style:{userSelect:"none"}},e,{onChange:function(n,a){console.log("".concat(e.k," -> ").concat(a)),t((function(t){return Object(he.a)(Object(he.a)({},t),{},Object(Re.a)({},e.k,a))}))}}))}))))}))})),o.a.createElement(Je,null),o.a.createElement(s.a,{container:!0,direction:"row",justify:"space-between",alignItems:"stretch"},o.a.createElement(s.a,{item:!0},o.a.createElement(u,null)),o.a.createElement(s.a,{item:!0,style:{width:"0.5rem"}}),o.a.createElement(s.a,{item:!0},o.a.createElement(m,null)))))))}var Qe=function(){var e=function(){var e="object"===typeof window,t=Object(a.useCallback)((function(){return{width:e?window.innerWidth:void 0,height:e?window.innerHeight:void 0}}),[e]),n=Object(a.useState)(t),o=Object(c.a)(n,2),r=o[0],i=o[1];return Object(a.useEffect)((function(){if(!e)return function(){};function n(){i(t())}return window.addEventListener("resize",n),function(){return window.removeEventListener("resize",n)}}),[t,e]),r}(),t={xyCtrl:Object(u.b)((function(){return{xy:Object(m.vScale)(1/1e-7,d),config:g.default.xy}})),zoomCtrl:Object(u.b)((function(){return{z:85,minZoom:.5,maxZoom:1e5,config:g.default.zoom}})),rotCtrl:Object(u.b)((function(){return{theta:.6,config:g.default.rot}}))},n={xyCtrl:Object(u.b)((function(){return{xy:[0,0],config:g.default.xy}})),zoomCtrl:Object(u.b)((function(){return{z:.5,minZoom:.5,maxZoom:2e3,config:g.default.zoom}})),rotCtrl:Object(u.b)((function(){return{theta:0,config:g.default.rot}}))},r=Object(a.useState)(!1),i=Object(c.a)(r,2),p=i[0],b=i[1];return o.a.createElement(l.a,{theme:be},o.a.createElement(Pe,null),o.a.createElement(me,null,o.a.createElement(s.a,{container:!0},o.a.createElement(ue.Consumer,null,(function(a){var r=a.settings;return o.a.createElement(s.a,{item:!0,container:!0,direction:(e.width||1)<(e.height||0)?"column-reverse":"row",justify:"center",className:"fullSize",style:{position:"absolute"}},o.a.createElement("div",{style:{position:"absolute",right:0,top:0,margin:20,width:"auto"}},o.a.createElement(A,{show:r.showCoordinates,mandelbrot:{xy:t.xyCtrl[0].xy,zoom:t.zoomCtrl[0].z,theta:t.rotCtrl[0].theta}}),o.a.createElement(j,{show:r.showCoordinates,mandelbrot:t})),o.a.createElement(s.a,{item:!0,xs:!0,className:"renderer"},o.a.createElement(ke,Object.assign({controls:t},r))),o.a.createElement(s.a,{item:!0,xs:!0,className:"renderer"},o.a.createElement(Oe,Object.assign({c:t.xyCtrl[0].xy,controls:n},r))))})),o.a.createElement(Ke,{reset:function(){return O(t,f),void O(n,f)},toggleInfo:function(){return b(!p)}}),o.a.createElement(oe,{ctrl:[p,b]}))))};i.a.render(o.a.createElement(Qe,null),document.getElementById("root"))}},[[229,1,2]]]);
//# sourceMappingURL=main.eca45470.chunk.js.map