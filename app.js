
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
function renderHomeReferences(refs){
 const box=document.getElementById("reference-grid"); if(!box)return;
 if(!refs.length){box.innerHTML='<div class="doc-empty">No reference links published yet.</div>';return;}
 box.innerHTML=refs.filter(r=>r.url||r.link||r.driveUrl).map(r=>{const url=r.url||r.link||r.driveUrl; return `<a class="reference-card" href="${esc(url)}" target="_blank" rel="noopener"><div class="reference-icon">🔗</div><div><b>${esc(r.title||r.name||"Reference")}</b><span>${esc(r.event||"All Events")} • ${esc(r.category||r.referenceType||"Reference")} • ${esc(r.type||r.format||"Link")}</span></div><strong>Open →</strong></a>`}).join("")||'<div class="doc-empty">No valid reference links published yet.</div>';
}
function esc(v){return String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
const HOME_CACHE_KEY = "khelostav_home_v4";
const HOME_CACHE_MS = 5 * 60 * 1000;

function renderHomeData(d){
   const schedulesBySport=d.schedulesBySport||{};
   const resultsBySport=d.resultsBySport||{};
   const s=Object.values(schedulesBySport).flat();
   const r=Object.values(resultsBySport).flat();
   const v=d.volunteers||[];
   const e=d.enrollments||[];

   const sb=document.getElementById("schedule-body");
   if(sb){
     // Homepage schedule = HIGH LEVEL ONLY.
     // One row for each Day + Event + Age Group.
     // Multiple detailed rows are collapsed to the earliest Event Time.
     // Multi-day source values such as "1, 2" are split into separate day rows.
     const grouped={};
     const timeToMinutes=(value)=>{
       const raw=String(value||'').trim().toUpperCase();
       if(!raw) return Number.POSITIVE_INFINITY;
       const m=raw.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/);
       if(!m) return Number.POSITIVE_INFINITY;
       let h=Number(m[1]); const min=Number(m[2]||0); const ap=m[3];
       if(ap==='AM' && h===12) h=0;
       if(ap==='PM' && h!==12) h+=12;
       return h*60+min;
     };
     const splitDays=(value)=>{
       const raw=String(value||'').trim();
       if(!raw) return [''];
       return raw.split(/\s*(?:,|\/|&|\band\b)\s*/i).map(x=>x.trim()).filter(Boolean);
     };
     const dayLabel=(value)=>{
       const raw=String(value||'').trim();
       const m=raw.match(/^(?:day\s*)?(\d+)$/i);
       return m ? 'Day '+m[1] : raw;
     };
     s.forEach(x=>{
       const event=String(x.Event||x.event||'').trim();
       const age=String(x["Age Group"]||x.ageGroup||'').trim();
       if(!event) return;
       splitDays(x.Day||x.day||'').forEach(dayValue=>{
         const day=dayLabel(dayValue);
         const key=[day.toLowerCase(),event.toLowerCase(),age.toLowerCase()].join('|');
         if(!grouped[key]) grouped[key]={day,event,age,startTime:'',startMinutes:Number.POSITIVE_INFINITY,venues:[],statuses:[]};
         const g=grouped[key];
         const t=String(x["Event Time"]||x.time||'').trim(); const tm=timeToMinutes(t);
         if(tm<g.startMinutes){g.startMinutes=tm;g.startTime=t;} else if(!g.startTime&&t){g.startTime=t;}
         const venue=String(x.Venue||x.venue||'').trim(); if(venue&&!g.venues.includes(venue)) g.venues.push(venue);
         const status=String(x.Status||x.status||'').trim(); if(status&&!g.statuses.includes(status)) g.statuses.push(status);
       });
     });
     const daySort=(value)=>{const m=String(value||'').match(/\d+/);return m?Number(m[0]):999;};
     const rows=Object.values(grouped).sort((a,b)=>{
       const d=daySort(a.day)-daySort(b.day); if(d)return d;
       const t=a.startMinutes-b.startMinutes; if(t)return t;
       const e=a.event.localeCompare(b.event); if(e)return e;
       return a.age.localeCompare(b.age);
     });
     window.khelScheduleRows=rows;
     window.renderKhelSchedule=(selectedDay='all')=>{
       const wanted=String(selectedDay||'all').trim().toLowerCase();
       const filtered=wanted==='all'?window.khelScheduleRows:window.khelScheduleRows.filter(x=>String(x.day||'').trim().toLowerCase()===wanted);
       sb.innerHTML=filtered.length
         ? filtered.map(x=>`<tr><td>${esc(x.day)}</td><td>${esc(x.startTime)}</td><td><b>${esc(x.event)}</b></td><td>${esc(x.age)}</td><td>${esc(x.venues.join(", "))}</td><td>${esc(x.statuses.join(", "))}</td></tr>`).join("")
         : `<tr><td colspan="6">No events scheduled for ${esc(selectedDay)}.</td></tr>`;
     };
     window.renderKhelSchedule('all');
   }

   const rb=document.getElementById("results-body");
   if(rb) rb.innerHTML=r.length?r.map(x=>`<tr><td>${esc(x.Event||x.event||"")}</td><td>${esc(x["Age Group"]||x.ageGroup)}</td><td>${esc(x.Position||x.position)}</td><td>${esc(x["Child Name"]||x.child)}</td><td>${esc(x.Block||x.block)}</td><td>${esc(x["Flat Number"]||x.flatNumber)}</td><td>${esc(x["Score / Time"]||x.score)}</td><td>${esc(x.Medal||x.medal)}</td></tr>`).join(""):`<tr><td colspan="8">No results published yet.</td></tr>`;

   const vb=document.getElementById("volunteer-body");
   if(vb) vb.innerHTML=v.length?v.map(x=>`<tr><td>${esc(x["Event / Sport"]||x["Sport / Area"]||x.Sport||x.sport||x.Event||x.event)}</td><td>${esc(x.Role||x.role)}</td><td>${esc(x.Name||x.name)}</td><td>${esc(x.Block||x.block)}</td><td>${esc(x["Flat Number"]||x.flatNumber)}</td><td>${esc(x.Contact||x.contact)}</td><td>${esc(x.Reporting||x.reporting)}</td><td>${esc(x.Status||x.status)}</td></tr>`).join(""):`<tr><td colspan="8">Volunteer details will be published here.</td></tr>`;

   renderHomeReferences(d.references||[]);

   const eb=document.getElementById("enrollment-body");
   if(eb) eb.innerHTML=e.length?e.map(x=>`<tr><td>${esc(x["Child Name"]||x.Child||x.child)}</td><td>${esc(x["Age Group"]||x.ageGroup)}</td><td>${esc(x.Event||x.event)}</td><td>${esc(x.Block||x.block)}</td><td>${esc(x["Flat Number"]||x.flatNumber)}</td><td>${esc(x["Enrollment Status"]||x.enrollmentStatus)}</td><td>${esc(x["Event Status"]||x.eventStatus)}</td></tr>`).join(""):`<tr><td colspan="7">Enrollment summary will appear after Google Form is connected.</td></tr>`;

   if(document.getElementById("total")){
     document.getElementById("total").textContent=e.length;
     document.getElementById("confirmed").textContent=e.filter(x=>String(x["Enrollment Status"]||x.enrollmentStatus).toLowerCase()==="confirmed").length;
     document.getElementById("pending").textContent=e.filter(x=>String(x["Enrollment Status"]||x.enrollmentStatus).toLowerCase()==="pending").length;
   }
}

async function load(){
 if(!CONFIG.apiUrl)return;
 // Show the previous successful data immediately, then refresh in the background.
 try{
   const cached=localStorage.getItem(HOME_CACHE_KEY);
   if(cached){
     const item=JSON.parse(cached);
     if(item && item.data){
       renderHomeData(item.data);
     }
   }
 }catch(err){}

 try{
   const response=await fetch(CONFIG.apiUrl+"?action=all",{cache:"no-store"});
   const d=await response.json();
   if(d && d.success!==false){
     try{localStorage.setItem(HOME_CACHE_KEY,JSON.stringify({savedAt:Date.now(),data:d}));}catch(err){}
     renderHomeData(d);
   }
 }catch(err){
   console.warn("Live data refresh failed",err);
 }
}
document.querySelectorAll(".filters [data-day]").forEach(btn=>{
 btn.addEventListener("click",()=>{
  document.querySelectorAll(".filters [data-day]").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  if(window.renderKhelSchedule) window.renderKhelSchedule(btn.getAttribute("data-day")||"all");
 });
});

if(document.getElementById("schedule-body")){load();setInterval(load,CONFIG.refreshSeconds*1000);}
