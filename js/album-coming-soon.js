(function(){
  var buttons=document.querySelectorAll(".album-coming-languages button");
  var copy=document.querySelectorAll("[data-both]");

  buttons.forEach(function(button){
    button.addEventListener("click",function(){
      var language=button.getAttribute("data-language");
      copy.forEach(function(item){item.textContent=item.getAttribute("data-"+language)});
      buttons.forEach(function(other){
        other.setAttribute("aria-pressed",String(other===button))
      });
      document.documentElement.lang=language==="en"?"en":"km"
    })
  })
})();
