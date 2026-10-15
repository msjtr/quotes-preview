const { chromium } = require('playwright'); const fs=require('fs'); const {execSync}=require('child_process');
(async()=>{ const icons=fs.readFileSync('icons.json','utf8'); const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const mode=process.argv[2]; // 'shot L t' or 'render L'
 const L=process.argv[3]; const W=L==='m'?720:1280,H=L==='m'?900:540;
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:mode==='render'?+(process.env.DPR||1.5):1});
 await p.addInitScript(`window.ICON=${icons};window.LAY='${L}';`); p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file:///home/claude/vid/hero2.html'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(400);
 if(mode==='shot'){ for(const t of process.argv.slice(4)){ await p.evaluate(t=>window.render(t),+t); await p.screenshot({path:`/tmp/claude-0/-home-claude/c559dbdd-1eea-5df0-9991-28b01da0c844/scratchpad/h_${L}_${t}.jpg`,type:'jpeg'}); } }
 else { const dir='frh_'+L; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir); const N=18*30;
  for(let i=0;i<N;i++){ await p.evaluate(t=>window.render(t),i/30); await p.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:97}); }
  const suf=L==='m'?'-m':'';
  execSync(`ffmpeg -y -loglevel error -framerate 30 -i ${dir}/f%04d.jpg -vf "eq=saturation=1.08:contrast=1.03" -c:v libx264 -profile:v high -crf ${process.env.CRF||23} -preset slow -tune animation -pix_fmt yuv420p -movflags +faststart -an out2/hero${suf}.mp4 && ffmpeg -y -loglevel error -i ${dir}/f0480.jpg -vf "eq=saturation=1.08:contrast=1.03" -q:v 3 out2/hero${suf}.jpg`);
  fs.rmSync(dir,{recursive:true,force:true}); console.log('done hero',L,fs.statSync(`out2/hero${suf}.mp4`).size); }
 await b.close(); })();
