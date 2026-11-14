// ============================================================
//  EXAM SETTINGS + QUESTION BANK  (server side only - never sent to the browser)
//  In every question, the FIRST option in "o" is the correct answer.
//  The server shuffles the options before sending them to the candidate.
// ============================================================

export const CONFIG = {
  total: 40,          // questions per paper
  durationSec: 30 * 60, // exam time in seconds
  passPct: 70,        // pass mark in %
  maxViolations: 3,   // tab/window/fullscreen exits allowed before the exam is ended (3 = 2 warnings, 3rd ends the exam)
  graceSec: 30,       // extra seconds allowed for network delay when submitting
};

export const BANK = [
 // ---- Zone identification from training pages ----
 {tag:"Zone identification",img:"img/q_masthead.jpg",q:"The newspaper name block marked in orange (\"DIE TAT\" with the tagline) should be zoned as:",o:["IssueTitle","Title","SectionTitle","Image"]},
 {tag:"Zone identification",img:"img/q_section.jpg",q:"The page section heading marked in orange (\"AUSLAND\") should be zoned as:",o:["SectionTitle","Title","IssueTitle","Subtitle"]},
 {tag:"Zone identification",img:"img/q_kicker.jpg",q:"The small lead line marked in orange, sitting just above the main headline, should be zoned as:",o:["TitleLead","Subtitle","Para","Caption"]},
 {tag:"Zone identification",img:"img/q_title3.jpg",q:"The main article headline marked in orange should be zoned as:",o:["Title","TitleLead","SectionTitle","Subtitle"]},
 {tag:"Zone identification",img:"img/q_title1.jpg",q:"The large headline marked in orange (\"Weihnachten in aller Welt\") should be zoned as:",o:["Title","IssueTitle","SectionLead","Caption"]},
 {tag:"Zone identification",img:"img/q_para1.jpg",q:"The article body text marked in orange should be zoned as:",o:["Para","Author-para","Caption","Margin"]},
 {tag:"Zone identification",q:"A photograph or illustration inside an article should be zoned as:",o:["Image","Caption","Para","Margin"]},
 {tag:"Zone identification",q:"The descriptive text printed directly under a photograph is zoned as:",o:["Caption","Subtitle","Para","TitleLead"]},
 {tag:"Zone identification",q:"A secondary heading printed directly BELOW the main headline (explaining it further) is zoned as:",o:["Subtitle","TitleLead","SectionTitle","Title"]},
 {tag:"Zone identification",q:"In Web Zoner, when you draw a new zone it appears in red by default. Red is the colour of which zone type?",o:["Para","Title","Image","IssueTitle"]},

 // ---- Zone type shortcut keys ----
 {tag:"Shortcut keys",q:"Which key sets the selected zone as Para?",o:["P","A","R","Ctrl+P"]},
 {tag:"Shortcut keys",q:"Which key sets the selected zone as Title?",o:["T","Ctrl+T","B","L"]},
 {tag:"Shortcut keys",q:"Which key sets the selected zone as Image?",o:["I","M","G","Ctrl+I"]},
 {tag:"Shortcut keys",q:"Which key sets the selected zone as TitleLead?",o:["B","L","T","E"]},
 {tag:"Shortcut keys",q:"Which key sets the selected zone as IssueTitle?",o:["D","I","U","F"]},
 {tag:"Shortcut keys",q:"Which key sets the selected zone as SectionTitle?",o:["F","S","E","H"]},
 {tag:"Shortcut keys",q:"Which key sets the selected zone as Subtitle?",o:["S","U","B","Ctrl+S"]},
 {tag:"Shortcut keys",q:"Which key sets the selected zone as Caption?",o:["C","Ctrl+C","A","P"]},
 {tag:"Shortcut keys",q:"Which key sets the selected zone as Author-para?",o:["U","A","Y","Ctrl+U"]},
 {tag:"Shortcut keys",q:"Which shortcut sets the selected zone as cont-Caption (continued caption)?",o:["Ctrl+C","C","Ctrl+V","Shift+C"]},
 {tag:"Shortcut keys",q:"Which key sets the selected zone as Margin?",o:["W","M","N","X"]},
 {tag:"Shortcut keys",q:"Which key sets the selected zone as Firstname?",o:["A","F","N","Ctrl+V"]},

 // ---- Zone colours ----
 {tag:"Zone colours",q:"In Web Zoner, a zone marked as Title is shown in which colour?",o:["Green","Red","Blue","Yellow"]},
 {tag:"Zone colours",q:"In Web Zoner, a zone marked as Image is shown in which colour?",o:["Blue","Green","Pink","Grey"]},
 {tag:"Zone colours",q:"In Web Zoner, the IssueTitle (newspaper name) zone is shown in which colour?",o:["Pink / light violet","Green","Red","Cyan"]},
 {tag:"Zone colours",q:"In Web Zoner, a TitleLead zone is shown in which colour?",o:["Cyan (light blue)","Green","Yellow","Brown"]},

 // ---- Function shortcuts ----
 {tag:"Tool functions",q:"Which key draws a New Zone (rectangle)?",o:["N","Z","R","Ctrl+N"]},
 {tag:"Tool functions",q:"Which key is used to GROUP selected zones into one article?",o:["G","M","Ctrl+G","O"]},
 {tag:"Tool functions",q:"Which key MERGES selected zones?",o:["M","G","J","Ctrl+M"]},
 {tag:"Tool functions",q:"Which key is used for Multi Select of zones?",o:["Q","Ctrl+A","M","Shift"]},
 {tag:"Tool functions",q:"Which key performs a Horizontal Split of a zone?",o:["J","K","H","S"]},
 {tag:"Tool functions",q:"Which key performs a Vertical Split of a zone?",o:["K","J","V","Ctrl+K"]},
 {tag:"Tool functions",q:"Which key sets the reading Sequence (Set Sequence) of zones?",o:["Z","S","Q","Ctrl+Z"]},
 {tag:"Tool functions",q:"Which key opens the Help window that lists all zone types and shortcuts?",o:["5","H","F1","6"]},
 {tag:"Tool functions",q:"Which key shows the Articles in Page list?",o:["6","5","O","A"]},
 {tag:"Tool functions",q:"Which shortcut is used to GOTO a specific page?",o:["Shift+G","G","Ctrl+G","Alt+G"]},
 {tag:"Tool functions",q:"Which key shows / hides the zone labels on the page?",o:["/ (slash)",". (dot)","L","Ctrl+L"]},
 {tag:"Tool functions",q:"Which shortcut removes rotation from a zone (Remove Rotation)?",o:["Ctrl+R","R","Shift+R","Ctrl+X"]},
 {tag:"Tool functions",q:"Which key opens Article Observe to review an article's zones?",o:["O","A",";","X"]},

 // ---- Workflow / tool ----
 {tag:"Workflow",q:"An article continues on another page (e.g. \"Fortsetzung von Seite 1\" = continued from page 1). Which right-click option connects the two parts?",o:["Add Forward Link","New Zone","Move Front","Goto"]},
 {tag:"Workflow",q:"In the Web Zoner header, the page counter shows \"00003 / 16\". What does it mean?",o:["Page 3 of 16 pages in the issue","Article 3 of 16 articles","Zone 3 of 16 zones","Batch 3 of 16 batches"]},
 {tag:"Workflow",q:"Which Web Zoner toolbar button checks the page for zoning errors before you finish?",o:["Validate","Preview","Source","Link"]},
 {tag:"Workflow",q:"Which button do you click to submit the issue after all pages are zoned and validated?",o:["Finish","Close","Image","Source"]},
 {tag:"Workflow",q:"Which two buttons are available in the Web Zoner QC tool but NOT in the normal zoning tool?",o:["Audit and Reject","Save and Close","Validate and Preview","Link and Image"]},
 {tag:"Workflow",q:"What is the work in this Newspaper Zoning project?",o:["Drawing and labelling zones on newspaper pages in the online tool — no typing","Typing the full newspaper text","Translating German articles to English","Scanning physical newspapers"]},
 {tag:"Workflow",q:"Which shortcut creates an Untitled Article (an article that has no headline)?",o:["Ctrl+N","N","Ctrl+S","Ctrl+T"]},
];

function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build one candidate paper: all image questions + random others, shuffled.
export function buildPaper() {
  const all = BANK.map((b, i) => ({ ...b, id: i }));
  const img = all.filter((b) => b.img);
  const rest = shuffle(all.filter((b) => !b.img));
  const pick = shuffle(img.concat(rest.slice(0, CONFIG.total - img.length)));
  return pick.map((b) => {
    const opts = shuffle(b.o);
    return { id: b.id, tag: b.tag, img: b.img || null, q: b.q, opts, correct: opts.indexOf(b.o[0]) };
  });
}
