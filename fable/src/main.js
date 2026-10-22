// RAÏ NOIR rebuild · boot
'use strict';
(async function boot(){
  ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H); text('LOADING… INSHALGORITHM',W/2,H/2,'#c3cad6',6,'center',null);
  await Promise.race([document.fonts.load("8px 'Press Start 2P'").then(()=>document.fonts.load("8px 'Bungee'")),new Promise(r=>setTimeout(r,2500))]).catch(()=>{});
  await ASSETS_READY;
  go(SC.boot); loop();
})();
// debug hooks for tests
window.__rr={get scene(){return scene;},SC,get G(){return G;},get player(){return player;},get ents(){return ents;},get state(){return stageState;},press,held,get camX(){return camX;},get wave(){return wave;},get waveI(){return waveI;},trackTime,startLevel:i=>{newRun();go(SC.stage,i);},playMusic};
window.__rr_setcam=x=>{ camX=x; };
