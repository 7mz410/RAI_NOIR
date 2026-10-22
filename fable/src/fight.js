// RAÏ NOIR rebuild · the fight: player, enemies, props, waves, nokia, popup, HUD
'use strict';
let G=null, LV=null, player=null, ents=[], projs=[], items=[], props=[], floats=[];
let camX=0, lockX=null, levelT=0, stageState='play', stageT=0, waveI=0, wave=null, spawnT=0, BG=null, hype=null;
const K=1.2;
const SPC_MAX=100;

function newRun(){ G={score:0,chain:0,chainT:0,chainBest:0,mama:100,spc:0,lives:3,level:0}; }

// ---- background: stitch panels, no stretch, crossfade in the overlap ----
function buildBG(keys){
  const ims=keys.map(k=>IMG[k]).filter(Boolean); const total=LV.len+W, c=document.createElement('canvas'); c.width=total; c.height=H; const g=c.getContext('2d');
  if(!ims.length){ g.fillStyle='#2a1a3a'; g.fillRect(0,0,total,H); return c; }
  const pw=ims.map(im=>Math.round(im.width*H/im.height)), sum=pw.reduce((a,b)=>a+b,0);
  const ov=ims.length>1?Math.max(60,Math.round((sum-total)/(ims.length-1))):0; let x=0;
  ims.forEach((im,i)=>{ const w=pw[i]; if(i===0){ g.drawImage(im,0,0,w,H); }
    else { const t=document.createElement('canvas'); t.width=w; t.height=H; const tg=t.getContext('2d'); tg.drawImage(im,0,0,w,H);
      tg.globalCompositeOperation='destination-in'; const gr=tg.createLinearGradient(0,0,ov,0); gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(1,'#000'); tg.fillStyle=gr; tg.fillRect(0,0,w,H);
      g.drawImage(t,x,0); }
    x+=w-ov; });
  return c;
}

// ---- entities ----
function mkPlayer(){ return {kind:'player',look:'cheb',name:'CHEB GPT',x:60,y:195,z:0,vz:0,dir:1,state:'idle',t:0,anim:0,hp:100,maxhp:100,sc:K,spd:1.5,combo:0,comboT:0,inv:0,blink:0,flashT:0}; }
function spawnEnemy(type,side){
  const T=ETYPES[type]; spawnEnemy.n=(spawnEnemy.n||0)+1;
  const ym=LV.yMin||YMIN, lane=spawnEnemy.n%3, y=lane===0?ym+4:lane===1?YMAX-4:(ym+YMAX)/2+rnd(-6,6);
  const e={kind:'enemy',type,T,look:T.look,name:T.name,x:side>0?camX+W+30:camX-30,y,z:0,vz:0,dir:side>0?-1:1,state:'walk',t:0,anim:irnd(0,30),hp:T.hp,maxhp:T.hp,sc:(T.sc||1)*K,spd:T.spd,cool:irnd(30,80),hang:0,flashT:0,entered:false};
  if(T.boss){ e.x=camX+W+30; e.dir=-1; G.boss=e; G.bossIntroT=120; }
  ents.push(e); return e;
}
function floatText(x,y,s,col='#fff'){ floats.push({x,y,s,col,t:0}); }
function say(e,s){ e.say=s; e.sayT=150; }

// ---- combat ----
function targetsOf(a){ return a.kind==='player'?ents.filter(e=>e.kind==='enemy'&&!e.dead):[player]; }
function strike(a,reach,dmg,knock){
  let hit=false;
  for(const t of targetsOf(a)){
    if(['down','dead','fall'].includes(t.state)) continue; if(t.kind==='player'&&t.inv>0) continue;
    const dx=t.x-a.x; if(Math.sign(dx)!==a.dir&&Math.abs(dx)>6) continue; if(Math.abs(dx)>reach*K+8||Math.abs(t.y-a.y)>12||Math.abs((t.z||0)-(a.z||0))>26) continue;
    hurt(t,dmg,a.dir,knock); hit=true;
  }
  if(a.kind==='player'){ if(hit){ chainHit(); hitstop=Math.max(hitstop,knock?6:3); shake=Math.max(shake,knock?3:1.5); }
    // breakables
    for(const p of props){ if(p.broken) continue; const dx=p.x-a.x; if(Math.sign(dx)===a.dir&&Math.abs(dx)<reach*K+10&&Math.abs(p.y-a.y)<14) breakProp(p); } }
  return hit;
}
function hurt(t,dmg,dir,knock){
  if(t.kind==='enemy'&&t.T.boss&&!knock&&Math.random()<.15&&t.hp>dmg){ sfx('punch'); t.flashT=4; t.hp-=dmg; return; }
  t.hp-=dmg; t.flashT=5; t.dir=-dir; sfx(knock?'kick':'punch');
  if(t.kind==='player'){ t.inv=0; G.chain=0; }
  if(t.hp<=0||knock){ t.state='fall'; t.t=0; t.vz=2.2; t.z=Math.max(t.z||0,1); t.kx=dir*(knock?2.4:1.6); t.pose=null; if(t.hp<=0){ sfx('ko'); if(t.kind==='enemy'){ G.score+=t.T.score; floatText(t.x,t.y-70,'+'+t.T.score,'#ffe066'); } } }
  else { t.state='hurt'; t.t=0; t.pose=null; t.x+=dir*2; }
  if(t.kind==='player') G.spc=Math.min(SPC_MAX,G.spc+4);
}
function chainHit(){ G.chain++; G.chainT=110; G.chainBest=Math.max(G.chainBest,G.chain); G.spc=Math.min(SPC_MAX,G.spc+9);
  const h=HYPE.find(x=>x[0]===G.chain); if(h){ hype={s:h[1],t:0}; shake=Math.max(shake,4); hitstop=Math.max(hitstop,8); sfx('select'); G.score+=G.chain*50; } }

// knocked-down physics shared by all fighters
function fallTick(e){
  e.z+=e.vz; e.vz-=.18; e.x+=e.kx||0; if(e.kx) e.kx*=.92;
  if(e.z<=0){ e.z=0; e.vz=0; e.kx=0; e.state='down'; e.t=0; if(e.kind==='enemy'&&e.hp<=0){ e.dead=true; e.deadT=0; } if(e.kind==='player'&&e.hp<=0){ e.dead=true; e.state='dead'; } }
}

function updatePlayer(){
  const p=player; p.t++; p.anim++; if(p.inv>0) p.inv--; p.blink=p.inv>0&&p.inv<60; if(p.flashT>0) p.flashT--; if(p.comboT>0){ p.comboT--; if(!p.comboT) p.combo=0; }
  if(p.dead) return;
  const yMin=LV.yMin||YMIN, mx=(held.right?1:0)-(held.left?1:0), my=(held.down?1:0)-(held.up?1:0);
  const live=ents.filter(e=>e.kind==='enemy'&&!e.dead);
  if(p.state==='fall'){ fallTick(p); return; }
  if(p.state==='down'){ if(p.t>40){ p.state='getup'; p.t=0; p.inv=70; } return; }
  if(p.state==='getup'){ if(p.t>14) p.state='idle'; return; }
  if(p.state==='hurt'){ if(p.t>14) p.state='idle'; return; }
  if(p.z>0||p.state==='jump'||p.state==='jumpkick'){ // airborne
    p.z+=p.vz; p.vz-=.22; p.x+=mx*p.spd*.9; if(p.state==='jump'&&pressed.a){ p.state='jumpkick'; p.t=0; } if(p.state==='jumpkick'&&p.t===3) strike(p,30,13,true);
    if(p.z<=0){ p.z=0; p.vz=0; p.state='idle'; } return; }
  const atk=p.state==='jab'||p.state==='cross'||p.state==='upper'||p.state==='kick'||p.state==='special';
  if(atk){
    if(p.state==='special'){ if(p.t===8){ let any=false; for(const e of live){ if(Math.abs(e.x-p.x)<90&&Math.abs(e.y-p.y)<40){ e.dir=Math.sign(p.x-e.x)||1; hurt(e,18,Math.sign(e.x-p.x)||1,true); any=true; } } if(any){ chainHit(); shake=6; hitstop=8; } }
      if(p.t>30) p.state='idle'; return; }
    const hitT=p.state==='kick'||p.state==='upper'?5:4, endT=p.state==='kick'||p.state==='upper'?16:12;
    if(p.t===hitT) strike(p,p.state==='kick'?30:p.state==='upper'?22:24,p.state==='kick'?13:p.state==='upper'?11:8,p.state==='kick'||p.state==='upper');
    if(p.t>=endT){ p.state='idle'; } else if(p.t>=hitT+2&&pressed.a&&p.state!=='kick'&&p.combo<2){ p.combo++; p.state=['jab','cross','upper'][p.combo]; p.t=0; p.comboT=30; }
    return;
  }
  // noob helper: punching with an enemy only behind you turns you around
  if(pressed.a||pressed.k){ const front=live.some(e=>Math.sign(e.x-p.x)===p.dir&&Math.abs(e.x-p.x)<70), back=live.find(e=>Math.sign(e.x-p.x)===-p.dir&&Math.abs(e.x-p.x)<50&&Math.abs(e.y-p.y)<16); if(!front&&back) p.dir=-p.dir; }
  if(pressed.a){ p.state=p.comboT?['jab','cross','upper'][p.combo]:'jab'; if(!p.comboT) p.combo=0; p.t=0; p.comboT=30; return; }
  if(pressed.k){ p.state='kick'; p.t=0; return; }
  if(pressed.b){ p.state='jump'; p.t=0; p.vz=4.3; p.z=1; sfx('jump'); return; }
  if(pressed.c&&G.spc>=SPC_MAX){ G.spc=0; p.state='special'; p.t=0; sfx('special'); floatText(p.x,p.y-80,'VOCODER WAVE','#5ff0ff'); return; }
  if(mx||my){ if(mx) p.dir=mx; p.x+=mx*p.spd; p.y=clamp(p.y+my*p.spd*.62,yMin,YMAX); p.state='walk'; } else p.state='idle';
  const lo=camX+8, hi=(lockX!=null?lockX:camX)+W-8; p.x=clamp(p.x,lo,Math.min(hi,LV.len+W-8));
}

function updateEnemy(e){
  const p=player, T=e.T; e.t++; e.anim++; if(e.flashT>0) e.flashT--; if(e.cool>0) e.cool--; if(e.sayT>0) e.sayT--;
  if(e.dead){ e.deadT++; if(e.deadT>50) e.remove=true; return; }
  if(e.state==='fall'){ fallTick(e); return; }
  if(e.state==='down'){ if(e.t>46){ e.state='getup'; e.t=0; } return; }
  if(e.state==='getup'){ if(e.t>14){ e.state='walk'; e.cool=irnd(30,60); } return; }
  if(e.state==='hurt'){ if(e.t>14) e.state='walk'; return; }
  if(e.state==='wind'){ if(e.t>=T.wind){ e.state='atk'; e.t=0; strike(e,T.reach+4,T.dmg,!!T.knock); } return; }
  if(e.state==='atk'){ if(e.t>=16){ e.state='walk'; e.cool=irnd(40,90)/(T.boss?1.5:1); } return; }
  if(e.state==='film'){ if(e.t===16&&Math.abs(p.x-e.x)<140&&p.inv<=0&&!p.z){ p.hp-=3; floatText(p.x,p.y-70,'FILMED. -3','#ff5566'); } if(e.t>30){ e.state='walk'; } return; }
  if(e.state==='throw'){ if(e.t===14) projs.push({x:e.x+e.dir*12,y:e.y,z:32,vx:e.dir*3.2,dmg:8,life:110,kind:T.boss?'mic':'can',from:e}); if(e.t>26){ e.state='walk'; e.cool=irnd(50,90); } return; }
  if(e.state==='special'){ if(e.t===16) projs.push({x:e.x+e.dir*16,y:e.y,z:10,vx:e.dir*1.8,dmg:11,knock:1,life:150,kind:'wave',from:e}); if(e.t>34){ e.state='walk'; e.cool=irnd(60,100); } return; }
  if(e.hang>0){ e.hang--; e.state='idle'; return; }
  if(p.dead){ e.state='idle'; return; }
  // decide
  e.dir=p.x>e.x?1:-1; const RE=T.reach*K, dy=p.y-e.y, dxp=Math.abs(p.x-e.x);
  if(e.cool<=0&&dxp<=RE+2&&Math.abs(dy)<7&&p.z<20){ e.state='wind'; e.t=0; if(Math.random()<.35&&ENEMY_LINES[e.type]) say(e,ENEMY_LINES[e.type][irnd(0,ENEMY_LINES[e.type].length-1)]); return; }
  if(T.boss&&e.cool<=0){ const r=Math.random(); if(r<.45&&dxp>60){ e.state='throw'; e.t=0; return; } if(r<.75&&Math.abs(dy)<20&&dxp>40){ e.state='special'; e.t=0; return; } }
  if(T.thrower&&e.cool<=0&&Math.random()<.02&&dxp>60&&Math.abs(dy)<14){ e.state='throw'; e.t=0; return; }
  if(T.filmer&&dxp>40&&Math.random()<.006){ e.state='film'; e.t=0; return; }
  if(Math.random()<.004) e.hang=irnd(30,70);
  const want=p.x-e.dir*(RE-2), dx=want-e.x;
  if(Math.abs(dx)>1||Math.abs(dy)>1){ e.x+=clamp(dx,-T.spd,T.spd); e.y=clamp(e.y+clamp(dy,-T.spd*.6,T.spd*.6),LV.yMin||YMIN,YMAX); e.state='walk'; } else e.state='idle';
  // never camp off-screen once you're in the fight
  if(!e.entered){ if(e.x>camX+10&&e.x<camX+W-10) e.entered=true; } else e.x=clamp(e.x,camX+10,camX+W-10);
}

function updateProjs(){
  for(const q of projs){ q.x+=q.vx; q.life--; if(q.kind!=='wave'){ q.z+=q.vz||0; }
    const p=player; if(!q.hit&&p.inv<=0&&!p.dead&&Math.abs(q.x-p.x)<12&&Math.abs(q.y-p.y)<12&&Math.abs(q.z-(p.z||0))<30){ q.hit=true; q.life=0; hurt(p,q.dmg,Math.sign(q.vx),!!q.knock); }
    if(q.x<camX-20||q.x>camX+W+20) q.life=0; }
  projs=projs.filter(q=>q.life>0);
}
function breakProp(p){ p.broken=true; sfx('crate'); shake=Math.max(shake,2); items.push({x:p.x,y:p.y,z:14,vz:1.6,item:p.item,t:0}); G.score+=20; }
function updateItems(){ for(const it of items){ it.t++; if(it.z>0||it.vz>0){ it.z+=it.vz; it.vz-=.18; if(it.z<0) it.z=0; }
    if(it.t>10&&Math.abs(it.x-player.x)<14&&Math.abs(it.y-player.y)<10&&!player.z){ it.taken=true; const food=['karantika','oranges','baguette','tajine','sardines','tray','shisha'].includes(it.item);
      if(food){ player.hp=Math.min(player.maxhp,player.hp+12); floatText(player.x,player.y-75,'+12','#7dff8a'); } else { G.score+=300; floatText(player.x,player.y-75,'+300','#ffe066'); } sfx('blip'); } }
  items=items.filter(i=>!i.taken); }

// ---- waves, music pacing ----
function tt(){ const t=trackTime(); return t!=null?t:levelT/60; }
function updateWaves(){
  const nw=LV.waves[waveI], t=tt();
  if(wave){ const live=ents.filter(e=>e.kind==='enemy'&&!e.dead); const alive=live.length+wave.queue.length;
    if(wave.queue.length&&live.length<(wave.boss?4:3)&&--spawnT<=0){ spawnEnemy(wave.queue.shift(),(spawnEnemy.n||0)%2?1:-1); spawnT=irnd(24,55); }
    if(!alive){ if(wave.boss){ stageClear(); } wave=null; lockX=null; }
    else if(nw&&!nw.boss&&nw.t!=null&&t>=nw.t+6&&!wave.boss){ wave.queue.push(...nw.list); waveI++; } // track ran ahead: pour the next wave in
    return; }
  if(!nw) return;
  if(nw.boss&&player.x>nw.at&&t<nw.t-3&&curMusic===LV.music&&!nw.pulled){ nw.pulled=1; const a=DECK[deckI]; if(isFinite(a.duration)&&a.duration>nw.t+10){ seekTo(nw.t); floatText(player.x,player.y-80,'PULL UP! THE SELECTA SKIPS TO THE DROP','#ffe066'); sfx('special'); } }
  if(player.x>nw.at||(nw.t!=null&&t>=nw.t)){ wave={boss:!!nw.boss,queue:[...nw.list]}; waveI++; spawnT=0; lockX=nw.boss?Math.min(camX,LV.len):camX; if(nw.boss&&player.x<nw.at) nw.late=1; }
}
function stageClear(){ stageState='clear'; stageT=0; sfx('select'); G.spc=SPC_MAX; player.state='idle'; player.inv=9999;
  const left=trackLeft(); if(left!=null&&left>14) playMusic(curMusic,{restart:true,seek:DECK[deckI].duration-11,fade:1}); }

// ---- nokia ----
const PHONE={q:[],cur:null,t:0};
function sms(from,txt){ PHONE.q.push({from,txt}); }
function phoneLife(c){ return Math.max(300,170+c.txt.length*3.4); }
function phoneUpdate(){ if(!PHONE.cur&&PHONE.q.length){ PHONE.cur=PHONE.q.shift(); PHONE.t=0; sfx('phone'); } if(PHONE.cur){ PHONE.t++; if(PHONE.t>phoneLife(PHONE.cur)) PHONE.cur=null; } }
function phoneDraw(){
  const c=PHONE.cur; if(!c) return; const life=phoneLife(c), T=PHONE.t, k=clamp(Math.min(T/12,(life-T)/12),0,1);
  const pw=104, ph=74, x=W-pw-6, y=H-Math.round(k*ph)+(T<26?Math.round(Math.sin(T*2)*1.5):0);
  R(x,y,pw,ph+10,'#1b2340'); R(x+2,y+2,pw-4,3,'#3c4a7a'); R(x+3,y+ph+4,pw-6,4,'#10152a');
  const sx=x+7, sy=y+10, sw=pw-14, sh=46, lcd='#a9cf6c', ink='#1c2a10'; R(sx,sy,sw,sh,lcd); for(let i=0;i<sh;i+=2) R(sx,sy+i,sw,1,'rgba(0,0,0,.08)');
  const pct=G.mama; R(sx+sw-14,sy+2,11,5,ink); R(sx+sw-3,sy+3,1,3,ink); R(sx+sw-13,sy+3,9,3,lcd); R(sx+sw-13,sy+3,Math.max(1,Math.round(9*pct/100)),3,ink);
  const icon=/MAMA/.test(c.from)?'♥':/ALDI/.test(c.from)?'♠':'✉'; text(icon+' '+c.from,sx+2,sy+2,ink,5,'left',null);
  if(T<28) text('1 NEW MESSAGE',sx+sw/2,sy+22,ink,4,'center',null);
  else { const lines=wrap(c.txt,sw-6,5), off=Math.floor(Math.max(0,T-110)/80), vis=lines.slice(off,off+3); vis.forEach((l,i)=>text(l,sx+3,sy+12+i*10,ink,5,'left',null)); if(lines.length>off+3&&frame%30<15) text('▼',sx+sw-6,sy+sh-6,ink,4,'left',null); }
  for(let i=0;i<3;i++) R(x+14+i*28,y+ph-8,22,6,'#2b355c');
}

// ---- story popup (one per level) ----
let POP=null;
function popupUpdate(){
  const pp=LV.popup; if(!pp||pp.done) return;
  if(!POP){ if(player.x>pp.at){ const clear=!ents.some(e=>e.kind==='enemy'&&!e.dead); pp.waitT=(pp.waitT||0)+1; if(clear||pp.waitT>480){ POP={i:0,t:0}; } } return; }
  POP.t++; if(POP.t>40&&(pressed.a||pressed.start||pressed.k)){ POP.i++; POP.t=20; sfx('blip'); if(POP.i>=pp.lines.length){ pp.done=true; POP=null; } }
}
function popupDraw(){
  if(!POP) return; const pp=LV.popup, [who,line]=pp.lines[POP.i], k=clamp(POP.t/14,0,1);
  ctx.fillStyle='rgba(0,0,0,'+(.55*k)+')'; ctx.fillRect(0,0,W,H);
  const bw=300, bh=120, bx=(W-bw)/2, by=Math.round(lerp(H,52,k)); R(bx-2,by-2,bw+4,bh+4,'#ffe066'); R(bx,by,bw,bh,'#0b0616');
  coverImg(IMG[pp.img],bx+4,by+4,112,bh-8);
  text(who,bx+124,by+10,'#ff3d8b',6,'left'); wrap(line,bw-136,7).forEach((l,i)=>text(l,bx+124,by+28+i*11,'#fff',7,'left'));
  if(POP.t>40&&frame%40<28) text('▶ PUNCH',bx+bw-8,by+bh-12,'#ffe066',5,'right');
}

// ---- stage ----
function startLevel(i){
  LV=LEVELS[i]; G.level=i; ents=[]; projs=[]; items=[]; floats=[]; PHONE.q=[]; PHONE.cur=null; POP=null; hype=null; if(LV.popup){ LV.popup.done=false; LV.popup.waitT=0; } for(const w of LV.waves){ w.pulled=0; w.late=0; }
  player=mkPlayer(); camX=0; lockX=null; levelT=0; stageState='play'; stageT=0; waveI=0; wave=null; G.boss=null; G.bossIntroT=0; G.shareT=0; G.chain=0;
  props=LV.props.map(([kind,x,y,item])=>({kind,x,y,item,broken:false}));
  BG=buildBG(LV.bgs); LV.nokia.forEach(n=>n.sent=false);
  playMusic(LV.music,{restart:true,fade:1});
}
function stageUpdate(){
  levelT++; if(pressed.pause&&stageState==='play'){ stageState='pause'; return; } if(stageState==='pause'){ if(pressed.pause||pressed.start) stageState='play'; return; }
  if(stageState==='play'){
    if(POP){ popupUpdate(); return; }
    if(G.bossIntroT>0){ G.bossIntroT--; }
    updatePlayer(); for(const e of ents) if(e.kind==='enemy') updateEnemy(e); ents=ents.filter(e=>!e.remove);
    updateProjs(); updateItems(); updateWaves(); popupUpdate(); phoneUpdate();
    const t=tt(); for(const n of LV.nokia) if(!n.sent&&t>=n.t){ n.sent=true; sms(n.from,n.txt); }
    if(G.chainT>0){ G.chainT--; if(!G.chainT) G.chain=0; }
    if(player.dead&&player.state==='dead'){ player.t++; if(player.t>90){ stageState='gameover'; stageT=0; } }
    if(player.hp<=0&&!player.dead&&player.state!=='fall'){ player.hp=0; player.state='fall'; player.vz=2; player.z=1; }
    // camera
    const target=clamp(player.x-W*.4,0,lockX!=null?lockX:LV.len); camX=Math.round(lerp(camX,Math.max(camX,target),.12)); if(lockX!=null) camX=Math.min(camX,lockX);
  } else if(stageState==='clear'){ stageT++; updatePlayer(); for(const e of ents) if(e.kind==='enemy') updateEnemy(e); ents=ents.filter(e=>!e.remove); updateItems(); phoneUpdate();
    if(stageT===1){ floatText(player.x,player.y-80,'STAGE CLEAR','#ffe066'); } const left=trackLeft(); if(stageT>120&&(left==null||left<.3||stageT>60*14)){ stageState='done'; fadeTo(()=>scene.onClear(),40); }
  } else if(stageState==='gameover'){ stageT++; if(stageT>60&&(pressed.start||pressed.a)){ if(G.lives>0){ G.lives--; startLevel(G.level); } else go(SC.title); } }
  for(const f of floats) f.t++; floats=floats.filter(f=>f.t<70); if(hype){ hype.t++; if(hype.t>70) hype=null; }
}
function stageDraw(){
  ctx.drawImage(BG,-camX,0);
  // ground props + shadows, then y-sorted actors
  for(const p of props){ if(p.broken) continue; drawAtlas(p.kind==='bin'?'po_0':'po_2',p.x-camX,p.y,1); }
  const list=[...ents.filter(e=>!(e.dead&&e.deadT>40)),player,...items.map(i=>({item:i,y:i.y})),...projs.map(q=>({proj:q,y:q.y}))].sort((a,b)=>a.y-b.y);
  for(const o of list){ if(o.item){ const i=o.item; if(i.t>160&&frame%6<3) continue; ctx.fillStyle='rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(i.x-camX,i.y,7,2,0,0,7); ctx.fill(); drawAtlas('w_'+i.item,i.x-camX,i.y-i.z,.8); }
    else if(o.proj){ const q=o.proj; if(q.kind==='wave'){ ctx.strokeStyle='#5ff0ff'; ctx.lineWidth=2; for(let r=0;r<3;r++){ ctx.beginPath(); ctx.arc(q.x-camX-q.vx*r*3,q.y-18,6+r*3,-1,1); ctx.stroke(); } } else { R(q.x-camX-2,q.y-q.z-6,5,8,q.kind==='mic'?'#ddd':'#c33'); } }
    else { if(o.dead&&o.deadT>20&&frame%4<2) continue; drawFighter(o); if(o.say&&o.sayT>0){ const w=ctx.measureText(o.say).width; text(o.say,clamp(o.x-camX,70,W-70),o.y-(o.z||0)-84,'#fff',4,'center'); } } }
  for(const f of floats){ text(f.s,clamp(f.x-camX,60,W-60),f.y-f.t*.6,f.col,f.s.length>20?5:7,'center'); }
  hudDraw(); phoneDraw(); popupDraw();
  if(stageState==='pause'){ ctx.fillStyle='rgba(0,0,0,.6)'; ctx.fillRect(0,0,W,H); text('PAUSED',W/2,H/2-8,'#ffe066',12,'center',null,DFONT); }
  if(stageState==='gameover'){ ctx.fillStyle='rgba(0,0,0,.65)'; ctx.fillRect(0,0,W,H); text('MAMA IS CALLING',W/2,80,'#ff3d8b',14,'center',null,DFONT); text(G.lives>0?'CONTINUE · '+G.lives+' LEFT':'GAME OVER',W/2,112,'#fff',7,'center'); if(stageT>60&&frame%40<28) text('PRESS START',W/2,136,'#ffe066',6,'center'); }
}
function hudDraw(){
  // player
  R(6,6,110,22,'rgba(0,0,0,.55)'); coverImg(IMG['portraits/cheb'],8,8,18,18); text(player.name,30,8,'#fff',5);
  R(30,16,80,6,'#3a0a1a'); R(30,16,Math.round(80*clamp(player.hp/player.maxhp,0,1)),6,player.hp<30?'#ff5566':'#7dff8a');
  R(30,24,80,3,'#1a2a3a'); R(30,24,Math.round(80*G.spc/SPC_MAX),3,G.spc>=SPC_MAX&&frame%20<10?'#fff':'#5ff0ff');
  text('SCORE '+String(G.score).padStart(7,'0'),W-6,8,'#ffe066',5,'right'); text('×'+G.lives,W-6,16,'#fff',5,'right');
  if(G.chain>=3&&G.chainT>0){ text(G.chain+' HITS',W/2,30,'#ff3d8b',7,'center'); }
  if(hype){ const s=hype.t<10?lerp(6,12,hype.t/10):12; text(hype.s,W/2,46,'#ffe066',s,'center','#8b1040',DFONT); }
  const b=G.boss; if(b&&!b.dead&&b.hp>0){ R(W/2-90,H-16,180,8,'rgba(0,0,0,.6)'); R(W/2-88,H-14,Math.round(176*clamp(b.hp/b.maxhp,0,1)),4,'#ff5566'); text(b.name,W/2,H-26,'#fff',5,'center'); }
  if(G.bossIntroT>0&&b){ const k=clamp(Math.min(G.bossIntroT/20,(120-G.bossIntroT)/15),0,1); ctx.fillStyle='rgba(0,0,0,'+(.5*k)+')'; ctx.fillRect(0,80,W,54); text(b.name,W/2,86,'#ff3d8b',16,'center','#000',DFONT); text(b.T.intro,W/2,114,'#ffe066',5,'center'); }
  if(stageState==='clear'){ ctx.fillStyle='rgba(0,0,0,.35)'; ctx.fillRect(0,60,W,70); text('STAGE CLEAR',W/2,68,'#ffe066',22,'center','#8b1040',DFONT); text('BEST CHAIN '+G.chainBest+' · SCORE '+G.score,W/2,100,'#fff',6,'center'); text(stageT>120?'…AND THEN THE PHONE DIED':'ZIZOU PLAYS OUT',W/2,114,'#9aa6b8',5,'center'); }
  if(wave&&!wave.boss&&lockX!=null&&frame%60<30&&!ents.some(e=>e.kind==='enemy'&&!e.dead&&e.entered)) {}
  if(!wave&&stageState==='play'&&frame%50<30&&waveI<LV.waves.length) text('GO ▶',W-30,H-30,'#ffe066',7,'center');
}
