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
  function init(){
    var enabled=typeof CONFIG!=="undefined"&&CONFIG.COMING_SOON===true;
    document.querySelectorAll("#s-photo,#s-video,.album-gallery-section").forEach(function(section){
      var content=section.querySelector(".coming-soon-content");if(!content)return;
      if(!enabled)return;
      content.setAttribute("aria-hidden","true");content.inert=true;content.classList.add("coming-soon-blurred");
      var overlay=makeOverlay();section.appendChild(overlay);update(section)
    })
  }
  window.updateComingSoonLanguage=function(next){language=next||"both";document.querySelectorAll(".coming-soon-overlay").forEach(update)};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init()
})();