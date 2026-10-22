// RAÏ NOIR rebuild · sprites: pose→frame maps and the fighter draw
'use strict';
// Frames are [x,y,w,h,img]. All sheets face right. Walk = 4 phases: stride, pass, mirrored stride, pass (atlas10 m_/q_ frames).
const POSE={
  cheb:    {idle:'n_cheb_0',walk:'n_cheb_1',jab:'n_cheb_2',cross:'n_cheb_2',upper:'n_cheb_3',kick:'n_cheb_4',jump:'n_cheb_7',jumpkick:'n_cheb_8',hurt:'n_cheb_6',fall:'n_cheb_9',down:'n_cheb_10',dead:'n_cheb_10',getup:'n_cheb_11',special:'n_cheb_3',win:'n_cheb_12'},
  hustler: {idle:'e_hustler_0',walk:'e_hustler_1',wind:'e_hustler_3',atk:'e_hustler_4',hurt:'e_hustler_5',fall:'e_hustler_7',down:'e_hustler_8',dead:'e_hustler_8',getup:'e_hustler_9',film:'e_hustler_10'},
  goon:    {idle:'e_goon_0',walk:'e_goon_1',wind:'e_goon_3',atk:'e_goon_4',hurt:'e_goon_5',fall:'e_goon_5',down:'e_goon_12',dead:'e_goon_12',getup:'e_goon_10',film:'e_goon_9'},
  punk:    {idle:'e_punk_0',walk:'e_punk_1',wind:'e_punk_3',atk:'e_punk_4',hurt:'e_punk_5',fall:'e_punk_6',down:'e_punk_7',dead:'e_punk_7',getup:'e_punk_8',film:'e_punk_9',throw:'e_punk_3'},
  playback:{idle:'e_playback_0',walk:'e_playback_1',wind:'e_playback_3',throw:'e_playback_3',atk:'e_playback_4',hurt:'e_playback_5',fall:'e_playback_5',down:'e_playback_6',dead:'e_playback_6',getup:'e_playback_7',special:'e_playback_8'},
};
function frameKey(e){
  const M=POSE[e.look]; if(!M) return null; const st=e.pose||e.state;
  if(st==='walk'){ const fl=clamp(Math.round(7.5/Math.max(.5,e.spd||1)),4,11), ph=Math.floor(e.anim/fl)%4;
    if(ph===0) return M.walk; if(ph===2&&ATLAS['m_'+M.walk]) return 'm_'+M.walk; if(ATLAS['q_'+M.walk]){ e._bob=-1; return 'q_'+M.walk; } return M.idle; }
  return M[st]||M.idle;
}
function drawFighter(e){
  const key=frameKey(e), f=ATLAS[key]; if(!f) return; const im=IMG[f[4]]; if(!im) return;
  const sc=((e.sc||K)/K)*1.38*(e.look==='cheb'?1.07:1)*(e.T&&e.T.boss?1.1:1), w=Math.round(f[2]*sc), h=Math.round(f[3]*sc);
  const gx=Math.round(e.x-camX), gy=Math.round(e.y-(e.z||0))+(e._bob||0); e._bob=0;
  if(e.blink&&Math.floor(frame/3)%2) return;
  ctx.fillStyle='rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(gx,Math.round(e.y)+1,11*(e.sc||1),2.5*(e.sc||1),0,0,Math.PI*2); ctx.fill();
  const idle=ATLAS[POSE[e.look].idle], bw=Math.round(idle[2]*sc);
  const lying=['down','dead','fall','getup'].includes(e.pose||e.state)||w>h*1.3;
  const ox=lying?-Math.round(w/2):-Math.round(Math.min(w,bw)*.45), oy=-h+2;
  ctx.save(); ctx.translate(gx,gy); if(e.dir<0) ctx.scale(-1,1);
  if(e.flashT>0){ ctx.filter='brightness(3)'; }
  ctx.drawImage(im,f[0],f[1],f[2],f[3],ox,oy,w,h); ctx.restore();
}
