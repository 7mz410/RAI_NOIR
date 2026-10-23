#!/usr/bin/env python3
"""Stage the rebuild (fable/) as a self-contained folder for publishing: page + src + only the assets the slice uses.
usage: python3 tools/build_fable_artifact.py OUTDIR"""
import re,sys,shutil,pathlib
root=pathlib.Path(__file__).resolve().parent.parent; out=pathlib.Path(sys.argv[1]); 
if out.exists(): shutil.rmtree(out)
out.mkdir(parents=True)
html=(root/'fable/index.html').read_text()
body=re.search(r'<body>(.*)</body>',html,re.S).group(1)
style=re.search(r'<style>.*?</style>',html,re.S).group(0)
fonts=re.search(r'<link rel="stylesheet"[^>]+>',html).group(0)
body=body.replace("window.ASSET_ROOT||'../'","window.ASSET_ROOT||''")
page='<title>RAÏ NOIR rebuild</title>\n'+fonts+'\n'+style+'\n'+body
(out/'index.html').write_text(page)
files=['fable/src/core.js','fable/src/assets.js','fable/src/sprites.js','fable/src/levels.js','fable/src/fight.js','fable/src/scenes.js','fable/src/main.js',
 'audio/zizou.mp3','audio/sawna_boot.mp3','audio/offline.mp3','assets/video/oran_tape.webm','assets/video/oran_tape.mp4',
 'assets/ui/logo_v3.png','assets/ui/sawna_logo.png','assets/story/kitchen_tv.jpg']
files+=[f'assets/spr/{a}.{e}' for a in ['atlas2','atlas3','atlas10','atlas6','props'] for e in ['json','png']]
files+=[f'assets/bg/oran_{n}.jpg' for n in ['corniche','blvd','old','souk']]
files+=[f'assets/covers/{n}' for n in ['oran.jpg','cairo.jpg','cybercairo.jpg','marseille.jpg','ghorba.webp','serverfarm.jpg','jannah.jpg']]
files+=[f'assets/portraits/{n}.jpg' for n in ['cheb','aicha','k7']]
for f in files:
    dst=out/(f[len('fable/'):] if f.startswith('fable/') else f); dst.parent.mkdir(parents=True,exist_ok=True); shutil.copy(root/f,dst)
print(out, len(files)+1, 'files')
