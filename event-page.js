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

function renderReferences(refs){
 const box=document.getElementById('event-references');
 if(!box)return;
 if(!refs.length){box.innerHTML='<div class="doc-empty">No organiser reference links have been published yet.</div>';return;}
 box.innerHTML=refs.map(r=>{
   const url=String(r.url||r.link||r.driveUrl||'').trim();
   if(!url)return '';
   return `<div class="reference-row"><div class="reference-icon">🔗</div><div class="reference-info"><b>${esc(r.title||r.name||'Reference')}</b><span>${esc(r.category||r.referenceType||'Reference')} • ${esc(r.type||r.format||'Link')}</span></div><a class="doc-btn" href="${esc(url)}" target="_blank" rel="noopener">Open</a></div>`;
 }).join('')||'<div class="doc-empty">No valid reference links have been published.</div>';
}

async function loadGamePage(){
 if(!game || !CONFIG.apiUrl)return;
 try{
   const url=CONFIG.apiUrl+'?action=sport&sport='+encodeURIComponent(game[1]);
   const data=await (await fetch(url,{cache:'no-store'})).json();

   const volunteers=data.volunteers||[];
   const enrollments=data.enrollments||[];
   const schedule=data.schedule||[];
   const results=data.results||[];

   renderRulesDocs((data.references||[]).filter(r=>norm(r.category)==='rules'));
   renderReferences(data.references||[]);

   const spoc=volunteers[0];
   const spocCard=document.getElementById('spoc-card');
   if(spoc && spocCard){
     spocCard.innerHTML=`<div class="spoc-icon">👤</div><div><h3>${esc(spoc.Name||spoc.name||'SPOC')}</h3><p><b>${esc(spoc.Role||spoc.role||'Event SPOC')}</b>${(spoc.Contact||spoc.contact)?` • ${esc(spoc.Contact||spoc.contact)}`:''}</p><p>Reporting: ${esc(spoc.Reporting||spoc.reporting||'As per schedule')}</p></div>`;
   }

   const participantBody=document.getElementById('participants-body');
   if(participantBody) participantBody.innerHTML=enrollments.length?enrollments.map(x=>`<tr><td><b>${esc(x["Child Name"]||x.Child||x.child)}</b></td><td>${esc(x["Age Group"]||x.ageGroup)}</td><td>${esc(x["Enrollment Status"]||x.enrollmentStatus)}</td><td>${esc(x["Event Status"]||x.eventStatus)}</td></tr>`).join(''):`<tr><td colspan="6">No enrolled kids published yet.</td></tr>`;

   const confirmed=enrollments.filter(x=>norm(x["Enrollment Status"]||x.enrollmentStatus)==='confirmed').length;
   const groups=new Set(enrollments.map(x=>x["Age Group"]||x.ageGroup).filter(Boolean));
   setText('participant-count',enrollments.length); setText('confirmed-count',confirmed); setText('age-groups-count',groups.size);

   const scheduleBody=document.getElementById('game-schedule-body');
   if(scheduleBody) scheduleBody.innerHTML=schedule.length?schedule.map(x=>`<tr><td>${esc(x.Day||x.day)}</td><td>${esc(x.Date||x.date)}</td><td>${esc(x["Reporting Time"]||x.reporting)}</td><td>${esc(x["Event Time"]||x.time)}</td><td>${esc(x.Event||x.event||sport)}</td><td>${esc(x["Age Group"]||x.ageGroup)}</td><td>${esc(x["Participant Name"]||x.Participant||x.participant||x["Child Name"]||x.child)}</td><td>${esc(x.Block||x.block)}</td><td>${esc(x["Flat Number"]||x.flatNumber)}</td><td>${esc(x.Venue||x.venue)}</td><td>${esc(x.Status||x.status)}</td></tr>`).join(''):`<tr><td colspan="11">No schedule published yet.</td></tr>`;

   const resultsBody=document.getElementById('game-results-body');
   if(resultsBody) resultsBody.innerHTML=results.length?results.map(x=>`<tr><td>${esc(x["Age Group"]||x.ageGroup)}</td><td><b>${esc(x.Position||x.position)}</b></td><td>${esc(x["Child Name"]||x.child||x.participant)}</td><td>${esc(x.Block||x.block)}</td><td>${esc(x["Flat Number"]||x.flatNumber)}</td><td>${esc(x["Score / Time"]||x.score||x.time)}</td><td>${esc(x.Medal||x.medal)}</td></tr>`).join(''):`<tr><td colspan="7">No results published yet.</td></tr>`;
 }catch(err){console.warn('Unable to load event data',err);}
}
loadGamePage();
if(CONFIG.refreshSeconds>0)setInterval(loadGamePage,CONFIG.refreshSeconds*1000);
