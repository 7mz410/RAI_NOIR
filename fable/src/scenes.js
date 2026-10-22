// RAÏ NOIR rebuild · scenes: boot, sawna, title, level select, tape, stage
'use strict';
const SC={};
let SAVE=null; try{ SAVE=JSON.parse(localStorage.getItem('rainoir-fable-save')||'null'); }catch(e){}
function saveStage(i){ SAVE={s:i}; try{ localStorage.setItem('rainoir-fable-save',JSON.stringify(SAVE)); }catch(e){} }

function drawSawna(t,shine){
  const im=IMG['ui/sawna']; ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H);
  const w=Math.min(240,im?im.width:240), h=im?Math.round(im.height*w/im.width):56, x=Math.round((W-w)/2), y=Math.round((H-h)/2)-10;
  if(im) ctx.drawImage(im,x,y,w,h); else text('SAWNA',W/2,y,'#0a5bb0',16,'center',null,DFONT);
  if(shine){ const sx=x-30+t*7; if(sx<x+w+40){ ctx.save(); ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip(); ctx.globalCompositeOperation='lighter'; ctx.fillStyle='rgba(255,255,255,.55)'; ctx.beginPath(); ctx.moveTo(sx,y); ctx.lineTo(sx+18,y); ctx.lineTo(sx-6,y+h); ctx.lineTo(sx-24,y+h); ctx.fill(); ctx.restore(); } }
  return {x,y,w,h};
}
// boot: wait for a press (unlocks audio), then the Sawna card
SC.boot={ tapStart:true, enter(){ this.t=0; }, update(){ this.t++; if(pressed.start||pressed.a||pressed.b||pressed.k||pressed.c){ sfx('select'); playMusic('sawna_boot',{fade:0}); go(SC.sawna); } },
  draw(){ const r=drawSawna(0,false); if(frame%60<40) text('▶ PRESS START',W/2,r.y+r.h+26,'#0a5bb0',7,'center',null); text('SOUND ON',W/2,H-16,'#9aa6b8',5,'center',null); } };
SC.sawna={ tapStart:true, enter(){ this.t=0; }, update(){ this.t++; if((this.t>30&&(pressed.start||pressed.a))||this.t>120) fadeTo(()=>go(SC.title),12); },
  draw(){ const r=drawSawna(this.t,true); if(this.t>34) text('R E C O R D S',W/2,r.y+r.h+10,'#0a5bb0',6,'center',null); } };

// title: three hero portraits under the logo, PRESS START, nothing else
SC.title={ tapStart:true,
  enter(){ this.t=0; this.ask=0; this.ai=0; if(curMusic!=='zizou') playMusic('zizou',{fade:1,loop:true}); },
  update(){ this.t++;
    if(this.ask){ if(pressed.up||pressed.down){ this.ai^=1; sfx('blip'); } if(pressed.start||pressed.a){ sfx('select'); if(this.ai===0) fadeTo(()=>go(SC.select,{preselect:SAVE.s})); else { SAVE=null; fadeTo(()=>go(SC.select)); } } return; }
    if(this.t>20&&(pressed.start||pressed.a)){ sfx('select'); if(SAVE&&SAVE.s>1) this.ask=1; else fadeTo(()=>go(SC.select)); } },
  draw(){ const t=this.t;
    coverImg(IMG['bg/oran_corniche'],0,0,W,H,1); ctx.fillStyle='rgba(7,4,13,.55)'; ctx.fillRect(0,0,W,H);
    const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'rgba(7,4,13,0)'); g.addColorStop(1,'rgba(7,4,13,.9)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // heroes
    const hero=[['portraits/aicha',-62],['portraits/cheb',0],['portraits/k7',62]]; hero.forEach(([k,dx],i)=>{ const s=i===1?58:50, x=W/2+dx-s/2, y=118-(i===1?6:0)+Math.round(Math.sin(t/24+i)*1.5);
      ctx.fillStyle='#0b0616'; ctx.fillRect(x-2,y-2,s+4,s+4); coverImg(IMG[k],x,y,s,s); });
    const lg=IMG['ui/logo']; if(lg){ const lw=150, lh=Math.round(lg.height*lw/lg.width), ly=-4+Math.round(Math.min(0,-(20-t)*2)); ctx.drawImage(lg,W/2-lw/2,ly,lw,lh); }
    if(this.ask){ R(W/2-100,160,200,44,'rgba(0,0,0,.75)'); const opt=['CONTINUE · '+STAGELIST[SAVE.s].title,'NEW GAME · ORAN']; opt.forEach((s,i)=>text((this.ai===i?'▶ ':'  ')+s,W/2-92,168+i*14,this.ai===i?'#ffe066':'#ccc',6)); }
    else if(frame%60<40) text('PRESS START',W/2,186,'#ffe066',8,'center');
    text('© 1993 SAWNA REC',W/2,H-12,'#9aa6b8',4,'center');
  } };

// level select: scroll through the stage covers. FULL GAME first.
SC.select={ tapStart:false,
  enter(o){ this.i=(o&&o.preselect)||0; this.t=0; this.sx=this.i; },
  update(){ this.t++; if(pressed.left&&this.i>0){ this.i--; sfx('blip'); } if(pressed.right&&this.i<STAGELIST.length-1){ this.i++; sfx('blip'); }
    this.sx=lerp(this.sx,this.i,.25);
    if(pressed.start||pressed.a){ const st=STAGELIST[this.i]; if(st.lv==null){ sfx('hurt'); this.nope=40; return; } sfx('select'); newRun(); G.story=!!st.story; G.sel=this.i; fadeTo(()=>startStory(st.lv)); }
    if(pressed.b||pressed.k) fadeTo(()=>go(SC.title)); if(this.nope>0) this.nope--; },
  draw(){ ctx.fillStyle='#07040d'; ctx.fillRect(0,0,W,H); const cw=230, ch=130;
    STAGELIST.forEach((st,i)=>{ const dx=(i-this.sx)*250, sel=i===this.i; if(Math.abs(dx)>300) return; const x=W/2+dx-cw/2, y=34;
      R(x-2,y-2,cw+4,ch+4,sel?(frame%30<15?'#ffe066':'#ff3d8b'):'#1a1228'); coverImg(IMG[st.cover],x,y,cw,ch,st.lv==null?.35:1);
      if(st.lv==null){ text('SOON',x+cw/2,y+ch/2-6,'#ccc',10,'center',null,DFONT); } });
    const st=STAGELIST[this.i]; text(st.title,W/2,174,'#ffe066',8,'center'); text(st.sub,W/2,188,'#ccc',5,'center');
    if(this.i>0) text('◀',14,96,'#fff',12,'center'); if(this.i<STAGELIST.length-1) text('▶',W-14,96,'#fff',12,'center');
    text('◀ ▶ CHOOSE · PUNCH = GO · KICK = BACK',W/2,H-12,'#9aa6b8',4,'center'); if(this.nope>0) text('NOT YET, KHOYA',W/2,206,'#ff5566',6,'center'); }
};
// select touch: left/right thirds scroll, middle starts
cv.addEventListener('pointerdown',e=>{ if(scene!==SC.select) return; const r=cv.getBoundingClientRect(), x=(e.clientX-r.left)/r.width*W; if(x<W/4) pressed.left=true; else if(x>W*3/4) pressed.right=true; else pressed.a=true; });

// tape: a short video with two captions, skippable
SC.tape={ tapStart:true,
  enter(o){ this.o=o; this.t=0; this.v=null; const v=document.createElement('video'); v.muted=true; v.playsInline=true; v.preload='auto'; v.src=ROOT+'assets/video/'+o.video+'.webm'; v.onerror=()=>{ if(!v.triedMp4){ v.triedMp4=1; v.src=ROOT+'assets/video/'+o.video+'.mp4'; } else this.v=null; };
    v.play().then(()=>{ this.v=v; }).catch(()=>{}); this.vel=v; if(curMusic!==LV.music) playMusic(LV.music,{fade:1}); },
  update(){ this.t++; if(this.t>this.o.hold||(this.t>20&&(pressed.start||pressed.a))){ this.vel.pause(); fadeTo(()=>this.o.next(),14); this.o.hold=1e9; } },
  draw(){ ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H); if(this.v&&this.v.videoWidth){ const vw=this.v.videoWidth, vh=this.v.videoHeight, s=Math.min(W/vw,H/vh), dw=vw*s, dh=vh*s; ctx.drawImage(this.v,(W-dw)/2,(H-dh)/2,dw,dh); }
    else coverImg(IMG['bg/oran_old'],0,0,W,H,.6);
    const [c1,c2]=this.o.caption; R(0,H-40,W,40,'rgba(0,0,0,.6)'); text(c1,W/2,H-32,'#ffe066',6,'center'); if(this.t>80) text(c2,W/2,H-18,'#fff',6,'center'); text('REC ●',W-10,8,frame%40<20?'#ff3d3d':'#600',5,'right'); if(this.t>60&&frame%50<30) text('SKIP ▶',10,8,'#9aa6b8',4); } };

// stage
SC.stage={ isStage:true, enter(i){ startLevel(i); saveStage(STAGELIST.findIndex(s=>s.lv===i&&!s.story)); }, update:stageUpdate, draw:stageDraw,
  onTrackEnd(name){ if(stageState==='play'&&name===LV.music){ /* song ran out before the boss fell: keep fighting on silence, boss comes to you */ playMusic('offline',{fade:1,loop:true}); } },
  onClear(){ go(SC.after); } };
function startStory(lv){ const L=LEVELS[lv]; LV=L; if(L.tape){ go(SC.tape,Object.assign({next:()=>go(SC.stage,lv)},L.tape)); } else go(SC.stage,lv); }

// after the stage: the rest is not built yet. One card, back to the title.
SC.after={ tapStart:true, enter(){ this.t=0; if(curMusic!=='offline') playMusic('offline',{fade:1,loop:true}); },
  update(){ this.t++; if(this.t>40&&(pressed.start||pressed.a)) fadeTo(()=>go(SC.title)); },
  draw(){ ctx.fillStyle='#07040d'; ctx.fillRect(0,0,W,H); coverImg(IMG['story/kitchen_tv'],W/2-120,10,240,120,.9);
    text('THE PHONE DIED.',W/2,142,'#ffe066',8,'center'); text('THE ONLY OUTLET IS MAMA.',W/2,156,'#fff',6,'center'); text('CAIRO IS NOT BUILT YET IN THIS VERSION.',W/2,178,'#9aa6b8',5,'center');
    text('SCORE '+G.score+' · BEST CHAIN '+G.chainBest,W/2,194,'#5ff0ff',6,'center'); if(this.t>40&&frame%40<28) text('PRESS START',W/2,208,'#ffe066',6,'center'); } };
