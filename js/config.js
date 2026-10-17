/* ===== EDIT THESE ===== */
var CONFIG = {
  groom: "Soem Kungkiet",
  bride: "Chham Chanthu",
  date: "2026-11-22T15:00:00+07:00",          // wedding date/time (placeholder)
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
  contact: { telegram: "", whatsapp: "" },   // telegram: username without @ · whatsapp: number with country code, e.g. 855XXXXXXXX
  /* gift accounts: entries with an empty account are not shown; the whole section hides if none */
  gifts: [
    { bank: "ABA Bank", name: "SOEM KUNGKIET", account: "000 000 000" }
  ],
  dress: {                                     // dress-code colours — delete the whole block to hide the section
    text: "សូមស្លៀកពាក់តាមពណ៌ខាងក្រោម ដើម្បីបន្ថែមភាពស្រស់ស្អាតដល់ថ្ងៃពិសេសរបស់យើងខ្ញុំ",
    colors: ["#b39b36", "#d8c068", "#fbf7ea", "#6e5c12"]
  },
  photos: [],                                  // real photo links, e.g. ["assets/photos/p1.jpg", ...] — shows a swipeable full-screen viewer (empty = upload slots)
  story: [                                     // love story timeline — edit the text; delete all entries to hide the section
    { date: "២០២៦", title: "ជួបគ្នាលើកដំបូង", text: "ពេលពួកយើងទៅដើរលេងនៅកោះទន្សាយ" },
    { date: "២០២៦", title: "ក្លាយជាគូស្នេហ៍", text: "ពេលត្រឡប់មកពីដើរវិញបាន៣ថ្ងៃ" },
    { date: "២០២៦", title: "ស្នើសុំរៀបការ", text: "ព្រោះអាយុកាន់តែចាស់" },
    { date: "២០២៦", title: "ថ្ងៃមង្គលការ", text: "ថ្ងៃដែលយើងចាប់ដៃគ្នាចូលក្នុងជីវិតថ្មី" }
  ],
  khqr: "",                                    // optional: link to your KHQR image
  live: ""                                     // optional: Facebook / YouTube live link on the wedding day
};
/* ====================== */
