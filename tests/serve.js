// Static server with Range support (python http.server has none, so <audio> cannot seek). node tests/serve.js [port]
const http=require('http'), fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..'), PORT=+process.argv[2]||8777;
const MIME={'.html':'text/html','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp3':'audio/mpeg','.mp4':'video/mp4','.webm':'video/webm','.css':'text/css'};
http.createServer((req,res)=>{
  const p=path.join(ROOT,decodeURIComponent(req.url.split('?')[0])); if(!p.startsWith(ROOT)||!fs.existsSync(p)||fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  const size=fs.statSync(p).size, type=MIME[path.extname(p)]||'application/octet-stream', m=/bytes=(\d*)-(\d*)/.exec(req.headers.range||'');
  if(m){ const s=m[1]?+m[1]:0, e=m[2]?+m[2]:size-1; res.writeHead(206,{'Content-Type':type,'Content-Range':`bytes ${s}-${e}/${size}`,'Content-Length':e-s+1,'Accept-Ranges':'bytes'}); fs.createReadStream(p,{start:s,end:e}).pipe(res); }
  else { res.writeHead(200,{'Content-Type':type,'Content-Length':size,'Accept-Ranges':'bytes'}); fs.createReadStream(p).pipe(res); }
}).listen(PORT,()=>console.log('serving '+ROOT+' on http://localhost:'+PORT));
