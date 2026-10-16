/* Tìm cơ sở y tế / nhà thuốc quanh người dùng qua OpenStreetMap (Overpass API + Nominatim). */
(function (root) {
  const MAX_RADIUS_M = 10000; // tối đa 10 km
  const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];

  const TYPE_LABEL = { pharmacy: 'Nhà thuốc', hospital: 'Bệnh viện', clinic: 'Phòng khám', doctors: 'Phòng khám' };

  function haversineKm(a, b) {
    const R = 6371, toRad = d => d * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function buildQuery(center, radiusM) {
    const r = Math.min(radiusM, MAX_RADIUS_M);
    const around = `(around:${r},${center.lat},${center.lon})`;
    return `[out:json][timeout:25];(` +
      `nwr${around}[amenity~"^(pharmacy|hospital|clinic|doctors)$"];` +
      `nwr${around}[healthcare~"^(pharmacy|hospital|clinic|doctor)$"];` +
      `);out center 400;`;
  }

  function normalize(elements, center, radiusKm) {
    const seen = new Set(), out = [];
    for (const el of elements) {
      const lat = el.lat ?? el.center?.lat, lon = el.lon ?? el.center?.lon;
      if (lat == null || lon == null) continue;
      const t = el.tags || {};
      const kind = t.amenity || ({ doctor: 'doctors' }[t.healthcare] || t.healthcare);
      if (!TYPE_LABEL[kind]) continue;
      const name = t.name || t['name:vi'] || TYPE_LABEL[kind] + ' (chưa có tên)';
      const distanceKm = haversineKm(center, { lat, lon });
      if (distanceKm > radiusKm) continue;
      const key = `${name}|${lat.toFixed(4)}|${lon.toFixed(4)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const address = [t['addr:housenumber'], t['addr:street'], t['addr:suburb'] || t['addr:subdistrict'], t['addr:city'] || t['addr:district']].filter(Boolean).join(', ');
      out.push({
        id: `${el.type}/${el.id}`, name, kind: kind === 'doctors' ? 'clinic' : kind, label: TYPE_LABEL[kind],
        lat, lon, distanceKm, address, phone: t.phone || t['contact:phone'] || '', hours: t.opening_hours || '',
        emergency: t.emergency === 'yes',
      });
    }
    return out.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  async function findNearby(center, radiusKm = 10) {
    const radiusM = Math.min(radiusKm, 10) * 1000;
    const body = 'data=' + encodeURIComponent(buildQuery(center, radiusM));
    let lastErr;
    for (const url of OVERPASS) {
      try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
        if (!res.ok) throw new Error('Overpass HTTP ' + res.status);
        const json = await res.json();
        return normalize(json.elements || [], center, Math.min(radiusKm, 10));
      } catch (e) { lastErr = e; }
    }
    throw lastErr;
  }

  async function geocode(query) {
    const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=vn&accept-language=vi&q=' + encodeURIComponent(query);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Nominatim HTTP ' + res.status);
    const arr = await res.json();
    if (!arr.length) return null;
    return { lat: parseFloat(arr[0].lat), lon: parseFloat(arr[0].lon), label: arr[0].display_name };
  }

  function getPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Trình duyệt không hỗ trợ định vị'));
      navigator.geolocation.getCurrentPosition(
        p => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
        e => reject(new Error(e.message || 'Không lấy được vị trí')),
        { enableHighAccuracy: true, timeout: 12000 });
    });
  }

  const api = { MAX_RADIUS_M, haversineKm, buildQuery, normalize, findNearby, geocode, getPosition };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Geo = api;
})(typeof window !== 'undefined' ? window : globalThis);
