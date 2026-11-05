/* Guest album page: shows CONFIG.album, or assets/album/1.jpg..N.jpg (CONFIG.albumCount), or the gallery photos */
(function(){
  var $=function(id){return document.getElementById(id)};
  var C=typeof CONFIG!=="undefined"?CONFIG:{};
  try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}

  /* keep the guest's personal link when going back to the invitation */
  $("back").href="index.html"+location.search;
  $("sub").textContent=(C.groom||"")+" & "+(C.bride||"");
  if(C.albumUpload){$("up").href=C.albumUpload;$("up").hidden=false}

  var list=[];
  if(C.album&&C.album.length)list=C.album;
  else if(C.albumCount>0){for(var n=1;n<=C.albumCount;n++)list.push((C.albumFolder||"assets/album/")+n+"."+(C.albumExt||"jpg"))}
  else list=C.photos||[];

  var grid=$("agrid"),lb=$("lb"),li=0,from=null;
  if(!list.length)$("empty").hidden=false;

  function show(i){
    li=(i+list.length)%list.length;
    $("lbi").src=list[li];$("lbi").alt="Photo "+(li+1)+" of "+list.length;
    $("lbd").href=list[li];$("lbd").setAttribute("download",list[li].split("/").pop());
    if(lb.hidden){from=document.activeElement;lb.hidden=false;$("lbx").focus()}}
  function close(){lb.hidden=true;if(from&&from.focus)from.focus();from=null}

  list.forEach(function(u,i){
    var im=document.createElement("img");
    im.src=u;im.alt="Photo "+(i+1);im.width=720;im.height=960;im.loading="lazy";im.decoding="async";
    im.tabIndex=0;im.setAttribute("role","button");
    im.onclick=function(){show(i)};
    im.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();show(i)}};
    im.onerror=function(){im.remove()};   /* skip files that are not uploaded yet */
    grid.appendChild(im)});

  $("lbx").onclick=close;$("lbp").onclick=function(){show(li-1)};$("lbn").onclick=function(){show(li+1)};
  lb.onclick=function(e){if(e.target===lb)close()};
  var tx=0;
  lb.addEventListener("touchstart",function(e){tx=e.touches[0].clientX},{passive:true});
  lb.addEventListener("touchend",function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)show(li+(d<0?1:-1))},{passive:true});
  document.addEventListener("keydown",function(e){
    if(lb.hidden)return;
    if(e.key==="Escape")close();
    if(e.key==="ArrowRight")show(li+1);
    if(e.key==="ArrowLeft")show(li-1);
    if(e.key==="Tab"){var f=[$("lbx"),$("lbp"),$("lbn"),$("lbd")],k=f.indexOf(document.activeElement);
      e.preventDefault();f[(k+(e.shiftKey?f.length-1:1))%f.length].focus()}});
})();
