/* ===== EDIT THESE ===== */
var CONFIG = {
  COMING_SOON: false,
  ALBUM_COMING_SOON: true,                     // guest album page: true = photos blurred with a Coming Soon badge, false = open album
  PHOTO_COMING_SOON: false,
  VIDEO_AUTOPLAY: true,                         // pre-wedding video starts by itself (muted) when scrolled into view; false = guest taps play
  VIDEO_COMING_SOON: false,
  groom: "Soem Kungkiet",
  bride: "Cham Chanthu",
  groomKm: "ស៊ឹម គង់គៀត",                        // Khmer spelling, shown when the guest switches to Khmer
  brideKm: "ឆាំ ចន្ធូ",
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
  // Google Drive copies of the gallery photos (folder "Wedding Invitation Media", shared: anyone with the link).
  // The page tries Drive first and falls back to assets/photos/ if a Drive image fails. Set USE_DRIVE_PHOTOS:false to use only the repo.
  USE_DRIVE_PHOTOS: true,
  drivePhotos: {
    "DSC_5408.jpg": "1tFIhGW11qLhqJ4D8BzNBQDL7xH8MxBSO",
    "DSC_5424.jpg": "1nDbJBISzzeobi-FQpHz9Rn3kiMZ2Dzqp",
    "DSC_5433.jpg": "18urB9fZLpqSD37Ct1aoew4U524LDeQTX",
    "DSC_5437.jpg": "10vlE8WJZ6hE01Or6ZdT8-5JrcyT9O2v-",
    "DSC_5441.jpg": "1U7G_XwJC1ricA1pd9KHOPTYpgVzOrqlc",
    "DSC_5443.jpg": "1zyS4Zx7T_gEpyE0i8kYZc2Rr7NWzRLU7",
    "DSC_5448.jpg": "1jrIjUf6Dzf0jFAPG1tmOo5ST8HzV69dJ",
    "DSC_5450.jpg": "1rcLWlnWCr2LfDdvNIDU9uc4AI7pRHtmo",
    "DSC_5452.jpg": "1aJc1ofaCQsFIcIEUIhRNN_fjcNUZujLS",
    "DSC_5456.jpg": "1w7kr7LiPRjf9_TSguJirHKyKWJpyUrlr",
    "DSC_5466.jpg": "1_awplSun0GWWtKv0hYTUPGQ7hxA4DXLf",
    "DSC_5468.jpg": "19jtYIQ7SN7DQHvOIvO5L2bbhpzw4q_rl",
    "DSC_5472.jpg": "1x-Yw3FlEAcd0alsrqq7cLdcsiyFAf_Bp",
    "DSC_5477.jpg": "1yrSL-23T2zJ-f3UVqyOjVyVY4dF7s67G",
    "DSC_5481.jpg": "1KSnGxU4IEpYCByXGqhxto2LFIxf3ZgMd",
    "DSC_5485.jpg": "1siFrGJ3mKUuCxIETlBOt2Xkxl277OcAl",
    "DSC_5488.jpg": "1M4mlnbPaHLQuEV0OygZBgE_sawrMTtIk",
    "DSC_5490.jpg": "1LmT-oxuG_lF9uAh5wGY6962Tmo_GWTJ0",
    "DSC_5492.jpg": "1JAgjbeddm6xyCuOaAQy7-jgscEH8oFWs",
    "DSC_5495.jpg": "1vxdFlV-jji-L2jZvQj0-3HnidlTA--q3",
    "DSC_5499.jpg": "1uwPe8unVLfgC4oEhO1FxoAu38m837zfb",
    "DSC_5501.jpg": "1ud-CxdFqvRYoa0oE2WAmgH9hDM_Yu3Uc",
    "DSC_5504.jpg": "1W2VJtnjxhgkQb-TYHZikcRIFwCXWiySe",
    "DSC_5512.jpg": "1eyRyu8E9_E7drCQ5365_g0371ddeJZut",
    "DSC_5514.jpg": "1l0pezgS2zJ20qXgdHzRXwgoMZJnSMivI",
    "DSC_5519.jpg": "19tXUM5Tp1OXfJY1sdjOBFNZ1Ta6mSTwX",
    "DSC_5523.jpg": "1RVS9RJSE3VwHD_kEyszMx_NFwvrhGCj7",
    "DSC_5525.jpg": "1CRanbTgA3_y9_OduZQu5jUaSSFOZStnN",
    "DSC_5526.jpg": "10uNjm7Rg17Q--eTPZrEDScE5jZzWIG75",
    "DSC_5527.jpg": "1h__O-IetN0iOcr4oQZ7BDeE_G0J_EurF",
    "DSC_5533.jpg": "1oaCapABD91mPcPf-gkpCYCyxUujc_c63"
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
