/* AMC Junior Khelotsav 2026 - lightweight visitor counter.
 * Counts one visit per browser per local day; no IP or personal visitor data is collected. */
(function(){
  const el = document.getElementById('visitor-count');
  if (!el || !window.CONFIG || !CONFIG.apiUrl) return;

  const pad = n => String(n).padStart(2, '0');
  const now = new Date();
  const today = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  const storageKey = 'amc_junior_khelostav_visitor_counted_date';
  let alreadyCounted = false;
  try { alreadyCounted = localStorage.getItem(storageKey) === today; } catch (e) {}

  const increment = alreadyCounted ? '0' : '1';
  const url = CONFIG.apiUrl + '?action=visit&increment=' + increment + '&_=' + Date.now();

  fetch(url, {cache:'no-store'})
    .then(r => r.json())
    .then(payload => {
      if (!payload || !payload.success) throw new Error('visitor counter failed');
      const total = Number(payload.totalVisits || 0);
      el.textContent = '👀 Visitors: ' + total;
      if (increment === '1' && payload.counted) {
        try { localStorage.setItem(storageKey, today); } catch (e) {}
      }
    })
    .catch(() => {
      el.textContent = '👀 Visitors: —';
    });
})();
