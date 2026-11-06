(function(){
  var language="both";
  var copy={
    km:{kh:"ឆាប់ៗនេះ",en:"COMING SOON",sub:"រូបភាពនឹងដាក់បង្ហាញក្នុងពេលឆាប់ៗនេះ / Photos & videos will be available soon"},
    en:{kh:"COMING SOON",en:"COMING SOON",sub:"Photos & videos will be available soon"},
    both:{kh:"ឆាប់ៗនេះ",en:"COMING SOON",sub:"រូបភាពនឹងដាក់បង្ហាញក្នុងពេលឆាប់ៗនេះ / Photos & videos will be available soon"}
  };
  function makeOverlay(){
    var overlay=document.createElement("div");overlay.className="coming-soon-overlay";overlay.setAttribute("role","status");overlay.setAttribute("aria-live","polite");overlay.setAttribute("aria-label","ឆាប់ៗនេះ · COMING SOON");
    overlay.innerHTML='<div class="coming-soon-message"><strong class="coming-soon-kh"></strong><span class="coming-soon-divider" aria-hidden="true"></span><span class="coming-soon-en"></span><small class="coming-soon-sub"></small></div>';
    return overlay
  }
  function update(section){
    var text=copy[language]||copy.both,kh=section.querySelector(".coming-soon-kh"),en=section.querySelector(".coming-soon-en"),sub=section.querySelector(".coming-soon-sub");
    if(kh)kh.textContent=text.kh;if(en)en.textContent=text.en;if(sub)sub.textContent=text.sub
  }
  function badge(){
    var badge=document.createElement("span");badge.className="coming-soon-photo-badge";badge.setAttribute("role","status");badge.setAttribute("aria-live","polite");
    badge.innerHTML='<strong class="coming-soon-photo-kh"></strong><span class="coming-soon-photo-divider" aria-hidden="true"></span><span class="coming-soon-photo-en"></span>';return badge
  }
  function updateBadges(){
    var text=copy[language]||copy.both;
    document.querySelectorAll(".coming-soon-photo-badge").forEach(function(item){item.querySelector(".coming-soon-photo-kh").textContent=text.kh;item.querySelector(".coming-soon-photo-en").textContent=text.en})
  }
  function decoratePhotos(){
    var changed=false;
    document.querySelectorAll(".photo-card:not(.coming-soon-photo),img.ph:not(.coming-soon-photo-source)").forEach(function(photo){
      var target=photo;
      if(photo.matches("img.ph")){target=document.createElement("span");target.className="coming-soon-photo";photo.classList.add("coming-soon-photo-source");photo.parentNode.insertBefore(target,photo);target.appendChild(photo)}else target.classList.add("coming-soon-photo");
      target.appendChild(badge());changed=true
    });
    if(changed)updateBadges()
  }
  function init(){
    var enabled=typeof CONFIG!=="undefined"&&CONFIG.COMING_SOON===true;
    var photoEnabled=typeof CONFIG!=="undefined"&&CONFIG.PHOTO_COMING_SOON===true;
    document.querySelectorAll("#s-photo,#s-video,.album-gallery-section").forEach(function(section){
      var content=section.querySelector(".coming-soon-content");if(!content)return;
      if(!enabled)return;
      content.setAttribute("aria-hidden","true");content.inert=true;content.classList.add("coming-soon-blurred");
      var overlay=makeOverlay();section.appendChild(overlay);update(section)
    })
    if(photoEnabled){decoratePhotos();new MutationObserver(decoratePhotos).observe(document.body,{childList:true,subtree:true})}
  }
  window.updateComingSoonLanguage=function(next){language=next||"both";document.querySelectorAll(".coming-soon-overlay").forEach(update);updateBadges()};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init()
})();