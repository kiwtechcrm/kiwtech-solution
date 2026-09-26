(function(){
var box=document.getElementById('hero3d');if(!box||typeof THREE==='undefined')return;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');box.prepend(canvas);
var renderer;try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});}catch(e){canvas.remove();return}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);
var scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(0,0,9);
scene.add(new THREE.HemisphereLight(0xffffff,0xDCD8FF,1.1));
var key=new THREE.DirectionalLight(0xffffff,1.1);key.position.set(4,6,6);scene.add(key);
var p1=new THREE.PointLight(0xD63BFF,1.4,18);p1.position.set(-4,-2,4);scene.add(p1);
var p2=new THREE.PointLight(0x3D5AFE,1.2,18);p2.position.set(4,3,2);scene.add(p2);
var root=new THREE.Group();scene.add(root);
var NOISE='vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}';
var orbMat=new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uAmp:{value:.26},uMouse:{value:new THREE.Vector2()}},extensions:{derivatives:true},
 vertexShader:NOISE+'uniform float uTime;uniform float uAmp;uniform vec2 uMouse;varying vec3 vPos;varying float vN;varying vec3 vObj;void main(){vec3 n=normalize(position);float d=snoise(n*.9+vec3(uTime*.2))*.7+snoise(n*1.7-vec3(uTime*.15))*.22;d+=dot(n.xy,uMouse)*.35;vN=d;vObj=n;vec3 p=position+n*d*uAmp;vec4 mv=modelViewMatrix*vec4(p,1.0);vPos=mv.xyz;gl_Position=projectionMatrix*mv;}',
 fragmentShader:'uniform float uTime;varying vec3 vPos;varying float vN;varying vec3 vObj;void main(){vec3 n=normalize(cross(dFdx(vPos),dFdy(vPos)));vec3 v=normalize(-vPos);float fr=pow(1.0-max(dot(n,v),0.0),2.4);vec3 blue=vec3(.24,.35,1.0),mag=vec3(.84,.23,1.0),coral=vec3(1.0,.42,.36),gold=vec3(.95,.70,.24);float h=clamp(vN*.9+.45+vObj.y*.35+sin(uTime*.3+vObj.x*2.0)*.12,0.0,1.0);vec3 col=mix(blue,mag,smoothstep(.0,.55,h));col=mix(col,coral,smoothstep(.5,.85,h));col=mix(col,gold,smoothstep(.8,1.0,h));vec3 L=normalize(vec3(.4,.9,.7));float diff=max(dot(n,L),0.0);vec3 H=normalize(L+v);float spec=pow(max(dot(n,H),0.0),80.0)*1.2+pow(max(dot(n,H),0.0),12.0)*.18;float spec2=pow(max(dot(n,normalize(normalize(vec3(-.7,-.3,.6))+v)),0.0),40.0)*.5;col=col*(.62+.5*diff);col+=vec3(1.0)*(spec+spec2);col=mix(col,vec3(1.0,.97,1.0),fr*.55);gl_FragColor=vec4(col,1.0);}'});
var small=innerWidth<700;
var orb=new THREE.Mesh(new THREE.SphereGeometry(1.35,small?110:170,small?110:170),orbMat);root.add(orb);
var sats=[];
function sat(geo,color,x,y,z,spd){var m=new THREE.Mesh(geo,new THREE.MeshPhysicalMaterial({color:color,roughness:.18,metalness:.25,clearcoat:1,clearcoatRoughness:.08}));m.position.set(x,y,z);root.add(m);sats.push({m:m,b:m.position.clone(),s:spd,p:Math.random()*6})}
sat(new THREE.TorusGeometry(.42,.14,40,90),0x3D5AFE,-2.1,1.35,.4,.9);
sat(new THREE.SphereGeometry(.26,48,48),0xF2B33D,1.9,1.6,-.2,1.2);
sat(new THREE.IcosahedronGeometry(.3,0),0xD63BFF,1.75,-1.55,.6,1.0);
sat(new THREE.TorusKnotGeometry(.22,.075,120,16),0xFF6A5B,-1.6,-1.7,.2,.8);
sat(new THREE.OctahedronGeometry(.18,0),0xffffff,.2,2.2,.8,1.4);
var rm=new THREE.MeshBasicMaterial({color:0x6B5BFF,transparent:true,opacity:.22});
var r1=new THREE.Mesh(new THREE.TorusGeometry(2.25,.006,8,220),rm);r1.rotation.x=1.2;root.add(r1);
var r2=new THREE.Mesh(new THREE.TorusGeometry(2.6,.005,8,220),rm.clone());r2.material.color.set(0xFF6A5B);r2.rotation.set(.4,.8,0);root.add(r2);
var N=small?1800:3600,pos=new Float32Array(N*3),rnd=new Float32Array(N);
for(var i=0;i<N;i++){var yy=1-(i/(N-1))*2,r=Math.sqrt(1-yy*yy),th=i*2.39996323,R=2.9+(Math.random()-.5)*.3;pos[i*3]=Math.cos(th)*r*R;pos[i*3+1]=yy*R;pos[i*3+2]=Math.sin(th)*r*R;rnd[i]=Math.random()}
var pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));pg.setAttribute('aR',new THREE.BufferAttribute(rnd,1));
var pm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uTime:{value:0},uPR:{value:renderer.getPixelRatio()}},
 vertexShader:'attribute float aR;uniform float uTime;uniform float uPR;varying float vR;varying float vD;void main(){vec3 p=position;float b=uTime*.12;p.xz=mat2(cos(b),-sin(b),sin(b),cos(b))*p.xz;p+=vec3(sin(uTime*.8+aR*31.0),cos(uTime*.7+aR*17.0),sin(uTime*.6+aR*13.0))*.04;vec4 mv=modelViewMatrix*vec4(p,1.0);gl_PointSize=2.3*uPR*(.55+aR*.9)*(9.0/-mv.z);gl_Position=projectionMatrix*mv;vR=aR;vD=clamp((p.y+3.0)/6.0,0.0,1.0);}',
 fragmentShader:'varying float vR;varying float vD;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;vec3 c=mix(vec3(.24,.35,1.0),vec3(.84,.23,1.0),smoothstep(0.,.45,fract(vR*.6+vD*.7)));c=mix(c,vec3(1.0,.42,.36),smoothstep(.45,.8,fract(vR*.6+vD*.7)));gl_FragColor=vec4(c,smoothstep(.5,.15,d)*(.5+vR*.45));}'});
root.add(new THREE.Points(pg,pm));
function resize(){var w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
var mx=0,my=0,tx=0,ty=0;addEventListener('pointermove',function(e){tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
var vis=true;new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(box);
var clock=new THREE.Clock(),intro=0;
(function loop(){requestAnimationFrame(loop);if(!vis)return;var dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime,sp=reduce?0:1;
 intro=Math.min(1,intro+dt*.6);var ie=1-Math.pow(1-intro,3);mx+=(tx-mx)*.06;my+=(ty-my)*.06;
 root.scale.setScalar(.5+.5*ie);root.rotation.y=mx*.5+Math.min(scrollY/innerHeight,1)*.8;root.rotation.x=my*.3;
 orbMat.uniforms.uTime.value=t*sp;orbMat.uniforms.uMouse.value.set(mx*2,-my*2);orb.rotation.y=t*.1*sp;
 pm.uniforms.uTime.value=t*sp;
 sats.forEach(function(s){s.m.position.set(s.b.x+Math.sin(t*s.s*sp+s.p)*.12,s.b.y+Math.cos(t*s.s*.8*sp+s.p)*.18,s.b.z);s.m.rotation.x+=dt*s.s*.6*sp;s.m.rotation.y+=dt*s.s*.8*sp});
 r1.rotation.z+=dt*.15*sp;r2.rotation.z-=dt*.1*sp;
 renderer.render(scene,camera)})();
})();
