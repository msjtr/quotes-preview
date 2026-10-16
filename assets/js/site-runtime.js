(function(){
  var host=document.getElementById('pv-host'), box=document.getElementById('pv-site'), fr=document.getElementById('pv-site-f'), bar=document.querySelector('.pv-bar');
  var CFG=window.__TERA||{}, LINKS=CFG.links||{};
  var page=CFG.start||'app', C=null, loading=null, PP={}, cur={path:'/',hash:''}, first=true;
  var dv=document.createElement('div'); dv.className='ts-dev'; fr.parentNode.insertBefore(dv,fr); dv.appendChild(fr);
  /* شاشة الانتظار الموحّدة: تظهر في كل تحميل وانتقال وتحديث، ومدتها 3 ثوانٍ على الأقل */
  var LG=['sym','tera','ar','lines','tagtx','en'];
  /* إن رُسمت الشاشة مسبقًا في الصفحة (من أول لحظة: الحلقات والنقاط فقط) نتبنّاها، وتبدأ حركة الشعار بعد تحميل السكربت الثقيل فلا تتقطّع */
  var wait=document.querySelector('.tw'), pre=!!wait;
  if(!pre){ wait=document.createElement('div'); wait.className='tw'; wait.setAttribute('role','status'); wait.setAttribute('aria-label','جارٍ التحميل');
  wait.innerHTML='<div class="tw-bg"><i class="tw-aur"></i><i class="tw-g1"></i><i class="tw-g2"></i><i class="tw-grid"></i></div>'+
    '<div class="tw-stage"><div class="tw-rings"><i class="r1"></i><i class="r2"></i><i class="r3"></i><i class="rp"></i><i class="rp rp2"></i></div>'+
    '<div class="tw-logo" aria-label="تيرا — عالمك بلا حدود"><div class="tw-st"><img class="tw-gh" src="vid/logo-dark.webp" alt="" draggable="false">'+LG.map(function(k){return '<img class="l-'+k+'" src="vid/lg-'+k+'.webp" alt="" draggable="false">'}).join('')+'<i class="tw-sheen"></i></div></div></div>'+
    '<p class="tw-t">من الاحتياج إلى الحل</p>'+
    '<div class="tw-w"><span class="tw-s">يرجى الانتظار</span><span class="tw-rail"><i></i></span><span class="tw-dots"><i></i><i></i><i></i><i></i><i></i></span></div>';
  document.body.appendChild(wait); }
  var TWCSS=""
  +".tw{position:fixed;left:0;right:0;bottom:0;top:var(--pvh,0px);min-height:calc(100dvh - var(--pvh,0px));z-index:2147483000;display:grid;place-items:center;align-content:center;gap:clamp(14px,2.6vh,24px);padding:24px 16px;overflow:hidden;background:linear-gradient(125deg,#0B2552 0%,#0F3B78 48%,#0A7F8C 100%);color:#fff;font-family:Alexandria,'IBM Plex Sans Arabic',sans-serif;direction:rtl;transition:opacity .45s ease,visibility .45s}"
  +".tw[hidden]{display:none}.tw.is-out{opacity:0;visibility:hidden}"
  +".tw-bg,.tw-bg i{position:absolute;inset:0;pointer-events:none}"
  +".tw-aur{inset:-30%!important;background:conic-gradient(from 200deg at 55% 45%,transparent 0deg,rgba(99,226,224,.22) 40deg,transparent 95deg,rgba(255,200,97,.18) 150deg,transparent 215deg);filter:blur(34px);mix-blend-mode:screen;animation:twAur 9s linear infinite}"
  +".tw-g1,.tw-g2{width:60vmax!important;height:60vmax!important;border-radius:50%;filter:blur(18px)}"
  +".tw-g1{inset:auto auto -20vmax -18vmax!important;background:radial-gradient(circle,rgba(25,194,190,.55),transparent 66%);animation:twDrift 6s ease-in-out infinite alternate}"
  +".tw-g2{inset:-22vmax -16vmax auto auto!important;background:radial-gradient(circle,rgba(255,176,64,.38),transparent 68%);animation:twDrift 7s ease-in-out infinite alternate-reverse}"
  +".tw-grid{background-image:radial-gradient(rgba(255,214,140,.6) 1.2px,transparent 1.4px);background-size:30px 30px;opacity:.12;-webkit-mask:radial-gradient(circle at 50% 45%,#000 0,transparent 70%);mask:radial-gradient(circle at 50% 45%,#000 0,transparent 70%)}"
  +".tw-stage{position:relative;display:grid;place-items:center;width:min(90vw,560px);aspect-ratio:640/283}"
  +".tw-rings{position:absolute;left:50%;top:50%;width:0;height:0}"
  +".tw-rings i{position:absolute;left:0;top:0;border-radius:50%;translate:-50% -50%}"
  +".tw-rings .r1{width:min(64vw,330px);height:min(64vw,330px);border:1.5px solid rgba(255,200,97,.55);box-shadow:0 0 50px rgba(10,165,173,.35),inset 0 0 40px rgba(10,165,173,.18);animation:twPulse 3s ease-in-out infinite,twIn .9s cubic-bezier(.2,.9,.3,1.2) both}"
  +".tw-rings .r2{width:min(78vw,410px);height:min(78vw,410px);border:1.5px dashed rgba(99,226,224,.5);animation:twSpin 14s linear infinite,twIn 1.1s .1s cubic-bezier(.2,.9,.3,1.2) both}"
  +".tw-rings .r3{width:min(92vw,500px);height:min(92vw,500px);border:2px dotted rgba(255,255,255,.18);animation:twSpin 24s linear infinite reverse,twIn 1.3s .2s ease both}"
  +".tw-rings .rp{width:min(52vw,260px);height:min(52vw,260px);border:2px solid rgba(255,200,97,.55);animation:twRipple 2.4s .6s ease-out infinite}"
  +".tw-rings .rp2{border-color:rgba(99,226,224,.55);animation-delay:1.8s}"
  +".tw-logo{position:relative;width:100%;height:100%;perspective:900px;filter:drop-shadow(0 0 26px rgba(10,165,173,.55))}"
  +".tw-st{position:absolute;inset:0;transform-style:preserve-3d}"
  +".tw-st img{position:absolute;inset:0;width:100%;height:100%;user-select:none;-webkit-user-drag:none}"
  +".tw-gh{opacity:0;filter:grayscale(1) brightness(1.6)}"
  +".tw-sheen{position:absolute;inset:0;background:linear-gradient(105deg,transparent 42%,rgba(255,255,255,.95) 50%,transparent 58%) 160% 0/300% 100% no-repeat;-webkit-mask:url(vid/logo-dark.webp) center/100% 100% no-repeat;mask:url(vid/logo-dark.webp) center/100% 100% no-repeat;opacity:0;mix-blend-mode:screen}"
  +".tw.run .tw-st{animation:twRot 3s cubic-bezier(.45,.05,.25,1) both}"
  +".tw.run .tw-gh{animation:twGh 3s linear both}"
  +".tw.run .tw-sheen{animation:twSh 3s linear both}"
  +"@keyframes twRot{0%,40%{transform:rotateY(0) rotateX(0) scale(1)}50%{transform:rotateY(-28deg) rotateX(11deg) scale(.96)}61%{transform:rotateY(24deg) rotateX(-8deg) scale(.96)}69%{transform:rotateY(-7deg) rotateX(3deg) scale(.98)}76%,100%{transform:rotateY(0) rotateX(0) scale(1)}}"
  +"@keyframes twGh{0%{opacity:0}4%,34%{opacity:.16}44%,100%{opacity:0}}"
  +"@keyframes twSh{0%,78%{background-position:160% 0;opacity:0}79%{opacity:1}94%{background-position:-60% 0;opacity:1}95%,100%{opacity:0;background-position:-60% 0}}"
  +".tw-st .l-sym{clip-path:inset(0 0 0 100%)}.tw.run .l-sym{animation:twL-sym 3s cubic-bezier(.45,.05,.25,1) both}"
  +"@keyframes twL-sym{0%,2%{clip-path:inset(0 0 0 100%);filter:none;transform:translateZ(0)}13%{clip-path:inset(0 0 0 0);filter:drop-shadow(0 0 10px rgba(99,226,224,.95)) brightness(1.25)}19%,42%{clip-path:inset(0 0 0 0);filter:none;transform:translateZ(0)}52%,64%{clip-path:inset(0 0 0 0);transform:translateZ(82px);filter:drop-shadow(0 10px 20px rgba(0,8,30,.55))}76%,100%{clip-path:inset(0 0 0 0);transform:translateZ(0);filter:none}}"
  +".tw-st .l-tera{clip-path:inset(0 100% 0 0)}.tw.run .l-tera{animation:twL-tera 3s cubic-bezier(.45,.05,.25,1) both}"
  +"@keyframes twL-tera{0%,8%{clip-path:inset(0 100% 0 0);filter:none;transform:translateZ(0)}20%{clip-path:inset(0 0 0 0);filter:drop-shadow(0 0 10px rgba(99,226,224,.95)) brightness(1.25)}26%,42%{clip-path:inset(0 0 0 0);filter:none;transform:translateZ(0)}52%,64%{clip-path:inset(0 0 0 0);transform:translateZ(46px);filter:drop-shadow(0 6px 12px rgba(0,8,30,.55))}76%,100%{clip-path:inset(0 0 0 0);transform:translateZ(0);filter:none}}"
  +".tw-st .l-ar{clip-path:inset(0 0 0 100%)}.tw.run .l-ar{animation:twL-ar 3s cubic-bezier(.45,.05,.25,1) both}"
  +"@keyframes twL-ar{0%,12%{clip-path:inset(0 0 0 100%);filter:none;transform:translateZ(0)}24%{clip-path:inset(0 0 0 0);filter:drop-shadow(0 0 10px rgba(99,226,224,.95)) brightness(1.25)}30%,42%{clip-path:inset(0 0 0 0);filter:none;transform:translateZ(0)}52%,64%{clip-path:inset(0 0 0 0);transform:translateZ(46px);filter:drop-shadow(0 6px 12px rgba(0,8,30,.55))}76%,100%{clip-path:inset(0 0 0 0);transform:translateZ(0);filter:none}}"
  +".tw-st .l-lines{clip-path:inset(0 50% 0 50%)}.tw.run .l-lines{animation:twL-lines 3s cubic-bezier(.45,.05,.25,1) both}"
  +"@keyframes twL-lines{0%,17%{clip-path:inset(0 50% 0 50%);filter:none;transform:translateZ(0)}28%{clip-path:inset(0 0 0 0);filter:drop-shadow(0 0 10px rgba(99,226,224,.95)) brightness(1.25)}33%,42%{clip-path:inset(0 0 0 0);filter:none;transform:translateZ(0)}52%,64%{clip-path:inset(0 0 0 0);transform:translateZ(14px);filter:drop-shadow(0 3px 6px rgba(0,8,30,.55))}76%,100%{clip-path:inset(0 0 0 0);transform:translateZ(0);filter:none}}"
  +".tw-st .l-tagtx{clip-path:inset(0 0 0 100%)}.tw.run .l-tagtx{animation:twL-tagtx 3s cubic-bezier(.45,.05,.25,1) both}"
  +"@keyframes twL-tagtx{0%,21%{clip-path:inset(0 0 0 100%);filter:none;transform:translateZ(0)}31%{clip-path:inset(0 0 0 0);filter:drop-shadow(0 0 10px rgba(99,226,224,.95)) brightness(1.25)}36%,42%{clip-path:inset(0 0 0 0);filter:none;transform:translateZ(0)}52%,64%{clip-path:inset(0 0 0 0);transform:translateZ(28px);filter:drop-shadow(0 4px 8px rgba(0,8,30,.55))}76%,100%{clip-path:inset(0 0 0 0);transform:translateZ(0);filter:none}}"
  +".tw-st .l-en{clip-path:inset(0 100% 0 0)}.tw.run .l-en{animation:twL-en 3s cubic-bezier(.45,.05,.25,1) both}"
  +"@keyframes twL-en{0%,24%{clip-path:inset(0 100% 0 0);filter:none;transform:translateZ(0)}34%{clip-path:inset(0 0 0 0);filter:drop-shadow(0 0 10px rgba(99,226,224,.95)) brightness(1.25)}39%,42%{clip-path:inset(0 0 0 0);filter:none;transform:translateZ(0)}52%,64%{clip-path:inset(0 0 0 0);transform:translateZ(21px);filter:drop-shadow(0 3px 6px rgba(0,8,30,.55))}76%,100%{clip-path:inset(0 0 0 0);transform:translateZ(0);filter:none}}"
  +".tw-t{margin:0;padding:.18em .2em .1em;line-height:1.55;font-weight:800;font-size:clamp(1.35rem,4.2vw,2.3rem);background:linear-gradient(100deg,#FFE7B0 0%,#FFC861 40%,#FFF4D8 70%,#FFC861 100%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;overflow:visible}"
  +".tw.run .tw-t{animation:twUp .7s 1.1s ease-out both,twShim 3s 1.1s linear infinite}"
  +".tw-w{display:grid;justify-items:center;gap:12px}"
  +".tw-s{font:500 clamp(.85rem,2.4vw,.98rem) 'IBM Plex Sans Arabic',Alexandria,sans-serif;color:#E4EEFA;letter-spacing:.02em}"
  +".tw-rail{position:relative;width:min(16rem,70vw);height:4px;border-radius:9px;background:rgba(255,255,255,.18);overflow:hidden}"
  +".tw-rail i{position:absolute;inset-block:0;right:0;width:100%;border-radius:9px;background:linear-gradient(270deg,#19C2AE,#FFC861);transform-origin:100% 50%;transform:scaleX(0);box-shadow:0 0 12px rgba(255,200,97,.7)}"
  +".tw.run .tw-rail i{animation:twFill 2.9s cubic-bezier(.4,.1,.3,1) forwards}"
  +".tw-dots{display:flex;gap:8px;direction:ltr}"
  +".tw-dots i{width:7px;height:7px;border-radius:50%;background:#FFC861;box-shadow:0 0 8px rgba(255,200,97,.8);animation:twDot 1.2s ease-in-out infinite}"
  +".tw-dots i:nth-child(2){animation-delay:.12s;background:#FFD98E}.tw-dots i:nth-child(3){animation-delay:.24s;background:#fff}.tw-dots i:nth-child(4){animation-delay:.36s;background:#7FE3D8}.tw-dots i:nth-child(5){animation-delay:.48s;background:#19C2AE;box-shadow:0 0 8px rgba(25,194,174,.8)}"
  +"@keyframes twDraw{to{-webkit-mask-position:0 0;mask-position:0 0}}"
  +"@keyframes twSym{from{transform:scale(.6) rotate(-14deg);opacity:0}60%{opacity:1}to{transform:none;opacity:1}}"
  +"@keyframes twWriteL{to{-webkit-mask-position:0 0;mask-position:0 0}}@keyframes twWriteR{to{-webkit-mask-position:100% 0;mask-position:100% 0}}"
  +"@keyframes twFromL{from{transform:translateX(-14%);opacity:0;filter:blur(6px)}to{transform:none;opacity:1;filter:none}}"
  +"@keyframes twFromR{from{transform:translateX(14%);opacity:0;filter:blur(6px)}to{transform:none;opacity:1;filter:none}}"
  +"@keyframes twLines{from{transform:scaleX(0);opacity:0}to{transform:none;opacity:1}}"
  +"@keyframes twUp{from{transform:translateY(14px);opacity:0}to{transform:none;opacity:1}}"
  +"@keyframes twSpread{from{letter-spacing:-.05em;opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}"
  +"@keyframes twSheen{0%{opacity:1;background-position:-150% 0}100%{opacity:1;background-position:250% 0}}"
  +"@keyframes twShim{to{background-position:-220% 0}}"
  +"@keyframes twFill{to{transform:scaleX(1)}}"
  +"@keyframes twDot{0%,100%{transform:translateY(0);opacity:.45}40%{transform:translateY(-8px);opacity:1}}"
  +"@keyframes twPulse{0%,100%{scale:1}50%{scale:1.05}}"
  +"@keyframes twSpin{to{rotate:360deg}}"
  +"@keyframes twIn{from{opacity:0;scale:.6}to{opacity:1;scale:1}}"
  +"@keyframes twRipple{from{opacity:.55;scale:.75}to{opacity:0;scale:1.7}}"
  +"@keyframes twAur{to{transform:rotate(360deg)}}"
  +"@keyframes twDrift{to{transform:translate(4vmax,-3vmax) scale(1.08)}}"
  +"@media (prefers-reduced-motion:reduce){.tw *,.tw.run *{animation-duration:.01ms!important;animation-iteration-count:1!important;animation-delay:0s!important}}";
  if(!document.querySelector('link[href$="splash.css"]')){ var tws=document.createElement('style'); tws.textContent=TWCSS; document.head.appendChild(tws); }
  var MINW=3000, waitAt=0, waitHide=0, waitOff=0, renderSeq=0, srcT=0;
  function waitShow(){ clearTimeout(waitHide); clearTimeout(waitOff); waitAt=Date.now(); /* الشاشة تبدأ من أسفل الجزء الظاهر من الشريط فقط — وإذا مُرِّر خارج الشاشة تملأ الشاشة كاملة */ var v=Math.max(0, Math.round(bar ? bar.getBoundingClientRect().bottom : 0))+'px'; wait.style.setProperty('--pvh',v); wait.hidden=false; wait.classList.remove('is-out','run'); void wait.offsetWidth; wait.classList.add('run'); }
  function waitDone(){ if(wait.hidden) return; clearTimeout(waitHide); waitHide=setTimeout(function(){ wait.classList.add('is-out'); waitOff=setTimeout(function(){ wait.hidden=true; wait.classList.remove('run') },460) }, Math.max(0, MINW-(Date.now()-waitAt))); }
  window.__teraWait={show:waitShow,done:waitDone};
  var ALIAS={'/p/dept/cat-1':'/store/cat/pkg','/p/dept/cat-2':'/store/cat/leg','/p/dept/cat-3':'/store/cat/dsn','/p/dept/cat-4':'/store/cat/tec','/p/dept/cat-5':'/store/cat/mob','/p/dept/cat-6':'/store/cat/tab','/p/dept/cat-7':'/store/cat/wat','/p/dept/cat-8':'/store/cat/aud','/p/dept/cat-9':'/store/cat/acc','/p/dept/custom':'/store/custom','/index':'/','/platform':'/','/p/about.html':'/p/about'};
  function phone(){var b=document.querySelector('.pv-bar button[data-dev].is-on'); return !!(b&&b.dataset.dev==='phone')}
  function b64gz(s){var bin=atob(s), u=new Uint8Array(bin.length); for(var i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'))).text().then(JSON.parse)}
  function script(src){return new Promise(function(ok,no){var s=document.createElement('script'); s.src=src; s.onload=ok; s.onerror=no; document.head.appendChild(s)})}
  function load(){
    if(loading) return loading;
    loading=new Promise(function(ok,no){ window.__TS_READY=function(){ b64gz(window.__TS_GZ).then(function(c){C=c; window.__TS_GZ=''; ok(c)},no) }; script('site/core.js').catch(no) });
    return loading;
  }
  var RAW={}, CH={};
  window.__TS_PPS=function(d){ for(var k in d) RAW[k]=d[k] };
  function product(sku){
    if(PP[sku]) return Promise.resolve(PP[sku]);
    var ck=(C.ppc||{})[sku]||'misc';
    if(!CH[ck]) CH[ck]=script('pp/'+ck+'.js').catch(function(){});
    return CH[ck].then(function(){ if(!RAW[sku]) return null; return b64gz(RAW[sku]).then(function(p){ PP[sku]=p; return p }) });
  }
  function norm(href){
    var h='', p=String(href||'/'), i=p.indexOf('#'); if(i>=0){h=p.slice(i+1); p=p.slice(0,i)}
    p=p.split('?')[0].replace(/\.html$/,'').replace(/\/+$/,'')||'/';
    if(ALIAS[p]) p=ALIAS[p];
    var focus='', m=p.match(/^\/product\/(.+)$/);
    if(m){ if(C.prods.indexOf(m[1])<0){ focus=m[1]; p='/p/products' } return {path:p,hash:h,focus:focus,sku:C.prods.indexOf(m[1])>=0?m[1]:''} }
    if(!C.pages[p]) p='/';
    return {path:p,hash:h,focus:focus};
  }
  function esc(s){return String(s).replace(/<\/script/gi,'<\\/script')}
  function js(v){return esc(JSON.stringify(v))}
  function dark(){ try{ var t=localStorage.getItem('tera-theme'); if(t) return t==='night' }catch(e){} return document.documentElement.classList.contains('pv-dark') }
  function build(r,pg,opening){
    var d=dark();
    var head='<!DOCTYPE html><html lang="ar" dir="rtl" class="'+(d?'is-dark':'')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="'+document.baseURI.replace(/"/g,'&quot;')+'"><title>'+pg.t+'</title>'+
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap">'+
      '<style>'+C.css+'</style><script>window.__PATH='+js(r.path)+';window.__HASH='+js(r.hash)+';window.__FOCUS='+js(r.focus)+';window.__GROUP='+js(pg.g||'')+';window.__DARK='+d+';window.__ICON='+js(C.icons)+';window.__FIND='+js(C.find)+';window.__OPT='+js(C.opt)+';<\/script></head><body>';
    var shell=C.shell.replace('@@ROOT@@',function(){return pg.h});
    var sideOpen=false; try{ sideOpen=localStorage.getItem('tera-side')==='open' }catch(e){}
    var cls='t2 t2-app is-guest'+(sideOpen?'':' is-side-min')+(d?' is-dark':'');
    shell=shell.replace('class="t2 t2-app is-guest is-side-min"',function(){return 'class="'+cls+'"'});
    return head+(opening?C.opening:'')+shell+'<script>'+esc(C.run)+'<\/script><script>try{parent.postMessage({tera:"ready"},"*")}catch(e){}<\/script></body></html>';
  }
  function render(href,opening){
    opening=false; first=false;
    waitShow();
    load().then(function(){
      var r=norm(href);
      var pr=r.sku?product(r.sku):Promise.resolve(C.pages[r.path]);
      return pr.then(function(pg){
        if(!pg){ r=norm('/p/products'); pg=C.pages['/p/products'] }
        cur=r; setBtn(r.path==='/login'?'portal':'home');
        var html=build(r,pg,opening), my=++renderSeq; clearTimeout(srcT);
        /* نترك لحركة الشعار ثانية كاملة قبل رسم الصفحة الثقيلة حتى لا تتقطّع */
        srcT=setTimeout(function(){ if(my===renderSeq) fr.srcdoc=html }, Math.max(0, 1000-(Date.now()-waitAt)));
      });
    }).catch(function(err){ waitDone(); console.error(err) });
  }
  fr.addEventListener('load',function(){ waitDone() });
  function setBtn(p){ page=p; document.querySelectorAll('.pv-bar button[data-page]').forEach(function(b){var on=b.dataset.page===p; if(b.classList.contains('is-on')!==on) b.classList.toggle('is-on',on)}) }
  function size(){ var v=(bar?bar.offsetHeight:44)+'px'; if(box.style.getPropertyValue('--pvh')!==v) box.style.setProperty('--pvh',v); var ph=phone(); if(box.classList.contains('is-phone')!==ph) box.classList.toggle('is-phone',ph) }
  function paint(opening){
    setBtn(page);
    var hh=page!=='app'; document.documentElement.classList.toggle('pv-on-site',hh); if(host.hidden!==hh) host.hidden=hh; if(box.hidden!==!hh) box.hidden=!hh;
    if(page!=='app'){ size(); var target=page==='portal'?'/login':(cur.path==='/login'?'/':(cur.sku?'/product/'+cur.sku:cur.path)+(cur.hash?'#'+cur.hash:'')); if(window.scrollY) window.scrollTo(0,0); render(target,opening) }
    else { waitShow(); waitDone() }
  }
  function setPage(p){ if(LINKS[p]){ location.href=LINKS[p]; return } if(p==='home') cur={path:'/',hash:''}; page=p; paint(true) }
  document.querySelectorAll('.pv-bar button[data-page]').forEach(function(b){b.addEventListener('click',function(){setPage(b.dataset.page)})});
  document.querySelectorAll('.pv-bar button[data-dev]').forEach(function(b){b.addEventListener('click',function(){ if(page!=='app') setTimeout(function(){paint(false)},0) })});
  document.querySelectorAll('.pv-bar button[data-role]').forEach(function(b){b.addEventListener('click',function(){ if(page!=='app') setPage('app') })});
  window.addEventListener('message',function(e){
    if(e.source!==fr.contentWindow) return; var d=e.data||{};
    if(d.tera==='ready') waitDone();
    else if(d.tera==='enter'){ if(LINKS.app){ location.href=LINKS.app; return } setPage('app'); try{ if(window.__teraApp) window.__teraApp.home() }catch(err){} }
    else if(d.tera==='elig') setPage('app');
    else if(d.tera==='nav') render(d.path,false);
  });
  document.addEventListener('click',function(e){ var b=e.target.closest&&e.target.closest('.ov button'); if(b && b.textContent.trim()==='تسجيل الدخول') setTimeout(function(){setPage('portal')},0) },true);
  window.addEventListener('resize',function(){ if(page!=='app') size() });
  try{ localStorage.removeItem('tera-preview-page') }catch(err){}
  window.__teraSite={setPage:setPage,go:function(h){render(h,false)}};
  paint(false);
  /* سلامة العرض: إن بقي محتوى المنصة بلا رسم بعد التحميل، أنهِ حركات الظهور */
  setTimeout(function(){ try{ document.getAnimations().forEach(function(a){ var t=a.effect&&a.effect.getTiming&&a.effect.getTiming(); if(t&&t.iterations!==Infinity&&a.playState!=='finished'&&a.currentTime<50) a.finish() }) }catch(e){} },2500);
})();
