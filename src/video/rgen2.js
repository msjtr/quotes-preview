const { chromium } = require('playwright');
const fs=require('fs'); const {execSync}=require('child_process');
(async()=>{
 const specs=JSON.parse(fs.readFileSync('specs2.json','utf8')); const icons=fs.readFileSync('icons.json','utf8');
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const args=process.argv.slice(2); const lays=(process.env.LAYS||'w,m').split(',');
 const names=args.length?args:Object.keys(specs);
 fs.mkdirSync('out2',{recursive:true});
 for(const n of names) for(const L of lays){
  const W=L==='m'?720:1280, H=L==='m'?720:480;
  const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:+(process.env.DPR||1.5)});
  await p.addInitScript(`window.SPEC=${JSON.stringify(specs[n])};window.ICON=${icons};window.LAY='${L}';`);
  p.on('pageerror',e=>console.log('ERR',n,e.message));
  await p.goto('file:///home/claude/vid/vgen2.html'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(400);
  const dir=`fr2_${n}_${L}`; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
  const D=specs[n].dur||10, N=D*30;
  for(let i=0;i<N;i++){ await p.evaluate(t=>window.render(t),i/30); await p.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:97}); }
  await p.close();
  const suf=L==='m'?'-m':'';
  execSync(`ffmpeg -y -loglevel error -framerate 30 -i ${dir}/f%04d.jpg -vf "eq=saturation=1.08:contrast=1.03" -c:v libx264 -profile:v high -crf ${process.env.CRF||23} -preset slow -tune animation -pix_fmt yuv420p -movflags +faststart -an out2/${n}${suf}.mp4 && ffmpeg -y -loglevel error -i ${dir}/f0180.jpg -vf "eq=saturation=1.08:contrast=1.03" -q:v 3 out2/${n}${suf}.jpg`);
  fs.rmSync(dir,{recursive:true,force:true});
  console.log('done',n,L, fs.statSync(`out2/${n}${suf}.mp4`).size);
 }
 await b.close();
})();
