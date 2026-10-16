(function () {
  const K = window.Knowledge, E = window.Engine, G = window.Geo;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let center = null, map = null, layer = null, places = [], filter = 'all', preferred = ['pharmacy', 'clinic', 'hospital'];

  // ---- Dựng form ----
  $('rfList').innerHTML = K.RED_FLAGS.map(r => `<label class="check"><input type="checkbox" name="rf" value="${r.id}"> ${esc(r.label)}</label>`).join('');
  const groups = {};
  K.SYMPTOMS.forEach(s => (groups[s.group] ||= []).push(s));
  $('symptomList').innerHTML = Object.entries(groups).map(([g, list]) =>
    `<fieldset><legend>${esc(g)}</legend><div class="checks">` +
    list.map(s => `<label class="check"><input type="checkbox" name="sym" value="${s.id}"> ${esc(s.label)}</label>`).join('') +
    `</div></fieldset>`).join('');

  const checked = name => [...document.querySelectorAll(`input[name=${name}]:checked`)].map(i => i.value);

  // ---- Vị trí ----
  function setCenter(c, label) {
    center = c;
    $('locStatus').textContent = '✅ Đã xác định vị trí' + (label ? ': ' + label : ` (${c.lat.toFixed(4)}, ${c.lon.toFixed(4)})`);
  }
  $('btnLocate').onclick = async () => {
    $('locStatus').textContent = 'Đang lấy vị trí…';
    try { setCenter(await G.getPosition()); }
    catch (e) { $('locStatus').textContent = '❌ ' + e.message + '. Hãy nhập địa chỉ thủ công.'; }
  };
  $('address').addEventListener('input', () => { center = null; });
  $('btnGeocode').onclick = async () => {
    const q = $('address').value.trim();
    if (!q) return;
    $('locStatus').textContent = 'Đang tìm địa chỉ…';
    try {
      const r = await G.geocode(q);
      if (r) setCenter(r, r.label); else $('locStatus').textContent = '❌ Không tìm thấy địa chỉ.';
    } catch (e) { $('locStatus').textContent = '❌ Lỗi tìm địa chỉ: ' + e.message; }
  };

  function ageFromDob(v) {
    if (!v) return '';
    const d = new Date(v), n = new Date();
    if (isNaN(d) || d > n) return '';
    let age = n.getFullYear() - d.getFullYear();
    if (n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) age--;
    return age;
  }

  // ---- Phân tích ----
  $('form').addEventListener('submit', async ev => {
    ev.preventDefault();
    const profile = {
      name: $('fullname').value.trim(), age: ageFromDob($('dob').value), temperature: $('temperature').value,
      fever_days: $('fever_days').value, allergies: $('allergies').value, pregnant: $('pregnant').checked,
    };
    const symptoms = checked('sym'), redFlags = checked('rf');
    if (!symptoms.length && !redFlags.length) { alert('Vui lòng chọn ít nhất một triệu chứng.'); return; }
    if ($('dob').value && profile.age === '') { alert('Ngày sinh không hợp lệ.'); return; }
    if (!center && $('address').value.trim()) {
      try { const r = await G.geocode($('address').value.trim()); if (r) setCenter(r, r.label); } catch (e) { /* bỏ qua, báo ở bước tìm nơi */ }
    }
    const res = E.analyze({ symptoms, profile, redFlags });
    res.userName = profile.name; res.userAge = profile.age;
    renderResult(res);
    $('results').hidden = false;
    $('results').scrollIntoView({ behavior: 'smooth' });

    const first = res.conditions[0];
    preferred = first ? first.facility : ['pharmacy', 'clinic', 'hospital'];
    if (res.emergency) preferred = ['hospital'];
    if (!center) { $('placesStatus').textContent = 'Hãy nhập nơi ở hoặc dùng GPS ở bước 1 rồi bấm phân tích lại để xem nơi gần bạn.'; return; }
    await loadPlaces();
  });

  function renderResult(res) {
    $('resultTitle').textContent = res.userName ? `Kết quả phân tích cho ${res.userName}${res.userAge !== '' ? ' (' + res.userAge + ' tuổi)' : ''}` : 'Kết quả phân tích';
    const em = $('emergency');
    em.hidden = !res.emergency;
    if (res.emergency) {
      em.innerHTML = `<h3>🚨 CẦN CẤP CỨU NGAY – gọi <a href="tel:115">115</a></h3><ul>` +
        res.redFlags.map(r => `<li>${esc(r.label)}</li>`).join('') +
        `</ul><p>Đừng tự điều trị tại nhà. Đến bệnh viện gần nhất ngay.</p>`;
    }
    $('warnings').innerHTML = res.warnings.map(w => `<div class="alert warn">⚠️ ${esc(w)}</div>`).join('');
    $('conditions').innerHTML = res.conditions.length ? res.conditions.map((c, i) => `
      <article class="card cond">
        <div class="cond-head">
          <h3>${i + 1}. ${esc(c.name)}</h3>
          <span class="badge ${c.level.replace(' ', '-')}">Khả năng ${esc(c.level)} · ${c.likelihood}%</span>
        </div>
        <div class="bar"><i style="width:${c.likelihood}%"></i></div>
        <p>${esc(c.summary)}</p>
        <p class="muted">Triệu chứng khớp: ${c.matched.map(esc).join(', ')}</p>
        <p><strong>Chuyên khoa nên khám:</strong> ${esc(c.specialty)}</p>
        <h4>💊 Nhóm thuốc thường dùng (hỏi dược sĩ/bác sĩ trước khi dùng)</h4>
        <ul>${c.drugs.map(d => `<li><strong>${esc(d.group)}</strong> – ${esc(d.examples)}<br><small>${esc(d.note)}</small></li>`).join('')}</ul>
        ${c.avoidDrugs.length ? `<p class="avoid">🚫 Không nên dùng cho bạn: ${c.avoidDrugs.map(esc).join('; ')}</p>` : ''}
        <h4>📝 Lời khuyên</h4>
        <ul>${c.advice.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
      </article>`).join('')
      : (res.emergency ? '' : '<p class="card">Không đủ thông tin để gợi ý. Hãy chọn thêm triệu chứng hoặc đến gặp bác sĩ.</p>');
  }

  // ---- Bản đồ & danh sách ----
  async function loadPlaces() {
    $('placesStatus').textContent = 'Đang tìm cơ sở y tế quanh bạn…';
    $('places').innerHTML = '';
    try {
      places = await G.findNearby(center, 10);
      $('placesStatus').textContent = places.length ? `Tìm thấy ${places.length} địa điểm trong 10 km.` : 'Không tìm thấy địa điểm nào trong 10 km (dữ liệu OpenStreetMap có thể chưa đầy đủ).';
      renderPlaces();
    } catch (e) {
      $('placesStatus').textContent = '❌ Không tải được dữ liệu bản đồ: ' + e.message + '. Vui lòng thử lại.';
    }
  }

  function renderPlaces() {
    const list = places.filter(p => filter === 'all' || p.kind === filter);
    // Ưu tiên loại phù hợp với chẩn đoán khi xem "Tất cả"
    const rank = p => { const i = preferred.indexOf(p.kind); return i < 0 ? 99 : i; };
    const shown = filter === 'all' ? [...list].sort((a, b) => (rank(a) - rank(b)) || (a.distanceKm - b.distanceKm)) : list;
    $('places').innerHTML = shown.slice(0, 60).map(p => {
      const dir = `https://www.google.com/maps/dir/?api=1&origin=${center.lat},${center.lon}&destination=${p.lat},${p.lon}`;
      return `<li class="place ${p.kind}">
        <div><strong>${esc(p.name)}</strong> <span class="tag">${esc(p.label)}</span></div>
        <div class="muted">${p.distanceKm.toFixed(1)} km${p.address ? ' · ' + esc(p.address) : ''}</div>
        ${p.hours ? `<div class="muted">🕒 ${esc(p.hours)}</div>` : ''}
        <div class="links">${p.phone ? `<a href="tel:${esc(p.phone.replace(/[^+\d]/g, ''))}">📞 ${esc(p.phone)}</a>` : ''}<a href="${dir}" target="_blank" rel="noopener">🧭 Chỉ đường</a></div>
      </li>`;
    }).join('');
    drawMap(shown.slice(0, 60));
  }

  function drawMap(list) {
    if (typeof L === 'undefined') { $('map').hidden = true; return; }
    if (!map) {
      map = L.map('map');
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
    }
    if (layer) layer.remove();
    layer = L.layerGroup().addTo(map);
    L.circle([center.lat, center.lon], { radius: 10000, color: '#0b7a75', weight: 1, fillOpacity: 0.04 }).addTo(layer);
    L.marker([center.lat, center.lon]).addTo(layer).bindPopup('Vị trí của bạn');
    const colors = { pharmacy: '#2e9e4f', clinic: '#e08a00', hospital: '#d33' };
    list.forEach(p => L.circleMarker([p.lat, p.lon], { radius: 7, color: colors[p.kind] || '#555', fillOpacity: 0.85 })
      .addTo(layer).bindPopup(`<strong>${esc(p.name)}</strong><br>${esc(p.label)} · ${p.distanceKm.toFixed(1)} km`));
    map.fitBounds(L.latLng(center.lat, center.lon).toBounds(20000));
    setTimeout(() => map.invalidateSize(), 50);
  }

  $('filters').addEventListener('click', e => {
    const b = e.target.closest('button[data-f]');
    if (!b) return;
    filter = b.dataset.f;
    document.querySelectorAll('#filters .chip').forEach(c => c.classList.toggle('active', c === b));
    if (center && places.length) renderPlaces();
  });
})();
