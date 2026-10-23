// RAÏ NOIR rebuild · assets: images, atlases, music decks, synth sfx
'use strict';
const ROOT=window.ASSET_ROOT, AV='f1';
const IMG={}, ATLAS={};   // ATLAS[key]=[x,y,w,h,imgKey]
function loadImg(key,src){ return new Promise(res=>{ const im=new Image(); im.onload=()=>{IMG[key]=im;res(im);}; im.onerror=()=>res(null); im.src=ROOT+src+'?v='+AV; }); }
async function loadAtlas(name,prefix){
  const j=await fetch(ROOT+'assets/spr/'+name+'.json?v='+AV).then(r=>r.json()).catch(()=>null);
  if(!j) return; await loadImg('spr/'+name,'assets/spr/'+name+'.png');
  for(const k in j) ATLAS[prefix+k]=[...j[k],'spr/'+name];
}
const IMAGES={ 'ui/logo':'assets/ui/logo_v3.png','ui/sawna':'assets/ui/sawna_logo.png',
  'portraits/cheb':'assets/portraits/cheb.jpg','portraits/aicha':'assets/portraits/aicha.jpg','portraits/k7':'assets/portraits/k7.jpg',
  'covers/oran':'assets/covers/oran.jpg','covers/cairo':'assets/covers/cairo.jpg','covers/cybercairo':'assets/covers/cybercairo.jpg','covers/marseille':'assets/covers/marseille.jpg','covers/ghorba':'assets/covers/ghorba.webp','covers/serverfarm':'assets/covers/serverfarm.jpg','covers/jannah':'assets/covers/jannah.jpg',
  'bg/oran_corniche':'assets/bg/oran_corniche.jpg','bg/oran_blvd':'assets/bg/oran_blvd.jpg','bg/oran_old':'assets/bg/oran_old.jpg','bg/oran_souk':'assets/bg/oran_souk.jpg',
  'story/kitchen_tv':'assets/story/kitchen_tv.jpg' };
const ASSETS_READY=(async()=>{
  await Promise.all([ ...Object.entries(IMAGES).map(([k,s])=>loadImg(k,s)),
    loadAtlas('atlas2','n_'), loadAtlas('atlas3','e_'), loadAtlas('atlas10',''), loadAtlas('atlas6','w_'), loadAtlas('props','') ]);
})();
function drawAtlas(key,x,y,sc=1,flip=false){ const e=ATLAS[key], im=e&&IMG[e[4]]; if(!im) return;
  const w=Math.round(e[2]*sc), h=Math.round(e[3]*sc); ctx.save(); ctx.translate(Math.round(x),Math.round(y)); if(flip) ctx.scale(-1,1);
  ctx.drawImage(im,e[0],e[1],e[2],e[3],-Math.round(w/2),-h,w,h); ctx.restore(); }
function coverImg(im,x,y,w,h,alpha=1){ if(!im) return; const s=Math.max(w/im.width,h/im.height), dw=im.width*s, dh=im.height*s;
  ctx.save(); ctx.globalAlpha=alpha; ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip(); ctx.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh); ctx.restore(); }

// ---- music: two <audio> decks, crossfade, seek ----
const DECK=[new Audio(),new Audio()]; let deckI=0, curMusic=null, musicVol=.7, pendingMusic=null;
for(const a of DECK){ a.preload='auto'; a.volume=0; a.loop=false; }
const fades=[0,0]; // target volume per deck
function playMusic(name,o={}){
  if(curMusic===name&&!o.restart&&o.seek==null) return;
  const old=DECK[deckI]; deckI^=1; const a=DECK[deckI];
  fades[deckI^1]=0; fades[deckI]=musicVol;
  a.src=ROOT+'audio/'+name+'.mp3?v='+AV; a.loop=!!o.loop; a.currentTime=0; a.volume=o.fade?0:musicVol;
  const p=a.play(); if(p&&p.catch) p.catch(()=>{ pendingMusic={name,o}; });
  if(o.seek){ const s=()=>{ try{ a.currentTime=o.seek; }catch(e){} }; if(a.readyState>=1) s(); else a.addEventListener('loadedmetadata',s,{once:true}); }
  curMusic=name; a.onended=()=>{ if(scene&&scene.onTrackEnd&&DECK[deckI]===a) scene.onTrackEnd(name); };
}
function musicTick(){ for(let i=0;i<2;i++){ const a=DECK[i], t=fades[i]; if(Math.abs(a.volume-t)>.01) a.volume=lerp(a.volume,t,.08); else if(a.volume!==t){ a.volume=t; if(t===0&&!a.paused) a.pause(); } } }
function stopMusic(){ fades[0]=fades[1]=0; curMusic=null; }
function trackTime(){ const a=DECK[deckI]; return (curMusic&&a.currentTime>0)?a.currentTime:null; }
function trackLeft(){ const a=DECK[deckI]; return isFinite(a.duration)?a.duration-a.currentTime:null; }
function seekTo(t){ try{ DECK[deckI].currentTime=t; }catch(e){} }
onGesture.push(()=>{ if(pendingMusic){ const {name,o}=pendingMusic; pendingMusic=null; curMusic=null; playMusic(name,o); } if(AC&&AC.state!=='running') AC.resume(); });

// ---- sfx: tiny synth, no files ----
const AC=window.AudioContext?new AudioContext():null;
function sfx(kind){
  if(!AC||AC.state!=='running') return; const t=AC.currentTime, o=AC.createOscillator(), g=AC.createGain(); o.connect(g); g.connect(AC.destination);
  const env=(v,d)=>{ g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.001,t+d); o.start(t); o.stop(t+d); };
  switch(kind){
    case 'punch': o.type='square'; o.frequency.setValueAtTime(180,t); o.frequency.exponentialRampToValueAtTime(60,t+.08); env(.25,.1); break;
    case 'kick': o.type='sawtooth'; o.frequency.setValueAtTime(120,t); o.frequency.exponentialRampToValueAtTime(40,t+.12); env(.3,.14); break;
    case 'hurt': o.type='sawtooth'; o.frequency.setValueAtTime(300,t); o.frequency.exponentialRampToValueAtTime(90,t+.2); env(.2,.22); break;
    case 'jump': o.type='square'; o.frequency.setValueAtTime(200,t); o.frequency.exponentialRampToValueAtTime(600,t+.12); env(.12,.14); break;
    case 'select': o.type='square'; o.frequency.setValueAtTime(660,t); o.frequency.setValueAtTime(990,t+.06); env(.15,.14); break;
    case 'blip': o.type='square'; o.frequency.setValueAtTime(880,t); env(.08,.05); break;
    case 'phone': o.type='square'; [0,.1,.2,.35].forEach((d,i)=>o.frequency.setValueAtTime([1318,1174,987,880][i%4],t+d)); env(.12,.5); break;
    case 'ko': o.type='sawtooth'; o.frequency.setValueAtTime(90,t); o.frequency.exponentialRampToValueAtTime(30,t+.35); env(.35,.4); break;
    case 'special': o.type='sawtooth'; o.frequency.setValueAtTime(100,t); o.frequency.exponentialRampToValueAtTime(1200,t+.3); env(.3,.35); break;
    case 'crate': o.type='triangle'; o.frequency.setValueAtTime(150,t); o.frequency.exponentialRampToValueAtTime(50,t+.15); env(.3,.18); break;
    default: o.type='square'; o.frequency.setValueAtTime(440,t); env(.1,.1);
  }
}
