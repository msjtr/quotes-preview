const { chromium } = require('playwright');
const fs=require('fs'); const {execSync}=require('child_process');
const F='/home/claude/vid/fonts/'; const css=fs.readFileSync('../sb/fontcss.txt','utf8');
(async()=>{
 const test=process.argv[2]==='test'; const DUR=+(process.argv[3]||53);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const ctx=await b.newContext({viewport:{width:432,height:768},deviceScaleFactor:2.5});
 await ctx.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:css}));
 await ctx.route('**/f/*.woff2',r=>{const n=r.request().url().split('/f/')[1];r.fulfill({contentType:'font/woff2',body:fs.readFileSync(F+n)})});
 const p=await ctx.newPage(); p.on('pageerror',e=>console.log('PERR',e.message.slice(0,150)));
 await p.goto('http://localhost:8765/sample.html'); await p.waitForTimeout(4000);
 const btn=p.locator('#pv-host').getByText('شاهد فيلم التدشين').first();
 await btn.scrollIntoViewIfNeeded(); await btn.click(); await p.waitForTimeout(2500);
 await p.clock.install(); await p.clock.pauseAt(Date.now()+1000);
 await p.evaluate(()=>{ window.__A=new Map(); window.__seen=()=>{ const now=performance.now(); for(const a of document.getAnimations()){ if(!__A.has(a)){ __A.set(a,now-(a.currentTime||0)); } a.pause(); a.currentTime=Math.max(0,now-__A.get(a)); } }; });
 await p.getByText('ابدأ التدشين').first().click();
 await p.evaluate(()=>{ for(const b of document.querySelectorAll('button')){ if(/كتم الصوت|تشغيل الصوت|تخطي|إغلاق/.test(b.textContent)) b.style.opacity='0' } });
 const dir='/home/claude/vid/frfm'; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
 const N=test?6:DUR*30; const step=test?5000:1000/30;
 for(let i=0;i<N;i++){
   await p.clock.runFor(step); await p.evaluate(()=>window.__seen());
   await p.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:93});
   if(i%150===0) console.log('frame',i);
 }
 await b.close();
 if(!test){ execSync(`ffmpeg -y -loglevel error -framerate 30 -i ${dir}/f%04d.jpg -i /home/claude/vid/film.mp3 -map 0:v -map 1:a -vf "eq=saturation=1.05" -c:v libx264 -profile:v high -crf 22 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -shortest -movflags +faststart /home/claude/vid/out2/film-m.mp4 && ffmpeg -y -loglevel error -i ${dir}/f0360.jpg -q:v 3 /home/claude/vid/out2/film-m.jpg`); console.log('film done', fs.statSync('/home/claude/vid/out2/film-m.mp4').size); }
})();
