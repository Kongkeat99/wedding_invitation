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

/* gallery: photos come from CONFIG.photos (built further below) */
var g=$("grid");

function mountVideo(b,src,n){
  var stage=document.createElement("div");stage.className="video-frame";
  var v=document.createElement("video");v.playsInline=true;v.setAttribute("playsinline","");v.preload="metadata";
  v.poster=src.replace(/\.[^./]+$/,".jpg");v.dataset.src=src;v.setAttribute("aria-label","Pre-wedding video "+n);
  var playOverlay=document.createElement("button");playOverlay.type="button";playOverlay.className="video-play";playOverlay.setAttribute("aria-label","Play pre-wedding video");
  playOverlay.innerHTML='<span aria-hidden="true">▶</span>';
  var controls=document.createElement("div");controls.className="video-controls";controls.setAttribute("role","group");controls.setAttribute("aria-label","Video controls");
  var icons={
    play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>',
    pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>',
    mute:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4zM17 9l5 6m0-6-5 6"/></svg>',
    fullscreen:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3"/></svg>'
  };
  var toggle=document.createElement("button");toggle.type="button";toggle.className="video-control video-toggle";toggle.setAttribute("aria-label","Play video");toggle.innerHTML=icons.play;
  var progress=document.createElement("input");progress.className="video-progress";progress.type="range";progress.min="0";progress.max="1000";progress.value="0";progress.setAttribute("aria-label","Video progress");
  var time=document.createElement("span");time.className="video-time";time.textContent="0:00 / 0:00";
  var audio=document.createElement("button");audio.type="button";audio.className="video-control video-audio";audio.disabled=true;audio.setAttribute("aria-label","This video has no audio");audio.title="No audio track";audio.innerHTML=icons.mute;
  var fullscreen=document.createElement("button");fullscreen.type="button";fullscreen.className="video-control video-fullscreen";fullscreen.setAttribute("aria-label","Enter fullscreen");fullscreen.innerHTML=icons.fullscreen;
  var hideTimer=null;
  function showControls(){
    stage.classList.add("controls-visible");clearTimeout(hideTimer);
    if(!v.paused&&!v.ended)hideTimer=setTimeout(function(){stage.classList.remove("controls-visible")},2500)
  }
  function formatTime(seconds){
    if(!isFinite(seconds)||seconds<0)return "0:00";
    var mins=Math.floor(seconds/60),secs=Math.floor(seconds%60);
    return mins+":"+(secs<10?"0":"")+secs
  }
  var play=function(){
    if(!v.src){v.src=v.dataset.src;v.load()}
    var result=v.play();
    if(result&&result.catch)result.catch(function(){stage.classList.remove("is-playing");playOverlay.disabled=false;playOverlay.setAttribute("aria-hidden","false");toggle.innerHTML=icons.play;toggle.setAttribute("aria-label","Play video")})
  };
  playOverlay.addEventListener("click",play);
  toggle.addEventListener("click",function(){if(v.paused||v.ended)play();else v.pause();showControls()});
  v.addEventListener("play",function(){stage.classList.add("is-playing");playOverlay.disabled=true;playOverlay.setAttribute("aria-hidden","true");toggle.innerHTML=icons.pause;toggle.setAttribute("aria-label","Pause video");showControls()});
  function showPlay(){stage.classList.remove("is-playing");playOverlay.disabled=false;playOverlay.setAttribute("aria-hidden","false");toggle.innerHTML=icons.play;toggle.setAttribute("aria-label","Play video");stage.classList.add("controls-visible");clearTimeout(hideTimer)}
  v.addEventListener("pause",showPlay);v.addEventListener("ended",showPlay);
  function updateProgress(){
    var ratio=v.duration?Math.min(1,v.currentTime/v.duration):0;
    progress.value=String(Math.round(ratio*1000));progress.style.setProperty("--progress",ratio*100+"%");
    time.textContent=formatTime(v.currentTime)+" / "+formatTime(v.duration)
  }
  v.addEventListener("timeupdate",updateProgress);v.addEventListener("durationchange",updateProgress);
  progress.addEventListener("input",function(){if(v.duration)v.currentTime=v.duration*Number(progress.value)/1000;showControls()});
  fullscreen.addEventListener("click",function(){
    if(document.fullscreenElement){document.exitFullscreen();return}
    if(stage.requestFullscreen)stage.requestFullscreen();
    else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen()
  });
  stage.addEventListener("pointermove",showControls);
  stage.addEventListener("pointerleave",function(){if(!v.paused&&!v.ended)hideTimer=setTimeout(function(){stage.classList.remove("controls-visible")},2500)});
  stage.addEventListener("click",function(e){if(v.paused||e.target.closest("button,.video-controls"))return;showControls()});
  controls.appendChild(toggle);controls.appendChild(progress);controls.appendChild(time);controls.appendChild(audio);controls.appendChild(fullscreen);
  stage.appendChild(v);stage.appendChild(playOverlay);stage.appendChild(controls);
  b.appendChild(stage);
  b.video=v;b.playVideo=play
}
(CONFIG.videos||[]).forEach(function(src,k){
  var b=document.createElement("div");b.className="vid video-card pre has";b.style.setProperty("--d",k*.25+"s");
  mountVideo(b,src,k+1);$("vids").appendChild(b)});
if(!$("vids").children.length)$("vids").parentNode.hidden=true;
/* Load video metadata near the viewport and pause when it is no longer visible. */
(function(){
  var vs=Array.prototype.slice.call($("vids").children);
  function pauseAll(){vs.forEach(function(card){if(card.video&&!card.video.paused)card.video.pause()})}
  if(!("IntersectionObserver" in window)){
    vs.forEach(function(card){card.classList.remove("pre");card.video.src=card.video.dataset.src;card.video.load()});
  }else{
    var reveal=new IntersectionObserver(function(entries,observer){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.remove("pre");observer.unobserve(e.target)}})},{threshold:.12});
    var visibleCards=[];
    var media=new IntersectionObserver(function(entries){entries.forEach(function(e){
      var video=e.target.video;
      if(e.isIntersecting){
        if(visibleCards.indexOf(e.target)<0)visibleCards.push(e.target);
        if(!video.src){video.src=video.dataset.src;video.load()}
      }else{
        visibleCards=visibleCards.filter(function(card){return card!==e.target});
        if(video&&!video.paused)video.pause()
      }
      document.body.classList.toggle("video-section-active",visibleCards.length>0)
    })},{threshold:.15});
    vs.forEach(function(card){reveal.observe(card);media.observe(card)})
  }
  document.addEventListener("visibilitychange",function(){if(document.hidden)pauseAll()});
})();

/* QR code for the map link */
try{new QRCode($("qr"),{text:CONFIG.mapUrl,width:170,height:170,colorDark:"#6e5c12",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M})}
catch(e){$("qr").textContent=CONFIG.mapUrl}

/* personal guest links: ?to=Name */
var base=location.href.split("?")[0].split("#")[0];
var qp=new URLSearchParams(location.search),to=qp.get("to")||qp.get("name")||qp.get("guest")||qp.get("")||"";
if(!to){qp.forEach(function(v,k){if(!to&&v&&k!=="setup")to=v})}
if(/^\?=/.test(location.search)){var rw=location.search.slice(2).split("#")[0];try{rw=decodeURIComponent(rw.replace(/\+/g," "))}catch(e){rw=rw.replace(/\+/g," ")}to=rw.replace(/_/g," ").replace(/\s+/g," ").trim()||to}
/* short links: ?g=<base64url of the name> (made by the guest-link tool; the older ?=Name links still work) */
var gq=qp.get("g");
if(gq&&CONFIG.guests&&CONFIG.guests[gq.toLowerCase()])to=CONFIG.guests[gq.toLowerCase()];
else if(gq){try{to=new TextDecoder().decode(Uint8Array.from(atob(gq.replace(/-/g,"+").replace(/_/g,"/")),function(c){return c.charCodeAt(0)}))}catch(e){to=""}}
if(to){$("guestName").textContent=to;$("heroGuestName").textContent=to;$("heroGuest").hidden=false}

/* Splash language toggle changes only the first-page copy. */
var splashLanguage=$("splashLanguage");
if(splashLanguage)splashLanguage.addEventListener("click",function(){
  var language=this.dataset.language==="km"?"en":"km";
  this.dataset.language=language;this.textContent=language==="km"?"EN":"ខ្មែរ";
  this.setAttribute("aria-label",language==="km"?"Switch to English":"ប្ដូរទៅភាសាខ្មែរ");
  document.querySelectorAll("#cover [data-km][data-en]").forEach(function(element){element.textContent=element.getAttribute("data-"+language)});
  $("cover").lang=language;
  $("coverCta").setAttribute("aria-label",language==="km"?"ចុចលើសំបុត្រ ដើម្បីបើក":"Tap the envelope to open")
});

/* ===== guest features ===== */
function copyTxt(t,done){
  function fb(){var ta=document.createElement("textarea");ta.value=t;ta.style.cssText="position:fixed;opacity:0;top:0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");done&&done()}catch(e){}ta.remove()}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){done&&done()},fb)}else fb()}
function flash(b,txt){var o=b.dataset.o||b.textContent;b.dataset.o=o;b.textContent=txt;setTimeout(function(){b.textContent=o},1800)}

/* guest album page: keep the personal guest link when opening it */
$("albumLink").href="album.html"+location.search;

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
  function b64u(t){var s="";new TextEncoder().encode(t).forEach(function(c){s+=String.fromCharCode(c)});return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
  function gl(n){var u=$("gbase").value.trim().replace(/[?#].*$/,"");if(codeOf[n])return u+"?g="+codeOf[n];return $("gshort").checked?u+"?g="+b64u(n):u+"?="+enc(n)}
  function esc(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
  /* message where the link is hidden behind clickable text (rich text clipboard) */
  function gmRich(n){
    var t=$("gmsg").value.replace(/\{name\}/g,n).replace(/\{couple\}/g,CONFIG.groom+" & "+CONFIG.bride).trim(),
        parts=t.indexOf("{link}")<0?[t+"\n",""]:t.split("{link}"),
        txt=$("glt").value.trim()||"Open the invitation",url=gl(n);
    return {html:"<div>"+parts.map(esc).join('<a href="'+esc(url)+'">'+esc(txt)+'</a>').replace(/\n/g,"<br>")+"</div>",plain:parts.join(url)}}
  function copyRich(o,done){
    try{if(window.ClipboardItem&&navigator.clipboard&&navigator.clipboard.write){
      navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([o.html],{type:"text/html"}),"text/plain":new Blob([o.plain],{type:"text/plain"})})]).then(done,function(){copyTxt(o.plain,done)});return}}catch(e){}
    copyTxt(o.plain,done)}
  function gm(n,withLink){return $("gmsg").value.replace(/\{name\}/g,n).replace(/\{couple\}/g,CONFIG.groom+" & "+CONFIG.bride).replace(/\{link\}/g,withLink===false?"":gl(n)).trim()}
  /* a line can be "code = Full name" -> link ?g=code (very short; needs the snippet in config.js) */
  var codeOf={};
  function gnames(){codeOf={};return $("gnames").value.split("\n").map(function(x){x=x.trim();
      var m=x.match(/^([A-Za-z0-9_-]{1,24})\s*=\s*(.+)$/);if(m){codeOf[m[2].trim()]=m[1].toLowerCase();return m[2].trim()}return x}).filter(function(x,i,a){return x&&a.indexOf(x)===i})}
  function mk(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt)e.textContent=txt;return e}
  function gen(){
    var L=$("gList");L.innerHTML="";try{localStorage.setItem("glist",$("gnames").value)}catch(e){}
    var names=gnames(),codes=Object.keys(codeOf);
    $("gSnipBox").hidden=!codes.length;
    $("gSnip").value=codes.map(function(n){return '    '+JSON.stringify(codeOf[n])+': '+JSON.stringify(n)}).join(",\n");
    names.forEach(function(n){
      var r=mk("div","gr"+(sent[n]?" sent":"")),mark=function(){sent[n]=1;r.classList.add("sent");try{localStorage.setItem("gsent",JSON.stringify(sent))}catch(e){}};
      r.appendChild(mk("b","",n));
      var cp=mk("button","btn alt sm","Copy link");cp.type="button";cp.onclick=function(){copyTxt(gm(n),function(){flash(cp,"✓ Copied");mark()})};r.appendChild(cp);
      var cr=mk("button","btn alt sm","Copy clickable");cr.type="button";cr.onclick=function(){copyRich(gmRich(n),function(){flash(cr,"✓ Copied");mark()})};r.appendChild(cr);
      [["Telegram","https://t.me/share/url?url="+enc(gl(n))+"&text="+enc(gm(n,false).replace(/[៖:]\s*$/,""))],["WhatsApp","https://wa.me/?text="+enc(gm(n))],["SMS","sms:?&body="+enc(gm(n))]].forEach(function(x){
        var a=mk("a","btn sm",x[0]);a.href=x[1];a.target="_blank";a.rel="noopener";a.onclick=mark;r.appendChild(a)});
      L.appendChild(r)});
    if(!L.children.length)L.appendChild(mk("p","hint","Add names above, then press Make links."))}
  $("sGuests").onclick=function(){$("gp").hidden=false;gen()};
  $("gX").onclick=function(){$("gp").hidden=true};
  $("gSnipCopy").onclick=function(){var b=this;copyTxt($("gSnip").value,function(){flash(b,"✓ Copied")})};
  $("gGen").onclick=gen;$("gshort").onchange=gen;$("glt").onchange=gen;
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
(CONFIG.story||[]).forEach(function(e,n){var d=document.createElement("div");d.className="st";
  var a=document.createElement("small");a.textContent=e.date||"";var h=document.createElement("h3");var ic=document.createElement("span");ic.className="ic";ic.textContent=e.icon||["🏝️","💞","💍","🎊"][n%4]||"♥";h.appendChild(ic);h.appendChild(document.createTextNode(e.title||""));
  var p=document.createElement("p");p.textContent=e.text||"";d.appendChild(a);d.appendChild(h);d.appendChild(p);sy.appendChild(d)});
if(!sy.children.length)$("s-story").hidden=true;

var ph=CONFIG.photos||[],li=0,lbFrom=null,lb=$("lb");
function openLb(i){
  li=(i+ph.length)%ph.length;$("lbi").src=ph[li];$("lbi").alt="Pre-wedding photo "+(li+1)+" of "+ph.length;
  if(lb.hidden){lbFrom=document.activeElement;lb.hidden=false;$("lbx").focus()}}
function closeLb(){lb.hidden=true;if(lbFrom&&lbFrom.focus)lbFrom.focus();lbFrom=null}
if(ph.length){
  ph.forEach(function(u,i){
    var im=document.createElement("img");im.src=u.replace(/\/([^/]+)$/,"/thumbs/$1");im.alt="Pre-wedding photo "+(i+1);im.width=720;im.height=960;im.loading="lazy";im.decoding="async";
    im.className="ph";im.tabIndex=0;im.setAttribute("role","button");
    im.onclick=function(){openLb(i)};
    im.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();openLb(i)}};
    g.appendChild(im)})
}else $("s-photo").hidden=true;
$("lbx").onclick=closeLb;$("lbp").onclick=function(){openLb(li-1)};$("lbn").onclick=function(){openLb(li+1)};
lb.onclick=function(e){if(e.target===this)closeLb()};
var tx=0;lb.addEventListener("touchstart",function(e){tx=e.touches[0].clientX},{passive:true});
lb.addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)openLb(li+(dx<0?1:-1))});
document.addEventListener("keydown",function(e){if(lb.hidden)return;
  if(e.key==="Escape")closeLb();
  if(e.key==="ArrowRight")openLb(li+1);
  if(e.key==="ArrowLeft")openLb(li-1);
  if(e.key==="Tab"){ /* keep keyboard focus inside the viewer */
    var f=[$("lbx"),$("lbp"),$("lbn")],k=f.indexOf(document.activeElement);
    e.preventDefault();f[(k+(e.shiftKey?f.length-1:1))%f.length].focus()}})

if(!(window.CSS&&CSS.supports("animation-timeline","scroll()")))window.addEventListener("scroll",function(){var h=document.documentElement.scrollHeight-innerHeight;$("bar").style.width=(h>0?scrollY/h*100:0)+"%"},{passive:true});

function confetti(){if(navigator.vibrate)navigator.vibrate([30,40,30]);var c=["#b39b36","#d8c068","#f3e3a0","#ffffff"];
  for(var i=0;i<40;i++){var e=document.createElement("i");e.className="cf";
    e.style.cssText="left:"+(Math.random()*100)+"vw;background:"+c[i%4]+";animation-duration:"+(1.6+Math.random()*1.6)+"s;animation-delay:"+(Math.random()*.4)+"s";
    document.body.appendChild(e);setTimeout(function(x){x.remove()},3800,e)}}

var thm=$("thm"),root=document.documentElement;
function isDark(){var a=root.getAttribute("data-theme");return a?a==="dark":matchMedia("(prefers-color-scheme:dark)").matches}
function syncThm(){thm.setAttribute("aria-label",isDark()?"Switch to light theme":"Switch to dark theme")}
function setTheme(t){root.setAttribute("data-theme",t);thm.textContent=t==="dark"?"☀":"🌙";syncThm();try{localStorage.setItem("theme",t)}catch(e){}}
thm.onclick=function(){
  var t=isDark()?"light":"dark";
  if(!document.startViewTransition||matchMedia("(prefers-reduced-motion:reduce)").matches){setTheme(t);return}
  var r=thm.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,R=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  document.startViewTransition(function(){setTheme(t)}).ready.then(function(){
    document.documentElement.animate({clipPath:["circle(0px at "+x+"px "+y+"px)","circle("+R+"px at "+x+"px "+y+"px)"]},{duration:650,easing:"ease-in-out",pseudoElement:"::view-transition-new(root)"})})};
try{var sv=localStorage.getItem("theme");if(sv)setTheme(sv);else{thm.textContent=isDark()?"☀":"🌙";syncThm()}}catch(e){thm.textContent=isDark()?"☀":"🌙";syncThm()}

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
      c:$("cover").classList.contains("unseal")||$("cover").classList.contains("open")?gold[Math.random()*4|0]:"#ffffff"});
    var maxParticles=innerWidth<=600?22:80;if(ps.length>maxParticles)ps.splice(0,ps.length-maxParticles);
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
  document.addEventListener("cover:burst",function(){
    var bounds=document.querySelector("#cover .env").getBoundingClientRect(),count=innerWidth<=600?20:24;
    for(var i=0;i<count;i++)add(bounds.left+bounds.width/2,bounds.top+bounds.height/2,false)
  });
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
function tilt(x,y){ev.style.transform="perspective(900px) rotateY("+(x*8).toFixed(1)+"deg) rotateX("+(-y*8).toFixed(1)+"deg)"}
if(!matchMedia("(prefers-reduced-motion:reduce)").matches){
  $("cover").addEventListener("pointermove",function(e){if($("cover").classList.contains("unseal"))return;tilt((e.clientX/innerWidth-.5)*2,(e.clientY/innerHeight-.5)*2)});
  $("cover").addEventListener("pointerleave",function(){ev.style.transform=""});
  window.addEventListener("deviceorientation",function(e){if(e.gamma==null||$("cover").classList.contains("open"))return;
    tilt(Math.max(-1,Math.min(1,e.gamma/30)),Math.max(-1,Math.min(1,(e.beta-45)/30)))})}
$("openBtn").addEventListener("click",function(){if(navigator.vibrate)navigator.vibrate(25)});
document.querySelector("#cover .env").addEventListener("click",function(e){if(e.target===$("openBtn")||$("cover").classList.contains("unseal"))return;$("openBtn").click()});
$("coverCta").addEventListener("click",function(){$("openBtn").click()});

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
var pt=$("petals"),petalCount=innerWidth<=600?8:14;for(var q=0;q<petalCount;q++){var pi=document.createElement("i");
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
  playing=true;$("mus").classList.add("eq");$("mus").setAttribute("aria-label","Pause music");
  var u=tr&&tr.url;
  if(u){
    if(!au){au=new Audio();au.addEventListener("ended",function(){ti++;startMusic()});
      au.addEventListener("error",function(){clearInterval(timer);melody()})}
    au.src=u;au.play().catch(function(){});label(tr.title);return}
  label(tr?tr.title:"Wedding Melody");melody();
}
function stopMusic(){if(au)au.pause();clearInterval(timer);playing=false;$("mus").classList.remove("eq");$("mus").setAttribute("aria-label","Play music")}
$("mus").onclick=function(){playing?stopMusic():startMusic();this.style.opacity=playing?1:.5};
/* A short two-note chime shares the envelope tap gesture with music playback. */
function playChime(){
  var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  ac=ac||new AC();if(ac.state==="suspended")ac.resume();
  [659.25,880].forEach(function(frequency,index){
    var oscillator=ac.createOscillator(),gain=ac.createGain(),start=ac.currentTime+index*.13;
    oscillator.type="sine";oscillator.frequency.setValueAtTime(frequency,start);
    gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.045,start+.025);gain.gain.exponentialRampToValueAtTime(.0001,start+.48);
    oscillator.connect(gain);gain.connect(ac.destination);oscillator.start(start);oscillator.stop(start+.5)
  })
}
$("openBtn").addEventListener("click",function(){
  if($("cover").classList.contains("unseal"))return;
  $("cover").classList.add("unseal");
  document.dispatchEvent(new Event("cover:burst"));
  var reduced=matchMedia("(prefers-reduced-motion:reduce)").matches;
  setTimeout(function(){$("cover").classList.add("open");document.body.classList.add("go")},reduced?250:1700);
  try{playChime();startMusic()}catch(e){}
});

/* thank-you paragraph: written out slowly (like a song) when the guest scrolls to it.
   speed: 110 ms per letter, 170 ms at spaces, 700 ms at the end of a sentence – change the numbers below to adjust */
(function(){
  var el=$("thanksText");if(!el)return;
  var full=el.textContent.trim();
  var parts;
  try{parts=(window.Intl&&Intl.Segmenter)?Array.from(new Intl.Segmenter("km",{granularity:"grapheme"}).segment(full),function(x){return x.segment}):Array.from(full)}catch(e){parts=Array.from(full)}
  if(!("IntersectionObserver" in window))return;
  var done=document.createElement("span"),rest=document.createElement("span");
  rest.style.visibility="hidden";rest.textContent=full;el.textContent="";el.appendChild(done);el.appendChild(rest);
  el.setAttribute("aria-label",full);
  var started=false;
  function write(){
    var i=0,step=function(){
      i++;done.textContent=parts.slice(0,i).join("");rest.textContent=parts.slice(i).join("");
      if(i<parts.length)setTimeout(step,parts[i-1]==="។"?700:(parts[i-1]===" "?170:110))};
    step()}
  new IntersectionObserver(function(en,ob){
    en.forEach(function(e){if(e.isIntersecting&&!started){started=true;ob.disconnect();write()}})
  },{threshold:.1}).observe(el);
})();

/* photo autoplay:
   1) all photos start hidden
   2) when the gallery comes on screen they appear ONE BY ONE (every 500 ms)
   3) then a golden spotlight moves from photo to photo (zoom + glow, 1.5 s each) while the gallery is on screen
   Pauses while the guest touches or hovers the gallery. */
(function(){
  var g=$("grid");if(!g||!("IntersectionObserver" in window))return;
  var REVEAL=500,LIFT=1500;
  var idx=-1,timer=null,paused=false,last=null,revealed=false,started=false;
  Array.prototype.forEach.call(g.children,function(n){n.classList.add("hide")});
  function reveal(){
    var items=Array.prototype.slice.call(g.children),i=0;
    var t=setInterval(function(){
      if(i<items.length){items[i].classList.remove("hide");i++}
      if(i>=items.length){clearInterval(t);setTimeout(function(){revealed=true;if(onScreen)play()},700)}
    },REVEAL);
  }
  function tick(){
    if(paused)return;
    var items=g.children;if(!items.length)return;
    if(last)last.classList.remove("auto");
    idx=(idx+1)%items.length;
    last=items[idx];last.classList.add("auto");
  }
  var onScreen=false;
  function play(){if(!timer&&revealed){g.classList.add("playing");tick();timer=setInterval(tick,LIFT)}}
  function stop(){clearInterval(timer);timer=null;g.classList.remove("playing");if(last){last.classList.remove("auto");last=null}idx=-1}
  g.addEventListener("mouseenter",function(){paused=true;g.classList.remove("playing");if(last)last.classList.remove("auto")});
  g.addEventListener("mouseleave",function(){paused=false;if(timer)g.classList.add("playing")});
  g.addEventListener("touchstart",function(){paused=true;g.classList.remove("playing");if(last)last.classList.remove("auto")},{passive:true});
  g.addEventListener("touchend",function(){setTimeout(function(){paused=false;if(timer)g.classList.add("playing")},2500)},{passive:true});
  new IntersectionObserver(function(en){en.forEach(function(e){
    onScreen=e.isIntersecting;
    if(onScreen){if(!started){started=true;reveal()}else play()}else stop();
  })},{threshold:.2}).observe(g);
})();

/* love story: cards slide in one by one, dots pop, gold line grows while scrolling */
(function(){
  var sy=$("story");if(!sy||!sy.children.length)return;
  var cards=Array.prototype.slice.call(sy.children);
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.25});
    cards.forEach(function(c){io.observe(c)});
  }else cards.forEach(function(c){c.classList.add("in")});
  function line(){
    var r=sy.getBoundingClientRect(),vh=window.innerHeight||600;
    var p=(vh*0.7-r.top)/Math.max(r.height,1);
    sy.style.setProperty("--p",Math.max(0,Math.min(1,p)));
    var lc=cards[cards.length-1];sy.style.setProperty("--end",Math.max(0,sy.offsetHeight-lc.offsetTop-27)+"px");
  }
  var tk=false;
  window.addEventListener("scroll",function(){if(!tk){tk=true;requestAnimationFrame(function(){line();tk=false})}},{passive:true});
  window.addEventListener("resize",line);line();
})();
