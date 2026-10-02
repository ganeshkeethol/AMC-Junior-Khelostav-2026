const gameSlug = new URLSearchParams(location.search).get('game') || '';
const game = (typeof events !== 'undefined' ? events : []).find(e => e[3] === gameSlug) || (typeof events !== 'undefined' ? events[0] : null);
const gameRules = (typeof rules !== 'undefined' && game) ? (rules[game[1]] || []) : [];

function esc(v){return String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function setText(id,v){const el=document.getElementById(id); if(el) el.textContent=v;}
function norm(v){return String(v||'').trim().toLowerCase();}

if(game){
 document.title=`${game[1]} • AMC Junior Khelostav 2026`;
 setText('event-title',game[1]); setText('event-type',game[2]); setText('event-emoji',game[0]); setText('rules-heading',`${game[1]} Rules`);
 const list=document.getElementById('rules-list');
 if(list) list.innerHTML=gameRules.map((r,i)=>`<div class="rule"><b>${i+1}</b><span>${esc(r)}</span></div>`).join('');
}

function renderRulesDocs(docs){
 const box=document.getElementById('rules-docs');
 if(!box)return;
 if(!docs.length){box.innerHTML='<div class="doc-empty">No rules document has been published yet.</div>';return;}
 box.innerHTML=docs.map(d=>{
   const url=String(d.url||d.driveUrl||d.link||'').trim();
   if(!url)return '';
   return `<div class="rules-doc"><div class="doc-icon">📄</div><div class="doc-info"><b>${esc(d.title||d.document||'Game Rules Document')}</b><span>${esc(d.type||'Document')}</span></div><div class="doc-actions"><a class="doc-btn" href="${esc(url)}" target="_blank" rel="noopener">Open</a></div></div>`;
 }).join('')||'<div class="doc-empty">No valid rules document link has been published.</div>';
}

const SPORT_CACHE_PREFIX = "khelostav_sport_v5_";
const SPORT_CACHE_MS = 5 * 60 * 1000;

function renderGameData(response){
   const data=response.data || response;

   let volunteers=data.volunteers||response.volunteers||[];
   const enrollments=data.enrollments||response.enrollments||[];
   const schedule=data.schedule||response.schedule||[];
   const results=data.results||response.results||[];
   const teams=data.teams||response.teams||[];
   const teamBased=Boolean(data.teamBased || response.teamBased);

   // Rules are stored in the References spreadsheet as the Rules URL
   // for each sport. The sport API returns it as data.rulesUrl.
   // Build the document card directly from that URL.
   const rulesUrl = String(
     data.rulesUrl ||
     response.rulesUrl ||
     ''
   ).trim();

   if(rulesUrl){
     renderRulesDocs([{
       title: `${game[1]} Official Rules`,
       type: 'Google Drive / Google Docs',
       url: rulesUrl
     }]);
   }else{
     renderRulesDocs([]);
   }


   // Show volunteers assigned to this sport. The Volunteers sheet uses "Event / Sport".
   const matchingVolunteers = volunteers.filter(v => {
     const sportName = String(v.sport || v["Event / Sport"] || v["Sport / Area"] || v.Event || v.event || "").trim();
     return sportName.split(/[,;\n]+/).map(x => norm(x)).filter(Boolean).includes(norm(game[1]));
   });
   const spocCard=document.getElementById('spoc-card');
   if(spocCard){
     if(matchingVolunteers.length){
       spocCard.innerHTML = matchingVolunteers.map(v => {
         const name = v.name || v.Name || 'Volunteer';
         const block = v.block || v.Block || '';
         const flat = v.flatNumber || v["Flat Number"] || '';
         const contact = v.contact || v.Contact || '';
         const meta = [
           block ? `Block ${esc(block)}` : '',
           flat ? `Flat ${esc(flat)}` : ''
         ].filter(Boolean).join(' • ');

         // Build safe phone links. Supports numbers stored as 10 digits, +91..., 0091..., etc.
         const rawPhone = String(contact || '').replace(/[^0-9+]/g, '');
         let phoneDigits = rawPhone.replace(/^\+/, '');
         if(phoneDigits.startsWith('0091')) phoneDigits = phoneDigits.slice(2);
         if(phoneDigits.length === 10) phoneDigits = '91' + phoneDigits;
         const callUrl = phoneDigits ? `tel:+${phoneDigits}` : '';
         const waUrl = phoneDigits ? `https://wa.me/${phoneDigits}` : '';
         const actions = phoneDigits ? `<div class="volunteer-actions"><a class="volunteer-call" href="${esc(callUrl)}">📞 Call</a><a class="volunteer-whatsapp" href="${esc(waUrl)}" target="_blank" rel="noopener">💬 WhatsApp</a></div>` : '';

         return `<article class="volunteer-card"><div class="spoc-icon">👤</div><div class="spoc-details"><h3>${esc(name)}</h3>${meta ? `<p class="volunteer-meta">${meta}</p>` : ''}${actions}</div></article>`;
       }).join('');
     } else {
       spocCard.innerHTML='<div class="spoc-icon">👤</div><div><h3>Details will be published soon</h3><p>No volunteer is currently assigned to this sport in the Volunteers sheet.</p></div>';
     }
   }

   const participantBody=document.getElementById('participants-body');
   if(participantBody) participantBody.innerHTML=enrollments.length?enrollments.map(x=>`<tr><td><b>${esc(x["Child Name"]||x.Child||x.child)}</b></td><td>${esc(x["Age Group"]||x.ageGroup)}</td><td>${esc(x["Block"]||x.Block||'')}</td><td>${esc(x["Flat Number"]||x.flatNumber||'')}</td><td>${esc(x["Enrollment Status"]||x.enrollmentStatus)}</td><td>${esc(x["Event Status"]||x.eventStatus)}</td></tr>`).join(''):`<tr><td colspan="6">No enrolled kids published yet.</td></tr>`;

   const confirmed=enrollments.filter(x=>norm(x["Enrollment Status"]||x.enrollmentStatus)==='confirmed').length;
   const groups=new Set(enrollments.map(x=>x["Age Group"]||x.ageGroup).filter(Boolean));
   setText('participant-count',enrollments.length); setText('confirmed-count',confirmed); setText('age-groups-count',groups.size);

   // Group games: show team cards and use Team A / Team B schedule & results.
   const teamsSection=document.getElementById('teams-section');
   const teamsGrid=document.getElementById('teams-grid');
   if(teamsSection){
     teamsSection.hidden=!teamBased;
   }
   if(teamsGrid && teamBased){
     const sourceTeams = teams.length ? teams : buildTeamsFromEnrollments(enrollments);
     teamsGrid.innerHTML = sourceTeams.length ? sourceTeams.map(t=>{
       const id=t["Team ID"]||t.teamId||t.TeamID||'';
       const name=t["Team Name"]||t.teamName||t.Name||t.name||'Team';
       const age=t["Age Group"]||t.ageGroup||'';
       const captain=t.Captain||t.captain||'';
       const status=t["Team Status"]||t.status||t.Status||'';
       const teamPlayers=enrollments.filter(x=>String(x["Team ID"]||x.teamId||'').trim()===String(id).trim());
       const playerRows=teamPlayers.map(x=>({
         name:String(x["Child Name"]||x.Child||x.child||'').trim(),
         role:String(x["Team Role"]||x.teamRole||x.Role||x.role||'').trim().toLowerCase()
       })).filter(x=>x.name);
       const count=playerRows.length;
       const playersHtml=count
         ? `<div class="team-players"><span class="team-players-label">Players:</span><ul>${playerRows.map(player=>`<li>${esc(player.name)}${player.role==='captain'?` <span class="team-captain-badge">Captain</span>`:''}</li>`).join('')}</ul></div>`
         : `<p class="team-no-players">No players assigned yet.</p>`;
       return `<article class="team-card"><div class="team-icon">👥</div><div class="team-card-content"><h3>${esc(name)}</h3><p><b>${esc(id)}</b>${age?` • Age ${esc(age)}`:''}</p>${captain?`<p>Captain: ${esc(captain)}</p>`:''}<p>${count} player${count===1?'':'s'}${status?` • ${esc(status)}`:''}</p>${playersHtml}</div></article>`;
     }).join('') : '<div class="team-empty">No teams published yet.</div>';
   }

   const scheduleBody=document.getElementById('game-schedule-body');
   const scheduleTable=scheduleBody ? scheduleBody.closest('table') : null;
   const scheduleHead=scheduleTable ? scheduleTable.querySelector('thead tr') : null;
   if(scheduleBody){
     if(teamBased){
       if(scheduleHead) scheduleHead.innerHTML='<th>Day</th><th>Date</th><th>Reporting</th><th>Event Time</th><th>Age Group</th><th>Match / Round</th><th>Team A</th><th>Team B</th><th>Venue</th><th>Status</th>';
       scheduleBody.innerHTML=schedule.length?schedule.map(x=>`<tr><td>${esc(x.Day||x.day)}</td><td>${esc(x.Date||x.date)}</td><td>${esc(x["Reporting Time"]||x.reporting)}</td><td>${esc(x["Event Time"]||x.time)}</td><td>${esc(x["Age Group"]||x.ageGroup)}</td><td>${esc(x["Match / Round"]||x.Match||x.Round||x.round||x["Round"]||'')}</td><td>${esc(x["Team A"]||x.TeamA||x["Team A Name"]||'')}</td><td>${esc(x["Team B"]||x.TeamB||x["Team B Name"]||'')}</td><td>${esc(x.Venue||x.venue)}</td><td>${esc(x.Status||x.status)}</td></tr>`).join(''):`<tr><td colspan="10">No schedule published yet.</td></tr>`;
     }else{
       if(scheduleHead) scheduleHead.innerHTML='<th>Day</th><th>Date</th><th>Reporting</th><th>Event Time</th><th>Event</th><th>Age Group</th><th>Participant</th><th>Block</th><th>Flat Number</th><th>Venue</th><th>Status</th>';
       scheduleBody.innerHTML=schedule.length?schedule.map(x=>`<tr><td>${esc(x.Day||x.day)}</td><td>${esc(x.Date||x.date)}</td><td>${esc(x["Reporting Time"]||x.reporting)}</td><td>${esc(x["Event Time"]||x.time)}</td><td>${esc(x.Event||x.event||game[1])}</td><td>${esc(x["Age Group"]||x.ageGroup)}</td><td>${esc(x["Participant Name"]||x.Participant||x.participant||x["Child Name"]||x.child)}</td><td>${esc(x.Block||x.block)}</td><td>${esc(x["Flat Number"]||x.flatNumber)}</td><td>${esc(x.Venue||x.venue)}</td><td>${esc(x.Status||x.status)}</td></tr>`).join(''):`<tr><td colspan="11">No schedule published yet.</td></tr>`;
     }
   }

   const resultsBody=document.getElementById('game-results-body');
   const resultsTable=resultsBody ? resultsBody.closest('table') : null;
   const resultsHead=resultsTable ? resultsTable.querySelector('thead tr') : null;
   if(resultsBody){
     if(teamBased){
       if(resultsHead) resultsHead.innerHTML='<th>Age Group</th><th>Round</th><th>Match</th><th>Team</th><th>Opponent</th><th>Score</th><th>Result</th><th>Position</th><th>Medal</th>';
       resultsBody.innerHTML=results.length?results.map(x=>`<tr><td>${esc(x["Age Group"]||x.ageGroup)}</td><td>${esc(x.Round||x.round)}</td><td>${esc(x.Match||x["Match"]||'')}</td><td>${esc(x["Team Name"]||x.Team||x.team)}</td><td>${esc(x.Opponent||x.opponent)}</td><td>${esc(x.Score||x["Score / Time"]||x.score||x.time)}</td><td>${esc(x.Result||x.result)}</td><td>${esc(x.Position||x.position)}</td><td>${esc(x.Medal||x.medal)}</td></tr>`).join(''):`<tr><td colspan="9">No results published yet.</td></tr>`;
     }else{
       if(resultsHead) resultsHead.innerHTML='<th>Age Group</th><th>Position</th><th>Participant</th><th>Block</th><th>Flat Number</th><th>Score / Time</th><th>Medal</th>';
       resultsBody.innerHTML=results.length?results.map(x=>`<tr><td>${esc(x["Age Group"]||x.ageGroup)}</td><td><b>${esc(x.Position||x.position)}</b></td><td>${esc(x["Child Name"]||x.child||x.participant)}</td><td>${esc(x.Block||x.block)}</td><td>${esc(x["Flat Number"]||x.flatNumber)}</td><td>${esc(x["Score / Time"]||x.score||x.time)}</td><td>${esc(x.Medal||x.medal)}</td></tr>`).join(''):`<tr><td colspan="7">No results published yet.</td></tr>`;
     }
   }
}


function buildTeamsFromEnrollments(rows){
  const map={};
  rows.forEach(function(x){
    const id=String(x["Team ID"]||x.teamId||'').trim();
    if(!id)return;
    if(!map[id]) map[id]={"Team ID":id,"Team Name":x["Team Name"]||x.teamName||id,"Age Group":x["Age Group"]||x.ageGroup||'',Captain:'',"Team Status":x["Team Status"]||x.status||''};
    if(String(x["Team Role"]||x.teamRole||x.Role||x.role||'').trim().toLowerCase()==='captain') map[id].Captain=x["Child Name"]||x.Child||x.child||'';
  });
  return Object.keys(map).map(k=>map[k]);
}

async function loadGamePage(){
 if(!game || !CONFIG.apiUrl)return;
 const cacheKey=SPORT_CACHE_PREFIX+game[1].toLowerCase().replace(/[^a-z0-9]+/g,'_');
 // Render cached sport data immediately while the live request runs.
 try{
   const cached=localStorage.getItem(cacheKey);
   if(cached){
     const item=JSON.parse(cached);
     if(item && item.data) renderGameData(item.data);
   }
 }catch(err){}

 try{
   const sportName=encodeURIComponent(game[1]);
   const [sportResponse, volunteerResponse] = await Promise.all([
     fetch(CONFIG.apiUrl+'?action=sport&sport='+sportName,{cache:'no-store'}).then(r=>r.json()),
     fetch(CONFIG.apiUrl+'?action=sportVolunteers&sport='+sportName,{cache:'no-store'}).then(r=>r.json()).catch(()=>null)
   ]);

   if(sportResponse && sportResponse.success!==false){
     // Prefer the dedicated sport-volunteers endpoint. This guarantees that
     // comma-separated assignments such as "Carroms, Chess, Badminton"
     // are resolved server-side as well as client-side.
     const merged = Object.assign({}, sportResponse);
     const baseData = sportResponse.data || {};
     if(volunteerResponse && volunteerResponse.success!==false && Array.isArray(volunteerResponse.volunteers)){
       merged.data = Object.assign({}, baseData, {volunteers: volunteerResponse.volunteers});
     }
     try{localStorage.setItem(cacheKey,JSON.stringify({savedAt:Date.now(),data:merged}));}catch(err){}
     renderGameData(merged);
   }
 }catch(err){
   console.warn('Unable to refresh event data',err);
 }
}
loadGamePage();
if(CONFIG.refreshSeconds>0)setInterval(loadGamePage,CONFIG.refreshSeconds*1000);
