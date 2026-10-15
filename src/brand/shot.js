const { chromium } = require('playwright');
(async()=>{ const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 let p=await b.newPage({viewport:{width:512,height:512},deviceScaleFactor:2}); await p.goto('file:///home/claude/vid/brand/icon.html'); await p.waitForTimeout(400);
 await p.locator('.c').screenshot({path:'icon-1024.png',omitBackground:true});
 p=await b.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1}); await p.goto('file:///home/claude/vid/brand/og.html'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(500);
 await p.screenshot({path:'og.png'}); await b.close(); })();
