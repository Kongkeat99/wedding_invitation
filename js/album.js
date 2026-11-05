/* Guest album page: two albums (groom's guests / bride's guests), set in CONFIG.album */
(function(){
  var $=function(id){return document.getElementById(id)};
  var C=typeof CONFIG!=="undefined"?CONFIG:{},A=C.album||{};
  try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}
  $("back").href="index.html"+location.search;
  $("sub").textContent=(C.groom||"")+" & "+(C.bride||"");

  function categoryList(c){
    c=c||{};
    if(c.list&&c.list.length)return c.list;
    var out=[];for(var n=1;n<=(c.count||0);n++)out.push((c.folder||"")+n+".jpg");
    return out
  }
  function hasPhotos(s){return (s.categories||[]).some(function(c){return c.count||c.list&&c.list.length})}
  var sides={groom:A.groom||{},bride:A.bride||{}},preview=!hasPhotos(sides.groom)&&!hasPhotos(sides.bride);
  var grid=$("agrid"),lb=$("lb"),categoryBar=$("categories"),list=[],li=0,from=null,side="groom",category="all";

  function show(i){
    if(!list.length)return;
    li=(i+list.length)%list.length;
    $("lbi").src=list[li];$("lbi").alt="Photo "+(li+1)+" of "+list.length;
    $("lbd").href=list[li];$("lbd").setAttribute("download",list[li].split("/").pop());
    if(lb.hidden){from=document.activeElement;lb.hidden=false;$("lbx").focus()}}
  function close(){lb.hidden=true;if(from&&from.focus)from.focus();from=null}
  function setHash(k,c){try{history.replaceState(null,"",location.pathname+location.search+"#"+k+(c&&c!=="all"?"/"+c:""))}catch(e){}}

  function renderCategories(k){
    var cats=(sides[k].categories||[]).filter(function(c){return c.count||c.list&&c.list.length});
    categoryBar.innerHTML="";
    var active=null,all=document.createElement("button");all.type="button";all.textContent="All ("+cats.reduce(function(total,c){return total+categoryList(c).length},0)+")";all.setAttribute("aria-pressed",category==="all");all.onclick=function(){pick(k,"all")};categoryBar.appendChild(all);if(category==="all")active=all;
    cats.forEach(function(c){
      var b=document.createElement("button");b.type="button";b.dataset.category=c.id;b.innerHTML=c.km+" <small>("+categoryList(c).length+")</small>";b.setAttribute("aria-pressed",category===c.id);b.title=c.en;b.onclick=function(){pick(k,c.id)};categoryBar.appendChild(b);if(category===c.id)active=b
    });
    if(active&&window.matchMedia&&window.matchMedia("(max-width:700px)").matches)active.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})
  }

  function pick(k,c,keepHash){
    side=k;category=c||"all";
    var cats=sides[k].categories||[],selected=category==="all"?cats:cats.filter(function(item){return item.id===category});
    list=selected.reduce(function(all,item){return all.concat(categoryList(item))},[]);
    if(preview)list=C.photos||[];
    renderCategories(k);grid.innerHTML="";
    $("tGroom").setAttribute("aria-pressed",k==="groom");$("tBride").setAttribute("aria-pressed",k==="bride");
    $("empty").hidden=list.length>0;
    list.forEach(function(u,i){
      var im=document.createElement("img");
      im.src=u;im.alt=(k==="groom"?"Groom's guests":"Bride's guests")+" photo "+(i+1);im.width=720;im.height=960;im.loading="lazy";im.decoding="async";
      im.tabIndex=0;im.setAttribute("role","button");
      im.onclick=function(){show(i)};
      im.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();show(i)}};
      im.onerror=function(){im.remove()};
      grid.appendChild(im)});
    if(!keepHash)setHash(k,category)
  }

  $("tGroom").onclick=function(){pick("groom")};
  $("tBride").onclick=function(){pick("bride")};
  var hash=location.hash.slice(1).split("/"),initialSide=hash[0]==="bride"?"bride":"groom",initialCategory=hash[1]||"all";
  pick(initialSide,initialCategory,true);

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
