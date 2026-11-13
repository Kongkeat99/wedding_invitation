/* ===== EDIT THESE ===== */
var CONFIG = {
  COMING_SOON: false,
  ALBUM_COMING_SOON: true,                     // guest album page: true = photos blurred with a Coming Soon badge, false = open album
  PHOTO_COMING_SOON: false,
  VIDEO_AUTOPLAY: true,                         // pre-wedding video starts by itself (muted) when scrolled into view; false = guest taps play
  VIDEO_COMING_SOON: false,
  groom: "Soem Kungkiet",
  bride: "Chham Chanthu",
  date: "2026-11-22T15:00:00+07:00",          // wedding date/time (Cambodia time, UTC+7)
  venue: "គេហដ្ឋានខាងស្រី",
  mapUrl: "https://maps.app.goo.gl/ZqvGd8Px3T6WwukE9?g_st=ic",
  playlist: [                            // add songs: {title:"Song – Artist", url:"assets/music/file.mp3"} · empty url = built-in soft melody
    {title:"Beautiful In White – Shane Filan", url:"assets/music/beautiful-in-white.mp3"}
  ],
  program: [
    ["០៧:០០","ពិធី ហែរជំនួន"],
    ["០៨:០០","ពិធីកាត់សក់"],
    ["១១:៣០","ពិសាភោជនាហារថ្ងៃត្រង់"],
    ["១៨:០០","ពិសាភោជនាហាពេលល្ងាច"]
  ],
  /* RSVP replies go to you through these (leave "" to hide a button) */
  /* English version shown when a guest taps EN. Keep the SAME order/length as the Khmer lists above. Empty = Khmer is kept. */
  en: {
    venue: "The bride's family home",
    program: ["Groom's procession (Hae Chamnoun)", "Hair-cutting ceremony", "Lunch reception", "Dinner reception"],
    story: [
      { title: "Our first meeting", text: "When we went on a trip to Koh Tonsay (Rabbit Island)" },
      { title: "Becoming a couple", text: "When we understood each other's hearts more clearly" },
      { title: "The proposal", text: "Because we had become certain about each other" },
      { title: "Our wedding day", text: "The day we take each other's hand into a new life" }
    ],
    dressText: "Please dress in the colours below to add beauty to our special day"
  },
  contact: { telegram: "", whatsapp: "" },   // telegram: username without @ · whatsapp: number with country code, e.g. 855XXXXXXXX
  /* gift accounts: entries with an empty account are not shown; the whole section hides if none */
  gifts: [
    { bank: "ABA Bank", name: "SOEM KUNGKIET", account: "000 000 000" }
  ],
  dress: {                                     // dress-code colours — delete the whole block to hide the section
    text: "សូមស្លៀកពាក់តាមពណ៌ខាងក្រោម ដើម្បីបន្ថែមភាពស្រស់ស្អាតដល់ថ្ងៃពិសេសរបស់យើងខ្ញុំ",
    colors: ["#b39b36", "#d8c068", "#fbf7ea", "#6e5c12"]
  },
  guests: {                                    // short guest links: "code": "Name shown on the invitation"  ->  your-site/?g=code  (made by the ?setup guest-link tool)
  },
  // guest album page (album.html) - one album for the groom's guests and one for the bride's guests.
  // Photos use <folder>1.jpg ... <folder>count.jpg unless list is provided.
  // The page shows its empty-state message when no photos are configured.
  album: {
    groom: { categories: [
      {id:"trax-team", km:"ក្រុមការងារ Trax Apparel", en:"Trax Apparel Team", folder:"assets/album/groom/trax-team/", count:15, list:[]},
      {id:"silver-age", km:"ក្រុមការងារ Silver Age", en:"Silver Age Team", folder:"assets/album/groom/silver-age/", count:15, list:[]},
      {id:"asean-freight", km:"ក្រុមការងារ ASEAN FREIGHT", en:"ASEAN FREIGHT Team", folder:"assets/album/groom/asean-freight/", count:15, list:[]},
      {id:"university", km:"មិត្តចាស់សាកលវិទ្យាល័យ", en:"University Old Friend", folder:"assets/album/groom/university/", count:15, list:[]},
      {id:"high-school", km:"មិត្តចាស់វិទ្យាល័យ", en:"High School Old Friend", folder:"assets/album/groom/high-school/", count:15, list:[]},
      {id:"primary", km:"មិត្តចាស់បឋមសិក្សា", en:"Primary Old Friend", folder:"assets/album/groom/primary/", count:15, list:[]},
      {id:"cgti", km:"មិត្តចាស់ CGTI", en:"Old Friend CGTI", folder:"assets/album/groom/cgti/", count:15, list:[]},
      {id:"family", km:"បងប្អូន និងញាតិសន្តាន", en:"Sibling & Cousin", folder:"assets/album/groom/family/", count:15, list:[]}
    ]},
    bride: { categories: [
      {id:"mv-team", km:"ក្រុមការងារ MV", en:"MV Team", folder:"assets/album/bride/mv-team/", count:15, list:[]},
      {id:"king-success", km:"ក្រុមការងារ King Success", en:"King Success Team", folder:"assets/album/bride/king-success/", count:15, list:[]},
      {id:"university", km:"មិត្តចាស់សាកលវិទ្យាល័យ", en:"University Old Friend", folder:"assets/album/bride/university/", count:15, list:[]},
      {id:"high-school", km:"មិត្តចាស់វិទ្យាល័យ", en:"High School Old Friend", folder:"assets/album/bride/high-school/", count:15, list:[]},
      {id:"primary", km:"មិត្តចាស់បឋមសិក្សា", en:"Primary Old Friend", folder:"assets/album/bride/primary/", count:15, list:[]},
      {id:"family", km:"បងប្អូន និងញាតិសន្តាន", en:"Sibling & Cousin", folder:"assets/album/bride/family/", count:15, list:[]}
    ]}
  },
  photos: [                                    // photos in assets/photos/
    "assets/photos/DSC_5408.jpg",
    "assets/photos/DSC_5424.jpg",
    "assets/photos/DSC_5433.jpg",
    "assets/photos/DSC_5437.jpg",
    "assets/photos/DSC_5441.jpg",
    "assets/photos/DSC_5443.jpg",
    "assets/photos/DSC_5448.jpg",
    "assets/photos/DSC_5450.jpg",
    "assets/photos/DSC_5452.jpg",
    "assets/photos/DSC_5456.jpg",
    "assets/photos/DSC_5466.jpg",
    "assets/photos/DSC_5468.jpg",
    "assets/photos/DSC_5472.jpg",
    "assets/photos/DSC_5477.jpg",
    "assets/photos/DSC_5481.jpg",
    "assets/photos/DSC_5485.jpg",
    "assets/photos/DSC_5488.jpg",
    "assets/photos/DSC_5490.jpg",
    "assets/photos/DSC_5492.jpg",
    "assets/photos/DSC_5495.jpg",
    "assets/photos/DSC_5499.jpg",
    "assets/photos/DSC_5501.jpg",
    "assets/photos/DSC_5504.jpg",
    "assets/photos/DSC_5512.jpg",
    "assets/photos/DSC_5514.jpg",
    "assets/photos/DSC_5519.jpg",
    "assets/photos/DSC_5523.jpg",
    "assets/photos/DSC_5525.jpg",
    "assets/photos/DSC_5526.jpg",
    "assets/photos/DSC_5527.jpg",
    "assets/photos/DSC_5533.jpg"
  ],
  story: [                                     // love story timeline — edit the text; delete all entries to hide the section. date is optional ("wedding" = the wedding date above)
    { title: "ជួបគ្នាលើកដំបូង", text: "ពេលយើងទៅដើរលេងនៅកោះទន្សាយ" },
    { title: "ក្លាយជាគូស្នេហ៍", text: "ពេលយើងយល់ពីចិត្តគ្នាកាន់តែច្បាស់" },
    { title: "ស្នើសុំរៀបការ", text: "ព្រោះយើងបានច្បាស់លាស់ជាមួយគ្នា" },
    { date: "wedding", title: "ថ្ងៃមង្គលការ", text: "ថ្ងៃដែលយើងចាប់ដៃគ្នាចូលក្នុងជីវិតថ្មី" }
  ],
  videos: ["assets/videos/prewedding_merged_silent.mp4"],   // upload videos to assets/videos/ and add a matching .jpg poster
  khqr: "",                                    // optional: link to your KHQR image
  live: ""                                     // optional: Facebook / YouTube live link on the wedding day
};
/* ====================== */
