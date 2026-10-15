// فيلم التدشين v238 — node fgen.js shot w|m t1 t2 …   |   node fgen.js render w|m
const { chromium } = require('playwright'); const fs=require('fs'); const {execSync}=require('child_process');
(async()=>{ const icons=fs.readFileSync('/home/claude/vid/icons.json','utf8');
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const mode=process.argv[2], L=process.argv[3]; const W=L==='m'?720:1280,H=L==='m'?1280:720;
 const DPR=mode==='render'?+(process.env.DPR||1.5):(+process.env.SDPR||1);
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:DPR});
 await p.addInitScript(`window.ICON=${icons};window.LAY='${L}';`); p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file:///home/claude/vid/film3.html'); await p.evaluate(()=>document.fonts.ready);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r})))); await p.waitForTimeout(500);
 const SD='/tmp/claude-0/-home-claude/c559dbdd-1eea-5df0-9991-28b01da0c844/scratchpad/fs';
 if(mode==='shot'){ fs.mkdirSync(SD,{recursive:true}); for(const t of process.argv.slice(4)){ await p.evaluate(t=>window.render(t),+t); await p.screenshot({path:`${SD}/f_${L}_${t}.jpg`,type:'jpeg',quality:88}); } }
 else { const dir='/home/claude/vid/frf3_'+L; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir); const N=53*30;
  for(let i=0;i<N;i++){ await p.evaluate(t=>window.render(t),i/30); await p.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:96}); if(i%300===0) console.log('frame',L,i); }
  const suf=L==='m'?'-m':''; const O='/home/claude/vid/out2';
  execSync(`ffmpeg -y -loglevel error -framerate 30 -i ${dir}/f%04d.jpg -i /home/claude/vid/film.mp3 -map 0:v -map 1:a -c:v libx264 -profile:v high -crf ${process.env.CRF||20} -preset slow -tune animation -pix_fmt yuv420p -c:a aac -b:a 128k -shortest -movflags +faststart ${O}/film${suf}.mp4`);
  execSync(`ffmpeg -y -loglevel error -i ${dir}/f0570.jpg -q:v 3 ${O}/film-poster${suf}.jpg && cp ${O}/film-poster${suf}.jpg ${O}/film${suf}.jpg`);
  fs.rmSync(dir,{recursive:true,force:true}); console.log('done film',L,fs.statSync(`${O}/film${suf}.mp4`).size); }
 await b.close(); })();
