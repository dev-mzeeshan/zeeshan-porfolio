/* ── 1. SCROLL PROGRESS BAR ── */
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
    const pct = (scrollY / (document.body.scrollHeight - innerHeight)) * 100;
    scrollBar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

/* ── 2. CUSTOM CURSOR ── */
const cdot = document.getElementById('cdot');
const cring = document.getElementById('cring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cdot.style.left = mx + 'px';
    cdot.style.top = my + 'px';
});

// Ring follows with lag
function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cring.style.left = rx + 'px';
    cring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
}
animRing();

// Expand on interactive elements
document.querySelectorAll('a, button, .pcard, .stat, .ccard, .tag').forEach(el => {
    el.addEventListener('mouseenter', () => { cdot.classList.add('expand'); cring.classList.add('expand'); });
    el.addEventListener('mouseleave', () => { cdot.classList.remove('expand'); cring.classList.remove('expand'); });
});

/* ── 3. PAGE LOAD SEQUENCE ── */
window.addEventListener('load', () => {
    // Nav slides in
    setTimeout(() => document.getElementById('nav').classList.add('loaded'), 200);
    // Hero elements animate in
    setTimeout(() => document.querySelector('.hero-tag').classList.add('anim'), 300);
    setTimeout(() => document.querySelector('.hero-name').classList.add('anim'), 420);
    setTimeout(() => document.querySelector('.typing-wrap').classList.add('anim'), 540);
    setTimeout(() => document.querySelector('.hero-desc').classList.add('anim'), 660);
    setTimeout(() => document.querySelector('.hero-btns').classList.add('anim'), 780);
    setTimeout(() => document.querySelector('.hero-soc').classList.add('anim'), 900);
    setTimeout(() => document.getElementById('hero-right').classList.add('anim'), 400);
    // Start typing after hero name appears
    setTimeout(startTyping, 1100);
});

/* ── 4. TYPING ANIMATION ── */
const words = ['AI Engineer', 'RAG Pipeline Builder', 'LLM Integrator', 'Python Developer', 'GenAI Specialist'];
let wi = 0, ci = 0, del = false;
const el = document.getElementById('typed');
function startTyping() {
    function type() {
        const w = words[wi];
        if (!del) {
            el.textContent = w.slice(0, ++ci);
            if (ci === w.length) { del = true; setTimeout(type, 1900); return; }
            setTimeout(type, 72);
        } else {
            el.textContent = w.slice(0, --ci);
            if (ci === 0) { del = false; wi = (wi + 1) % words.length; setTimeout(type, 320); return; }
            setTimeout(type, 40);
        }
    }
    type();
}

/* ── 5. SPLIT TEXT for section titles ── */
function splitWords(el) {
    const html = el.innerHTML;
    // Handle <br> tags
    el.innerHTML = html.split('<br>').map(line =>
        line.trim().split(' ').filter(w => w).map(word =>
            `<span class="word"><span class="word-inner">${word}</span></span>`
        ).join(' ')
    ).join('<br>');
}
document.querySelectorAll('.stitle').forEach(splitWords);

/* ── 6. SCROLL REVEAL + SPLIT TEXT + COUNTER + TIMELINE ── */
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;

        // Generic reveal
        if (el.classList.contains('reveal')) el.classList.add('on');

        // Split text reveal
        if (el.classList.contains('stitle')) {
            setTimeout(() => el.classList.add('revealed'), 100);
        }

        // Counter animation
        el.querySelectorAll('[data-count]').forEach(stat => {
            if (stat.dataset.animated) return;
            stat.dataset.animated = '1';
            const target = parseInt(stat.dataset.count);
            const suffix = stat.dataset.suffix || '';
            const divide = parseFloat(stat.dataset.divide || 1);
            let start = 0;
            const duration = 1400;
            const startTime = performance.now();
            function tick(now) {
                const pct = Math.min((now - startTime) / duration, 1);
                const ease = 1 - Math.pow(1 - pct, 3); // cubic ease-out
                const val = Math.floor(ease * target);
                stat.textContent = divide !== 1
                    ? (val / divide).toFixed(2) + suffix
                    : val + suffix;
                if (pct < 1) requestAnimationFrame(tick);
                else stat.textContent = divide !== 1
                    ? (target / divide).toFixed(2) + suffix
                    : target + suffix;
            }
            requestAnimationFrame(tick);
        });

        // Timeline line draw
        if (el.id === 'timeline' || el.closest('#timeline')) {
            const fill = document.getElementById('tline-fill');
            if (fill) fill.style.height = '100%';
        }

    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .stitle').forEach(e => obs.observe(e));
const tl = document.getElementById('timeline');
if (tl) obs.observe(tl);

/* ── 7. 3D CARD TILT ── */
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rx = (-y / rect.height) * 10;
        const ry = (x / rect.width) * 10;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1), border-color .3s, box-shadow .3s';
        card.style.transform = '';
        setTimeout(() => card.style.transition = '', 600);
    });
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform .1s linear, border-color .3s, box-shadow .3s';
    });
});

/* ── 8. MAGNETIC BUTTONS ── */
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.3;
        const dy = (e.clientY - cy) * 0.3;
        btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1), box-shadow .25s, opacity .25s';
        setTimeout(() => btn.style.transition = '', 500);
    });
});

/* ── 9. PARALLAX ORBS on mouse ── */
const orb1 = document.getElementById('orb1');
const orb2 = document.getElementById('orb2');
let oMx = 0, oMy = 0, o1x = 0, o1y = 0, o2x = 0, o2y = 0;
document.addEventListener('mousemove', e => {
    oMx = (e.clientX / innerWidth - 0.5) * 40;
    oMy = (e.clientY / innerHeight - 0.5) * 40;
}, { passive: true });
function animOrbs() {
    o1x += (oMx - o1x) * 0.04;
    o1y += (oMy - o1y) * 0.04;
    o2x += (-oMx - o2x) * 0.04;
    o2y += (-oMy - o2y) * 0.04;
    orb1.style.transform = `translate(${o1x}px, ${o1y}px)`;
    orb2.style.transform = `translate(${o2x}px, ${o2y}px)`;
    requestAnimationFrame(animOrbs);
}
animOrbs();

/* ── 10. NAV SCROLL + ACTIVE ── */
const nav = document.getElementById('nav');
const secs = [...document.querySelectorAll('section[id]')];
const lnks = [...document.querySelectorAll('.nav-links a')];
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 40);
    document.getElementById('btt').classList.toggle('show', scrollY > 400);
    let cur = '';
    secs.forEach(s => { if (scrollY >= s.offsetTop - 160) cur = s.id; });
    lnks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
}, { passive: true });

/* ── 11. HAMBURGER MENU ── */
const ham = document.getElementById('ham');
const mob = document.getElementById('mob');
ham.addEventListener('click', () => {
    ham.classList.toggle('open'); mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mlink').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('open'); mob.classList.remove('open');
    document.body.style.overflow = '';
}));
