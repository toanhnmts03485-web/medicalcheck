/* Bộ phân tích: chấm điểm bệnh theo triệu chứng + điều chỉnh theo hồ sơ người dùng. */
(function (root) {
  const K = typeof require !== 'undefined' ? require('./knowledge.js') : root.Knowledge;

  function analyze(input) {
    const symptoms = new Set(input.symptoms || []);
    const profile = input.profile || {};
    const redFlags = input.redFlags || [];
    const result = { emergency: redFlags.length > 0, redFlags: K.RED_FLAGS.filter(r => redFlags.includes(r.id)), conditions: [], warnings: [] };

    const temp = Number(profile.temperature) || 0;
    if (temp >= 39.5) result.warnings.push('Sốt ≥ 39,5 °C: nên đến cơ sở y tế trong ngày.');
    if (temp >= 38 && Number(profile.fever_days) >= 3) result.warnings.push('Sốt kéo dài từ 3 ngày: cần được bác sĩ thăm khám.');
    const age = Number(profile.age);
    if (age && age < 5) result.warnings.push('Trẻ dưới 5 tuổi: không tự dùng thuốc, hãy đưa trẻ đến bác sĩ nhi.');
    if (age >= 65) result.warnings.push('Người từ 65 tuổi: bệnh dễ diễn tiến nặng, nên đi khám sớm thay vì tự điều trị.');
    if (profile.pregnant) result.warnings.push('Đang mang thai: hỏi bác sĩ/dược sĩ trước khi dùng BẤT KỲ loại thuốc nào.');

    if (symptoms.size === 0) return result;

    const scored = [];
    for (const c of K.CONDITIONS) {
      const total = Object.values(c.weights).reduce((a, b) => a + b, 0);
      let matched = 0, matchedCount = 0;
      const matchedIds = [];
      for (const [sid, w] of Object.entries(c.weights)) {
        if (symptoms.has(sid)) { matched += w; matchedCount++; matchedIds.push(sid); }
      }
      if (matchedCount === 0) continue;
      // Độ phủ của bệnh (bao nhiêu % đặc trưng bệnh có mặt) và độ giải thích (bao nhiêu % triệu chứng của người dùng được bệnh giải thích)
      const coverage = matched / total;
      const explained = matchedCount / symptoms.size;
      let score = 0.6 * coverage + 0.4 * explained;
      // Bệnh chỉ khớp 1 triệu chứng chung chung thì giảm điểm
      if (matchedCount === 1) score *= 0.6;
      // Điều chỉnh theo hồ sơ
      if (c.id === 'sxh' && temp >= 38.5) score *= 1.1;
      if (c.id === 'cum' && temp >= 38.5) score *= 1.1;
      if (c.id === 'di_ung' && temp >= 38) score *= 0.5;
      scored.push({ condition: c, score: Math.min(score, 1), matchedIds });
    }
    scored.sort((a, b) => b.score - a.score);

    const top = scored.slice(0, 4).filter(s => s.score >= 0.12);
    result.conditions = top.map(s => {
      const c = s.condition;
      const pct = Math.round(s.score * 100);
      const drugs = c.drugs.map(d => ({ ...K.DRUGS[d], id: d }));
      const blocked = new Set(c.avoid || []);
      if (age && age < 12) blocked.add('nsaid');
      if (profile.pregnant) { blocked.add('nsaid'); }
      const allergies = (profile.allergies || '').toLowerCase();
      if (allergies.includes('paracetamol')) blocked.add('ha_sot');
      if (/ibuprofen|nsaid|aspirin/.test(allergies)) blocked.add('nsaid');
      return {
        id: c.id, name: c.name, summary: c.summary, specialty: c.specialty,
        likelihood: pct, level: pct >= 55 ? 'cao' : pct >= 35 ? 'trung bình' : 'thấp',
        matched: s.matchedIds.map(id => K.SYMPTOMS.find(x => x.id === id).label),
        advice: c.advice,
        drugs: drugs.filter(d => !blocked.has(d.id)),
        avoidDrugs: [...blocked].filter(id => K.DRUGS[id]).map(id => K.DRUGS[id].group),
        facility: c.facility,
      };
    });
    return result;
  }

  const api = { analyze };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Engine = api;
})(typeof window !== 'undefined' ? window : globalThis);
