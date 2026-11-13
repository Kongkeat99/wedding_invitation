/* Khmer / English switch for the whole invitation (inner page + cover).
   - Static text: elements with data-en="..." (the Khmer original is remembered automatically).
   - Pairs of blocks: .lang-km / .lang-en (one is shown, the other hidden).
   - Dynamic text (program, story, venue, date, countdown labels, dress text) comes from CONFIG.en in js/config.js.
   The guest's choice is remembered in this browser. Default = Khmer. */
(function(){
  var html=document.documentElement,KH="០១២៣៤៥៦៧៨៩",cur="km";
  function $(i){return document.getElementById(i)}
  function arabic(s){return String(s).replace(/[០-៩]/g,function(c){return KH.indexOf(c)})}
  function E(){return (window.CONFIG&&CONFIG.en)||{}}

  /* English wedding date, always in Cambodia time (UTC+7) */
  function enDate(){
    var c=new Date(new Date(window.WD||CONFIG.date).getTime()+7*3600000);
    var wd=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        mo=["January","February","March","April","May","June","July","August","September","October","November","December"],
        H=c.getUTCHours(),M=c.getUTCMinutes(),h=H%12||12;
    return wd[c.getUTCDay()]+", "+c.getUTCDate()+" "+mo[c.getUTCMonth()]+" "+c.getUTCFullYear()+"\n"+h+(M?":"+("0"+M).slice(-2):":00")+" "+(H<12?"AM":"PM")
  }

  function swapText(root){
    Array.prototype.forEach.call(root.querySelectorAll("[data-en]:not([data-km])"),function(el){el.setAttribute("data-km",el.textContent)});
    Array.prototype.forEach.call(root.querySelectorAll("[data-en][data-km]"),function(el){el.textContent=el.getAttribute("data-"+cur);el.lang=cur})
  }

  function renderProgram(){
    var items=document.querySelectorAll("#prog .tt"),en=E().program||[];
    Array.prototype.forEach.call(items,function(tt,i){
      var b=tt.querySelector("b"),s=tt.querySelector("span");if(!b||!s)return;
      if(!b.hasAttribute("data-km")){b.setAttribute("data-km",b.textContent);s.setAttribute("data-km",s.textContent)}
      if(cur==="en"){b.textContent=arabic(b.getAttribute("data-km"));if(en[i])s.textContent=en[i]}
      else{b.textContent=b.getAttribute("data-km");s.textContent=s.getAttribute("data-km")}
    })
  }
  function renderStory(){
    var en=E().story||[];
    Array.prototype.forEach.call(document.querySelectorAll("#story .st"),function(st,i){
      var h=st.querySelector("h3"),p=st.querySelector("p"),small=st.querySelector("small");if(!h||!p)return;
      var tn=h.lastChild;
      if(!st.hasAttribute("data-km-t")){st.setAttribute("data-km-t",tn.textContent);st.setAttribute("data-km-p",p.textContent);if(small)st.setAttribute("data-km-d",small.textContent)}
      if(cur==="en"){
        if(en[i]&&en[i].title)tn.textContent=en[i].title;if(en[i]&&en[i].text)p.textContent=en[i].text;
        if(small){var d=new Date(new Date(window.WD||CONFIG.date).getTime()+7*3600000),
          mo=["January","February","March","April","May","June","July","August","September","October","November","December"];
          if(CONFIG.story[i]&&CONFIG.story[i].date==="wedding")small.textContent=d.getUTCDate()+" "+mo[d.getUTCMonth()]+" "+d.getUTCFullYear()}
      }else{tn.textContent=st.getAttribute("data-km-t");p.textContent=st.getAttribute("data-km-p");if(small)small.textContent=st.getAttribute("data-km-d")}
    })
  }
  function setKept(el,key,enText){
    if(!el)return;
    if(!el.hasAttribute(key))el.setAttribute(key,el.textContent);
    el.textContent=(cur==="en"&&enText)?enText:el.getAttribute(key)
  }

  function apply(lang){
    cur=lang==="en"?"en":"km";
    html.dataset.language=cur;html.lang=cur;
    var cover=$("cover");if(cover)cover.lang=cur;

    /* cover (first page) */
    Array.prototype.forEach.call(document.querySelectorAll("#cover [data-km][data-en]"),function(el){el.textContent=el.getAttribute("data-"+cur)});
    var seal=$("openBtn");if(seal)seal.setAttribute("aria-label",cur==="km"?"បើកសំបុត្រ":"Open invitation");
    var qrBox=$("qr");if(qrBox)qrBox.setAttribute("aria-label",cur==="km"?"QR Code ទីតាំងពិធី":"QR code for the venue location");
    var nv=$("nav");if(nv)nv.setAttribute("aria-label",cur==="km"?"ផ្នែកក្នុងទំព័រ":"Page sections");

    /* both toggle buttons show the language you would switch TO */
    [$("splashLanguage"),$("langBtn")].forEach(function(b){
      if(!b)return;
      b.dataset.language=cur;b.dataset.cur=cur;if(b.id!=="langBtn")b.textContent=cur==="km"?"EN":"ខ្មែរ";
      b.setAttribute("aria-label",cur==="km"?"Switch to English":"ប្ដូរទៅភាសាខ្មែរ");
      b.lang=cur==="km"?"en":"km"
    });

    /* inner page */
    swapText(document);
    Array.prototype.forEach.call(document.querySelectorAll(".lang-km"),function(e){e.hidden=cur!=="km"});
    Array.prototype.forEach.call(document.querySelectorAll(".lang-en"),function(e){e.hidden=cur!=="en"});
    var en=E();
    setKept($("venue"),"data-km",en.venue);
    setKept($("dtxt"),"data-km",en.dressText);
    var dt=$("dateTxt");if(dt){if(!dt.hasAttribute("data-km"))dt.setAttribute("data-km",dt.textContent);dt.textContent=cur==="en"?enDate():dt.getAttribute("data-km")}
    var lbl=cur==="en"?["Days","Hours","Minutes","Seconds"]:["ថ្ងៃ","ម៉ោង","នាទី","វិនាទី"];
    Array.prototype.forEach.call(document.querySelectorAll("#cd span"),function(s,i){s.textContent=lbl[i]});
    renderProgram();renderStory();
    if(typeof syncDressLanguage==="function")syncDressLanguage(cur);
    var tgt=$("langBtn");if(tgt)tgt.title=cur==="km"?"English":"ភាសាខ្មែរ";
    try{localStorage.setItem("lang",cur)}catch(e){}
  }

  /* keep in step if the cover button (handled in app.js) changes the language */
  new MutationObserver(function(){var l=html.dataset.language;if(l&&l!==cur)apply(l)}).observe(html,{attributes:true,attributeFilter:["data-language"]});

  var lb=$("langBtn");
  if(lb)lb.addEventListener("click",function(){apply(cur==="km"?"en":"km")});

  var saved="km";try{saved=localStorage.getItem("lang")||"km"}catch(e){}
  var q=new URLSearchParams(location.search).get("lang");   /* ?lang=en opens the English version */
  if(q==="en"||q==="km")saved=q;
  if(saved==="en")apply("en");else{html.dataset.language="km";apply("km")}
})();
