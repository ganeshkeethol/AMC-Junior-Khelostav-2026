
// Light sports-themed falling emoji decoration. Non-interactive and automatically
// disabled for reduced-motion users.
(function addFallingSportsEmojis(){
  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (document.getElementById('falling-sports-emojis')) return;

  const layer = document.createElement('div');
  layer.id = 'falling-sports-emojis';
  layer.setAttribute('aria-hidden','true');

  const icons = ['🎾','🏸','🏀','🏏','🏅','🎾','🏸','🏀','🏏','🏅','🎾','🏸'];
  icons.forEach((icon, i) => {
    const item = document.createElement('span');
    item.className = 'falling-sports-emoji';
    item.textContent = icon;
    item.style.setProperty('--x', `${6 + ((i * 13.7) % 88)}vw`);
    item.style.setProperty('--delay', `${reduceMotion ? '0s' : -(i * 1.35) + 's'}`);
    item.style.setProperty('--duration', `${8 + (i % 5)}s`);
    item.style.setProperty('--drift', `${(i % 2 ? 16 : -16)}px`);
    item.style.setProperty('--size', `${18 + (i % 4) * 3}px`);
    if (reduceMotion) {
      item.classList.add('falling-sports-emoji-static');
      item.style.setProperty('--static-y', `${8 + ((i * 17) % 82)}vh`);
    }
    layer.appendChild(item);
  });

  document.body.appendChild(layer);
})();

// Responsive mobile navigation: desktop top nav, floating mobile menu.
(function(){
  const toggle=document.querySelector('.menu-toggle');
  const menu=document.getElementById('mobile-menu');
  if(!toggle || !menu) return;

  const backdrop=document.createElement('div');
  backdrop.className='mobile-menu-backdrop';
  backdrop.setAttribute('aria-hidden','true');
  document.body.appendChild(backdrop);

  function closeMenu(){
    menu.setAttribute('hidden','');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
    toggle.textContent='☰';
    document.body.classList.remove('mobile-menu-open');
  }

  function openMenu(){
    menu.removeAttribute('hidden');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Close menu');
    toggle.textContent='✕';
    document.body.classList.add('mobile-menu-open');
  }

  toggle.addEventListener('click',()=>{
    const isOpen=!menu.hasAttribute('hidden');
    isOpen ? closeMenu() : openMenu();
  });

  backdrop.addEventListener('click',closeMenu);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && !menu.hasAttribute('hidden')) closeMenu();
  });

  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
})();

// Centralised event start label: edit only CONFIG.eventDate in config.js.
const startLabel = (window.CONFIG && CONFIG.eventDate) ? String(CONFIG.eventDate) : "November 1st onwards";
(function(){
  const hero = document.getElementById("event-date-display");
  if(hero) hero.textContent = startLabel;
  const inline = document.getElementById("event-date-inline");
  if(inline) inline.textContent = startLabel;
  const footer = document.getElementById("footer-event-date");
  if(footer) footer.textContent = startLabel;
})();
const events=[
["🏸","Badminton","Racquet sport","badminton"],["🏏","Box Cricket","Team sport","box-cricket"],["🏀","Basketball","Team sport","basketball"],["🎯","Carroms","Indoor game","carroms"],["♟️","Chess","Mind game","chess"],["🏊","Swimming","Aquatic sport","swimming"],["🏓","Table Tennis","Racquet sport","table-tennis"],["🎨","Drawing","Creative activity","drawing"],["🎵","Musical Chairs","Fun game","musical-chairs"],["🧠","Quiz","Fun & knowledge","quiz"],["🚲","Slow Cycling","Fun challenge","slow-cycle"],["🐸","Frog Jump","Fun challenge","frog-jump"],["🎲","Fun Games (4-6)","Fun game • Age 4-6","fun-games-4-6"],["🎭","Fancy Dress","Creative activity","fancy-dress"]];
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
const formBtn=document.getElementById("form-btn"); if(formBtn) formBtn.onclick=()=>CONFIG.googleFormUrl?window.open(CONFIG.googleFormUrl,"_blank"):alert("Google Form link will be added soon.");

/* Dynamic kids enrollment deadline: edit only CONFIG.enrollmentDeadline in config.js. */
(function(){
  const deadline=(window.CONFIG && CONFIG.enrollmentDeadline) ? String(CONFIG.enrollmentDeadline) : "October 24, 2026";
  document.querySelectorAll(".enrollment-deadline-value, .enrollment-deadline-light-value").forEach(el=>{ el.textContent=deadline; });
})();


// Lightweight homepage high-level schedule. It fetches only one small Google Sheet.
(function loadHighLevelSchedule(){
  const daysEl=document.getElementById('schedule-days');
  const contentEl=document.getElementById('schedule-content');
  if(!daysEl || !contentEl || !window.CONFIG || !CONFIG.apiUrl) return;
  fetch(CONFIG.apiUrl+'?action=highLevelSchedule&_='+Date.now(), {cache:'no-store'})
    .then(r=>r.json())
    .then(payload=>{
      const rows=Array.isArray(payload.schedule)?payload.schedule:[];
      if(!rows.length){
        contentEl.innerHTML='<div class="schedule-empty"><b>Schedule starts '+startLabel+'</b><span>The day-wise schedule will appear here as organisers publish dates and timings.</span></div>';
        return;
      }
      const clean=v=>String(v==null?'':v).trim();
      const get=(r,...keys)=>{for(const k of keys){if(clean(r[k])) return clean(r[k]);}return '';};
      const dayKey=r=>get(r,'Day','day') || 'Schedule';
      const dateVal=r=>get(r,'Date','date');
      const grouped={}; const order=[];
      rows.forEach(r=>{const d=dayKey(r); if(!grouped[d]){grouped[d]=[];order.push(d);} grouped[d].push(r);});
      order.forEach(d=>grouped[d].sort((a,b)=>String(get(a,'Start Time','Event Time','Time')).localeCompare(String(get(b,'Start Time','Event Time','Time')))));
      const buttonDateLabel=d=>{
        const first=(grouped[d]||[])[0]||{};
        const raw=get(first,'Date','date');
        if(!raw) return d;
        const m=String(raw).trim().match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
        if(m) return `${String(m[1]).padStart(2,'0')}-${String(m[2]).padStart(2,'0')}-${m[3]}`;
        const iso=String(raw).trim().match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
        if(iso) return `${String(iso[3]).padStart(2,'0')}-${String(iso[2]).padStart(2,'0')}-${iso[1]}`;
        return raw;
      };
      daysEl.innerHTML=order.map((d,i)=>`<button class="schedule-day-btn${i===0?' active':''}" data-day="${encodeURIComponent(d)}">${buttonDateLabel(d)}</button>`).join('');
      function formatScheduleDate(v){
        const raw=clean(v);
        if(!raw) return '';
        let dt=null;
        let m=raw.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
        if(m){ dt=new Date(Number(m[3]), Number(m[2])-1, Number(m[1])); }
        else {
          m=raw.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
          if(m) dt=new Date(Number(m[1]), Number(m[2])-1, Number(m[3]));
        }
        if(!dt || Number.isNaN(dt.getTime())) return raw;
        const weekdays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const dd=String(dt.getDate()).padStart(2,'0');
        const mm=String(dt.getMonth()+1).padStart(2,'0');
        const yyyy=dt.getFullYear();
        return `${weekdays[dt.getDay()]} • ${dd}-${mm}-${yyyy}`;
      }
      const renderDay=d=>{
        const list=grouped[d]||[]; const firstDate=dateVal(list[0]);
        const dateLabel=firstDate?`<span class="schedule-date">${formatScheduleDate(firstDate)}</span>`:'';
        contentEl.innerHTML=`<div class="schedule-day-head"><h3>${d}</h3>${dateLabel}</div><div class="schedule-list">${list.map(r=>{
          const time=get(r,'Start Time','Event Time','Time')||'TBA';
          const event=get(r,'Event','Sport','Name')||'Event';
          const age=get(r,'Age Group','Age','Category')||'All Ages';
          const venue=get(r,'Venue','Location')||'Venue TBA';
          const status=get(r,'Status')||'';
          return `<div class="schedule-row"><div class="schedule-time">${time}</div><div class="schedule-event"><b>${event}</b><span>${age}</span></div><div class="schedule-venue">📍 ${venue}</div><div class="schedule-status">${status}</div></div>`;
        }).join('')}</div>`;
      };
      daysEl.querySelectorAll('.schedule-day-btn').forEach(btn=>btn.addEventListener('click',()=>{
        daysEl.querySelectorAll('.schedule-day-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); renderDay(decodeURIComponent(btn.dataset.day));
      }));
      renderDay(order[0]);
    })
    .catch(()=>{contentEl.innerHTML='<div class="schedule-empty"><b>Schedule starts '+startLabel+'</b><span>The day-wise schedule will appear here as organisers publish dates and timings.</span></div>';});
})();
