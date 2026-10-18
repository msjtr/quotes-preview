// فيلم التدشين — اتصال العامل بقاعدة البيانات (GitHub Actions فقط، بمفتاح service_role من أسرار المستودع)
//   node job.js claim <id> <client.json>     يحجز الطلب ويكتب بيانات بطاقة العميل
//   node job.js done  <id> <files.json>      يسجّل الروابط ويُرسل «جُهِّز فيلمك»
//   node job.js fail  <id> <reason>
'use strict';
const fs = require('fs');
const URL_ = String(process.env.SUPABASE_URL || '').replace(/\/+$/, ''), KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const [cmd, id, arg] = process.argv.slice(2);
if (!URL_ || !KEY) { console.error('missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY'); process.exit(2); }
if (!/^[0-9a-f-]{36}$/i.test(id || '')) { console.error('bad id'); process.exit(2); }
const rpc = async (fn, body) => { const r = await fetch(URL_ + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const t = await r.text(); if (!r.ok) throw new Error(fn + ' ' + r.status + ' ' + t.slice(0, 200)); return JSON.parse(t); };
(async () => {
  if (cmd === 'claim') { const j = await rpc('film_job_claim', { p_id: id }); if (!j || j.ok !== true) { console.error('claim:', j && j.error); process.exit(3); }
    fs.writeFileSync(arg, JSON.stringify({ name_ar: j.name_ar, name_en: j.name_en, tier: j.tier, member_no: j.member_no, issued_at: j.issued_at, expires_at: j.expires_at, launched_at: j.launched_at, points: j.points }));
    fs.writeFileSync(arg + '.token', j.token); console.log('claimed', id, 'tier', j.tier); }
  else if (cmd === 'done') { const files = JSON.parse(fs.readFileSync(arg, 'utf8')); const j = await rpc('film_job_done', { p_id: id, p_files: files }); console.log('done', JSON.stringify(j).slice(0, 300)); if (!j || j.ok !== true) process.exit(4); }
  else if (cmd === 'fail') { const j = await rpc('film_job_fail', { p_id: id, p_error: String(arg || 'failed') }); console.log('failed', JSON.stringify(j)); }
  else { console.error('usage: claim|done|fail'); process.exit(2); }
})().catch(e => { console.error(String(e && e.message || e)); process.exit(1); });
