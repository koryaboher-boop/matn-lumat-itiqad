/* ============================================================
   لمعة الاعتقاد — تطبيق مستقل يعمل دون إنترنت
   شرح متن لمعة الاعتقاد للمبتدئين
   Vanilla JS SPA · Hash Router · localStorage · PWA-ready
   ============================================================ */
(() => {
'use strict';

/* ---------- shortcuts ---------- */
const $ = (sel, el) => (el || document).querySelector(sel);
const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const appEl = () => $('#app');

/* ---------- inline SVG icons (feather-style) ---------- */
const P = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  play: '<polygon points="5 3 19 12 5 21 5 3"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  chevL: '<polyline points="15 18 9 12 15 6"/>',
  chevR: '<polyline points="9 18 15 12 9 6"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  quote: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>',
  sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  rotate: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
  wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>'
};
const ic = (n, s) => '<svg class="ic" width="' + (s || 16) + '" height="' + (s || 16) +
  '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || '') + '</svg>';

/* ---------- mini markdown (safe) ---------- */
function mdToHtml(src) {
  if (!src) return '';
  let t = esc(src).replace(/\r/g, '');
  const lines = t.split('\n');
  const out = [];
  let inUl = false;
  const closeUl = () => { if (inUl) { out.push('</ul>'); inUl = false; } };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^###?\s+/.test(line)) { closeUl(); out.push('<h3>' + line.replace(/^###?\s+/, '') + '</h3>'); }
    else if (/^[-*]\s+/.test(line)) {
      if (!inUl) { out.push('<ul>'); inUl = true; }
      out.push('<li>' + line.replace(/^[-*]\s+/, '') + '</li>');
    } else if (line === '') { closeUl(); }
    else { closeUl(); out.push('<p>' + line + '</p>'); }
  }
  closeUl();
  return out.join('').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
const paras = (s) => esc(s || '').split(/\n{2,}/).filter(Boolean)
  .map((p) => '<p>' + p.replace(/\n/g, '<br/>') + '</p>').join('');

/* ---------- progress store ---------- */
const STORE_KEY = 'manara.luma.v1';
let S = { done: {}, last: null, theme: 'light', free: true };
try {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) S = Object.assign(S, JSON.parse(raw));
} catch (e) { /* private mode */ }
function persist() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) {} }
function save() { persist(); markDirty(); }
function isDone(id) { return !!S.done[id]; }
function scoreOf(id) { const r = S.done[id]; return r ? r.s : null; }
function recordDone(id, score) {
  S.done[id] = { s: score, d: new Date().toISOString().slice(0, 10) };
  save();
}
function setLast(courseId, lessonId) { S.last = { courseId: courseId, lessonId: lessonId }; save(); }

/* ---------- account & cloud sync (v1.1) ---------- */
const CAN_SYNC = location.protocol === 'http:' || location.protocol === 'https:';
const ACCT = { user: null, lastSync: null };
function apiFetch(path, opts) {
  return fetch('/api' + path, Object.assign({
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin'
  }, opts || {})).then(async (res) => {
    let j = null;
    try { j = await res.json(); } catch (e) { /* empty body */ }
    if (!res.ok) throw new Error((j && j.error) || 'تعذر الاتصال بالخادم');
    return j;
  });
}
function markDirty() { if (!CAN_SYNC || !ACCT.user) return; schedulePush(); }
let pushTimer = null;
function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => pushSync(false), 2500);
}
function mergeRec(a, b) {
  if (!a) return b;
  if (!b) return a;
  return { s: Math.max(a.s || 0, b.s || 0), d: (a.d && b.d ? (a.d <= b.d ? a.d : b.d) : (a.d || b.d)) };
}
function fmtSyncDate(iso) {
  try {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    if (diff < 60e3) return 'الآن';
    if (diff < 3600e3) return 'قبل ' + Math.floor(diff / 60e3) + ' دقيقة';
    if (diff < 86400e3) return 'قبل ' + Math.floor(diff / 3600e3) + ' ساعة';
    return d.toLocaleDateString('ar', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  } catch (e) { return ''; }
}
function syncStatusText() {
  if (!ACCT.user) return '';
  if (!navigator.onLine) return 'غير متصل الآن — ستتم المزامنة تلقائيًا عند عودة الاتصال';
  if (ACCT.lastSync) return 'آخر مزامنة: ' + fmtSyncDate(ACCT.lastSync);
  return 'تم تسجيل الدخول — ستتم مزامنة تقدّمك خلال لحظات';
}
function updateSyncBadges() {
  $$('[data-sync-text]').forEach((el) => { el.textContent = syncStatusText(); });
  $$('.sync-dot').forEach((el) => el.classList.toggle('off', !navigator.onLine));
}
async function pushSync(keepalive) {
  if (!CAN_SYNC || !ACCT.user || !navigator.onLine) return;
  if (pushTimer) { clearTimeout(pushTimer); pushTimer = null; }
  try {
    await apiFetch('/progress', { method: 'PUT', body: JSON.stringify({ done: S.done, last: S.last }), keepalive: !!keepalive });
    ACCT.lastSync = new Date().toISOString();
    S.lastSync = ACCT.lastSync; persist();
    updateSyncBadges();
  } catch (e) { /* silent — retried on next change or reconnect */ }
}
async function pullSync(announce) {
  if (!CAN_SYNC || !ACCT.user || !navigator.onLine) return;
  try {
    const res = await apiFetch('/progress');
    const remote = (res.data && typeof res.data === 'object') ? res.data : {};
    const rDone = remote.done || {};
    const merged = {};
    for (const k of Object.keys(rDone)) merged[k] = mergeRec(null, rDone[k]);
    for (const k of Object.keys(S.done)) merged[k] = mergeRec(merged[k] || null, S.done[k]);
    const before = Object.keys(S.done).length;
    S.done = merged;
    if (!S.last && remote.last) S.last = remote.last;
    ACCT.lastSync = new Date().toISOString();
    S.lastSync = ACCT.lastSync;
    save(); /* persists locally + pushes merged state back */
    updateSyncBadges();
    if (announce) {
      navigate();
      setTimeout(() => toast('تمت مزامنة تقدّمك'), 400);
    } else if (Object.keys(merged).length !== before) {
      navigate();
    }
  } catch (e) { /* silent */ }
}
async function bootAccount() {
  if (!CAN_SYNC) return;
  let painted = false;
  if (S.acct) { ACCT.user = S.acct; painted = true; }   /* instant identity from cache */
  if (S.lastSync) ACCT.lastSync = S.lastSync;
  if (painted) navigate();
  try {
    const res = await apiFetch('/auth/me');
    if (res.user) {
      const changed = !ACCT.user || ACCT.user.username !== res.user.username;
      ACCT.user = res.user; S.acct = res.user; persist();
      await pullSync(false);
      if (changed || painted) navigate();
    } else if (ACCT.user) {
      ACCT.user = null; delete S.acct; persist();
      navigate();
    }
  } catch (e) { /* server unreachable — stay in local mode */ }
  updateSyncBadges();
}
async function doLogin(username, password) {
  const res = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ username: username, password: password }) });
  ACCT.user = res.user; S.acct = res.user; persist();
  await pullSync(false);
  navigate();
  toast('مرحبًا بك، ' + res.user.displayName + ' — فُعّلت المزامنة');
}
async function doRegister(displayName, username, password) {
  const res = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ displayName: displayName, username: username, password: password }) });
  ACCT.user = res.user; S.acct = res.user; persist();
  await pullSync(false);
  navigate();
  toast('أهلًا بك في لمعة الاعتقاد، ' + res.user.displayName + ' — تم إنشاء حسابك');
}
async function doLogout() {
  try { await apiFetch('/auth/logout', { method: 'POST' }); } catch (e) { /* ignore */ }
  ACCT.user = null; delete S.acct; persist();
  navigate();
  toast('تم تسجيل الخروج — تقدّمك محفوظ على هذا الجهاز');
}

/* ---------- data model ---------- */
const DATA = window.MANARA_DATA || { tracks: [] };
const TRACKS = DATA.tracks || [];
const LEVELS = [
  ['BEGINNER', 'المبتدئ'],
  ['INTERMEDIATE', 'المتوسط'],
  ['ADVANCED', 'المتقدم'],
  ['SPECIALIZATION', 'التخصص']
];
const LEVEL_AR = { BEGINNER: 'مبتدئ', INTERMEDIATE: 'متوسط', ADVANCED: 'متقدم', SPECIALIZATION: 'تخصص' };

function courseById(id) {
  for (const t of TRACKS) for (const c of t.courses) if (c.id === id) return { track: t, course: c };
  return null;
}
function lessonById(id) {
  for (const t of TRACKS) for (const c of t.courses) {
    const i = c.lessons.findIndex((l) => l.id === id);
    if (i >= 0) return { track: t, course: c, lesson: c.lessons[i], index: i };
  }
  return null;
}
function courseDone(c) { return c.lessons.filter((l) => isDone(l.id)).length; }
function coursePct(c) { return c.lessons.length ? Math.round(courseDone(c) / c.lessons.length * 100) : 0; }
function trackPct(t) {
  const L = t.courses.reduce((a, c) => a + c.lessons.length, 0);
  if (!L) return 0;
  const D = t.courses.reduce((a, c) => a + courseDone(c), 0);
  return Math.round(D / L * 100);
}
function lessonLocked(course, idx) {
  return false;
}
function courseLocked(track, course) {
  return false;
}
function nextIncomplete() {
  for (const t of TRACKS) for (const c of t.courses) {
    if (courseLocked(t, c)) continue;
    for (let i = 0; i < c.lessons.length; i++) {
      const l = c.lessons[i];
      if (!isDone(l.id) && !lessonLocked(c, i)) return { track: t, course: c, lesson: l, index: i };
    }
  }
  return null;
}
function globalStats() {
  let total = 0, done = 0, coursesFull = 0, coursesOpen = 0;
  let sum = 0, n = 0;
  for (const t of TRACKS) for (const c of t.courses) {
    if (c.lessons.length) { coursesOpen++; total += c.lessons.length; done += courseDone(c); }
    else continue;
    if (c.lessons.length && courseDone(c) === c.lessons.length) coursesFull++;
  }
  for (const k of Object.keys(S.done)) { sum += S.done[k].s; n++; }
  return {
    total: total, done: done, coursesFull: coursesFull, coursesOpen: coursesOpen,
    avg: n ? Math.round(sum / n) : null
  };
}

/* ---------- toast ---------- */
function toast(msg) {
  const w = $('#toastWrap');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  w.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 350); }, 2400);
}

/* ---------- theme ---------- */
function applyTheme() {
  document.documentElement.classList.toggle('dark', S.theme === 'dark');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', S.theme === 'dark' ? '#16110E' : '#1F6B54');
}
function toggleTheme() {
  S.theme = S.theme === 'dark' ? 'light' : 'dark';
  save(); applyTheme();
  const b = $('#themeBtn');
  if (b) b.innerHTML = ic(S.theme === 'dark' ? 'sun' : 'moon', 18);
}

/* ---------- shared blocks ---------- */
function topbar() {
  const acctChip = !CAN_SYNC ? '' : (ACCT.user
    ? '<a class="acct-chip is-in" href="#/settings" title="حسابي — المزامنة والإعدادات"><span class="acct-av">' + esc((ACCT.user.displayName || '؟').trim()[0]) + '</span><span class="acct-nm">' + esc(ACCT.user.displayName) + '</span></a>'
    : '<a class="acct-chip" href="#/settings" title="تسجيل الدخول"><span class="acct-av">' + ic('user', 13) + '</span><span class="acct-nm">دخول</span></a>');
  return '<header class="topbar">' +
    '<a class="brand" href="#/"><span class="logo">ع</span><span>لمعة الاعتقاد<small>شرح الشيخ عبدالرزاق البدر</small></span></a>' +
    '<span class="spacer"></span>' +
    acctChip +
    '<button class="icon-btn" id="themeBtn" aria-label="تبديل الوضع الليلي">' + ic(S.theme === 'dark' ? 'sun' : 'moon', 18) + '</button>' +
    '<a class="icon-btn" href="#/settings" aria-label="الإعدادات">' + ic('cog', 18) + '</a>' +
    '</header>';
}
function sidebar(view) {
  const nav = [
    ['home', '#/', 'home', 'الرئيسية'],
    ['continue', '#/continue', 'play', 'متابعة الرحلة'],
    ['settings', '#/settings', 'cog', 'الإعدادات']
  ];
  const links = nav.map((n) => '<a class="sb-link' + (view === n[0] ? ' on' : '') + '" href="' + n[1] + '">' + ic(n[2], 17) + '<span>' + n[3] + '</span></a>').join('');
  const g = globalStats();
  let acctCard;
  if (!CAN_SYNC) {
    acctCard = '<div class="sb-acct"><span class="acct-av big">ض</span><div class="sba-tx"><b>نسخة دون اتصال</b><small>تقدّمك محفوظ على جهازك</small></div></div>';
  } else if (ACCT.user) {
    acctCard = '<div class="sb-acct"><span class="acct-av big">' + esc((ACCT.user.displayName || '؟').trim()[0]) + '</span><div class="sba-tx"><b>' + esc(ACCT.user.displayName) + '</b><small class="sync-dot" data-sync-text>' + esc(syncStatusText()) + '</small></div></div>';
  } else {
    acctCard = '<a class="sb-acct sb-login" href="#/settings"><span class="acct-av big">' + ic('user', 15) + '</span><div class="sba-tx"><b>تسجيل الدخول</b><small>لحفظ تقدّمك ومزامنته</small></div></a>';
  }
  return '<aside class="sidebar" aria-label="التنقل الجانبي">' +
    '<a class="sb-brand" href="#/"><span class="logo">ع</span><span>لمعة الاعتقاد<small>شرح الشيخ عبدالرزاق البدر</small></span></a>' +
    '<nav class="sb-nav">' + links + '</nav>' +
    '<div class="sb-foot">' + acctCard +
    '<div class="sb-stat"><span><b>' + g.done + '</b> درسًا مكتملًا</span><span><b>' + (g.avg == null ? '—' : g.avg + '%') + '</b> متوسط الدرجات</span></div>' +
    '</div></aside>';
}
function foot() {
  return '<footer class="appfoot"><span class="orn">۞ ۞ ۞</span><br/>' +
    'شرح لمعة الاعتقاد للمبتدئين<br/>' +
    'المحتوى مستخرج من مشروع «معهد المنهاج» · يعمل دون إنترنت' + (CAN_SYNC ? ' · وتُزامَن نتائجك عند الاتصال' : '') + '</footer>';
}
function bar(pct, green) {
  return '<div class="bar' + (green ? ' bar-green' : '') + '"><i style="width:' + pct + '%"></i></div>';
}
function levelTag(lv) { return '<span class="tag-level tag-' + lv + '">' + LEVEL_AR[lv] + '</span>'; }
function firstGlyph(title) {
  const t = title.replace(/^[«(\s]+/, '');
  return t ? t[0] : 'ك';
}

/* ---------- router ---------- */
let currentRoute = '';
function navigate() {
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\//, '').split('/').filter(Boolean);
  const view = parts[0] || 'home';
  currentRoute = view;
  applyTheme();
  const root = appEl();
  let html = '';
  try {
    if (view === 'home') html = viewHome();
    else if (view === 'tracks' || view === 'track') { const fc0 = TRACKS[0] && TRACKS[0].courses[0]; location.hash = '#/course/' + (fc0 ? fc0.id : ''); return; }
    else if (view === 'course' && parts[1]) html = viewCourse(parts[1]);
    else if (view === 'lesson' && parts[1]) html = viewLesson(parts[1]);
    else if (view === 'quiz' && parts[1]) html = viewQuiz(parts[1]);
    else if (view === 'settings') html = viewSettings();
    else if (view === 'continue') { goContinue(); return; }
    else html = viewHome();
  } catch (e) {
    html = '<div class="card soon-banner"><div class="orn">۞</div><h3>عذرًا، حدث خطأ</h3><p>' + esc(e.message) + '</p></div>';
  }
  root.innerHTML = '<div class="shell">' + sidebar(view) + '<div class="main-col">' + topbar() + '<div class="view">' + html + foot() + '</div></div></div>';
  $('#themeBtn').addEventListener('click', toggleTheme);
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  if (view === 'quiz') bindQuiz();
  if (view === 'settings') bindSettings();
  updateTabbar(view);
}
function updateTabbar(view) {
  $$('#tabbar .tab').forEach((a) => a.classList.toggle('on', a.dataset.nav === view));
}
function goContinue() {
  if (S.last) {
    const r = lessonById(S.last.lessonId);
    if (r) { location.hash = '#/lesson/' + S.last.lessonId; return; }
  }
  const nx = nextIncomplete();
  if (nx) { location.hash = '#/lesson/' + nx.lesson.id; return; }
  location.hash = '#/';
  setTimeout(() => toast('أكملت كل الدروس المتاحة — بارك الله فيك'), 300);
}

/* ---------- view: home ---------- */
function viewHome() {
  const g = globalStats();
  const continueCard = (() => {
    let target = null;
    if (S.last) { const r = lessonById(S.last.lessonId); if (r) target = r; }
    if (!target) target = nextIncomplete();
    if (!target) return '';
    const icon = target.track.slug === 'hadith' ? 'book' : 'file';
    return '<a class="card continue-card" href="#/lesson/' + target.lesson.id + '">' +
      '<span class="cc-ic">' + ic(icon, 20) + '</span>' +
      '<span class="cc-main"><b>متابعة الدرس</b><small>' + esc(target.course.title) + ' — ' + esc(target.lesson.title) + '</small></span>' +
      '<span class="li-side">' + ic('chevL', 18) + '</span></a>';
  })();

  const fc = TRACKS[0] && TRACKS[0].courses[0];
  const fcPct = fc ? coursePct(fc) : 0;
  const courseCard = fc ? '<a class="card course-row" href="#/course/' + fc.id + '">' +
    '<span class="cr-cover" style="background:linear-gradient(180deg,#2A7D61,#123C30)">ض</span>' +
    '<span class="cr-main"><b>' + esc(fc.title) + '</b>' +
    '<span class="by">' + esc(fc.author || '') + '</span>' +
    '<span class="cr-bar">' + bar(fcPct) + '<span class="pct">' + fcPct + '%</span></span></span>' +
    '<span class="cr-side"><span class="go">' + ic('chevL', 18) + '</span></span></a>' : '';

  return '<section class="hero">' +
    '<span class="kicker">' + ic('star', 12) + ' من المبتدئ إلى المتخصص</span>' +
    '<h1>شرحُ لمعةِ الاعتقاد <em>لعقيدة أهل السنة</em></h1>' +
    '<p>متون مؤصّلة، دروس مرتّبة، واختبارات تقيس فهمك — كل كتاب يُفتح بعد إتمام ما قبله، وكل شيء يعمل دون إنترنت.</p>' +
    '<span class="hero-actions"><a class="btn btn-gold" href="#/course/' + (fc ? fc.id : '') + '">' + ic('book', 16) + ' ابدأ متن لمعة الاعتقاد</a>' +
    '<a class="btn btn-ghost" style="background:rgba(255,246,232,.12);border-color:rgba(255,246,232,.3);color:#FFF3E0" href="#/continue">' + ic('play', 15) + ' متابعة الرحلة</a></span>' +
    '</section>' +
    (continueCard ? '<div class="sec"><div class="sec-head"><span class="orn">۞</span><h2>أكمل من حيث توقفت</h2></div>' + continueCard + '</div>' : '') +
    '<div class="sec"><div class="sec-head"><span class="orn">۞</span><h2>متن المقرر</h2></div>' +
    courseCard + '</div>' +
    '<div class="sec"><div class="stat-row">' +
    '<div class="stat card"><b>' + g.done + '</b><small>درسًا مكتملًا</small></div>' +
    '<div class="stat card"><b>' + (g.avg == null ? '—' : g.avg + '%') + '</b><small>متوسط الدرجات</small></div>' +
    '<div class="stat card"><b>' + g.coursesFull + '</b><small>متنًا أُتمّ</small></div>' +
    '</div></div>' +
    '<div class="hadith-strip"><b>حديثٌ للتحصين</b>«مَن سلك طريقًا يلتمس فيه علمًا سهّل الله له به طريقًا إلى الجنة»</div>';
}

/* ---------- view: tracks ---------- */
function viewTracks() {
  const ladder = LEVELS.map((lv, i) =>
    '<div class="lv"><span class="lv-n">' + (i + 1) + '</span><b>' + lv[1] + '</b><small>' + lv[0] + '</small></div>').join('');
  const rows = TRACKS.map((t) => {
    const filled = t.courses.filter((c) => c.lessons.length).length;
    const totalLessons = t.courses.reduce((a, c) => a + c.lessons.length, 0);
    const doneLessons = t.courses.reduce((a, c) => a + courseDone(c), 0);
    const pct = totalLessons ? Math.round(doneLessons / totalLessons * 100) : 0;
    return '<a class="card course-row' + (pct === 100 ? '' : '') + '" href="#/track/' + t.slug + '">' +
      '<span class="cr-cover" style="background:linear-gradient(180deg,' + esc(t.courses[0] && t.courses[0].coverColor || '#1F6B54') + ',' + esc(t.courses[0] && t.courses[0].coverColor || '#5F1F1F') + ')">' + firstGlyph(t.name) + '</span>' +
      '<span class="cr-main"><b>مسار ' + esc(t.name) + '</b>' +
      '<span class="by">' + esc(t.description) + '</span>' +
      '<span class="cr-bar">' + bar(pct) + '<span class="pct">' + pct + '%</span></span></span>' +
      '<span class="cr-side"><span class="go">' + ic('chevL', 18) + '</span></span></a>';
  }).join('');
  return '<section class="lesson-header"><h1 style="margin:6px 0 2px">المسارات العلمية</h1>' +
    '<p style="margin:0;color:var(--muted);font-size:13px">مساران متكاملان: كل مسار سلّمٌ من المتون، وكل متن يتفتح بعد ما قبله.</p></section>' +
    '<div class="sec"><div class="sec-head"><span class="orn">۞</span><h2>سلّم المستويات الأربعة</h2></div>' +
    '<div class="ladder">' + ladder + '</div></div>' +
    '<div class="sec"><div class="grid">' + rows + '</div></div>';
}

/* ---------- view: track ---------- */
function viewTrack(slug) {
  const t = TRACKS.find((x) => x.slug === slug);
  if (!t) throw new Error('المسار غير موجود');
  const pct = trackPct(t);
  const groups = LEVELS.map((lv) => {
    const cs = t.courses.filter((c) => c.level === lv[0]);
    if (!cs.length) return '';
    const items = cs.map((c) => courseRow(t, c)).join('');
    return '<div class="sec"><div class="sec-head"><span class="orn">۞</span><h2>المستوى ' + lv[1] + '</h2></div><div class="grid">' + items + '</div></div>';
  }).join('');
  return '<section class="course-hero" style="background:linear-gradient(145deg,' + esc(t.courses[0] && t.courses[0].coverColor || '#1F6B54') + ',' + esc(t.courses[0] && t.courses[0].coverColor || '#5F1F1F') + ')">' +
    '<span class="kicker on-glass" style="position:relative;display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;background:rgba(255,246,232,.14);border:1px solid rgba(255,246,232,.28);padding:5px 12px;border-radius:999px;color:#FFF3E0">' + ic('book', 12) + ' مسار ' + esc(t.name) + '</span>' +
    '<h1>' + esc(t.description) + '</h1>' +
    '<div class="ch-meta"><span class="chip on-glass">' + t.courses.length + ' متون</span>' +
    '<span class="chip ' + (pct === 100 ? 'chip-ok on-glass' : 'on-glass') + '">' + (pct === 100 ? 'مكتمل' : 'إنجاز ' + pct + '%') + '</span></div>' +
    '</section>' + groups;
}

/* ---------- course row (used in track page) ---------- */
function courseRow(track, c) {
  if (!c.lessons.length) {
    return '<div class="card course-row locked" aria-disabled="true">' +
      '<span class="cr-cover" style="background:var(--bg-soft);color:var(--faint);border:1px dashed var(--border-strong)">' + firstGlyph(c.title) + '</span>' +
      '<span class="cr-main"><b>' + esc(c.title) + '</b>' +
      '<span class="by">' + esc(c.author) + '</span>' +
      '<span class="cr-bar" style="margin-top:9px"><span class="chip chip-soon">' + ic('clock', 11) + ' قريبًا — لم يُعدّ بعد</span></span></span>' +
      '<span class="cr-side"><span class="go" style="opacity:.5">' + ic('lock', 16) + '</span></span></div>';
  }
  const locked = courseLocked(track, c);
  const done = courseDone(c);
  const pct = coursePct(c);
  const full = done === c.lessons.length;
  return '<a class="card course-row' + (locked ? ' locked' : '') + '" href="' + (locked ? 'javascript:void(0)' : '#/course/' + c.id) + '" data-locked="' + (locked ? 1 : 0) + '">' +
    '<span class="cr-cover" style="background:linear-gradient(180deg,' + esc(c.coverColor) + ' 0%, #4A1717 130%)">' + firstGlyph(c.title) + '</span>' +
    '<span class="cr-main"><b>' + esc(c.title) + '</b>' +
    '<span class="by">' + esc(c.author) + ' · ' + c.lessons.length + ' درسًا</span>' +
    '<span class="cr-bar">' + bar(pct, full) + '<span class="pct">' + (full ? 'مكتمل' : pct + '%') + '</span></span></span>' +
    '<span class="cr-side"><span class="go">' + (locked ? ic('lock', 16) : ic('chevL', 18)) + '</span></span></a>';
}

/* ---------- view: course ---------- */
function viewCourse(id) {
  const r = courseById(id);
  if (!r) throw new Error('المتن غير موجود');
  const t = r.track, c = r.course;
  if (!c.lessons.length) {
    return '<section class="lesson-header"><div class="crumb"><a href="#/">الرئيسية</a> ' + ic('chevL', 11) + ' <a href="#/course/' + c.id + '">' + esc(c.title) + '</a></div></section>' +
      '<div class="card soon-banner"><div class="orn">۞</div><h3>' + esc(c.title) + '</h3>' +
      '<p>' + esc(c.description) + '</p><p style="margin-top:10px"><span class="chip chip-soon">' + ic('clock', 11) + ' هذا المتن قيد الإعداد — سيتاح بإذن الله</span></p></div>';
  }
  const locked = courseLocked(t, c);
  const done = courseDone(c);
  const pct = coursePct(c);
  const lessons = c.lessons.map((l, i) => {
    const lk = locked || lessonLocked(c, i);
    const dn = isDone(l.id);
    const sc = scoreOf(l.id);
    const active = !dn && !lk;
    return '<a class="lesson-item' + (dn ? ' done' : '') + (active ? ' active' : '') + (lk ? ' locked' : '') + '" href="' + (lk ? 'javascript:void(0)' : '#/lesson/' + l.id) + '">' +
      '<span class="li-num">' + (dn ? ic('check', 16) : (lk ? ic('lock', 14) : (i + 1))) + '</span>' +
      '<span class="li-main"><b>' + esc(l.title) + '</b><small>' + esc(l.chapter || '—') + '</small></span>' +
      '<span class="li-side">' + (sc != null ? '<span class="score">' + sc + '%</span>' : (lk ? '<span style="color:var(--faint)">' + ic('lock', 15) + '</span>' : ic('chevL', 16))) + '</span>' +
      '</a>';
  }).join('');
  return '<section class="lesson-header"><div class="crumb"><a href="#/">الرئيسية</a> ' + ic('chevL', 11) + ' <a href="#/course/' + c.id + '">' + esc(c.title) + '</a></div></section>' +
    '<section class="course-hero" style="background:linear-gradient(145deg,' + esc(c.coverColor) + ' 0%, #4A1717 130%)">' +
    '<span class="kicker on-glass" style="position:relative;display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;background:rgba(255,246,232,.14);border:1px solid rgba(255,246,232,.28);padding:5px 12px;border-radius:999px;color:#FFF3E0">' + levelTag(c.level).replace('tag-level', 'tag-level on-glass') + '</span>' +
    '<h1>' + esc(c.title) + '</h1>' +
    '<div class="by">' + ic('users', 12) + ' ' + esc(c.author) + '</div>' +
    '<div class="desc">' + esc(c.description) + '</div>' +
    '<div class="ch-meta"><span class="chip on-glass">' + c.lessons.length + ' درسًا</span>' +
    (c.pdfUrl ? '<a class="chip on-glass" href="' + esc(c.pdfUrl) + '" target="_blank" download style="background:rgba(212,175,55,.25);border-color:rgba(255,215,0,.45);color:#FFF9C4;text-decoration:none">' + ic('file', 12) + ' تحميل كتاب المقرر (PDF)</a>' : '') +
    '<span class="chip on-glass">مكتمل ' + done + '/' + c.lessons.length + '</span>' +
    (locked ? '<span class="chip on-glass">' + ic('lock', 11) + ' أكمل المتون السابقة لفتحه</span>' : '') + '</div>' +
    '</section>' +
    (c.about ? '<div class="sec"><div class="card lsec-card"><h3><span class="orn">۞</span> عن المتن</h3><div class="prose" style="font-size:15.5px">' + paras(c.about) + '</div></div></div>' : '') +
    '<div class="sec"><div class="sec-head"><span class="orn">۞</span><h2>دروس المتن</h2><span class="more">' + pct + '%</span></div>' + bar(pct, pct === 100) + '<div style="height:14px"></div>' +
    lessons + '</div>';
}

/* ---------- online video player ---------- */
let VP_LOST = false;          // انقطع الاتصال أثناء التشغيل
let VP_LAST_ONLINE = navigator.onLine;
function ytId(url) {
  const m = String(url || '').match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,20})/);
  return m ? m[1] : null;
}
function vpStageHTML(id, online) {
  return online
    ? '<img class="vp-thumb" alt="" loading="lazy" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" onerror="this.style.display=\'none\'"/>'
    : '<div class="vp-offline"><span class="orn">۞</span><b>لا يوجد اتصال بالإنترنت</b><small>مشغّل الفيديو يعمل عند توفر الاتصال — وباقي أقسام الدرس تعمل دون اتصال، ويبدأ التشغيل تلقائيًا عند عودة الاتصال</small></div>';
}
function videoPlayerHTML(v) {
  const online = navigator.onLine;
  const id = ytId(v.url);
  if (!id) {
    return '<a class="card video-card" href="' + esc(v.url) + '" target="_blank" rel="noopener"><span class="vthumb">' + ic('play', 20) + '</span><span><b>' + esc(v.title || 'مشاهدة الدرس') + '</b><small>' + ic('info', 11) + ' يتطلب اتصالًا بالإنترنت</small></span></a>';
  }
  const ext = !CAN_SYNC ? '<a class="vp-ext" href="' + esc(v.url) + '" target="_blank" rel="noopener">' + ic('play', 12) + ' فتح الفيديو في تطبيق يوتيوب</a>' : '';
  return '<div class="video-player" id="videoPlayer" data-yt="' + id + '" data-vtitle="' + esc(v.title || 'الدرس المرئي') + '">' +
    '<div class="vp-stage">' + vpStageHTML(id, online) +
    '<button class="vp-play" type="button" aria-label="تشغيل الفيديو" data-vt="' + esc(v.title || 'الدرس المرئي') + '">' + ic('play', 26) + '</button></div>' +
    '<div class="vp-meta"><b>' + esc(v.title || 'الدرس المرئي') + '</b>' +
    '<small>' + (online ? 'متصل — اضغط زر التشغيل لبدء المشاهدة' : 'غير متصل — يبدأ التشغيل تلقائيًا عند عودة الاتصال') + '</small>' + ext + '</div></div>';
}
function vpInject(vp, autoplay) {
  const id = vp.dataset.yt, t = vp.dataset.vtitle || 'الدرس المرئي';
  const stage = $('.vp-stage', vp);
  if (!stage || !id) return;
  stage.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=' + (autoplay ? 1 : 0) + '&rel=0&modestbranding=1" title="' + esc(t) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
  vp.classList.add('playing');
  VP_LOST = false;
}
function vpHandleOffline() {
  const vp = document.getElementById('videoPlayer');
  if (!vp) return;
  if (vp.classList.contains('playing')) {
    VP_LOST = true;
    const stage = $('.vp-stage', vp);
    if (stage && !$('.vp-lost', stage)) {
      stage.insertAdjacentHTML('beforeend', '<div class="vp-lost"><span class="orn">۞</span><b>انقطع الاتصال بالإنترنت</b><small>سيُستأنف التشغيل تلقائيًا عند عودته</small></div>');
    }
  } else {
    navigate();  // إظهار بطاقة «غير متصل» بدل المصغّرة
  }
}
function refreshVideoState() {
  const vp = document.getElementById('videoPlayer');
  if (!vp) return;
  if (VP_LOST && navigator.onLine) {
    VP_LOST = false;
    navigate();
    setTimeout(() => {
      const nvp = document.getElementById('videoPlayer');
      if (nvp && navigator.onLine) vpInject(nvp, true);   // استئناف التشغيل تلقائيًا
    }, 80);
    return;
  }
  if (vp.classList.contains('playing')) return;
  navigate();   // تحديث بطاقة المشغل حسب حالة الاتصال
}
setInterval(() => {   // شبكة أمان للبيئات التي لا تُطلق أحداث online/offline بثبات
  const vp = document.getElementById('videoPlayer');
  if (!vp) return;
  const now = navigator.onLine;
  if (now === VP_LAST_ONLINE) return;
  VP_LAST_ONLINE = now;
  if (now) refreshVideoState();
  else vpHandleOffline();
}, 4000);

/* ---------- view: lesson ---------- */
function viewLesson(id) {
  const r = lessonById(id);
  if (!r) throw new Error('الدرس غير موجود');
  const { track: t, course: c, lesson: l, index: idx } = r;
  if (!c.lessons.length) throw new Error('الدرس غير موجود');
  const lk = courseLocked(t, c) || lessonLocked(c, idx);
  if (lk) return '<div class="card soon-banner" style="margin-top:40px"><div class="orn">' + ic('lock', 26) + '</div><h3>هذا الدرس مقفل</h3><p>أكمل الدروس السابقة أولًا، أو فعّل «التصفح الحر» من الإعدادات.</p><p style="margin-top:14px"><a class="btn btn-primary" href="#/course/' + c.id + '">عودة إلى المتن</a></p></div>';
  setLast(c.id, l.id);
  const prev = idx > 0 ? c.lessons[idx - 1] : null;
  const next = idx < c.lessons.length - 1 ? c.lessons[idx + 1] : null;
  const done = isDone(l.id);
  const sc = scoreOf(l.id);
  const C = l.content || {};
  const nextUnlocked = !next || (!lessonLocked(c, idx + 1));

  const secs = [];
  if (C.objectives && C.objectives.length) secs.push(['objectives', 'الأهداف', 'target', '<ol class="obj-list">' + C.objectives.map((o) => '<li>' + esc(o) + '</li>').join('') + '</ol>']);
  if (C.video && C.video.url) secs.push(['video', 'الدرس المرئي', 'video', videoPlayerHTML(C.video)]);
  if (C.matn) secs.push(['matn', 'المتن', 'file', '<div class="matn-box">' + paras(C.matn) + '</div>']);
  if (C.briefExplanation) secs.push(['brief', 'الشرح الموجز', 'quote', '<div class="prose">' + paras(C.briefExplanation) + '</div>']);
  if (C.detailedExplanation) secs.push(['detailed', 'الشرح التفصيلي', 'book', '<div class="prose">' + mdToHtml(C.detailedExplanation) + '</div>']);
  if (C.evidences && C.evidences.length) {
    const kinds = { quran: ['قرآن', 'ev-quran'], sunnah: ['سنة', 'ev-sunnah'], athar: ['أثر', 'ev-athar'] };
    secs.push(['evidences', 'الأدلة', 'award', C.evidences.map((e) => {
      const k = kinds[e.type] || ['نص', 'ev-athar'];
      return '<div class="ev-card"><span class="ev-badge ' + k[1] + '">' + k[0] + '</span><div class="ev-body">' + esc(e.text) + (e.reference ? '<span class="ev-ref">' + ic('info', 11) + ' ' + esc(e.reference) + '</span>' : '') + '</div></div>';
    }).join('')]);
  }
  if (C.scholars && C.scholars.length) secs.push(['scholars', 'من كلام العلماء', 'users', C.scholars.map((s) => '<div class="quote-card"><div class="qq">«' + esc(s.quote) + '»</div><div class="qa"><b>' + esc(s.name) + '</b>' + (s.source ? '<span>' + esc(s.source) + '</span>' : '') + '</div></div>').join('')]);
  if (C.benefits && C.benefits.length) secs.push(['benefits', 'فوائد وقواعد', 'star', '<ul class="benefit-list">' + C.benefits.map((b) => '<li>' + esc(b) + '</li>').join('') + '</ul>']);
  if (C.terms && C.terms.length) secs.push(['terms', 'المصطلحات', 'list', '<div class="term-grid">' + C.terms.map((tm) => '<div class="term-item"><b>' + esc(tm.term) + '</b><p>' + esc(tm.definition) + '</p></div>').join('') + '</div>']);
  if (C.mindMap && C.mindMap.branches) {
    secs.push(['map', 'الخريطة الذهنية', 'layers', '<div class="mm-root">' + esc(C.mindMap.title ? C.mindMap.title : '') + C.mindMap.branches.map((b) => '<div class="mm-node"><div class="mm-title">' + esc(b.title) + '</div><ul>' + b.items.map((it) => '<li>' + esc(it) + '</li>').join('') + '</ul></div>').join('') + '</div>']);
  }
  if (C.summaryTable && C.summaryTable.headers) {
    secs.push(['table', 'جدول الملخص', 'list', '<table class="stable"><thead><tr>' + C.summaryTable.headers.map((h) => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' + C.summaryTable.rows.map((row) => '<tr>' + row.map((cell) => '<td>' + esc(cell) + '</td>').join('') + '</tr>').join('') + '</tbody></table>']);
  }
  const chips = secs.map((s, i) => '<button class="tab-chip' + (i === 0 ? ' on' : '') + '" data-target="sec-' + s[0] + '">' + esc(s[1]) + '</button>').join('');
  const sections = secs.map((s, i) => '<section class="lsec" id="sec-' + s[0] + '" style="' + (i === 0 ? '' : 'margin-top:18px') + '"><div class="card lsec-card"><h3><span class="orn">۞</span> ' + s[1] + '</h3>' + s[3] + '</div></section>').join('');

  const quizBtnLabel = done ? ('أعد الاختبار' + (sc != null ? ' (' + sc + '%)' : '')) : 'ابدأ الاختبار';
  return '<section class="lesson-header">' +
    '<div class="crumb"><a href="#/">الرئيسية</a> ' + ic('chevL', 11) + ' <a href="#/course/' + c.id + '">' + esc(c.title) + '</a></div>' +
    '<h1>' + esc(l.title) + '</h1>' +
    '<div class="lmeta"><span class="chip chip-gold">' + esc(l.chapter || 'درس') + '</span>' +
    '<span class="chip">الدرس ' + (idx + 1) + ' من ' + c.lessons.length + '</span>' +
    (done && sc != null ? '<span class="chip chip-ok">' + ic('check', 11) + ' اجتزته بدرجة ' + sc + '%</span>' : '') + '</div>' +
    '</section>' +
    (l.summary ? '<div class="card lsec-card" style="margin-bottom:14px"><div class="prose" style="font-size:15.5px;color:var(--muted)"><p style="margin:0">' + esc(l.summary) + '</p></div></div>' : '') +
    '<div class="lesson-actions no-print"><button class="btn btn-ghost" id="printLesson" type="button">' + ic('download', 15) + ' حفظ / طباعة الدرس PDF</button></div>' +
    '<div class="lesson-layout">' +
    '<nav class="tabs" aria-label="أقسام الدرس">' + chips + '</nav>' +
    '<div class="lesson-main">' +
    sections +
    '<div class="lesson-foot">' +
    (prev ? '<a class="btn btn-ghost" href="#/lesson/' + prev.id + '">' + ic('chevR', 15) + ' السابق</a>' : '<span style="flex:1"></span>') +
    '<a class="btn btn-gold" href="#/quiz/' + l.id + '" style="flex:1.4">' + ic('award', 16) + ' ' + quizBtnLabel + '</a>' +
    (next ? ('<a class="btn btn-ghost" href="#/lesson/' + next.id + '"' + (nextUnlocked ? '' : ' disabled') + '>التالي ' + ic('chevL', 15) + '</a>') : '<span style="flex:1"></span>') +
    '</div>' +
    '</div></div>';
}

/* ---------- view: quiz ---------- */
let QZ = null;
function viewQuiz(id) {
  const r = lessonById(id);
  if (!r || !r.course.lessons.length) throw new Error('الاختبار غير موجود');
  const { track: t, course: c, lesson: l, index: idx } = r;
  if (!l.questions || !l.questions.length) {
    return '<div class="card soon-banner" style="margin-top:40px"><div class="orn">۞</div><h3>لا توجد أسئلة لهذا الدرس بعد</h3><p><a class="btn btn-primary" href="#/lesson/' + l.id + '">عودة إلى الدرس</a></p></div>';
  }
  if (courseLocked(t, c) || lessonLocked(c, idx)) {
    return '<div class="card soon-banner" style="margin-top:40px"><div class="orn">' + ic('lock', 26) + '</div><h3>هذا الاختبار مقفل</h3><p>أكمل الدروس السابقة أولًا.</p></div>';
  }
  QZ = { lesson: l, course: c, i: 0, sel: null, confirmed: false, correct: 0, finished: false, answers: [] };
  return '<div class="quiz-wrap" id="quizWrap">' + quizQuestion() + '</div>';
}
function quizQuestion() {
  const q = QZ.lesson.questions[QZ.i];
  const total = QZ.lesson.questions.length;
  const pct = Math.round((QZ.i) / total * 100);
  const fb = QZ.confirmed ? quizFeedback(q) : '';
  const opts = q.options.map((o, j) => {
    let cls = 'opt';
    if (QZ.confirmed) {
      if (j === q.answer) cls += ' right';
      else if (j === QZ.sel) cls += ' wrong';
    } else if (j === QZ.sel) cls += ' sel';
    return '<button class="' + cls + '" data-opt="' + j + '" ' + (QZ.confirmed ? 'disabled' : '') + '><span class="ol">' + ['أ', 'ب', 'ج', 'د'][j] + '</span><span>' + esc(o) + '</span></button>';
  }).join('');
  const action = !QZ.confirmed
    ? '<div class="quiz-act"><button class="btn btn-primary btn-block" id="qConfirm" ' + (QZ.sel == null ? 'disabled' : '') + '>تأكيد الإجابة</button></div>'
    : '<div class="quiz-act"><button class="btn btn-gold btn-block" id="qNext">' + (QZ.i + 1 < total ? 'السؤال التالي ' : 'عرض النتيجة ') + ic('chevL', 15) + '</button></div>';
  return '<div class="quiz-top"><span class="qnum">' + (QZ.i + 1) + ' / ' + total + '</span><span class="qbar">' + bar(pct) + '</span></div>' +
    '<div class="card quiz-card"><p class="quiz-q">' + esc(q.q) + '</p>' + opts +
    (fb ? '<div class="quiz-feedback ' + (QZ.sel === q.answer ? 'good' : 'bad') + '">' + fb + '</div>' : '') +
    action + '</div>';
}
function quizFeedback(q) {
  if (QZ.sel === q.answer) return ic('check', 13) + ' إجابة صحيحة — أحسنت!';
  return ic('x', 13) + ' الإجابة الصحيحة: ' + esc(q.options[q.answer]);
}
function bindQuiz() {
  const wrap = $('#quizWrap');
  if (!wrap) return;
  $$('.opt', wrap).forEach((b) => b.addEventListener('click', () => {
    QZ.sel = parseInt(b.dataset.opt, 10);
    $('#quizWrap').innerHTML = quizQuestion();
    bindQuiz();
  }));
  const confirmBtn = $('#qConfirm');
  if (confirmBtn) confirmBtn.addEventListener('click', () => {
    const q = QZ.lesson.questions[QZ.i];
    QZ.confirmed = true;
    if (QZ.sel === q.answer) QZ.correct++;
    QZ.answers.push(QZ.sel);
    $('#quizWrap').innerHTML = quizQuestion();
    bindQuiz();
  });
  const nextBtn = $('#qNext');
  if (nextBtn) nextBtn.addEventListener('click', () => {
    const total = QZ.lesson.questions.length;
    if (QZ.i + 1 < total) { QZ.i++; QZ.sel = null; QZ.confirmed = false; $('#quizWrap').innerHTML = quizQuestion(); bindQuiz(); }
    else { QZ.finished = true; finishQuiz(); }
  });
  const retryBtn = $('#qRetry');
  if (retryBtn) retryBtn.addEventListener('click', () => {
    QZ.i = 0; QZ.sel = null; QZ.confirmed = false; QZ.correct = 0; QZ.finished = false; QZ.answers = [];
    $('#quizWrap').innerHTML = quizQuestion();
    bindQuiz();
  });
}
function finishQuiz() {
  const total = QZ.lesson.questions.length;
  const pct = Math.round(QZ.correct / total * 100);
  const passed = pct >= 60;
  const firstPass = !isDone(QZ.lesson.id);
  if (passed) recordDone(QZ.lesson.id, pct);
  const r = lessonById(QZ.lesson.id);
  const nextIdx = r.index + 1;
  const next = nextIdx < r.course.lessons.length ? r.course.lessons[nextIdx] : null;
  const msg = pct >= 90 ? 'ما شاء الله! تفوقٌ واضح' : pct >= 80 ? 'أحسنت! أداء قوي' : passed ? 'اجتزت الاختبار — واصل التقدم' : 'لم تجتز هذه المرة — راجع الدرس وأعد المحاولة';
  const ringColor = passed ? 'var(--ok)' : '#B3452F';
  $('#quizWrap').innerHTML =
    '<div class="card result-card">' +
    '<div class="result-ring" style="background:conic-gradient(' + ringColor + ' ' + pct + '%, var(--bg-soft) 0)"><div style="width:96px;height:96px;border-radius:50%;background:var(--surface);display:flex;align-items:center;justify-content:center"><b style="color:' + ringColor + '">' + pct + '%</b></div></div>' +
    '<h2>' + esc(msg) + '</h2>' +
    '<p>' + QZ.correct + ' من ' + total + ' إجابات صحيحة' + (passed ? (firstPass ? ' — تم تسجيل اكتمال الدرس وفتح ما يليه' : ' — تم تحديث درجتك') : ' — درجة النجاح 60% فأعلى') + '</p>' +
    '<div class="result-actions">' +
    (!passed ? '<button class="btn btn-primary btn-block" id="qRetry">' + ic('rotate', 16) + ' إعادة الاختبار</button>' : '') +
    (passed && next ? '<a class="btn btn-gold btn-block" href="#/lesson/' + next.id + '">الدرس التالي ' + ic('chevL', 15) + '</a>' : '') +
    '<a class="btn btn-ghost btn-block" href="#/course/' + QZ.course.id + '">عودة إلى المتن</a>' +
    '</div></div>';
  bindQuiz();
  if (passed) {
    setTimeout(() => toast(firstPass ? 'تم تسجيل الدرس كمكتمل' : 'تم تحديث درجتك'), 250);
    if (!next) setTimeout(() => toast('بارك الله فيك! أتممت هذا المتن'), 900);
  }
}

/* ---------- view: settings ---------- */
function accountSection() {
  if (!CAN_SYNC) {
    return '<div class="sec"><div class="sec-head"><span class="orn">۞</span><h2>الحساب والمزامنة</h2></div>' +
      '<div class="card set-group"><div class="set-row"><span class="si">' + ic('user', 17) + '</span>' +
      '<span class="sm"><b>النسخة المدمجة — دون حساب</b><small>هذه نسخة التطبيق المدمجة (أندرويد / دون إنترنت): تقدّمك ودرجاتك محفوظة على جهازك تلقائيًا دون حساب. الدرس المرئي يُفتح خارج التطبيق عند توفر الاتصال.</small></span></div></div></div>';
  }
  if (!ACCT.user) {
    return '<div class="sec"><div class="sec-head"><span class="orn">۞</span><h2>الحساب والمزامنة</h2></div>' +
      '<div class="card auth-card">' +
      '<p class="auth-intro">أنشئ حسابًا مجانيًا ليُحفظ تقدّمك على الخادم وتتابعه من أي متصفح أو جهاز. يعمل التطبيق دون إنترنت كالمعتاد، وعند توفر الاتصال تُرفَع نتائجك وتُدمَج تلقائيًا مع ما على جهازك.</p>' +
      '<div class="auth-tabs" role="tablist">' +
      '<button class="auth-tab on" type="button" data-auth="login">تسجيل الدخول</button>' +
      '<button class="auth-tab" type="button" data-auth="register">حساب جديد</button></div>' +
      '<form class="auth-form" id="loginForm">' +
      '<label class="fld"><span>اسم المستخدم</span><input name="username" required minlength="3" maxlength="32" autocomplete="username" dir="auto"/></label>' +
      '<label class="fld"><span>كلمة المرور</span><input name="password" type="password" required minlength="6" autocomplete="current-password"/></label>' +
      '<div class="form-err" hidden></div>' +
      '<button class="btn btn-primary btn-block" type="submit">دخول</button>' +
      '</form>' +
      '<form class="auth-form" id="registerForm" hidden>' +
      '<label class="fld"><span>الاسم الظاهر</span><input name="displayName" maxlength="60" placeholder="مثال: عبد الرحمن" dir="auto"/></label>' +
      '<label class="fld"><span>اسم المستخدم</span><input name="username" required minlength="3" maxlength="32" autocomplete="username" dir="auto"/><small>حروف عربية أو لاتينية وأرقام — من 3 إلى 32</small></label>' +
      '<label class="fld"><span>كلمة المرور</span><input name="password" type="password" required minlength="6" autocomplete="new-password"/></label>' +
      '<label class="fld"><span>تأكيد كلمة المرور</span><input name="confirm" type="password" required minlength="6" autocomplete="new-password"/></label>' +
      '<div class="form-err" hidden></div>' +
      '<button class="btn btn-primary btn-block" type="submit">إنشاء الحساب</button>' +
      '</form>' +
      '</div></div>';
  }
  const u = ACCT.user;
  return '<div class="sec"><div class="sec-head"><span class="orn">۞</span><h2>الحساب والمزامنة</h2></div>' +
    '<div class="card auth-card">' +
    '<div class="acct-row"><span class="acct-av big">' + esc((u.displayName || '؟').trim()[0]) + '</span>' +
    '<div class="acct-info"><b>' + esc(u.displayName) + '</b><small dir="ltr">@' + esc(u.username) + '</small></div>' +
    '<button class="btn btn-ghost" id="acctLogout" type="button" style="min-height:38px;padding:7px 14px;font-size:12.5px">' + ic('logout', 14) + ' خروج</button></div>' +
    '<div class="sync-status">' + ic('cloud', 14) + ' <span data-sync-text>' + esc(syncStatusText()) + '</span></div>' +
    '<div class="acct-actions"><button class="btn btn-gold" id="syncNow" type="button">' + ic('rotate', 15) + ' مزامنة الآن</button>' +
    '<span class="sync-note">يُحفظ تقدّمك على جهازك دائمًا، وعند توفر الاتصال يُرفَع ويُدمَج مع حسابك تلقائيًا.</span></div>' +
    '</div></div>';
}
function viewSettings() {
  return '<section class="lesson-header"><h1 style="margin:6px 0 2px">الإعدادات</h1><p style="margin:0;color:var(--muted);font-size:13px">خصّص تجربتك — تُحفظ إعداداتك تلقائيًا على هذا الجهاز.</p></section>' +
    accountSection() +
    '<div class="sec"><div class="card set-group">' +
    '<div class="set-row"><span class="si">' + ic('moon', 17) + '</span><span class="sm"><b>الوضع الليلي</b><small>مناسب للقراءة الليلية ومراعاة للعين</small></span><button class="switch' + (S.theme === 'dark' ? ' on' : '') + '" id="setDark" role="switch" aria-checked="' + (S.theme === 'dark') + '" aria-label="الوضع الليلي"></button></div>' +
    '<div class="set-row"><span class="si">' + ic('lock', 17) + '</span><span class="sm"><b>التصفح الحر</b><small>فتح كل الدروس والمتون دون الالتزام بترتيب السلّم العلمي</small></span><button class="switch' + (S.free ? ' on' : '') + '" id="setFree" role="switch" aria-checked="' + S.free + '" aria-label="التصفح الحر"></button></div>' +
    '</div></div>' +
    '<div class="sec"><div class="card set-group">' +
    '<div class="set-row"><span class="si">' + ic('rotate', 17) + '</span><span class="sm"><b>إعادة تعيين التقدّم</b><small>مسح كل الدروس المكتملة والدرجات — لا يمكن الرجوع</small></span><button class="btn btn-ghost" id="setReset" style="min-height:38px;padding:7px 14px;font-size:12.5px">مسح</button></div>' +
    '</div></div>' +
    (CAN_SYNC ?
      '<div class="sec"><div class="sec-head"><span class="orn">۞</span><h2>تحميل التطبيق</h2></div>' +
      '<div class="card set-group dl-card">' +
      '<div class="dl-intro">حمّل لمعة الاعتقاد على هاتفك أو استخدمها من متصفح الحاسوب — كل الروابط من نفس هذا الموقع:</div>' +
      '<div class="dl-grid">' +
      '<a class="btn btn-primary dl-btn" href="/downloads/manara-1.6.0.apk" download>' + ic('download', 16) + ' APK v1.6.0 — أندرويد<span class="dl-sub">الأحدث · موقّع · كتاب الصيام مكتمل</span></a>' +
      '<a class="btn btn-gold dl-btn" href="/downloads/manara-web-app.zip" download>' + ic('download', 16) + ' نسخة الويب ZIP<span class="dl-sub">فكّ الضغط وافتح app/index.html — تعمل دون إنترنت</span></a>' +
      '<a class="btn btn-ghost dl-btn" href="/downloads/manara-latest.apk" download>' + ic('download', 16) + ' أحدث APK (رابط ثابت)<span class="dl-sub">يُحدَّث دائمًا مع كل إصدار جديد</span></a>' +
      '</div>' +
      '<div class="dl-note">بعد تحميل APK: افتح الملف واسمح بالتثبيت من «مصادر غير معروفة» عند السؤال. عند تحديث الإصدار ثبّت الملف الجديد فوق القديم مباشرة دون حذف — يُحفظ تقدّمك.</div>' +
      '</div></div>' :
      '') +
    '<div class="sec"><div class="card set-group">' +
    '<div class="set-row"><span class="si">' + ic('info', 17) + '</span><span class="sm"><b>عن التطبيق</b><small>«لمعة الاعتقاد» — متن ابن قدامة بشرح الشيخ عبدالرزاق البدر. يعمل التطبيق دون إنترنت بالكامل، ويمكن مزامنة التقدّم مع حساب عند الاتصال.</small></span></div>' +
    '<div class="set-row"><span class="si" style="font-family:var(--font-read);font-weight:700;color:var(--gold-deep)">ع</span><span class="sm"><b>لمعة الاعتقاد 1.0</b><small>متن لمعة الاعتقاد · مشغّل دروس مرئي · حساب ومزامنة · واجهة للحاسوب — بيانات: ' + globalStats().total + ' درسًا · ' + TRACKS.reduce((a, t) => a + t.courses.reduce((b, c) => b + c.lessons.reduce((x, l) => x + (l.questions || []).length, 0), 0), 0) + ' سؤال اختبار</small></span></div>' +
    '</div></div>';
}
function bindSettings() {
  const d = $('#setDark');
  if (d) d.addEventListener('click', () => { toggleTheme(); navigate(); });
  const f = $('#setFree');
  if (f) f.addEventListener('click', () => {
    S.free = !S.free; save(); navigate();
    toast(S.free ? 'فُتحت كل الدروس — التصفح الحر مفعّل' : 'عاد التطبيق إلى سلّم التدرّج');
  });
  const rs = $('#setReset');
  if (rs) rs.addEventListener('click', () => {
    if (rs.dataset.armed) {
      S.done = {}; S.last = null; save(); navigate(); toast('أُعيد تعيين التقدّم بالكامل');
    } else {
      rs.dataset.armed = '1'; rs.textContent = 'تأكيد المسح؟'; rs.style.color = 'var(--primary)'; rs.style.borderColor = 'var(--primary)';
      setTimeout(() => { if (rs.isConnected) { rs.dataset.armed = ''; rs.textContent = 'مسح'; rs.style.color = ''; rs.style.borderColor = ''; } }, 3000);
    }
  });
  /* account: tabs */
  $$('.auth-tab').forEach((t) => t.addEventListener('click', () => {
    $$('.auth-tab').forEach((x) => x.classList.remove('on'));
    t.classList.add('on');
    const lf = $('#loginForm'), rf = $('#registerForm');
    if (lf) lf.hidden = t.dataset.auth !== 'login';
    if (rf) rf.hidden = t.dataset.auth !== 'register';
  }));
  bindAuthForm('#loginForm', (fd) => doLogin(String(fd.get('username') || '').trim(), String(fd.get('password') || '')));
  bindAuthForm('#registerForm', (fd) => {
    const pw = String(fd.get('password') || ''), cf = String(fd.get('confirm') || '');
    if (pw !== cf) throw new Error('كلمتا المرور غير متطابقتين');
    return doRegister(String(fd.get('displayName') || '').trim(), String(fd.get('username') || '').trim(), pw);
  });
  const lo = $('#acctLogout');
  if (lo) lo.addEventListener('click', () => { lo.disabled = true; doLogout(); });
  const sn = $('#syncNow');
  if (sn) sn.addEventListener('click', async () => {
    if (!navigator.onLine) { toast('لا يوجد اتصال بالإنترنت الآن'); return; }
    sn.disabled = true;
    await pullSync(true);
    sn.disabled = false;
  });
}
function bindAuthForm(sel, fn) {
  const f = $(sel);
  if (!f) return;
  f.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const err = $('.form-err', f);
    if (err) err.hidden = true;
    const btn = $('button[type="submit"]', f);
    const old = btn.textContent;
    btn.disabled = true; btn.textContent = 'جارٍ المعالجة…';
    try { await fn(new FormData(f)); }
    catch (e) { if (err) { err.textContent = e.message || 'تعذر إتمام العملية'; err.hidden = false; } }
    btn.disabled = false; btn.textContent = old;
  });
}

/* ---------- boot & events ---------- */
document.addEventListener('click', (e) => {
  const vpPlay = e.target.closest('.vp-play');
  if (vpPlay) {
    const wrap = vpPlay.closest('.video-player');
    if (!navigator.onLine) { toast('الفيديو يتطلب اتصالًا بالإنترنت — يعمل باقي الدرس دون اتصال، ويبدأ التشغيل تلقائيًا عند عودته'); return; }
    if (wrap) vpInject(wrap, true);
    return;
  }
  const chip = e.target.closest('.tab-chip');
  if (chip) {
    $$('.tab-chip').forEach((c) => c.classList.remove('on'));
    chip.classList.add('on');
    const sec = document.getElementById(chip.dataset.target);
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (e.target.closest('#printLesson')) { window.print(); return; }
  const lockedRow = e.target.closest('[data-locked="1"]');
  if (lockedRow) {
    e.preventDefault();
    toast('أكمل المتون السابقة لفتح هذا الكتاب — أو فعّل التصفح الحر');
  }
});
window.addEventListener('hashchange', navigate);
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  navigate();
  bootAccount();
  window.addEventListener('online', () => { VP_LAST_ONLINE = true; updateSyncBadges(); pushSync(false); refreshVideoState(); });
  window.addEventListener('offline', () => { VP_LAST_ONLINE = false; updateSyncBadges(); vpHandleOffline(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && ACCT.user && navigator.onLine) pushSync(true); });
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
})();
