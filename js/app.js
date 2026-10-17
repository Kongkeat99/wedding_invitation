var $=function(i){return document.getElementById(i)};
["n1","cn1"].forEach(function(i){$(i).textContent=CONFIG.groom});
["n2","cn2"].forEach(function(i){$(i).textContent=CONFIG.bride});
/* wedding date: owner's saved date (setup mode) > CONFIG.date */
function getDate(){var o="";try{o=localStorage.getItem("cdate")||""}catch(e){}return o&&!isNaN(new Date(o))?o:CONFIG.date}
var WD=getDate();
function kd(n){return String(n).replace(/\d/g,function(c){return "០១២៣៤៥៦៧៨៩".charAt(c)})}
function khDate(t){var c=new Date(t.getTime()+7*3600000),
  wd=["អាទិត្យ","ច័ន្ទ","អង្គារ","ពុធ","ព្រហស្បតិ៍","សុក្រ","សៅរ៍"],
  mo=["មករា","កុម្ភៈ","មីនា","មេសា","ឧសភា","មិថុនា","កក្កដា","សីហា","កញ្ញា","តុលា","វិច្ឆិកា","ធ្នូ"],
  H=c.getUTCHours(),M=c.getUTCMinutes(),h12=H%12||12,tm=kd(h12)+(M?":"+kd(("0"+M).slice(-2)):"")+" "+(H<12?"ព្រឹក":"ល្ងាច");
  return "ថ្ងៃ"+wd[c.getUTCDay()]+" ទី"+kd(c.getUTCDate())+" ខែ"+mo[c.getUTCMonth()]+" ឆ្នាំ"+kd(c.getUTCFullYear())+"\nម៉ោង "+tm}
$("dateTxt").textContent=khDate(new Date(WD));
$("venue").textContent=CONFIG.venue;
$("mapBtn").href=CONFIG.mapUrl;
var ic=["🙏","🎁","💍","🍽️","🌙"];
$("prog").innerHTML='<div class="tl">'+CONFIG.program.map(function(p,i){return '<div class="ti"><div class="td">'+(ic[i]||"✦")+'</div><div class="tt"><b>'+p[0]+'</b><span>'+p[1]+'</span></div></div>'}).join("")+'</div>';

/* countdown */
var cdEls=null;
function p2(n){return n<10?"0"+n:""+n}
function tick(){
  var diff=new Date(WD)-new Date(),done=diff<=0,d=done?0:diff;
  var v=[[86400000,"ថ្ងៃ",0],[3600000,"ម៉ោង",1],[60000,"នាទី",1],[1000,"វិនាទី",1]];
  var vals=v.map(function(x){var n=Math.floor(d/x[0]);d-=n*x[0];return x[2]?p2(n):""+n});
  if(!cdEls){$("cd").innerHTML=v.map(function(x){return '<div><b></b><span>'+x[1]+'</span></div>'}).join("");cdEls=$("cd").querySelectorAll("b")}
  vals.forEach(function(t,i){var e=cdEls[i];if(e.textContent!==t){var first=e.textContent==="";e.textContent=t;if(!first){e.classList.remove("fl");void e.offsetWidth;e.classList.add("fl")}}});
  $("cdLbl").hidden=done;
  $("cdMsg").textContent=done?(-diff<86400000?"🎉 ថ្ងៃនេះជាថ្ងៃមង្គលការរបស់យើងខ្ញុំ!":"សូមអរគុណចំពោះការចូលរួម និងក្តីស្រឡាញ់ពីលោកអ្នក 💛"):"";
}
tick();setInterval(tick,1000);

/* gallery: 15 photos */
var g=$("grid");
for(var i=1;i<=15;i++){(function(i){
  var s=document.createElement("label");s.className="ph";s.textContent="📷 "+i;
  var f=document.createElement("input");f.type="file";f.accept="image/*";f.hidden=true;
  f.onchange=function(){var r=new FileReader();r.onload=function(){s.innerHTML='<img alt="photo '+i+'" src="'+r.result+'">'};if(f.files[0])r.readAsDataURL(f.files[0])};
  s.appendChild(f);g.appendChild(s);
})(i)}

/* 2 videos */
for(var j=1;j<=2;j++){(function(j){
  var b=document.createElement("label");b.className="vid";b.textContent="🎬 Video "+j;
  var f=document.createElement("input");f.type="file";f.accept="video/*";f.hidden=true;
  f.onchange=function(){if(!f.files[0])return;b.innerHTML='<video controls playsinline src="'+URL.createObjectURL(f.files[0])+'"></video>'};
  b.appendChild(f);$("vids").appendChild(b);
})(j)}

/* QR code for the map link */
try{new QRCode($("qr"),{text:CONFIG.mapUrl,width:170,height:170,colorDark:"#6e5c12",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M})}
catch(e){$("qr").textContent=CONFIG.mapUrl}

/* personal guest links: ?to=Name */
var base=location.href.split("?")[0].split("#")[0];
var to=new URLSearchParams(location.search).get("to");
if(to){$("guestName").textContent=to;$("heroGuestName").textContent=to;$("heroGuest").hidden=false}

/* ===== guest features ===== */
function copyTxt(t,done){
  function fb(){var ta=document.createElement("textarea");ta.value=t;ta.style.cssText="position:fixed;opacity:0;top:0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");done&&done()}catch(e){}ta.remove()}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){done&&done()},fb)}else fb()}
function flash(b,txt){var o=b.dataset.o||b.textContent;b.dataset.o=o;b.textContent=txt;setTimeout(function(){b.textContent=o},1800)}

/* live stream (optional) */
if(CONFIG.live){$("liveBtn").href=CONFIG.live;$("liveBtn").hidden=false}

/* owner setup panel: open the page with ?setup */
if(new URLSearchParams(location.search).has("setup")){
  var pn=$("setup"),ov=false;pn.hidden=false;
  try{ov=!!localStorage.getItem("cdate")}catch(e){}
  $("sd").value=new Date(new Date(WD).getTime()+7*3600000).toISOString().slice(0,16);
  $("sInfo").textContent=ov?"Showing the date saved in THIS browser only. Guests see CONFIG.date until you paste the copied line into CONFIG in the file.":"Showing CONFIG.date (what guests see).";
  $("sSave").onclick=function(){if(!$("sd").value)return;try{localStorage.setItem("cdate",$("sd").value+":00+07:00")}catch(e){}location.reload()};
  $("sReset").onclick=function(){try{localStorage.removeItem("cdate")}catch(e){}location.reload()};
  $("sCopy").onclick=function(){var b=this;copyTxt('date: "'+$("sd").value+':00+07:00",',function(){flash(b,"✓ Copied")})};
  $("sX").onclick=function(){pn.hidden=true};
  /* guest-link tool: names -> personal links -> send by Telegram / WhatsApp / SMS */
  var DM="សូមគោរពអញ្ជើញ {name} ចូលរួមពិធីមង្គលការរបស់ {couple} 💛 សូមបើកសំបុត្រអញ្ជើញតាម Link នេះ៖ {link}",sent={};
  try{sent=JSON.parse(localStorage.getItem("gsent")||"{}");$("gnames").value=localStorage.getItem("glist")||""}catch(e){}
  $("gbase").value=base;$("gmsg").value=DM;
  function enc(t){return encodeURIComponent(t)}
  function gl(n){return $("gbase").value.trim().replace(/[?#].*$/,"")+"?to="+enc(n)}
  function gm(n,withLink){return $("gmsg").value.replace(/\{name\}/g,n).replace(/\{couple\}/g,CONFIG.groom+" & "+CONFIG.bride).replace(/\{link\}/g,withLink===false?"":gl(n)).trim()}
  function gnames(){return $("gnames").value.split("\n").map(function(x){return x.trim()}).filter(function(x,i,a){return x&&a.indexOf(x)===i})}
  function mk(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt)e.textContent=txt;return e}
  function gen(){
    var L=$("gList");L.innerHTML="";try{localStorage.setItem("glist",$("gnames").value)}catch(e){}
    gnames().forEach(function(n){
      var r=mk("div","gr"+(sent[n]?" sent":"")),mark=function(){sent[n]=1;r.classList.add("sent");try{localStorage.setItem("gsent",JSON.stringify(sent))}catch(e){}};
      r.appendChild(mk("b","",n));
      var cp=mk("button","btn alt sm","Copy link");cp.type="button";cp.onclick=function(){copyTxt(gm(n),function(){flash(cp,"✓ Copied");mark()})};r.appendChild(cp);
      [["Telegram","https://t.me/share/url?url="+enc(gl(n))+"&text="+enc(gm(n,false).replace(/[៖:]\s*$/,""))],["WhatsApp","https://wa.me/?text="+enc(gm(n))],["SMS","sms:?&body="+enc(gm(n))]].forEach(function(x){
        var a=mk("a","btn sm",x[0]);a.href=x[1];a.target="_blank";a.rel="noopener";a.onclick=mark;r.appendChild(a)});
      L.appendChild(r)});
    if(!L.children.length)L.appendChild(mk("p","hint","Add names above, then press Make links."))}
  $("sGuests").onclick=function(){$("gp").hidden=false;gen()};
  $("gX").onclick=function(){$("gp").hidden=true};
  $("gGen").onclick=gen;
  $("gCsv").onclick=function(){var b=this;copyTxt("name,link\n"+gnames().map(function(n){return '"'+n.replace(/"/g,'""')+'",'+gl(n)}).join("\n"),function(){flash(b,"✓ Copied")})};
  $("gQr").onclick=function(){var q=$("gQrBox");q.innerHTML="";
    try{new QRCode(q,{text:$("gbase").value.trim(),width:200,height:200,colorDark:"#3a3010",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M})}catch(e){q.textContent="QR library not loaded (needs internet)"}
    q.appendChild(mk("p","hint","Print this on the physical card or the gate banner — anyone can scan it to open the invitation."))};
}

/* ===== beauty pack ===== */
var dc=CONFIG.dress;
if(dc&&dc.colors&&dc.colors.length){$("dtxt").textContent=dc.text||"";dc.colors.forEach(function(c){var i=document.createElement("span");i.className="sw";i.style.background=c;i.title=c;$("sws").appendChild(i)})}
else $("s-dress").hidden=true;
var sy=$("story");
(CONFIG.story||[]).forEach(function(e){var d=document.createElement("div");d.className="st";
  var a=document.createElement("small");a.textContent=e.date||"";var h=document.createElement("h3");h.textContent=e.title||"";
  var p=document.createElement("p");p.textContent=e.text||"";d.appendChild(a);d.appendChild(h);d.appendChild(p);sy.appendChild(d)});
if(!sy.children.length)$("s-story").hidden=true;

var ph=CONFIG.photos||[],li=0;
function openLb(i){li=(i+ph.length)%ph.length;$("lbi").src=ph[li];$("lb").hidden=false}
if(ph.length){g.innerHTML="";ph.forEach(function(u,i){var im=document.createElement("img");im.src=u;im.alt="photo "+(i+1);im.loading="lazy";im.className="ph";im.onclick=function(){openLb(i)};g.appendChild(im)});
  var hn=document.querySelector("#s-photo .hint");if(hn)hn.hidden=true}
$("lbx").onclick=function(){$("lb").hidden=true};$("lbp").onclick=function(){openLb(li-1)};$("lbn").onclick=function(){openLb(li+1)};
$("lb").onclick=function(e){if(e.target===this)this.hidden=true};
var tx=0;$("lb").addEventListener("touchstart",function(e){tx=e.touches[0].clientX},{passive:true});
$("lb").addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)openLb(li+(dx<0?1:-1))});
document.addEventListener("keydown",function(e){if($("lb").hidden)return;
  if(e.key==="Escape")$("lb").hidden=true;if(e.key==="ArrowRight")openLb(li+1);if(e.key==="ArrowLeft")openLb(li-1)});

if(!(window.CSS&&CSS.supports("animation-timeline","scroll()")))window.addEventListener("scroll",function(){var h=document.documentElement.scrollHeight-innerHeight;$("bar").style.width=(h>0?scrollY/h*100:0)+"%"},{passive:true});

function confetti(){if(navigator.vibrate)navigator.vibrate([30,40,30]);var c=["#b39b36","#d8c068","#f3e3a0","#ffffff"];
  for(var i=0;i<40;i++){var e=document.createElement("i");e.className="cf";
    e.style.cssText="left:"+(Math.random()*100)+"vw;background:"+c[i%4]+";animation-duration:"+(1.6+Math.random()*1.6)+"s;animation-delay:"+(Math.random()*.4)+"s";
    document.body.appendChild(e);setTimeout(function(x){x.remove()},3800,e)}}

var thm=$("thm"),root=document.documentElement;
function isDark(){var a=root.getAttribute("data-theme");return a?a==="dark":matchMedia("(prefers-color-scheme:dark)").matches}
function setTheme(t){root.setAttribute("data-theme",t);thm.textContent=t==="dark"?"☀":"🌙";try{localStorage.setItem("theme",t)}catch(e){}}
thm.onclick=function(){
  var t=isDark()?"light":"dark";
  if(!document.startViewTransition||matchMedia("(prefers-reduced-motion:reduce)").matches){setTheme(t);return}
  var r=thm.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,R=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  document.startViewTransition(function(){setTheme(t)}).ready.then(function(){
    document.documentElement.animate({clipPath:["circle(0px at "+x+"px "+y+"px)","circle("+R+"px at "+x+"px "+y+"px)"]},{duration:650,easing:"ease-in-out",pseudoElement:"::view-transition-new(root)"})})};
try{var sv=localStorage.getItem("theme");if(sv)setTheme(sv);else thm.textContent=isDark()?"☀":"🌙"}catch(e){thm.textContent=isDark()?"☀":"🌙"}

/* ===== magic pack ===== */
/* monogram preloader */
$("pm").textContent=(CONFIG.groom||"").charAt(0)+" & "+(CONFIG.bride||"").charAt(0);
var t0=Date.now();
function hidePre(){setTimeout(function(){$("pre").classList.add("gone")},Math.max(0,1500-(Date.now()-t0)))}
if(document.readyState==="complete")hidePre();else{addEventListener("load",hidePre);setTimeout(hidePre,3500)}

/* lotus flourish in the footer too */
var lt=document.querySelector("#hero .lotus").cloneNode(true),fo=document.querySelector("footer");fo.insertBefore(lt,fo.firstChild);

/* gold-dust cursor trail + heart bursts on tap */
if(!matchMedia("(prefers-reduced-motion:reduce)").matches){
  var cv=$("fx"),cx=cv.getContext("2d"),ps=[],raf=0,dpr=Math.min(devicePixelRatio||1,2),lastT=0;
  function fit(){cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}
  fit();addEventListener("resize",fit);
  function add(x,y,h){
    var a=Math.random()*6.283,v=h?1.5+Math.random()*3:.3+Math.random()*1.2,gold=["#b39b36","#d8c068","#e8c75a","#c9a44a"];
    ps.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-(h?2:.3),l:1,h:h,s:h?10+Math.random()*12:3+Math.random()*4,r:Math.random()*3,
      c:$("cover").classList.contains("open")?gold[Math.random()*4|0]:"#ffffff"});
    if(!raf)raf=requestAnimationFrame(loop)}
  function star(sz){cx.beginPath();cx.moveTo(0,-sz);cx.lineTo(sz*.3,0);cx.lineTo(0,sz);cx.lineTo(-sz*.3,0);cx.closePath();cx.fill()}
  function loop(){
    cx.clearRect(0,0,innerWidth,innerHeight);
    ps=ps.filter(function(p){
      p.x+=p.vx;p.y+=p.vy;p.vy+=p.h?.08:.02;p.l-=p.h?.016:.03;if(p.l<=0)return false;
      cx.globalAlpha=p.l;cx.fillStyle=p.c;
      if(p.h){cx.font=p.s+"px serif";cx.fillText("♥",p.x,p.y)}
      else{cx.save();cx.translate(p.x,p.y);cx.rotate(p.r+=.08);star(p.s);cx.rotate(1.5708);star(p.s);cx.restore()}
      return true});
    cx.globalAlpha=1;raf=ps.length?requestAnimationFrame(loop):0}
  addEventListener("pointermove",function(e){if(e.pointerType==="touch")return;var n=Date.now();if(n-lastT<30)return;lastT=n;add(e.clientX,e.clientY,false)});
  addEventListener("click",function(e){if(e.target.closest("a,button,input,textarea,select,label,#lb"))return;for(var i=0;i<14;i++)add(e.clientX,e.clientY,true)});
}

/* gold ripple on buttons */
document.addEventListener("click",function(e){
  var b=e.target.closest(".btn,.seg button");if(!b)return;
  var r=b.getBoundingClientRect(),d=Math.max(r.width,r.height),sp=document.createElement("span");
  sp.className="rp";sp.style.cssText="width:"+d+"px;height:"+d+"px;left:"+(e.clientX-r.left-d/2)+"px;top:"+(e.clientY-r.top-d/2)+"px";
  b.appendChild(sp);setTimeout(function(){sp.remove()},650)});

/* quote types itself out (grapheme-safe for Khmer) */
var qt=document.querySelector(".quote");
if(qt&&"IntersectionObserver" in window&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
  var full=qt.textContent,seg=(window.Intl&&Intl.Segmenter)?Array.from(new Intl.Segmenter("km",{granularity:"grapheme"}).segment(full),function(x){return x.segment}):Array.from(full);
  qt.style.minHeight=qt.offsetHeight+"px";qt.textContent="";
  var qo=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;qo.disconnect();var i=0;
    (function step(){qt.textContent=seg.slice(0,++i).join("");if(i<seg.length)setTimeout(step,38)})()},{threshold:.6});
  qo.observe(qt)}

/* 3D tilt on the envelope (pointer + phone gyro) */
var ev=document.querySelector("#cover .env");
function tilt(x,y){ev.style.transform="perspective(700px) rotateY("+(x*12).toFixed(1)+"deg) rotateX("+(-y*10).toFixed(1)+"deg)"}
if(!matchMedia("(prefers-reduced-motion:reduce)").matches){
  $("cover").addEventListener("pointermove",function(e){tilt((e.clientX/innerWidth-.5)*2,(e.clientY/innerHeight-.5)*2)});
  window.addEventListener("deviceorientation",function(e){if(e.gamma==null||$("cover").classList.contains("open"))return;
    tilt(Math.max(-1,Math.min(1,e.gamma/30)),Math.max(-1,Math.min(1,(e.beta-45)/30)))})}
$("openBtn").addEventListener("click",function(){if(navigator.vibrate)navigator.vibrate(25)});
document.querySelector("#cover .env").addEventListener("click",function(e){if(e.target===$("openBtn")||$("cover").classList.contains("unseal"))return;$("openBtn").click()});

/* nav scroll-spy */
var nv=$("nav"),nl=[].slice.call(nv.querySelectorAll("a"));
if("IntersectionObserver" in window){
  var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;
    nl.forEach(function(a){var on=a.getAttribute("href")==="#"+e.target.id;a.classList.toggle("on",on);
      if(on)nv.scrollTo({left:a.offsetLeft-nv.clientWidth/2+a.clientWidth/2,behavior:"smooth"})})})},{rootMargin:"-45% 0px -50% 0px"});
  nl.forEach(function(a){var t=document.querySelector(a.getAttribute("href"));if(t)spy.observe(t)})}

/* scroll reveal + falling petals */
var secs=document.querySelectorAll("section:not(#hero)");
if("IntersectionObserver" in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
  Array.prototype.forEach.call(secs,function(x){x.classList.add("rv");io.observe(x)})}
var pt=$("petals");for(var q=0;q<14;q++){var pi=document.createElement("i");
  pi.style.left=(Math.random()*100)+"%";pi.style.animationDuration=(9+Math.random()*9)+"s";pi.style.animationDelay=(-Math.random()*14)+"s";
  pi.style.transform="scale("+(.6+Math.random()*.8)+")";pt.appendChild(pi)}

/* music: built-in soft melody, or CONFIG.musicUrl */
var ac,playing=false,timer,au,ti=0;
var notes=[392,440,523,440,392,330,392,294,330,392,523,659,587,523,440,392];
function label(t){$("mtl").textContent="♪ "+t;$("mtl").classList.add("on");setTimeout(function(){$("mtl").classList.remove("on")},4000)}
function melody(){
  var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  ac=ac||new AC();if(ac.state==="suspended")ac.resume();
  var k=0;function note(){
    var o=ac.createOscillator(),gn=ac.createGain(),t=ac.currentTime;
    o.type="sine";o.frequency.value=notes[k++%notes.length];
    gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(.07,t+.05);gn.gain.exponentialRampToValueAtTime(.0001,t+1.3);
    o.connect(gn);gn.connect(ac.destination);o.start(t);o.stop(t+1.4)}
  note();timer=setInterval(note,650);
}
function startMusic(){
  var pl=CONFIG.playlist||[],tr=pl[ti%(pl.length||1)];
  playing=true;$("mus").classList.add("eq");
  var u=tr&&tr.url;
  if(u){
    if(!au){au=new Audio();au.addEventListener("ended",function(){ti++;startMusic()});
      au.addEventListener("error",function(){clearInterval(timer);melody()})}
    au.src=u;au.play().catch(function(){});label(tr.title);return}
  label(tr?tr.title:"Wedding Melody");melody();
}
function stopMusic(){if(au)au.pause();clearInterval(timer);playing=false;$("mus").classList.remove("eq")}
$("mus").onclick=function(){playing?stopMusic():startMusic();this.style.opacity=playing?1:.5};
$("openBtn").addEventListener("click",function(){$("cover").classList.add("unseal");setTimeout(function(){$("cover").classList.add("open");document.body.classList.add("go")},900);try{startMusic()}catch(e){}});
