const events=[
["🏸","Badminton","Racquet sport"],["🏏","Box Cricket","Team sport"],["🏀","Basketball","Team sport"],["🎯","Carroms","Indoor game"],["♟️","Chess","Mind game"],["🏊","Swimming","Aquatic sport"],["🏓","Table Tennis","Racquet sport"],["🎨","Drawing","Creative activity"],["🎵","Musical Chairs","Fun game"],["🧠","Quiz","Fun & knowledge"],["🚲","Slow Cycle","Fun challenge"]];
const rules={
"Badminton":["Participants must report before their scheduled match.","Matches will follow the format announced by organisers.","Players must use safe, non-damaging footwear and equipment.","Officials' scoring decisions during a match are final."],
"Box Cricket":["Team size and overs will be announced before the tournament.","Only registered players may participate.","Players must follow the umpire's decisions.","Safe play is required; no intentional dangerous play."],
"Basketball":["Teams must report before their scheduled match.","Games will follow the time/format announced by organisers.","Respect referees and other players.","No dangerous or deliberate physical play."],
"Carroms":["Players must report on time.","Striker and turn rules will be explained before play.","Only the organiser-approved board and equipment will be used.","The scorer/referee's recorded result is final."],
"Chess":["Players must report before the round.","Touch-move and time controls, if used, will be announced before play.","Players must maintain a quiet playing area.","The arbiter/organiser's decision is final."],
"Swimming":["Participants must follow pool safety instructions at all times.","Children must report to the pool area with their assigned volunteer.","No running around the pool deck.","Events and lane rules will be explained before each race."],
"Table Tennis":["Players must report before their match.","Match format and scoring will be announced before play.","Players must respect the table, equipment and opponent.","Official scoring decisions are final."],
"Drawing":["Theme, paper size and time limit will be announced before the activity.","Participants must use the materials allowed by organisers.","Entries must be completed within the allotted time.","Judging criteria will be announced before the competition."],
"Musical Chairs":["Participants must follow the volunteer's instructions.","No pushing, pulling or grabbing another child.","Children must walk safely around the chairs.","The game volunteer's decision is final."],
"Quiz":["Teams or individual format will be announced before the round.","Questions must be answered within the stated time.","No mobile phones or outside assistance unless organisers permit it.","Quizmaster's decision is final."],
"Slow Cycle":["Participants must wear required safety gear.","The objective is controlled slow cycling, not stopping with both feet down.","No pushing, blocking or unsafe riding.","The event marshal's decision is final."]};
const eventGrid=document.getElementById("event-grid");
eventGrid.innerHTML=events.map(e=>`<div class="card"><div class="emoji">${e[0]}</div><h3>${e[1]}</h3><p>${e[2]}</p></div>`).join("");
const general=[
["👨‍👩‍👧","Parent & Child Safety",["Parents/guardians should remain reachable during the event.","Children must follow volunteer instructions.","Inform organisers about relevant allergies or safety requirements through the private registration process."]],
["⏰","Reporting & Punctuality",["Participants should report at least 15 minutes before their event unless the schedule says otherwise.","Late arrival may affect participation if the event has already started.","Check the website/schedule for changes."]],
["👕","Dress & Equipment",["Wear comfortable sports clothing and suitable footwear.","Bring only the equipment requested for the event.","Label personal belongings where practical."]],
["🤝","Fair Play & Behaviour",["Respect participants, volunteers, referees and organisers.","No bullying, abusive language, cheating or deliberate unsafe behaviour.","Celebrate participation and effort as well as results."]],
["💧","Health & Hydration",["Bring water and take breaks when required.","Tell a volunteer immediately if a child feels unwell or is injured.","Follow venue-specific safety instructions."]],
["📸","Photos & Privacy",["Event photography may be used only according to community consent arrangements.","Do not publish another child's personal information.","Public result displays should use only approved participant information."]]
];
document.getElementById("guideline-grid").innerHTML=general.map(g=>`<div class="guide"><h3>${g[0]} ${g[1]}</h3><ul>${g[2].map(x=>`<li>${x}</li>`).join("")}</ul></div>`).join("");
document.getElementById("rules-grid").innerHTML=Object.entries(rules).map(([k,v])=>`<div class="rule"><h3>${events.find(e=>e[1]===k)?.[0]||"🏅"} ${k}</h3><ul>${v.map(x=>`<li>${x}</li>`).join("")}</ul></div>`).join("");
document.getElementById("form-btn").onclick=()=>CONFIG.googleFormUrl?window.open(CONFIG.googleFormUrl,"_blank"):alert("Google Form link will be added soon.");
async function load(){
 if(!CONFIG.apiUrl)return;
 try{const d=await (await fetch(CONFIG.apiUrl+"?action=all",{cache:"no-store"})).json();
 const s=d.schedule||[],r=d.results||[],v=d.volunteers||[],e=d.enrollments||[];
 document.getElementById("schedule-body").innerHTML=s.length?s.map(x=>`<tr><td>${x.day||""}</td><td>${x.reporting||""}</td><td>${x.time||""}</td><td><b>${x.event||""}</b></td><td>${x.ageGroup||""}</td><td>${x.venue||""}</td><td>${x.status||""}</td></tr>`).join(""):`<tr><td colspan="7">Schedule coming soon.</td></tr>`;
 document.getElementById("results-body").innerHTML=r.length?r.map(x=>`<tr><td>${x.event||""}</td><td>${x.ageGroup||""}</td><td>${x.position||""}</td><td>${x.child||""}</td><td>${x.score||""}</td><td>${x.medal||""}</td></tr>`).join(""):`<tr><td colspan="6">No results published yet.</td></tr>`;
 document.getElementById("volunteer-body").innerHTML=v.length?v.map(x=>`<tr><td>${x.sport||""}</td><td>${x.role||""}</td><td>${x.name||""}</td><td>${x.contact||""}</td><td>${x.reporting||""}</td></tr>`).join(""):`<tr><td colspan="5">Volunteer details will be published here.</td></tr>`;
 document.getElementById("enrollment-body").innerHTML=e.length?e.map(x=>`<tr><td>${x.child||""}</td><td>${x.ageGroup||""}</td><td>${x.event||""}</td><td>${x.enrollmentStatus||""}</td><td>${x.eventStatus||""}</td></tr>`).join(""):`<tr><td colspan="5">Enrollment summary will appear after Google Form is connected.</td></tr>`;
 document.getElementById("total").textContent=e.length||"0";document.getElementById("confirmed").textContent=e.filter(x=>String(x.enrollmentStatus).toLowerCase()==="confirmed").length;document.getElementById("pending").textContent=e.filter(x=>String(x.enrollmentStatus).toLowerCase()==="pending").length;
 }catch(err){console.log(err)}
}
load();setInterval(load,CONFIG.refreshSeconds*1000);