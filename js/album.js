/* Guest album page: two albums (groom's guests / bride's guests), set in CONFIG.album */
(function(){
  var $=function(id){return document.getElementById(id)};
  var C=typeof CONFIG!=="undefined"?CONFIG:{},A=C.album||{};
  try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}

  /* keep the guest's personal link when going back to the invitation */
  $("back").href="index.html"+location.search;
  $("sub").textContent=(C.groom||"")+" & "+(C.bride||"");

  function sideList(s){
    s=s||{};
    if(s.list&&s.list.length)return s.list;
    var out=[];for(var n=1;n<=(s.count||0);n++)out.push((s.folder||"")+n+"."+(s.ext||"jpg"));
    return out}
  var lists={groom:sideList(A.groom),bride:sideList(A.bride)};
  if(!lists.groom.length&&!lists.bride.length)lists.groom=lists.bride=C.photos||[];   /* preview until configured */

  var grid=$("agrid"),lb=$("lb"),list=[],li=0,from=null,side="groom";
  ["groom","bride"].forEach(function(k){$(k==="groom"?"tGroom":"tBride").querySelector("small").textContent="("+lists[k].length+")"});

  function show(i){
    li=(i+list.length)%list.length;
    $("lbi").src=list[li];$("lbi").alt="Photo "+(li+1)+" of "+list.length;
    $("lbd").href=list[li];$("lbd").setAttribute("download",list[li].split("/").pop());
    if(lb.hidden){from=document.activeElement;lb.hidden=false;$("lbx").focus()}}
  function close(){lb.hidden=true;if(from&&from.focus)from.focus();from=null}

  function pick(k,keepHash){
    side=k;list=lists[k];grid.innerHTML="";
    $("tGroom").setAttribute("aria-pressed",k==="groom");$("tBride").setAttribute("aria-pressed",k==="bride");
    var up=(A[k]||{}).upload;$("up").hidden=!up;if(up)$("up").href=up;
    $("empty").hidden=list.length>0;
    list.forEach(function(u,i){
      var im=document.createElement("img");
      im.src=u;im.alt=(k==="groom"?"Groom's guests":"Bride's guests")+" photo "+(i+1);im.width=720;im.height=960;im.loading="lazy";im.decoding="async";
      im.tabIndex=0;im.setAttribute("role","button");
      im.onclick=function(){show(i)};
      im.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();show(i)}};
      im.onerror=function(){im.remove()};   /* skip files that are not uploaded yet */
      grid.appendChild(im)});
    if(!keepHash)try{history.replaceState(null,"",location.pathname+location.search+"#"+k)}catch(e){}}

  $("tGroom").onclick=function(){pick("groom")};
  $("tBride").onclick=function(){pick("bride")};
  /* album.html#bride opens the bride's album directly, so each side can get its own link */
  pick(location.hash==="#bride"?"bride":"groom",true);

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
