export const vertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
void main() { vUv=uv; vNormal=normalize(normalMatrix*normal); vPosition=(modelViewMatrix*vec4(position,1.)).xyz; gl_Position=projectionMatrix*vec4(vPosition,1.); }
`;
export const fragmentShader = `
precision highp float;
uniform float uTime;
uniform float uDetail;
uniform float uOpacity;
uniform float uKind;
uniform vec3 uColor;
uniform vec3 uGlow;
uniform vec3 uSunView;
uniform float uSolarLight;
uniform sampler2D uDay;
uniform sampler2D uNight;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
float hash(vec3 p){ p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise(vec3 x){ vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ float n=0.,a=.5;for(int i=0;i<5;i++){if(float(i)>=uDetail)break;n+=a*noise(p);p=p*2.04+3.1;a*=.5;}return n; }
void main(){
 vec3 n=normalize(vNormal),viewDir=normalize(-vPosition);
 vec3 lightDirection=mix(normalize(vec3(-.75,.45,1.)),normalize(uSunView-vPosition),uSolarLight);
 float light=dot(n,lightDirection);
 float day=smoothstep(-.15,.7,light);
 vec3 p=vec3(vUv*vec2(14.,7.),1.);
 float terrain=fbm(p*2.5),fine=fbm(p*12.);
 vec3 base=uColor*(.4+terrain*.85+fine*.3);
 vec3 emission=vec3(0.);
 if(uKind>.5&&uKind<1.5){
  float waves=fbm(p*1.7+vec3(uTime*.025,0.,uTime*.015));
  float storm=smoothstep(.48,.75,fbm(p*2.+vec3(waves*2.,uTime*.012,0.)));
  base=mix(uColor*.32,uColor*1.5,waves)+vec3(.26,.33,.38)*storm*.5;
  base+=pow(max(0.,sin(waves*35.+uTime*.16)),18.)*.035;
 }
 if(uKind>1.5&&uKind<2.5){
  float cracks=1.-smoothstep(.015,.07,abs(fbm(p*3.)-.49));
  float pulse=.65+.25*sin(uTime*.65+terrain*12.);
  base=uColor*(.14+terrain*.6);
  emission=vec3(1.,.19,.025)*cracks*pulse;
 }
 if(uKind>2.5&&uKind<3.5){
  float bands=sin(vUv.y*95.+terrain*10.+fbm(p+uTime*.006)*5.);
  base=mix(uColor*.48,uColor*1.3,bands*.5+.5);
  base=mix(base,uGlow*.65,smoothstep(.6,.8,terrain)*.55);
 }
 if(uKind>3.5&&uKind<4.5){
  base=texture2D(uDay,vUv).rgb;
  emission=texture2D(uNight,vUv).rgb*(1.-smoothstep(-.15,.25,light))*.8;
  float cloud=smoothstep(.62,.77,fbm(p*2.+vec3(uTime*.012,0.,1.)));
  base=mix(base,vec3(.85,.88,.9),cloud*.7);
 }
 if(uKind>4.5&&uKind<5.5){
  float granules=fbm(p*9.+vec3(uTime*.03,0.,0.));
  base=mix(vec3(1.,.3,.035),vec3(1.,.8,.32),granules);
  emission=base*(1.4+granules*.6);
  base=vec3(0.);
 }
 if(uKind>5.5){
  float maria=smoothstep(.33,.65,fbm(p*1.4));
  float craters=pow(1.-abs(sin(fine*80.)),10.);
  base=mix(vec3(.23,.24,.25),uColor,maria)*(.78+fine*.45)-craters*.045;
 }
 float rim=pow(1.-max(0.,dot(n,viewDir)),4.);
 vec3 color=base*(.045+day*.98)+emission;
 color+=uGlow*rim*.2*smoothstep(-.3,.8,light);
 gl_FragColor=vec4(color,uOpacity);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;
export const atmosphereFragment = `
varying vec3 vNormal;varying vec3 vPosition;uniform vec3 uGlow;uniform vec3 uSunView;uniform float uSolarLight;
void main(){float rim=pow(1.-abs(dot(normalize(vNormal),normalize(-vPosition))),3.5);float lit=smoothstep(-.5,.8,dot(normalize(vNormal),mix(normalize(vec3(-.75,.45,1.)),normalize(uSunView-vPosition),uSolarLight)));gl_FragColor=vec4(uGlow,rim*.3*lit);}
`;
