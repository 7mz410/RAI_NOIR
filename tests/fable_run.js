// Full title-to-stage-clear run of the rebuild with a dumb bot. Prints a music/wave log. Exit 1 on a soft-lock or page error.
// node tests/fable_run.js [url]
const { chromium } = require('playwright');
const URL=process.argv[2]||'http://localhost:8777/fable/index.html';
const EXE=process.env.CHROME||undefined;
(async()=>{
  const b=await chromium.launch({executablePath:EXE,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const pg=await b.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true});
  const errs=[]; pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
  await pg.goto(URL); await pg.waitForFunction(()=>window.__rr&&__rr.scene===__rr.SC.boot,{timeout:20000});
  await pg.keyboard.press('Enter'); await pg.waitForFunction(()=>__rr.scene===__rr.SC.title,{timeout:8000}); await pg.waitForTimeout(500);
  await pg.keyboard.press('Enter'); await pg.waitForFunction(()=>__rr.scene===__rr.SC.select,{timeout:4000}); await pg.waitForTimeout(400);
  await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(300); await pg.keyboard.press('Enter');
  await pg.waitForFunction(()=>__rr.scene===__rr.SC.tape,{timeout:4000}); await pg.waitForTimeout(800); await pg.keyboard.press('Enter');
  await pg.waitForFunction(()=>__rr.scene===__rr.SC.stage,{timeout:6000});
  // bot: walk to the nearest enemy's line, punch when close, else head right; jump over waves
  await pg.evaluate(()=>{ window.__log=[]; let lastW=-1, lastState='';
    setInterval(()=>{ const p=__rr.player, H=__rr.held; if(!p||__rr.scene!==__rr.SC.stage) return;
      if(__rr.waveI!==lastW){ lastW=__rr.waveI; __log.push({ev:'wave'+lastW,t:+(__rr.trackTime()||0).toFixed(1),x:Math.round(p.x)}); }
      if(__rr.state!==lastState){ lastState=__rr.state; __log.push({ev:'state:'+lastState,t:+(__rr.trackTime()||0).toFixed(1),hp:p.hp}); }
      const en=__rr.ents.filter(e=>e.kind==='enemy'&&!e.dead&&e.state!=='down'&&e.state!=='fall').sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0];
      H.left=H.right=H.up=H.down=false;
      if(__rr.state==='gameover'){ __rr.press('start'); return; }
      if(en){ const dx=en.x-p.x, dy=en.y-p.y; if(Math.abs(dy)>4){ H[dy<0?'up':'down']=true; } if(Math.abs(dx)>24){ H[dx<0?'left':'right']=true; } else if(Math.random()<.7) __rr.press(Math.random()<.8?'a':'k');
        if(__rr.G.spc>=100&&Math.random()<.3) __rr.press('c'); }
      else { H.right=true; if(Math.random()<.05) __rr.press('a'); }
      if(Math.random()<.1) __rr.press('a'); },50); });
  const t0=Date.now(); let last='';
  while(Date.now()-t0<150000){ await pg.waitForTimeout(1000);
    const s=await pg.evaluate(()=>({scene:__rr.scene===__rr.SC.stage?'stage':__rr.scene===__rr.SC.after?'after':'other',st:__rr.state,x:Math.round(__rr.player?__rr.player.x:0),hp:__rr.player&&__rr.player.hp,t:+(__rr.trackTime()||0).toFixed(1),e:__rr.ents.length,w:__rr.waveI}));
    const line=JSON.stringify(s); if(line!==last){ process.stdout.write(line+'\n'); last=line; }
    if(s.scene==='after') break; }
  const log=await pg.evaluate(()=>window.__log); console.log('LOG', JSON.stringify(log));
  await pg.screenshot({path:'/tmp/fable_end.png'});
  const done=last.includes('"after"'); console.log(done?'RUN OK: reached the after-card':'RUN FAIL: never reached stage clear'); if(errs.length) console.log(errs.join('\n'));
  await b.close(); process.exit(done&&!errs.length?0:1);
})().catch(e=>{console.error(e);process.exit(1);});
