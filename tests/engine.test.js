const test = require('node:test');
const assert = require('node:assert');
const { analyze } = require('../src/engine.js');
const Geo = require('../src/geo.js');
const K = require('../src/knowledge.js');

test('triệu chứng sốt xuất huyết -> SXH đứng đầu và loại NSAID', () => {
  const r = analyze({ symptoms: ['sot', 'dau_sau_mat', 'dau_co', 'xuat_huyet'], profile: { temperature: 39.2 } });
  assert.strictEqual(r.conditions[0].id, 'sxh');
  assert.ok(!r.conditions[0].drugs.some(d => d.id === 'nsaid'));
});

test('hắt hơi + ngứa mắt -> dị ứng', () => {
  const r = analyze({ symptoms: ['hat_hoi', 'chay_mui', 'ngua_mat'] });
  assert.strictEqual(r.conditions[0].id, 'di_ung');
});

test('dấu hiệu nguy hiểm bật cờ cấp cứu', () => {
  assert.strictEqual(analyze({ symptoms: [], redFlags: ['rf_dau_nguc'] }).emergency, true);
});

test('trẻ nhỏ và thai phụ bị loại NSAID, có cảnh báo', () => {
  const r = analyze({ symptoms: ['dau_dau'], profile: { age: 8, pregnant: false } });
  assert.ok(!r.conditions[0].drugs.some(d => d.id === 'nsaid'));
  const p = analyze({ symptoms: ['dau_dau'], profile: { pregnant: true } });
  assert.ok(p.warnings.length > 0);
});

test('mọi id triệu chứng/thuốc trong cơ sở tri thức đều hợp lệ', () => {
  const sids = new Set(K.SYMPTOMS.map(s => s.id));
  for (const c of K.CONDITIONS) {
    for (const s of Object.keys(c.weights)) assert.ok(sids.has(s), `${c.id}: thiếu triệu chứng ${s}`);
    for (const d of c.drugs) assert.ok(K.DRUGS[d], `${c.id}: thiếu thuốc ${d}`);
  }
});

test('haversine ~ đúng và bán kính bị chặn 10 km', () => {
  const d = Geo.haversineKm({ lat: 21.0285, lon: 105.8542 }, { lat: 10.8231, lon: 106.6297 });
  assert.ok(d > 1100 && d < 1200);
  assert.match(Geo.buildQuery({ lat: 1, lon: 2 }, 50000), /around:10000,/);
});

test('normalize lọc ngoài 10 km và sắp xếp theo khoảng cách', () => {
  const c = { lat: 21.0, lon: 105.8 };
  const els = [
    { type: 'node', id: 1, lat: 21.05, lon: 105.8, tags: { amenity: 'pharmacy', name: 'Xa' } },
    { type: 'node', id: 2, lat: 21.01, lon: 105.8, tags: { amenity: 'hospital', name: 'Gần' } },
    { type: 'node', id: 3, lat: 21.5, lon: 105.8, tags: { amenity: 'pharmacy', name: 'Quá xa' } },
  ];
  const out = Geo.normalize(els, c, 10);
  assert.deepStrictEqual(out.map(x => x.name), ['Gần', 'Xa']);
});
