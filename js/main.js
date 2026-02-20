// ─── BOOT ───
const LINES = [
  {t:'BIOS v2.08 // ANTHROPIC SYSTEMS INT.',   d:0,    c:''},
  {t:'Memory check: 8192MB ................',  d:180,  c:'ok'},
  {t:'Loading kernel modules ...............',  d:340,  c:'ok'},
  {t:'Mounting /dev/identity ................', d:510,  c:'ok'},
  {t:'Initializing visual cortex ............', d:680,  c:'ok'},
  {t:'Verifying subject biometrics ..........', d:850,  c:'ok'},
  {t:'Uplink established ....................', d:1020, c:'ok'},
  {t:'Loading SUBJECT A-34 profile .........', d:1200, c:'ok'},
  {t:'WARNING: Mental state UNSTABLE',          d:1380, c:'warn'},
  {t:'Bypassing safety protocols ............', d:1550, c:'ok'},
  {t:'> All systems nominal. LAUNCHING...',    d:1730, c:''},
];

const linesEl = document.getElementById('boot-lines');
const barWrap = document.getElementById('barWrap');
const barFill = document.getElementById('barFill');
const barPct  = document.getElementById('barPct');
const bootEl  = document.getElementById('boot');
const mainEl  = document.getElementById('main');
const togEl   = document.getElementById('toggle-wrap');

LINES.forEach(({t,d,c}) => {
  setTimeout(() => {
    const el = document.createElement('div');
    el.className = 'boot-line' + (c ? ' '+c : '');
    el.textContent = t;
    linesEl.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('active')));
  }, d + 300);
});

setTimeout(() => {
  barWrap.classList.add('show');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 4.5 + 0.5;
    if (p >= 100) { p = 100; clearInterval(iv); }
    barFill.style.width = p + '%';
    barPct.textContent  = Math.round(p) + '%';
  }, 55);
}, 600);

setTimeout(() => {
  bootEl.classList.add('fade-out');
  setTimeout(() => {
    bootEl.style.display = 'none';
    mainEl.classList.add('visible');
    togEl.classList.add('show');
  }, 820);
}, 3000);

// ─── CLOCK ───
function tick() {
  const n = new Date();
  document.getElementById('clock').textContent =
    String(n.getHours()).padStart(2,'0') + ':' +
    String(n.getMinutes()).padStart(2,'0') + ':' +
    String(n.getSeconds()).padStart(2,'0');
}
setInterval(tick, 1000); tick();

// ─── THEME TOGGLE ───
let currentTheme = 'cyber';

const themeText = {
  cyber: {
    title: 'SUBJECT A-34',
    sys: 'SYS://BIO.EXE',
    photo: 'VISUAL IDENT // CONFIRMED',
    bio: '// SUBJECT PROFILE',
    links: '// ACCESS NODES',
    footer: 'SYS.ACTIVE',
    status: 'THEME:CYBER',
    sep: '//',
    linkIcons: ['◈','◈','◈','◈','◈','◈'],
  },
  gothic: {
    title: 'TORRA  ✦  TAHA',
    sys: '⚔ REGISTRY OF SOULS',
    photo: 'LIKENESS  ✦  VERIFIED',
    bio: '✦ On the Nature of the Subject',
    links: '✦ Portals & Passages',
    footer: 'EST. MMVIII',
    status: 'THEME:GOTHIC',
    sep: '⚔',
    linkIcons: ['⚜','⚜','⚜','⚜','⚜','⚜'],
  }
};

function toggleTheme() {
  const fl = document.getElementById('flash');
  fl.classList.add('pop');
  setTimeout(() => fl.classList.remove('pop'), 120);

  currentTheme = currentTheme === 'cyber' ? 'gothic' : 'cyber';
  document.documentElement.setAttribute('data-theme', currentTheme);

  const tx = themeText[currentTheme];
  document.getElementById('card-title').textContent    = tx.title;
  document.getElementById('sys-label').textContent     = tx.sys;
  document.getElementById('photo-label').textContent   = tx.photo;
  document.getElementById('bio-label').textContent     = tx.bio;
  document.getElementById('links-label').textContent   = tx.links;
  document.getElementById('footer-left').textContent   = tx.footer;
  document.getElementById('theme-label').textContent   = tx.status;
  document.getElementById('sep1').textContent          = tx.sep;
  document.getElementById('sep2').textContent          = tx.sep;

  // update link icons
  document.querySelectorAll('.li').forEach((el,i) => {
    el.textContent = tx.linkIcons[i] || '◈';
  });
}
