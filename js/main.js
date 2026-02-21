//  BOOT SEQUENCE
const BOOT_LINES = [
    { t: 'BIOS v2.08 // ANTHROPIC SYSTEMS INT.',    d: 0,    c: '' },
    { t: 'CPU: CREATIVE_UNIT_v7 .... 3.4GHz',       d: 180,  c: '' },
    { t: 'Memory check: 8192MB .................',   d: 340,  c: 'ok' },
    { t: 'Loading kernel modules ...............',   d: 510,  c: 'ok' },
    { t: 'Mounting /dev/identity ................',  d: 680,  c: 'ok' },
    { t: 'Initializing visual cortex ............',  d: 850,  c: 'ok' },
    { t: 'Verifying subject biometrics ..........',  d: 1020, c: 'ok' },
    { t: 'Uplink established ....................',   d: 1190, c: 'ok' },
    { t: 'Loading PSEUDOINTELLECTUAL profile ....',  d: 1370, c: 'ok' },
    { t: 'WARNING: Mental state UNSTABLE',           d: 1540, c: 'warn' },
    { t: 'Bypassing safety protocols ..........',   d: 1710, c: 'ok' },
    { t: '> All systems nominal. LAUNCHING...',     d: 1900, c: '' },
];

const linesEl = document.getElementById('boot-lines');
const barWrap = document.getElementById('barWrap');
const barFill = document.getElementById('barFill');
const barPct  = document.getElementById('barPct');
const bootEl  = document.getElementById('boot');
const mainEl  = document.getElementById('main');
const matrixEl= document.getElementById('main-matrix');
const togEl   = document.getElementById('toggle-wrap');

BOOT_LINES.forEach(({ t, d, c }) => {
    setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'boot-line' + (c ? ' ' + c : '');
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
        applyTheme();          // set initial layout
        togEl.classList.add('show');
    }, 820);
}, 3100);

//  CLOCK
function tick() {
    const n = new Date();
    const t = String(n.getHours()).padStart(2,'0') + ':' +
        String(n.getMinutes()).padStart(2,'0') + ':' +
        String(n.getSeconds()).padStart(2,'0');
    const c1 = document.getElementById('clock');
    const c2 = document.getElementById('mx-clock');
    if (c1) c1.textContent = t;
    if (c2) c2.textContent = t;
}
setInterval(tick, 1000);
tick();

//  MATRIX RAIN
const canvas = document.getElementById('matrix-canvas');
const ctx    = canvas.getContext('2d');
let matrixAnimId = null;
const CHARS = 'ｦｧｨｩｪｫｬｭｮｯｰアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let drops = [];
function initDrops() {
    const cols = Math.floor(canvas.width / 18);
    drops = Array.from({ length: cols }, () => Math.random() * -50);
}
initDrops();

let lastMatrixFrame = 0;
const MATRIX_INTERVAL = 80; // ms between steps — higher = slower rain

function drawMatrix(timestamp) {
    matrixAnimId = requestAnimationFrame(drawMatrix);

    // throttle: only update every MATRIX_INTERVAL ms
    if (timestamp - lastMatrixFrame < MATRIX_INTERVAL) return;
    lastMatrixFrame = timestamp;

    // very faint fade — low opacity keeps trails long
    ctx.fillStyle = 'rgba(0, 6, 1, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x  = i * 18;
        const y  = drops[i] * 18;

        ctx.fillStyle = drops[i] > 1
            ? 'rgba(0, 80, 20, 0.5)'
            : 'rgba(0, 255, 65, 0.55)';

        ctx.font = '14px Share Tech Mono, monospace';
        ctx.fillText(ch, x, y);

        if (Math.random() > 0.98) {
            ctx.fillStyle = 'rgba(180, 255, 200, 0.3)';
            ctx.fillText(ch, x, y);
        }

        drops[i]++;
        if (drops[i] * 18 > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
    }
}

function startMatrix() {
    if (!matrixAnimId) {
        initDrops();
        drawMatrix();
    }
}

function stopMatrix() {
    if (matrixAnimId) {
        cancelAnimationFrame(matrixAnimId);
        matrixAnimId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

//  VISITOR COUNTER
function initCounter() {
    const key   = 'pseudointellectual_visits';
    let count   = parseInt(localStorage.getItem(key) || '0', 10);
    const seen  = sessionStorage.getItem(key + '_seen');
    if (!seen) {
        count++;
        localStorage.setItem(key, count);
        sessionStorage.setItem(key + '_seen', '1');
    }
    // animate count up in all counter elements on the page
    const els = document.querySelectorAll('.vc-count');
    els.forEach(el => {
        let current = 0;
        const step  = Math.ceil(count / 40);
        const iv    = setInterval(() => {
            current = Math.min(current + step, count);
            el.textContent = String(current).padStart(4, '0');
            if (current >= count) clearInterval(iv);
        }, 40);
    });
}

//  THEME STATE
let currentTheme = 'cyber';
let currentSub   = 1;

const THEME_TEXT = {
    cyber: {
        img:    './assets/images/cyberme.png',
        title:  'Pseudointellectual',
        sys:    'SYS://BIO.EXE',
        photo:  'VISUAL IDENT // CONFIRMED',
        bio:    '// SUBJECT PROFILE',
        links:  '// ACCESS NODES',
        footer: 'SYS.ACTIVE',
        status: 'THEME:CYBER:V1',
        sep:    '//',
        icon:   '◈',
    },
    gothic: {
        img:    './assets/images/gothlow.png',
        title:  'PRATTLE ✦ BOSS',
        sys:    '⚔ REGISTRY OF SOULS',
        photo:  'LIKENESS  ✦  VERIFIED',
        bio:    '✦ On the Nature of the Subject',
        links:  '✦ Portals & Passages',
        footer: 'EST. MMiV',
        status: 'THEME:GOTHIC',
        sep:    '⚔',
        icon:   '⚜',
    },
};

function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.documentElement.setAttribute('data-sub',   currentSub);

    const isMatrixV2 = currentTheme === 'cyber' && currentSub === 2;
    const isGothic   = currentTheme === 'gothic';

    // show correct layout
    if (isMatrixV2) {
        mainEl.classList.remove('visible');
        mainEl.style.display = 'none';
        matrixEl.style.display = 'flex';
        requestAnimationFrame(() => matrixEl.classList.add('visible'));
        startMatrix();
        document.getElementById('matrix-img').src = './assets/images/cyberme.png';
    } else {
        stopMatrix();
        matrixEl.classList.remove('visible');
        matrixEl.style.display = 'none';
        mainEl.style.display = 'flex';
        requestAnimationFrame(() => mainEl.classList.add('visible'));

        const tx = THEME_TEXT[currentTheme];
        document.getElementById('profile-img').src         = tx.img;
        document.getElementById('card-title').textContent  = tx.title;
        document.getElementById('sys-label').textContent   = tx.sys;
        document.getElementById('photo-label').textContent = tx.photo;
        document.getElementById('bio-label').textContent   = tx.bio;
        document.getElementById('links-label').textContent = tx.links;
        document.getElementById('footer-left').textContent = tx.footer;
        document.getElementById('theme-label').textContent = tx.status;
        document.getElementById('sep1').textContent        = tx.sep;
        document.getElementById('sep2').textContent        = tx.sep;
        document.querySelectorAll('.li').forEach(el => el.textContent = tx.icon);
    }

    // scan sweep
    const sweep = document.querySelector('.scan-sweep');
    if (sweep) {
        if (isGothic) {
            sweep.style.animation = 'none';
            sweep.style.opacity   = '0';
            sweep.style.top       = '-10px';
        } else {
            sweep.style.opacity   = '';
            sweep.style.top       = '';
            sweep.style.animation = 'none';
            sweep.offsetHeight;
            sweep.style.animation = '';
        }
    }

    // sub buttons
    document.querySelectorAll('.sub-btn').forEach(btn => {
        btn.classList.toggle('active', Number(btn.dataset.v) === currentSub);
    });

    // visitor counter — always init
    initCounter();

    // flash
    const fl = document.getElementById('flash');
    fl.classList.add('pop');
    setTimeout(() => fl.classList.remove('pop'), 130);
}

function toggleTheme() {
    currentTheme = currentTheme === 'cyber' ? 'gothic' : 'cyber';
    currentSub   = 1;
    applyTheme();
}

function setSub(v) {
    if (currentSub === v) return;
    currentSub = v;
    applyTheme();
}
