/* Owner tool (?setup -> "📸 Photo links"): make a personal invitation link with the guest's name + preview photo.
   Telegram/Facebook/WhatsApp build the preview card from the page's <meta> tags (they do not run JavaScript),
   so every guest gets a tiny real page  g/<code>/  and a photo  assets/guests/<code>.jpg .
   "Publish" saves them straight to the GitHub repo (one commit); "Download ZIP" is the manual fallback. */
(function(){
  if(!new URLSearchParams(location.search).has("setup"))return;
  var $=function(i){return document.getElementById(i)};
  var openBtn=$("sPhotos");if(!openBtn)return;
  var CFG=window.CONFIG||{},W=1200,H=630,rows=[],busy=false;
  var BASE=location.href.split("?")[0].split("#")[0].replace(/index\.html$/,"").replace(/\/$/,"");
  var PERM="https://weddinginvitation-keat.vercel.app",BUILD=/^https?:\/\/[^\/]*-[a-z0-9]{8,10}-[a-z0-9-]+\.vercel\.app/i;
  BASE=BUILD.test(BASE)?PERM:BASE;   /* one-time Vercel build addresses give 404 later -> use the permanent address */
  $("pbase").value=BASE;
  try{var sv=JSON.parse(localStorage.getItem("pcfg")||"{}");if(sv.repo)$("prepo").value=sv.repo;if(sv.branch)$("pbranch").value=sv.branch;if(sv.base&&!BUILD.test(sv.base))$("pbase").value=sv.base}catch(e){}
  function mk(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e}
  function msg(t,bad){var m=$("pMsg");m.textContent=t;m.style.color=bad?"#b3261e":""}
  function esc(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
  function rnd(){var a="abcdefghjkmnpqrstuvwxyz23456789",s="",b=new Uint8Array(6);crypto.getRandomValues(b);b.forEach(function(x){s+=a[x%a.length]});return s}

  function addRow(){
    var r={code:rnd(),file:null,name:null},el=mk("div","pr"),th=mk("div","pt"),pf=mk("div","pf");
    var nm=mk("input");nm.type="text";nm.placeholder="Guest name (shown on the card)";
    var fl=mk("input");fl.type="file";fl.accept="image/*";
    var x=mk("button","px","✕");x.type="button";x.setAttribute("aria-label","remove");
    fl.onchange=function(){r.file=fl.files[0]||null;if(r.file){th.style.backgroundImage="url("+URL.createObjectURL(r.file)+")"}};
    nm.oninput=function(){r.name=nm.value};
    x.onclick=function(){rows.splice(rows.indexOf(r),1);el.remove()};
    pf.appendChild(nm);pf.appendChild(fl);el.appendChild(th);el.appendChild(pf);el.appendChild(x);
    r.getName=function(){return nm.value.replace(/\s+/g," ").trim()};
    rows.push(r);$("prows").appendChild(el)}

  /* photo -> 1200x630 JPEG (cover crop, keeps faces a little above centre) */
  function cover(file){return new Promise(function(ok,no){
    var u=URL.createObjectURL(file),im=new Image();
    im.onload=function(){
      var c=document.createElement("canvas");c.width=W;c.height=H;var x=c.getContext("2d");
      var s=Math.max(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s;
      x.fillStyle="#fff";x.fillRect(0,0,W,H);x.drawImage(im,(W-w)*.5,(H-h)*.35,w,h);
      c.toBlob(function(b){URL.revokeObjectURL(u);b?ok(b):no(new Error("photo failed"))},"image/jpeg",.85)};
    im.onerror=function(){no(new Error("Cannot read photo: "+file.name))};im.src=u})}
  function b64(blob){return new Promise(function(ok){var f=new FileReader();f.onload=function(){ok(String(f.result).split(",")[1])};f.readAsDataURL(blob)})}

  function page(r,base,hasPhoto){
    var title="សូមគោរពអញ្ជើញ "+r.name+" · "+(CFG.groom||"")+" & "+(CFG.bride||""),
        img=base+"/"+(hasPhoto?"assets/guests/"+r.code+".jpg":"assets/og.jpg"),
        target="../../?to="+encodeURIComponent(r.name),url=base+"/g/"+r.code+"/";
    return '<!DOCTYPE html>\n<html lang="km"><head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>'+esc(title)+'</title>\n<meta name="robots" content="noindex">\n<meta property="og:type" content="website">\n<meta property="og:title" content="'+esc(title)+'">\n<meta property="og:description" content="សូមគោរពអញ្ជើញចូលរួមក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ">\n<meta property="og:image" content="'+esc(img)+'">\n<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">\n<meta property="og:url" content="'+esc(url)+'">\n<meta name="twitter:card" content="summary_large_image">\n<noscript><meta http-equiv="refresh" content="0;url='+esc(target)+'"></noscript>\n<script>location.replace('+JSON.stringify(target)+')<\/script>\n</head><body><p><a href="'+esc(target)+'">'+esc(title)+'</a></p></body></html>\n'}

  /* build the files: [{path, text|blob}] + link list */
  function build(){
    var base=$("pbase").value.trim().replace(/[?#].*$/,"").replace(/\/$/,""),list=rows.filter(function(r){return r.getName()});
    if(!base)throw new Error("Type the invitation address first.");
    if(/^https?:\/\/[^\/]*-[a-z0-9]{8,10}-[a-z0-9-]+\.vercel\.app/i.test(base))throw new Error("This address ("+base.replace(/^https?:\/\//,"")+") is a one-time Vercel build address — links made with it will show 404 later. Type your permanent address instead (Vercel → your project → Settings → Domains), then press Publish again.");
    if(!list.length)throw new Error("Add at least one guest with a name.");
    var files=[],links=[];
    return list.reduce(function(p,r){return p.then(function(){
      r.name=r.getName();
      var has=!!r.file,step=has?cover(r.file):Promise.resolve(null);
      return step.then(function(blob){
        if(blob)files.push({path:"assets/guests/"+r.code+".jpg",blob:blob});
        files.push({path:"g/"+r.code+"/index.html",text:page(r,base,has)});
        links.push({name:r.name,url:base+"/g/"+r.code+"/",photo:has})})})},Promise.resolve()).then(function(){return {files:files,links:links}})}

  function showLinks(links){
    var L=$("pList");L.innerHTML="";
    links.forEach(function(l){
      var d=mk("div","pl");d.appendChild(mk("b","",l.name+(l.photo?"":"  (default photo)")));d.appendChild(mk("code","",l.url));
      var b=mk("button","btn alt sm","Copy link");b.type="button";b.onclick=function(){copyTxt(l.url,function(){flash(b,"✓ Copied")})};d.appendChild(b);
      var t=mk("a","btn sm","Telegram");t.href="https://t.me/share/url?url="+encodeURIComponent(l.url)+"&text="+encodeURIComponent("សូមគោរពអញ្ជើញ "+l.name);t.target="_blank";t.rel="noopener";t.style.marginLeft="6px";d.appendChild(t);
      L.appendChild(d)})}

  /* ---- GitHub: one commit with every file (Git Data API) ---- */
  function gh(token,repo,path,method,body){
    return fetch("https://api.github.com/repos/"+repo+path,{method:method||"GET",headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json","Content-Type":"application/json"},body:body?JSON.stringify(body):undefined})
      .then(function(r){return r.json().then(function(j){
        if(!r.ok){
          var m=(j&&j.message)||("GitHub error "+r.status),e=new Error(m+" ["+r.status+" "+(method||"GET")+" "+path.replace(/\/git\//,"")+"]");
          if(r.status===401)e.message="GitHub does not accept this token (typed wrong, expired or revoked). Make a new one. ["+r.status+"]";
          else if(r.status===403||r.status===404)e.message+="\nFix: the token needs repository access to THIS repo and Contents = Read and write. Make a new token (see steps) or edit it, then paste it again.";
          throw e}
        return j})})}
  function check(){
    var tk=$("ptoken").value.trim(),repo=$("prepo").value.trim();
    if(!tk||!repo){$("pgh").open=true;return msg("Fill the repository and the token first.",true)}
    msg("Checking …");
    gh(tk,repo,"").then(function(r){
      if(r.permissions&&r.permissions.push)msg("✓ Token can write to "+r.full_name+". You can publish.");
      else msg("✗ Token can only READ "+r.full_name+". It must have access to this repo with Contents = Read and write. (If you chose “Public repositories (read-only)”, choose “Only select repositories” instead.)",true)})
    .catch(function(e){msg(e.message,true)})}
  function publish(res,token,repo,branch){
    var head,tree;
    return gh(token,repo,"/git/ref/heads/"+encodeURIComponent(branch)).then(function(ref){head=ref.object.sha;return gh(token,repo,"/git/commits/"+head)})
    .then(function(c){tree=c.tree.sha;
      return res.files.reduce(function(p,f,i){return p.then(function(arr){
        msg("Uploading "+(i+1)+" / "+res.files.length+" …");
        var job=f.blob?b64(f.blob).then(function(d){return {content:d,encoding:"base64"}}):Promise.resolve({content:f.text,encoding:"utf-8"});
        return job.then(function(b){return gh(token,repo,"/git/blobs","POST",b)}).then(function(bl){arr.push({path:f.path,mode:"100644",type:"blob",sha:bl.sha});return arr})})},Promise.resolve([]))})
    .then(function(items){return gh(token,repo,"/git/trees","POST",{base_tree:tree,tree:items})})
    .then(function(t){return gh(token,repo,"/git/commits","POST",{message:"Add guest invitation links ("+res.links.length+")",tree:t.sha,parents:[head]})})
    .then(function(c){return gh(token,repo,"/git/refs/heads/"+encodeURIComponent(branch),"PATCH",{sha:c.sha})})}

  /* ---- minimal ZIP (stored, no compression) ---- */
  var T=(function(){var t=[],c,n,k;for(n=0;n<256;n++){c=n;for(k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
  function crc(u){var c=0xFFFFFFFF;for(var i=0;i<u.length;i++)c=T[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0}
  function zip(entries){
    var enc=new TextEncoder(),parts=[],cd=[],off=0;
    entries.forEach(function(e){
      var nm=enc.encode(e.path),d=e.data,cr=crc(d),h=new DataView(new ArrayBuffer(30));
      h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint16(10,0,true);h.setUint16(12,0x21,true);
      h.setUint32(14,cr,true);h.setUint32(18,d.length,true);h.setUint32(22,d.length,true);h.setUint16(26,nm.length,true);h.setUint16(28,0,true);
      parts.push(h.buffer,nm,d);
      var c=new DataView(new ArrayBuffer(46));
      c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(12,0,true);c.setUint16(14,0x21,true);
      c.setUint32(16,cr,true);c.setUint32(20,d.length,true);c.setUint32(24,d.length,true);c.setUint16(28,nm.length,true);c.setUint32(42,off,true);
      cd.push(c.buffer,nm);off+=30+nm.length+d.length});
    var cs=0;cd.forEach(function(x){cs+=x.byteLength||x.length});
    var end=new DataView(new ArrayBuffer(22));end.setUint32(0,0x06054b50,true);end.setUint16(8,entries.length,true);end.setUint16(10,entries.length,true);end.setUint32(12,cs,true);end.setUint32(16,off,true);
    return new Blob(parts.concat(cd,[end.buffer]),{type:"application/zip"})}
  function toBytes(f){return f.blob?f.blob.arrayBuffer().then(function(b){return {path:f.path,data:new Uint8Array(b)}}):Promise.resolve({path:f.path,data:new TextEncoder().encode(f.text)})}

  function run(fn){
    if(busy)return;busy=true;msg("Working …");
    try{localStorage.setItem("pcfg",JSON.stringify({repo:$("prepo").value.trim(),branch:$("pbranch").value.trim(),base:$("pbase").value.trim()}))}catch(e){}
    build().then(fn).catch(function(e){msg(e.message||String(e),true)}).then(function(){busy=false})}

  $("pAdd").onclick=addRow;$("pChk").onclick=check;
  $("pPub").onclick=function(){run(function(res){
    var tk=$("ptoken").value.trim(),repo=$("prepo").value.trim(),br=$("pbranch").value.trim()||"main";
    if(!tk||!repo){$("pgh").open=true;throw new Error("Open “GitHub publishing” and fill the repository and access token.")}
    return publish(res,tk,repo,br).then(function(){showLinks(res.links);msg("✓ Published. Your site updates in about a minute — then the links below work. (Photos are public files.)")})})};
  $("pZip").onclick=function(){run(function(res){
    return Promise.all(res.files.map(toBytes)).then(function(en){
      var a=document.createElement("a");a.href=URL.createObjectURL(zip(en));a.download="guest-links.zip";document.body.appendChild(a);a.click();a.remove();
      showLinks(res.links);msg("ZIP downloaded. Unzip it, then on GitHub: Add file → Upload files → drag the folders g and assets → Commit.")})})};
  openBtn.onclick=function(){$("pp").hidden=false;if(!rows.length)addRow()};
  $("pX").onclick=function(){$("pp").hidden=true};
})();
