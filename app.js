
// Mobile navigation menu
(function(){
  const toggle=document.querySelector('.menu-toggle');
  const menu=document.getElementById('mobile-menu');
  if(!toggle || !menu) return;
  toggle.addEventListener('click',()=>{
    const isOpen=!menu.hasAttribute('hidden');
    if(isOpen){
      menu.setAttribute('hidden','');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open menu');
      toggle.textContent='☰';
    }else{
      menu.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded','true');
      toggle.setAttribute('aria-label','Close menu');
      toggle.textContent='✕';
    }
  });
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    menu.setAttribute('hidden','');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
    toggle.textContent='☰';
  }));
})();
const events=[
["🏸","Badminton","Racquet sport","badminton"],["🏏","Box Cricket","Team sport","box-cricket"],["🏀","Basketball","Team sport","basketball"],["🎯","Carroms","Indoor game","carroms"],["♟️","Chess","Mind game","chess"],["🏊","Swimming","Aquatic sport","swimming"],["🏓","Table Tennis","Racquet sport","table-tennis"],["🎨","Drawing","Creative activity","drawing"],["🎵","Musical Chairs","Fun game","musical-chairs"],["🧠","Quiz","Fun & knowledge","quiz"],["🚲","Slow Cycle","Fun challenge","slow-cycle"],["🐸","Frog Jump","Fun challenge","frog-jump"],["🎲","Fun Games (4-6)","Fun game • Age 4-6","fun-games-4-6"]];
const rules={
"Badminton":["Participants must report before their scheduled match.","Matches will follow the format announced by organisers.","Players must use safe, non-damaging footwear and equipment.","Officials' scoring decisions during a match are final."],
"Box Cricket":["Team size and overs will be announced before the tournament.","Only registered players may participate.","Players must follow the umpire's decisions.","Safe play is required; no intentional dangerous play."],
"Basketball":["Teams must report before their scheduled match.","Games will follow the time/format announced by organisers.","Respect referees and other players.","No dangerous or deliberate physical play."],
"Carroms":["Players must report on time.","Striker and turn rules will be explained before play.","Only organiser-approved board and equipment will be used.","The scorer/referee's recorded result is final."],
"Chess":["Players must report before the round.","Touch-move and time controls, if used, will be announced before play.","Players must maintain a quiet playing area.","The arbiter/organiser's decision is final."],
"Swimming":["Participants must follow pool safety instructions at all times.","Children must report to the pool area with their assigned volunteer.","No running around the pool deck.","Events and lane rules will be explained before each race."],
"Table Tennis":["Players must report before their match.","Match format and scoring will be announced before play.","Players must respect the table, equipment and opponent.","Official scoring decisions are final."],
"Drawing":["Theme, paper size and time limit will be announced before the activity.","Participants must use the materials allowed by organisers.","Entries must be completed within the allotted time.","Judging criteria will be announced before the competition."],
"Musical Chairs":["Participants must follow the volunteer's instructions.","No pushing, pulling or grabbing another child.","Children must walk safely around the chairs.","The game volunteer's decision is final."],
"Quiz":["Teams or individual format will be announced before the round.","Questions must be answered within the stated time.","No mobile phones or outside assistance unless organisers permit it.","Quizmaster's decision is final."],
"Slow Cycle":["Participants must wear required safety gear.","The objective is controlled slow cycling, not stopping with both feet down.","No pushing, blocking or unsafe riding.","The event marshal's decision is final."],
"Frog Jump":["Participants must report before their turn.","Jump only within the marked course or lane.","No pushing, blocking or unsafe contact.","The event volunteer's decision is final."],
"Fun Games (4-6)":["This event is for children in the 4-6 age group.","Participants must follow volunteer instructions for each game.","No pushing, pulling or unsafe behaviour.","The game volunteer's decision is final."]};

const eventGrid=document.getElementById("event-grid");
if(eventGrid) eventGrid.innerHTML=events.map(e=>`<a class="card event-card" href="event.html?game=${encodeURIComponent(e[3])}"><div class="emoji">${e[0]}</div><h3>${e[1]}</h3><p>${e[2]}</p><span class="card-link">View event details →</span></a>`).join("");
const general=[
["👨‍👩‍👧","Parent & Child Safety",["Parents/guardians should remain reachable during the event.","Children must follow volunteer instructions.","Inform organisers about relevant allergies or safety requirements through the private registration process."]],
["⏰","Reporting & Punctuality",["Participants should report at least 15 minutes before their event unless the schedule says otherwise.","Late arrival may affect participation if the event has already started.","Check the website/schedule for changes."]],
["👕","Dress & Equipment",["Wear comfortable sports clothing and suitable footwear.","Bring only the equipment requested for the event.","Label personal belongings where practical."]],
["🤝","Fair Play & Behaviour",["Respect participants, volunteers, referees and organisers.","No bullying, abusive language, cheating or deliberate unsafe behaviour.","Celebrate participation and effort as well as results."]],
["💧","Health & Hydration",["Bring water and take breaks when required.","Tell a volunteer immediately if a child feels unwell or is injured.","Follow venue-specific safety instructions."]],
["📸","Photos & Privacy",["Event photography may be used only according to community consent arrangements.","Do not publish another child's personal information.","Public result displays should use only approved participant information."]]];
const gg=document.getElementById("guideline-grid"); if(gg) gg.innerHTML=general.map(g=>`<div class="guide"><h3>${g[0]} ${g[1]}</h3><ul>${g[2].map(x=>`<li>${x}</li>`).join("")}</ul></div>`).join("");
const rg=document.getElementById("rules-grid"); if(rg) rg.innerHTML=Object.entries(rules).map(([k,v])=>`<a class="rule event-rule" href="event.html?game=${encodeURIComponent(events.find(e=>e[1]===k)?.[3]||'')}"><h3>${events.find(e=>e[1]===k)?.[0]||"🏅"} ${k}</h3><ul>${v.map(x=>`<li>${x}</li>`).join("")}</ul><span class="card-link">Open full event page →</span></a>`).join("");
const formBtn=document.getElementById("form-btn"); if(formBtn) formBtn.onclick=()=>CONFIG.googleFormUrl?window.open(CONFIG.googleFormUrl,"_blank"):alert("Google Form link will be added soon.");
