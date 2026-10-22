// RAÏ NOIR rebuild · core: canvas, loop, input, text, scenes, fades
'use strict';
const W=384,H=224,S=2;
const cv=document.getElementById('cv'), ctx=cv.getContext('2d');
ctx.setTransform(S,0,0,S,0,0); ctx.imageSmoothingEnabled=false;
const FONT="'Press Start 2P',monospace", DFONT="'Bungee','Press Start 2P',monospace";
let frame=0;

const clamp=(v,a,b)=>v<a?a:v>b?b:v, lerp=(a,b,t)=>a+(b-a)*t;
const rnd=(a,b)=>a+Math.random()*(b-a), irnd=(a,b)=>Math.floor(rnd(a,b+1));
const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};

function text(s,x,y,col='#fff',size=7,align='left',shadow='#000',font=FONT){
  ctx.font=size+'px '+font; ctx.textAlign=align; ctx.textBaseline='top';
  if(shadow){ ctx.fillStyle=shadow; ctx.fillText(s,Math.round(x)+1,Math.round(y)+1); }
  ctx.fillStyle=col; ctx.fillText(s,Math.round(x),Math.round(y));
}
function wrap(s,maxW,size){
  ctx.font=size+'px '+FONT; const out=[]; let line='';
  for(const w of String(s).split(' ')){ const t=line?line+' '+w:w; if(ctx.measureText(t).width>maxW&&line){ out.push(line); line=w; } else line=t; }
  if(line) out.push(line); return out;
}

// ---- input: one map, three sources ----
const held={}, pressed={};
const KEYMAP={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',KeyJ:'a',KeyZ:'a',KeyK:'k',KeyX:'k',Space:'b',KeyI:'b',KeyL:'c',KeyC:'c',Enter:'start',KeyP:'pause',Escape:'pause'};
addEventListener('keydown',e=>{ const k=KEYMAP[e.code]; if(!k) return; e.preventDefault(); if(!held[k]) pressed[k]=true; held[k]=true; });
addEventListener('keyup',e=>{ const k=KEYMAP[e.code]; if(k) held[k]=false; });
addEventListener('blur',()=>{ for(const k in held) held[k]=false; });
function press(k){ pressed[k]=true; }

// touch buttons
for(const el of document.querySelectorAll('#btns .b')){
  const k=el.dataset.k;
  const on=e=>{ e.preventDefault(); el.classList.add('on'); if(!held[k]) pressed[k]=true; held[k]=true; firstGesture(); };
  const off=e=>{ el.classList.remove('on'); held[k]=false; };
  el.addEventListener('pointerdown',on); for(const t of ['pointerup','pointercancel','pointerleave']) el.addEventListener(t,off);
}
document.getElementById('start').addEventListener('pointerdown',e=>{ e.preventDefault(); pressed.start=true; firstGesture(); });
// floating stick
{
  const zone=document.getElementById('stick'), base=document.getElementById('stickbase'), knob=document.getElementById('knob');
  let id=null, ox=0, oy=0;
  const set=(dx,dy)=>{ const d=Math.hypot(dx,dy), DEAD=12; const nx=d>DEAD?dx/d:0, ny=d>DEAD?dy/d:0;
    held.left=nx<-.38; held.right=nx>.38; held.up=ny<-.38; held.down=ny>.38;
    const r=Math.min(d,40); knob.style.left=(28+(d?dx/d*r:0))+'px'; knob.style.top=(28+(d?dy/d*r:0))+'px'; };
  zone.addEventListener('pointerdown',e=>{ if(id!==null) return; id=e.pointerId; zone.setPointerCapture(id); firstGesture();
    const zr=zone.getBoundingClientRect(); ox=e.clientX-zr.left; oy=e.clientY-zr.top; base.style.left=(ox-52)+'px'; base.style.top=(oy-52)+'px'; base.style.bottom='auto'; base.style.opacity=1; set(0,0); });
  zone.addEventListener('pointermove',e=>{ if(e.pointerId!==id) return; const zr=zone.getBoundingClientRect(); set(e.clientX-zr.left-ox,e.clientY-zr.top-oy); });
  const end=e=>{ if(e.pointerId!==id) return; id=null; held.left=held.right=held.up=held.down=false; knob.style.left=knob.style.top='28px'; base.style.opacity=.75; base.style.left='calc(24px + var(--safe))'; base.style.top='auto'; base.style.bottom='24px'; };
  zone.addEventListener('pointerup',end); zone.addEventListener('pointercancel',end);
}
// canvas tap = start (menus only)
cv.addEventListener('pointerdown',e=>{ firstGesture(); if(scene&&scene.tapStart) pressed.start=true; });
// gamepad
let padPrev={};
function pollPad(){
  const p=(navigator.getGamepads?navigator.getGamepads():[])[0]; if(!p) return;
  const b=i=>!!(p.buttons[i]&&p.buttons[i].pressed);
  const st={left:p.axes[0]<-.4||b(14),right:p.axes[0]>.4||b(15),up:p.axes[1]<-.4||b(12),down:p.axes[1]>.4||b(13),a:b(2)||(b(0)&&!(scene&&scene.isStage)),k:b(0)&&!!(scene&&scene.isStage),b:b(1),c:b(3)||b(5)||b(7),start:b(9),pause:b(8)};
  for(const k in st){ if(st[k]&&!padPrev[k]) pressed[k]=true; if(st[k]||padPrev[k]) held[k]=st[k]; }
  padPrev=st;
}

// ---- scenes + transitions ----
let scene=null, fade={a:0,dir:0,cb:null,spd:1/20};
function go(s,arg){ scene=s; if(s.enter) s.enter(arg); }
function fadeTo(fn,frames=20){ fade.dir=1; fade.spd=1/frames; fade.cb=fn; }
function fadeTick(){ if(fade.dir===1){ fade.a=Math.min(1,fade.a+fade.spd); if(fade.a>=1){ fade.dir=-1; const f=fade.cb; fade.cb=null; if(f) f(); } }
  else if(fade.dir===-1){ fade.a=Math.max(0,fade.a-fade.spd); if(fade.a<=0) fade.dir=0; } }
function fadeDraw(){ if(fade.a>0){ ctx.fillStyle='rgba(0,0,0,'+fade.a+')'; ctx.fillRect(0,0,W,H); } }

// ---- first gesture → audio unlock (filled by assets.js) ----
let gestured=false; const onGesture=[];
function firstGesture(){ if(gestured) return; gestured=true; for(const f of onGesture) f(); }
for(const t of ['pointerdown','keydown']) addEventListener(t,firstGesture,{once:false});

// ---- loop ----
let shake=0, hitstop=0;
function loop(){
  requestAnimationFrame(loop);
  frame++; pollPad(); fadeTick(); if(typeof musicTick==='function') musicTick();
  if(hitstop>0){ hitstop--; } else if(scene&&scene.update) scene.update();
  for(const k in pressed) pressed[k]=false;
  ctx.save(); if(shake>0){ ctx.translate(irnd(-shake,shake),irnd(-shake,shake)); shake*=.8; if(shake<.5) shake=0; }
  if(scene&&scene.draw) scene.draw(); ctx.restore();
  fadeDraw();
  // scanlines
  ctx.fillStyle='rgba(0,0,0,.10)'; for(let y=0;y<H;y+=2) ctx.fillRect(0,y,W,1);
}
