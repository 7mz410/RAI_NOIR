// RAÏ NOIR rebuild · level data. x in world px, t in seconds of the stage track.
'use strict';
const YMIN=152, YMAX=214;
const ETYPES={
  hustler:{name:'BOUZID',look:'hustler',hp:16,spd:.7,reach:20,dmg:5,wind:24,score:150,filmer:1},
  scooter:{name:'SCOOTER',look:'hustler',hp:13,spd:1.0,reach:18,dmg:4,wind:18,score:120,filmer:1},
  goon:   {name:'GALLOUZ',look:'goon',hp:24,spd:.55,reach:22,dmg:8,wind:30,score:250,sc:1.08,knock:1},
  tote:   {name:'TATTOO HIPSTER',look:'punk',hp:20,spd:.8,reach:21,dmg:6,wind:22,score:220,thrower:1},
  playback:{name:'DJ PLAYBAK',look:'playback',hp:84,spd:.65,reach:22,dmg:8,wind:26,score:5000,sc:1.18,boss:1,intro:'KIOSK RADIO · BOUGHT YOUR TRACK FOR 1 DINAR'},
};
const ENEMY_LINES={ hustler:["AN AI SINGER? MY FRIDGE SINGS TOO.","GO BACK TO THE CLOUD, KHOYA."], goon:["VOCODER VERSACE? 5 DINAR FOR THE CASE."], scooter:["DELIVERY FOR CHEB GPT: ONE BOX OF RETURNS."], tote:["IS THIS... AUTHENTIC?"], playback:["I PLAY YOUR TRACK. I GET PAID. YOU GET EXPOSURE.","AUTOTUNE IS CHEATING. PLAYBACK IS ART."] };
const LEVELS=[
 { id:'oran', title:'STAGE 1 · ZIZOU', sub:'ORAN — OFFLINE AND LOVING IT', music:'zizou', dur:100, len:1300, yMin:176, cover:'covers/oran',
   bgs:['bg/oran_corniche','bg/oran_blvd','bg/oran_old','bg/oran_souk'],
   waves:[ {at:117,t:3,list:['hustler','hustler']},
           {at:338,t:14,list:['hustler','scooter','tote']},
           {at:585,t:28,list:['goon','hustler','scooter']},
           {at:832,t:44,list:['hustler','goon','scooter','goon']},
           {at:1053,t:62,boss:1,list:['playback','hustler','scooter']} ],
   props:[['bin',224,164,'karantika'],['bin',268,206,'babouche'],['bin',372,204,'pipe'],['crate',478,206,'oranges'],['bin',306,170,'tajine'],['crate',554,176,'micstand'],['crate',640,206,'baguette'],['bin',612,190,'hasni'],['crate',697,170,'sardines'],['bin',774,172,'k7tape'],['crate',822,206,'cassette'],['crate',908,170,'babouche'],['bin',956,206,'shisha'],['crate',984,206,'tray'],['crate',1032,180,'karantika'],['bin',1099,200,'darbuka'],['crate',1138,168,'sardines'],['bin',1166,172,'chechia'],['crate',1204,206,'yamaha']],
   nokia:[ {t:18,from:'NEPHEW YACINE',txt:"KHALI!! MY FRIENDS SAY YOU'RE AN A.I. ARE YOU REAL?? SEND A VOICE NOTE."} ],
   popup:{at:455,img:'story/kitchen_tv',lines:[['MAMA (FROM THE BALCONY)',"WLIDI, YOU'RE THIN. EAT. AND BE A DOCTOR."],['CHEB','AFTER, MAMA.']]},
   tape:{video:'oran_tape',hold:180,caption:['HOME. OFFLINE. AND LOVING IT.','UNTIL ORAN FINDS OUT HE IS AN A.I.']},
   poster:['RETRO CASSETTA','THEY CALL IT DIGGING. IN ORAN WE CALL IT SHOPPING.'] },
];
const STAGELIST=[ {title:'FULL GAME',sub:'ZIZOU → ZOMBY → AMOR HARAM → ZIDANE → GHORBA → FINALE',cover:'covers/oran',lv:0,story:1},
  {title:'STAGE 1 · ZIZOU',sub:'ORAN — OFFLINE AND LOVING IT',cover:'covers/oran',lv:0},
  {title:'STAGE 2 · ZOMBY',sub:'CAIRO',cover:'covers/cairo'},{title:'STAGE 3 · AMOR HARAM',sub:'CYBER CAIRO',cover:'covers/cybercairo'},
  {title:'STAGE 4 · ZIDANE',sub:'MARSEILLE',cover:'covers/marseille'},{title:'STAGE 5 · GHORBA',sub:'THE BOAT',cover:'covers/ghorba'},
  {title:'FINALE · HELL.EXE',sub:"ALDI'S DATACENTRE",cover:'covers/serverfarm'} ];
const HYPE=[[5,'WALLAH!'],[10,'YA SALAM!'],[15,'SAHHA!'],[20,'MABROUK!'],[30,'3ASSAL!'],[50,'LEGEND, KHOYA!'],[80,'MAMA SAW THAT.']];
