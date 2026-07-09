import React from 'react';
import { IOSDevice } from './IOSFrame';

// inject keyframes once
if (!document.getElementById('flush-kf')) {
  const s = document.createElement('style');
  s.id = 'flush-kf';
  s.textContent = `
  @keyframes flush-drift  { from{transform:translateX(-8%)} to{transform:translateX(8%)} }
  @keyframes flush-drift2 { from{transform:translateX(6%)}  to{transform:translateX(-6%)} }
  @keyframes flush-rain   { 0%{transform:translateY(-18px);opacity:0} 12%{opacity:.55} 88%{opacity:.55} 100%{transform:translateY(150px);opacity:0} }
  @keyframes flush-breathe{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.075)} }
  @keyframes flush-ring   { 0%{transform:scale(.55);opacity:.5} 100%{transform:scale(1.9);opacity:0} }
  @keyframes flush-ripple { 0%{transform:scale(.2);opacity:.55} 100%{transform:scale(1.75);opacity:0} }
  @keyframes flush-twinkle{ 0%,100%{opacity:.15} 50%{opacity:.7} }
  @keyframes flush-rise   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes flush-glow   { 0%,100%{opacity:.55} 50%{opacity:.9} }
  @keyframes flush-eq     { 0%,100%{transform:scaleY(.35)} 50%{transform:scaleY(1)} }
  @keyframes flush-bob    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes flush-pop    { 0%{opacity:0;transform:scale(.72)} 60%{opacity:1} 100%{opacity:1;transform:scale(1)} }
  `;
  document.head.appendChild(s);
}

const h = React.createElement;
const EASE = 'cubic-bezier(0,0,0.38,0.9)';

function useFlow() {
  const [phase, setPhase] = React.useState('idle');
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const start = () => setPhase('recording');
  const done = () => {
    setPhase('completing');
    timer.current = setTimeout(() => setPhase('summary'), 3800);
  };
  const reflect = () => setPhase('reflect');
  const reset = () => { clearTimeout(timer.current); setPhase('idle'); };
  return { phase, start, done, reflect, reset };
}

function StartButton({ onClick, dark }) {
  const [hov, setHov] = React.useState(false);
  return h('button', {
    onClick, onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false),
    style: {
      appearance: 'none', border: 'none', cursor: 'pointer',
      width: '100%', height: 60, borderRadius: 9999,
      background: dark ? (hov ? '#f0efec' : '#FFFFFF') : (hov ? '#1c1c22' : '#010204'),
      color: dark ? '#010204' : '#FFFFFF',
      fontFamily: '"Season Sans", system-ui', fontSize: 18, fontWeight: 600,
      letterSpacing: 0.1, transition: `background .3s ${EASE}, transform .3s ${EASE}`,
      transform: hov ? 'translateY(-1px)' : 'none',
      boxShadow: dark ? '0 8px 24px rgba(0,0,0,.28)' : '0 8px 22px rgba(1,2,4,.22)',
    },
  }, 'Start talking');
}

function DoneButton({ onClick, tone }) {
  const [hov, setHov] = React.useState(false);
  const isDark = tone === 'dark';
  return h('button', {
    onClick, onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false),
    style: {
      appearance: 'none', cursor: 'pointer',
      padding: '15px 34px', borderRadius: 9999,
      background: isDark
        ? (hov ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.10)')
        : (hov ? 'rgba(1,2,4,.06)' : 'rgba(255,255,255,.55)'),
      border: isDark ? '1px solid rgba(255,255,255,.45)' : '1px solid rgba(1,2,4,.55)',
      color: isDark ? '#FFFFFF' : '#010204',
      fontFamily: '"Season Sans", system-ui', fontSize: 16, fontWeight: 600,
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      transition: `background .3s ${EASE}`,
    },
  }, "I'm done");
}

function ListeningDots({ color }) {
  return h('div', {
    style: { display: 'flex', alignItems: 'flex-end', gap: 5, height: 22 },
  }, [0, 1, 2, 3, 4].map(i =>
    h('div', {
      key: i,
      style: {
        width: 4, height: 22, borderRadius: 4, background: color, transformOrigin: 'bottom',
        animation: `flush-eq 1.5s ${EASE} ${i * 0.18}s infinite`,
      },
    })
  ));
}

const contentWrap = {
  position: 'absolute', inset: 0, zIndex: 3,
  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
  padding: '96px 30px 46px', boxSizing: 'border-box',
};

const idleCenter = {
  position: 'absolute', inset: 0, zIndex: 4,
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  padding: '96px 30px 104px', boxSizing: 'border-box', textAlign: 'center',
};

function ShazamButton({ onClick, size = 132, ringColor, core, coreColor, coreBorder, glyph, rings = 3, glass = false }) {
  const [hov, setHov] = React.useState(false);
  return h('button', {
    onClick, onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false),
    'aria-label': 'Start talking',
    style: {
      position: 'relative', appearance: 'none', border: 'none', background: 'none',
      cursor: 'pointer', width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: hov ? 'scale(1.04)' : 'scale(1)', transition: `transform .35s ${EASE}`,
    },
  }, [
    ...Array.from({ length: rings }).map((_, i) => h('div', {
      key: 'r' + i,
      style: {
        position: 'absolute', width: size, height: size, borderRadius: '50%',
        border: `1.5px solid ${ringColor}`,
        animation: `flush-ring ${5.4}s ${EASE} ${(i * 5.4) / rings}s infinite`,
      },
    })),
    h('div', {
      key: 'core',
      style: {
        position: 'relative', width: size, height: size, borderRadius: '50%',
        background: core, color: coreColor,
        border: coreBorder || (glass ? '1px solid rgba(255,255,255,.6)' : 'none'),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        backdropFilter: glass ? 'blur(14px) saturate(1.6)' : 'none',
        WebkitBackdropFilter: glass ? 'blur(14px) saturate(1.6)' : 'none',
        boxShadow: glass
          ? '0 14px 34px rgba(42,8,36,.18), inset 0 1.5px 2px rgba(255,255,255,.9), inset 0 -14px 26px rgba(120,110,140,.18)'
          : '0 12px 34px rgba(1,2,4,.28)',
        animation: `flush-breathe 4s ${EASE} infinite`,
      },
    }, [
      glass && h('div', {
        key: 'sheen',
        style: {
          position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(130% 100% at 28% 15%, rgba(255,255,255,.75) 0%, rgba(255,255,255,.22) 26%, rgba(255,255,255,0) 52%), radial-gradient(120% 120% at 75% 92%, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 45%)',
        },
      }),
      h('div', { key: 'g', style: { position: 'relative', display: 'flex' } }, glyph),
    ]),
  ]);
}

function WaveGlyph({ color = '#fff', size = 52 }) {
  const hs = [0.28, 0.5, 0.86, 0.62, 1.0, 0.62, 0.86, 0.5, 0.28];
  const vb = 52, bw = 3.1, gap = 2.4;
  const total = hs.length * bw + (hs.length - 1) * gap;
  const x0 = (vb - total) / 2;
  return h('svg', { width: size, height: size, viewBox: `0 0 ${vb} ${vb}`, fill: 'none' },
    hs.map((f, i) => {
      const bh = 8 + f * 32;
      const x = x0 + i * (bw + gap);
      return h('rect', {
        key: i, x, y: (vb - bh) / 2, width: bw, height: bh, rx: bw / 2, fill: color,
      });
    }));
}

const idleHeadline = (text, color) => h('div', {
  style: { fontFamily: '"Season Serif",Georgia,serif', fontWeight: 465, fontSize: 40, lineHeight: 1.04, color, letterSpacing: -0.5, marginBottom: 40 },
}, text);

function CyclingHeadline({ prompts, color }) {
  const [i, setI] = React.useState(0);
  const [vis, setVis] = React.useState(true);
  React.useEffect(() => {
    let outT;
    const inT = setTimeout(() => {
      setVis(false);
      outT = setTimeout(() => {
        setI(p => (p + 1) % prompts.length);
        setVis(true);
      }, 620);
    }, 3200);
    return () => { clearTimeout(inT); clearTimeout(outT); };
  }, [i, prompts.length]);
  return h('div', {
    style: {
      minHeight: 96, display: 'flex', alignItems: 'flex-end', marginBottom: 40,
      fontFamily: '"Season Serif",Georgia,serif', fontWeight: 465, fontSize: 40, lineHeight: 1.04,
      color, letterSpacing: -0.5,
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(8px)',
      transition: `opacity .6s ${EASE}, transform .6s ${EASE}`,
      willChange: 'opacity, transform',
    },
  }, prompts[i]);
}

const idleCaption = (text, color) => h('div', {
  style: { marginTop: 40, fontFamily: '"Season Sans",system-ui', fontSize: 14, fontWeight: 500, letterSpacing: 0.3, color },
}, text);

function WeatherCanvas({ phase }) {
  const ref = React.useRef(null);
  const phaseRef = React.useRef(phase);
  phaseRef.current = phase;

  React.useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const rnd = (a, b) => a + Math.random() * (b - a);
    const lerp = (a, b, t) => a + (b - a) * t;
    const mix = (c1, c2, t) => c1.map((v, i) => Math.round(lerp(v, c2[i], t)));

    const makeCloud = (cx, cy, scale, speed, depth) => {
      const puffs = [];
      const n = Math.round(rnd(6, 9));
      const spanX = 150 * scale;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        puffs.push({
          ox: (t - 0.5) * spanX + rnd(-14, 14) * scale,
          oy: Math.sin(t * Math.PI) * -20 * scale + rnd(-10, 10) * scale,
          r: rnd(34, 60) * scale * (0.7 + Math.sin(t * Math.PI) * 0.5),
          ph: rnd(0, Math.PI * 2),
          sp: rnd(0.6, 1.3),
          amp: rnd(4, 10) * scale,
        });
      }
      return { cx, cy, scale, speed, depth, puffs, drift: rnd(0, 100), appear: 0 };
    };
    const clouds = [
      makeCloud(0.18, 0.14, 1.05, 0.010, 0.9),
      makeCloud(0.66, 0.10, 1.30, 0.007, 1.0),
      makeCloud(0.40, 0.28, 0.85, 0.013, 0.7),
      makeCloud(0.82, 0.34, 1.00, 0.009, 0.85),
      makeCloud(0.08, 0.40, 0.80, 0.012, 0.6),
      makeCloud(0.52, 0.52, 1.10, 0.008, 0.75),
      makeCloud(0.24, 0.64, 0.95, 0.011, 0.65),
      makeCloud(0.78, 0.70, 0.90, 0.010, 0.7),
      makeCloud(0.44, 0.82, 1.05, 0.009, 0.6),
      makeCloud(0.12, 0.88, 0.80, 0.012, 0.5),
    ];
    clouds.forEach((c, i) => {
      c.delay = i * 3.4;
      c.side = c.cx < 0.5 ? -1 : 1;
    });

    const rain = [];
    const mist = [];
    for (let i = 0; i < 16; i++) mist.push({ x: rnd(0, 1), y: rnd(0, 0.55), r: rnd(30, 70), vx: rnd(0.003, 0.010), a: rnd(0.02, 0.06) });
    const motes = [];
    for (let i = 0; i < 40; i++) motes.push({
      x: rnd(0, 1), y: rnd(0, 1), r: rnd(0.8, 2.6),
      vy: rnd(0.002, 0.006), vx: rnd(-0.0013, 0.0013),
      ph: rnd(0, Math.PI * 2), tw: rnd(0.25, 0.6), a: rnd(0.25, 0.7),
    });

    let rainI = 0;
    let clear = 0;
    let formed = 0;
    let raf, last = performance.now();

    const CLOUD_IDLE = [255, 255, 255];
    const CLOUD_RAIN = [247, 245, 251];
    const CLOUD_CLEAR = [255, 246, 224];

    const spawnRain = (dt) => {
      const rate = rainI * 3.2;
      let count = rate;
      while (count > 0) {
        if (Math.random() < count) {
          rain.push({
            x: rnd(-0.05, 1.05), y: rnd(0.18, 0.4),
            vy: rnd(230, 330), len: rnd(14, 26), a: rnd(0.25, 0.5), w: rnd(1, 1.8),
          });
        }
        count -= 1;
      }
    };

    const draw = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const p = phaseRef.current;
      const targetRain = p === 'recording' ? 1 : 0;
      const targetClear = (p === 'completing' || p === 'summary') ? 1 : 0;
      rainI += (targetRain - rainI) * Math.min(dt * 1.4, 1);
      clear += (targetClear - clear) * Math.min(dt * 1.1, 1);
      const targetForm = (p === 'recording' || p === 'completing') ? 1 : 0;
      formed += (targetForm - formed) * Math.min(dt * 1.6, 1);
      const gather = rainI;
      const tSec = now / 1000;

      ctx.clearRect(0, 0, W, H);

      if (clear > 0.01) {
        const gx = W * 0.5, gy = H * 0.26, gr = 210 * (0.6 + clear * 0.7);
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, `rgba(255,226,130,${0.85 * clear})`);
        g.addColorStop(0.4, `rgba(255,214,120,${0.32 * clear})`);
        g.addColorStop(1, 'rgba(255,214,120,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill();
      }

      let col = CLOUD_IDLE;
      col = mix(col, CLOUD_RAIN, rainI);
      col = mix(col, CLOUD_CLEAR, clear);
      const [cr, cg, cb] = col;

      for (const m of mist) {
        m.x += m.vx * dt * 6; if (m.x > 1.15) m.x = -0.15;
        const mx = m.x * W, my = m.y * H;
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, m.r);
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${m.a * (1 - clear * 0.7) * formed})`);
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, m.r, 0, Math.PI * 2); ctx.fill();
      }

      const drawClouds = () => {
        for (const c of clouds) {
          const wantAppear = (p === 'recording' || p === 'completing') ? 1 : 0;
          const travelDur = 9;
          if (wantAppear) {
            c.timer = (c.timer || 0) + dt;
            const active = Math.max(0, c.timer - c.delay);
            c.prog = Math.min(active / travelDur, 1);
          } else {
            c.timer = 0;
            c.prog = Math.max(0, (c.prog || 0) - dt * 1.2);
          }
          const eased = 1 - Math.pow(1 - c.prog, 3);
          const opac = Math.min(c.prog * 7, 1);
          c.drift += c.speed * dt * (20 + gather * 6);
          const sway = Math.sin(c.drift * 0.5) * (12 + gather * 4) * c.scale;
          const conv = gather * (0.5 - c.cx) * W * 0.28;
          const part = clear * (c.cx < 0.5 ? -1 : 1) * W * 0.5 * c.depth;
          const enterX = (1 - eased) * c.side * W * 1.15;
          const baseX = c.cx * W + sway + conv + part + enterX;
          const baseY = c.cy * H - gather * H * 0.02 + Math.sin(c.drift * 0.32) * 6 * c.scale;
          const grow = 1 + gather * 0.42;
          const churn = 0.4 + gather * 0.6;
          const alpha = (0.95 - c.depth * 0.05) * (1 + gather * 0.05) * (1 - clear * 0.9) * formed * opac;
          if (alpha <= 0.01) continue;
          for (const pf of c.puffs) {
            const wob = tSec * pf.sp;
            const dx = Math.cos(wob + pf.ph) * pf.amp * churn;
            const dy = Math.sin(wob * 1.3 + pf.ph) * pf.amp * 0.7 * churn;
            const rp = pf.r * grow * (1 + Math.sin(wob * 0.9 + pf.ph) * 0.08 * churn);
            const px = baseX + pf.ox * (1 + gather * 0.18) + dx, py = baseY + pf.oy * grow + dy, r = rp;
            const g = ctx.createRadialGradient(px, py - r * 0.2, r * 0.1, px, py, r);
            g.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
            g.addColorStop(0.5, `rgba(${cr},${cg},${cb},${alpha * 0.75})`);
            g.addColorStop(0.8, `rgba(${cr},${cg},${cb},${alpha * 0.3})`);
            g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
          }
        }
      };

      const amb = gather * (1 - clear);
      if (amb > 0.02) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.filter = 'blur(18px)';
        const rays = 4;
        for (let i = 0; i < rays; i++) {
          const sweep = Math.sin(tSec * 0.25 + i) * 0.06;
          const ang = -Math.PI / 2 + (i - (rays - 1) / 2) * 0.2 + sweep;
          const ox = W * 0.5, oy = -H * 0.15;
          const len = H * 1.25, wdt = 46 + i * 8;
          ctx.translate(ox, oy); ctx.rotate(ang + Math.PI / 2);
          const g = ctx.createLinearGradient(0, 0, 0, len);
          g.addColorStop(0, `rgba(255,250,235,${0.035 * amb})`);
          g.addColorStop(0.5, `rgba(255,248,228,${0.022 * amb})`);
          g.addColorStop(1, 'rgba(255,248,228,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.moveTo(-wdt * 0.3, 0); ctx.lineTo(wdt, len); ctx.lineTo(-wdt, len); ctx.closePath(); ctx.fill();
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        ctx.filter = 'none';
        for (const mo of motes) {
          mo.y -= mo.vy * dt * 6; mo.x += mo.vx * dt * 6 + Math.sin(tSec * 0.2 + mo.ph) * 0.0002;
          if (mo.y < -0.05) { mo.y = 1.05; mo.x = rnd(0, 1); }
          if (mo.x < -0.05) mo.x = 1.05; if (mo.x > 1.05) mo.x = -0.05;
          const tw = 0.55 + 0.45 * Math.sin(tSec * mo.tw + mo.ph);
          const mx = mo.x * W, my = mo.y * H, r = mo.r;
          const g = ctx.createRadialGradient(mx, my, 0, mx, my, r * 3.4);
          g.addColorStop(0, `rgba(255,252,240,${mo.a * amb * tw})`);
          g.addColorStop(1, 'rgba(255,252,240,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, r * 3.4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }

      drawClouds();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return h('canvas', { ref, style: { position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 } });
}

function SummaryView({ onReflect, onDone }) {
  const initial = [
    { t: 'Work',            n: 'the pressure piling up',        w: 'lg', bg: '#F1F2C6', br: '#E4E79B', fg: '#4A412D' },
    { t: 'Not sleeping',    n: 'awake again around 3am',        w: 'md', bg: '#E4E6F7', br: '#CBD0EF', fg: '#3B3F73' },
    { t: 'My sister',       n: "the call I keep replaying",     w: 'md', bg: '#FBE1F2', br: '#F4C7E5', fg: '#7A2E66' },
    { t: 'Feeling behind',  n: 'like everyone else has it figured out', w: 'sm', bg: '#DEEFDC', br: '#C3E2C0', fg: '#2F5A38' },
    { t: 'Being hard on myself', n: '',                          w: 'sm', bg: '#F6E7C7', br: '#EBD39C', fg: '#6B5320' },
  ];
  const sizes = {
    lg: { pt: '20px 30px', fs: 25, ds: 14 },
    md: { pt: '16px 24px', fs: 19, ds: 13 },
    sm: { pt: '13px 20px', fs: 15.5, ds: 12 },
  };
  const [items, setItems] = React.useState(initial);
  const [drag, setDrag] = React.useState(null);
  const refs = React.useRef([]);
  const holdT = React.useRef(null);
  const beginHold = (i, e) => {
    const el = e.currentTarget;
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
    clearTimeout(holdT.current);
    holdT.current = setTimeout(() => setDrag(i), 200);
  };
  const onMove = (e) => {
    if (drag == null) return;
    const x = e.clientX, y = e.clientY;
    let best = drag, bestD = Infinity;
    refs.current.forEach((n, j) => {
      if (!n) return;
      const r = n.getBoundingClientRect();
      const d = (r.left + r.width / 2 - x) ** 2 + (r.top + r.height / 2 - y) ** 2;
      if (d < bestD) { bestD = d; best = j; }
    });
    if (best !== drag) {
      setItems(prev => { const a = [...prev]; const [m] = a.splice(drag, 1); a.splice(best, 0, m); return a; });
      setDrag(best);
    }
  };
  const endDrag = () => { clearTimeout(holdT.current); setDrag(null); };
  const del = (idx, e) => { e.stopPropagation(); setItems(prev => prev.filter((_, j) => j !== idx)); };
  const anyDrag = drag != null;

  const bubble = (tp, i) => {
    const s = sizes[tp.w];
    const dragging = drag === i;
    const otherDim = anyDrag && !dragging;
    return h('div', {
      key: tp.t,
      ref: (n) => { refs.current[i] = n; },
      onPointerDown: (e) => beginHold(i, e),
      onPointerMove: onMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      style: {
        position: 'relative', alignSelf: i % 2 ? 'flex-start' : 'flex-end',
        touchAction: 'none', cursor: dragging ? 'grabbing' : 'grab',
        zIndex: dragging ? 5 : 1,
        transform: dragging ? 'scale(1.12) rotate(-3deg)' : otherDim ? 'scale(0.95)' : 'scale(1)',
        opacity: otherDim ? 0.5 : 1,
        transition: `transform .34s cubic-bezier(.34,1.4,.5,1), opacity .3s ${EASE}, box-shadow .25s ${EASE}`,
        animation: anyDrag ? 'none' : `flush-pop .7s ${EASE} both, flush-bob ${4.4 + i * 0.6}s ${EASE} ${i * 0.5}s infinite`,
      },
    }, [
      h('div', {
        key: 'b',
        style: {
          padding: s.pt, borderRadius: 9999, background: tp.bg, border: `1px solid ${tp.br}`,
          textAlign: 'center', boxShadow: dragging ? '0 20px 40px -8px rgba(76,29,68,.32)' : '0 6px 18px rgba(76,29,68,.06)',
          transition: `box-shadow .25s ${EASE}`,
        },
      }, [
        h('div', { key: 't', style: { fontFamily: '"Season Serif",Georgia,serif', fontWeight: 500, fontSize: s.fs, lineHeight: 1.05, color: tp.fg, letterSpacing: -0.2 } }, tp.t),
        tp.n && h('div', { key: 'n', style: { marginTop: 4, fontFamily: '"Season Sans",system-ui', fontSize: s.ds, lineHeight: 1.35, color: tp.fg, opacity: .62, maxWidth: 200 } }, tp.n),
      ]),
      h('button', {
        key: 'x', 'aria-label': 'Remove', onPointerDown: (e) => e.stopPropagation(), onClick: (e) => del(i, e),
        style: {
          position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: '50%',
          appearance: 'none', cursor: 'pointer', border: '1px solid rgba(255,255,255,.55)',
          background: 'rgba(255,255,255,.28)', color: 'rgba(42,8,36,.75)',
          backdropFilter: 'blur(8px) saturate(1.5)', WebkitBackdropFilter: 'blur(8px) saturate(1.5)',
          boxShadow: '0 2px 8px rgba(76,29,68,.16), inset 0 1px 1px rgba(255,255,255,.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 0,
        },
      }, h('svg', { width: 11, height: 11, viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' }, [
        h('line', { key: 'a', x1: 3, y1: 3, x2: 9, y2: 9 }), h('line', { key: 'b', x1: 9, y1: 3, x2: 3, y2: 9 }),
      ])),
    ]);
  };

  return h('div', { style: { position: 'absolute', inset: 0, zIndex: 6, background: 'radial-gradient(120% 80% at 50% 22%,#FFFDF6 0%,#FBF4E6 60%,#F5ECDA 100%)', display: 'flex', flexDirection: 'column', padding: '96px 24px 40px', boxSizing: 'border-box', overflow: 'auto', animation: `flush-rise .7s ${EASE} both` } }, [
    h('div', { key: 'ey', style: { textAlign: 'center', fontFamily: '"Season Sans",system-ui', fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(76,29,68,.5)', marginBottom: 10 } }, 'While you talked'),
    h('div', { key: 'h', style: { textAlign: 'center', fontFamily: '"Season Serif",Georgia,serif', fontWeight: 465, fontSize: 32, lineHeight: 1.08, color: '#2A0824', letterSpacing: -0.4 } }, 'These came up.'),
    h('div', { key: 'hint', style: { textAlign: 'center', marginTop: 6, fontFamily: '"Season Sans",system-ui', fontSize: 12.5, color: 'rgba(42,8,36,.4)' } }, 'Hold to rearrange · tap × to remove'),
    h('div', { key: 'field', style: { flex: 1, display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', alignItems: 'center', gap: 16, padding: '26px 4px', minHeight: 340 } },
      items.map((tp, i) => bubble(tp, i))),
    h('div', { key: 's', style: { textAlign: 'center', margin: '4px 8px 20px', fontFamily: '"Season Sans",system-ui', fontSize: 13.5, lineHeight: 1.5, color: 'rgba(42,8,36,.55)' } }, 'Nothing is saved unless you choose to keep it.'),
    h('div', { key: 'acts', style: { display: 'flex', flexDirection: 'column', gap: 10, flex: 'none' } }, [
      h('button', { key: 'r', onClick: onReflect, style: { appearance: 'none', cursor: 'pointer', width: '100%', height: 56, borderRadius: 9999, background: '#010204', border: 'none', color: '#FFFFFF', fontFamily: '"Season Sans",system-ui', fontSize: 16, fontWeight: 600 } }, 'I want to reflect'),
      h('button', { key: 'd', onClick: onDone, style: { appearance: 'none', cursor: 'pointer', width: '100%', height: 56, borderRadius: 9999, background: 'transparent', border: '1px solid rgba(1,2,4,.55)', color: '#010204', fontFamily: '"Season Sans",system-ui', fontSize: 16, fontWeight: 600 } }, "I'm done"),
    ]),
  ]);
}

function MoodFace({ kind, color }) {
  const stroke = { stroke: color, strokeWidth: 3, strokeLinecap: 'round', fill: 'none' };
  const mouth = kind === 'up' ? 'M18 34 Q30 44 42 34'
    : kind === 'down' ? 'M18 38 Q30 28 42 38'
    : 'M18 36 L42 36';
  return h('svg', { width: 60, height: 60, viewBox: '0 0 60 60', fill: 'none' }, [
    h('circle', { key: 'e1', cx: 22, cy: 24, r: 2.6, fill: color }),
    h('circle', { key: 'e2', cx: 38, cy: 24, r: 2.6, fill: color }),
    h('path', { key: 'm', d: mouth, ...stroke }),
  ]);
}

function MoodPicker({ onPick }) {
  const moods = [
    { kind: 'down', label: 'Heavy',   bg: '#E4E6F7', ring: '#CBD0EF', fg: '#3B3F73' },
    { kind: 'flat', label: 'Okay',    bg: '#F6E7C7', ring: '#EBD39C', fg: '#6B5320' },
    { kind: 'up',   label: 'Lighter', bg: '#DEEFDC', ring: '#C3E2C0', fg: '#2F5A38' },
  ];
  return h('div', { style: { position: 'absolute', inset: 0, zIndex: 7, background: 'radial-gradient(120% 80% at 50% 20%,#FFFDF6 0%,#FBF4E6 60%,#F5ECDA 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '104px 26px 60px', boxSizing: 'border-box', animation: `flush-rise .6s ${EASE} both` } }, [
    h('div', { key: 'ey', style: { textAlign: 'center', fontFamily: '"Season Sans",system-ui', fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(76,29,68,.5)', marginBottom: 12 } }, 'A moment to reflect'),
    h('div', { key: 'h', style: { textAlign: 'center', fontFamily: '"Season Serif",Georgia,serif', fontWeight: 465, fontSize: 30, lineHeight: 1.12, color: '#2A0824', letterSpacing: -0.4, marginBottom: 40 } }, 'How are you feeling now?'),
    h('div', { key: 'row', style: { display: 'flex', justifyContent: 'center', gap: 16 } }, moods.map((m, i) => h('button', {
      key: m.kind, onClick: () => onPick(m.kind),
      style: {
        appearance: 'none', cursor: 'pointer', border: `1px solid ${m.ring}`, background: m.bg,
        borderRadius: 24, padding: '20px 8px 16px', flex: 1, maxWidth: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        transition: `transform .25s ${EASE}, box-shadow .25s ${EASE}`,
        animation: `flush-pop .5s ${EASE} ${0.1 + i * 0.09}s both`,
      },
    }, [
      h(MoodFace, { key: 'f', kind: m.kind, color: m.fg }),
      h('div', { key: 'l', style: { fontFamily: '"Season Sans",system-ui', fontSize: 13.5, fontWeight: 600, color: m.fg } }, m.label),
    ]))),
  ]);
}

function ReflectView({ onDone }) {
  const [mood, setMood] = React.useState(null);
  const [txt, setTxt] = React.useState('');
  if (!mood) return h(MoodPicker, { onPick: setMood });
  return h('div', { style: { position: 'absolute', inset: 0, zIndex: 7, background: 'radial-gradient(120% 80% at 50% 20%,#FFFDF6 0%,#FBF4E6 60%,#F5ECDA 100%)', display: 'flex', flexDirection: 'column', padding: '104px 26px 40px', boxSizing: 'border-box', animation: `flush-rise .6s ${EASE} both` } }, [
    h('div', { key: 'ey', style: { fontFamily: '"Season Sans",system-ui', fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(76,29,68,.5)', marginBottom: 12 } }, 'A moment to reflect'),
    h('div', { key: 'h', style: { fontFamily: '"Season Serif",Georgia,serif', fontWeight: 465, fontSize: 32, lineHeight: 1.12, color: '#2A0824', letterSpacing: -0.4, marginBottom: 22 } }, "Now that it's out, what's one thing you're noticing?"),
    h('textarea', {
      key: 'ta', value: txt, onChange: (e) => setTxt(e.target.value),
      placeholder: 'Take your time…', rows: 5,
      style: {
        width: '100%', boxSizing: 'border-box', resize: 'none',
        padding: '16px 18px', borderRadius: 16, border: '1px solid #E3DFDA', background: '#FFFFFF',
        fontFamily: '"Season Sans",system-ui', fontSize: 16, lineHeight: 1.5, color: '#2A0824',
        outline: 'none',
      },
    }),
    h('div', { key: 'sp', style: { flex: 1 } }),
    h('button', { key: 'd', onClick: onDone, style: { appearance: 'none', cursor: 'pointer', width: '100%', height: 56, borderRadius: 9999, background: '#010204', border: 'none', color: '#FFFFFF', fontFamily: '"Season Sans",system-ui', fontSize: 16, fontWeight: 600, flex: 'none' } }, "I'm done"),
  ]);
}

// ============================================================
// WEATHER SCENE
// ============================================================
function WeatherScene(props) {
  const internal = useFlow();
  const { phase, start, done, reflect, reset } = props.flow || internal;
  const recording = phase === 'recording';
  const clearing = phase === 'completing';

  const bg = clearing
    ? 'linear-gradient(180deg,#FFF7DE 0%,#FDF0C4 42%,#FCEFD4 100%)'
    : recording
      ? 'linear-gradient(180deg,#BFB9CE 0%,#C9C3D6 55%,#D3CEDD 100%)'
      : 'linear-gradient(180deg,#DFE8EE 0%,#EAEAE2 58%,#F4F0E7 100%)';

  return h('div', { style: { position: 'absolute', inset: 0, background: bg, transition: `background 1.4s ${EASE}`, overflow: 'hidden' } }, [
    h(WeatherCanvas, { key: 'wx', phase }),
    phase === 'idle' && props.renderIdle && h('div', { key: 'idleC', style: idleCenter }, props.renderIdle({ start })),
    h('div', { key: 'content', style: contentWrap }, [
      phase === 'idle' && !props.renderIdle && h('div', { key: 'idle', style: { animation: `flush-rise .6s ${EASE} both` } }, [
        h('div', { key: 'h', style: { fontFamily: '"Season Serif",Georgia,serif', fontWeight: 470, fontSize: 46, lineHeight: 1.02, color: '#2A0824', letterSpacing: -0.5 } }, 'Let it out.'),
        h('div', { key: 's', style: { marginTop: 16, marginBottom: 30, fontFamily: '"Season Sans",system-ui', fontSize: 16, lineHeight: 1.5, color: 'rgba(42,8,36,.66)', maxWidth: 300 } }, "Say whatever's on your mind. No structure, no fixing — just let the words come."),
        h(StartButton, { key: 'b', onClick: start }),
      ]),
      recording && h('div', { key: 'rec', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 } }, [
        h('div', { key: 'top', style: { flex: 1 } }),
        h('div', { key: 'dot', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 30, animation: `flush-rise .5s ${EASE} both` } }, [
          h(ListeningDots, { key: 'd', color: '#4C1D44' }),
          h('div', { key: 't', style: { fontFamily: '"Season Sans",system-ui', fontSize: 15, fontWeight: 500, letterSpacing: 0.2, color: 'rgba(42,8,36,.62)' } }, "I'm listening"),
        ]),
        h('div', { key: 'btnrow', style: { display: 'flex', justifyContent: 'center' } }, h(DoneButton, { onClick: done, tone: 'light' })),
      ]),
      clearing && h('div', { key: 'done', style: { textAlign: 'center', animation: `flush-rise .9s ${EASE} both` } }, [
        h('div', { key: 'h', style: { fontFamily: '"Season Serif",Georgia,serif', fontWeight: 470, fontSize: 40, lineHeight: 1.05, color: '#4A412D', letterSpacing: -0.4 } }, 'Let it settle.'),
        h('div', { key: 's', style: { marginTop: 14, fontFamily: '"Season Sans",system-ui', fontSize: 15, lineHeight: 1.5, color: 'rgba(74,65,45,.6)' } }, "That's all you needed to do."),
      ]),
      phase === 'summary' && h(SummaryView, { key: 'sum', onReflect: reflect, onDone: props.onFinish || reset }),
      phase === 'reflect' && h(ReflectView, { key: 'ref', onDone: props.onFinish || reset }),
    ]),
  ]);
}

// ============================================================
// ORB SCENE
// ============================================================
function OrbScene(props) {
  const { phase, start, done, reflect, reset } = useFlow();
  const recording = phase === 'recording';
  const clearing = phase === 'completing';

  const bg = clearing
    ? 'radial-gradient(120% 90% at 50% 78%,#FFD9A6 0%,#E7A4C4 34%,#7C4A82 70%,#3A1638 100%)'
    : 'radial-gradient(120% 90% at 50% 42%,#3A1138 0%,#2A0824 55%,#1A0518 100%)';

  const orbGrad = clearing
    ? 'radial-gradient(circle at 38% 34%,#FFF3D6 0%,#FFC98C 40%,#F79ED0 100%)'
    : recording
      ? 'radial-gradient(circle at 38% 34%,#FBE9A8 0%,#E8B4D8 42%,#8A5A96 100%)'
      : 'radial-gradient(circle at 38% 34%,#E7D2E4 0%,#9E7FB0 45%,#5A3560 100%)';

  const stars = h('div', { style: { position: 'absolute', inset: 0, zIndex: 1, opacity: clearing ? 0 : 1, transition: `opacity 1.4s ${EASE}` } },
    Array.from({ length: 26 }).map((_, i) => h('div', {
      key: i,
      style: {
        position: 'absolute', top: `${Math.random() * 62}%`, left: `${Math.random() * 100}%`,
        width: 2, height: 2, borderRadius: '50%', background: '#FBE9A8',
        animation: `flush-twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`,
      },
    })));

  const rings = recording ? [0, 1, 2].map(i => h('div', {
    key: i,
    style: {
      position: 'absolute', width: 220, height: 220, borderRadius: '50%',
      border: '1px solid rgba(251,233,168,.5)',
      animation: `flush-ring 3.4s ${EASE} ${i * 1.13}s infinite`,
    },
  })) : null;

  const orbSize = recording ? 216 : 190;

  return h('div', { style: { position: 'absolute', inset: 0, background: bg, transition: `background 1.6s ${EASE}`, overflow: 'hidden' } }, [
    stars,
    h('div', { key: 'orbwrap', style: { position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' } }, [
      rings,
      h('div', {
        key: 'orb',
        style: {
          width: orbSize, height: orbSize, borderRadius: '50%', background: orbGrad,
          opacity: (props.hideIdleOrb && phase === 'idle') ? 0 : 1,
          transition: `width 1.4s ${EASE}, height 1.4s ${EASE}, background 1.6s ${EASE}, opacity 1s ${EASE}`,
          boxShadow: clearing ? '0 0 90px 30px rgba(255,201,140,.5)' : '0 0 70px 12px rgba(158,127,176,.45)',
          animation: `flush-breathe ${recording ? 4 : 6}s ${EASE} infinite`,
        },
      }),
    ]),
    h('div', { key: 'content', style: contentWrap }, [
      phase === 'idle' && props.renderIdle && h('div', { key: 'idleC', style: idleCenter }, props.renderIdle({ start })),
      phase === 'idle' && !props.renderIdle && h('div', { key: 'idle', style: { animation: `flush-rise .6s ${EASE} both` } }, [
        h('div', { key: 'h', style: { fontFamily: '"Season Serif",Georgia,serif', fontWeight: 460, fontSize: 44, lineHeight: 1.04, color: '#FBF5EC', letterSpacing: -0.5 } }, 'Say it out loud.'),
        h('div', { key: 's', style: { marginTop: 16, marginBottom: 30, fontFamily: '"Season Sans",system-ui', fontSize: 16, lineHeight: 1.5, color: 'rgba(251,245,236,.72)', maxWidth: 300 } }, "However it comes out. There's nothing here you need to get right."),
        h(StartButton, { key: 'b', onClick: start, dark: true }),
      ]),
      recording && h('div', { key: 'rec', style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } }, [
        h('div', { key: 'dot', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 30, animation: `flush-rise .5s ${EASE} both` } }, [
          h(ListeningDots, { key: 'd', color: 'rgba(251,245,236,.9)' }),
          h('div', { key: 't', style: { fontFamily: '"Season Sans",system-ui', fontSize: 15, fontWeight: 500, letterSpacing: 0.2, color: 'rgba(251,245,236,.7)' } }, "I'm listening"),
        ]),
        h('div', { key: 'btnrow', style: { display: 'flex', justifyContent: 'center' } }, h(DoneButton, { onClick: done, tone: 'dark' })),
      ]),
      clearing && h('div', { key: 'done', style: { textAlign: 'center', animation: `flush-rise .9s ${EASE} both` } }, [
        h('div', { key: 'h', style: { fontFamily: '"Season Serif",Georgia,serif', fontWeight: 460, fontSize: 40, lineHeight: 1.05, color: '#3A1638', letterSpacing: -0.4 } }, "It's lighter now."),
        h('div', { key: 's', style: { marginTop: 14, fontFamily: '"Season Sans",system-ui', fontSize: 15, lineHeight: 1.5, color: 'rgba(58,22,56,.7)' } }, 'Take the calm with you.'),
      ]),
      phase === 'summary' && h(SummaryView, { key: 'sum', onReflect: reflect, onDone: reset }),
    ]),
  ]);
}

// ============================================================
// WATER SCENE
// ============================================================
function WaterScene(props) {
  const { phase, start, done, reflect, reset } = useFlow();
  const recording = phase === 'recording';
  const clearing = phase === 'completing';

  const bg = clearing
    ? 'linear-gradient(180deg,#FCEFD6 0%,#F7E4C8 60%,#F1D9BC 100%)'
    : 'linear-gradient(180deg,#FCFCFB 0%,#F6F1EA 58%,#EFE7DB 100%)';

  const rippleColor = clearing ? 'rgba(74,65,45,.28)' : 'rgba(76,29,68,.30)';
  const count = clearing ? 2 : recording ? 5 : 3;
  const dur = recording ? 3.2 : clearing ? 6 : 4.6;

  const ripples = h('div', { style: { position: 'absolute', top: '34%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 1, width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
    Array.from({ length: count }).map((_, i) => h('div', {
      key: `${phase}-${i}`,
      style: {
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        border: `1px solid ${rippleColor}`,
        animation: `flush-ripple ${dur}s ${EASE} ${(i * dur) / count}s infinite`,
      },
    })).concat([
      h('div', {
        key: 'core',
        style: {
          width: 26, height: 26, borderRadius: '50%',
          background: clearing ? '#C9A24B' : '#4C1D44', opacity: .85,
          animation: `flush-breathe ${recording ? 3.5 : 5}s ${EASE} infinite`,
        },
      }),
    ]));

  return h('div', { style: { position: 'absolute', inset: 0, background: bg, transition: `background 1.4s ${EASE}`, overflow: 'hidden' } }, [
    ripples,
    h('div', { key: 'hz', style: { position: 'absolute', left: 0, right: 0, top: '34%', height: 1, background: 'rgba(76,29,68,.10)', zIndex: 0 } }),
    h('div', { key: 'content', style: contentWrap }, [
      phase === 'idle' && props.renderIdle && h('div', { key: 'idleC', style: idleCenter }, props.renderIdle({ start })),
      phase === 'idle' && !props.renderIdle && h('div', { key: 'idle', style: { animation: `flush-rise .6s ${EASE} both` } }, [
        h('div', { key: 'ey', style: { fontFamily: '"Season Sans",system-ui', fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(76,29,68,.5)', marginBottom: 14 } }, 'Flush'),
        h('div', { key: 'h', style: { fontFamily: '"Season Serif",Georgia,serif', fontWeight: 450, fontSize: 40, lineHeight: 1.08, color: '#2A0824', letterSpacing: -0.4 } }, "What's weighing on you?"),
        h('div', { key: 's', style: { marginTop: 16, marginBottom: 30, fontFamily: '"Season Sans",system-ui', fontSize: 16, lineHeight: 1.5, color: 'rgba(42,8,36,.62)', maxWidth: 300 } }, "Speak freely. Nothing here is graded, corrected, or judged."),
        h(StartButton, { key: 'b', onClick: start }),
      ]),
      recording && h('div', { key: 'rec', style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } }, [
        h('div', { key: 'dot', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 30, animation: `flush-rise .5s ${EASE} both` } }, [
          h(ListeningDots, { key: 'd', color: '#4C1D44' }),
          h('div', { key: 't', style: { fontFamily: '"Season Sans",system-ui', fontSize: 15, fontWeight: 500, letterSpacing: 0.2, color: 'rgba(42,8,36,.6)' } }, "Take your time"),
        ]),
        h('div', { key: 'btnrow', style: { display: 'flex', justifyContent: 'center' } }, h(DoneButton, { onClick: done, tone: 'light' })),
      ]),
      clearing && h('div', { key: 'done', style: { textAlign: 'center', animation: `flush-rise .9s ${EASE} both` } }, [
        h('div', { key: 'h', style: { fontFamily: '"Season Serif",Georgia,serif', fontWeight: 450, fontSize: 38, lineHeight: 1.08, color: '#4A412D', letterSpacing: -0.4 } }, 'Still water.'),
        h('div', { key: 's', style: { marginTop: 14, fontFamily: '"Season Sans",system-ui', fontSize: 15, lineHeight: 1.5, color: 'rgba(74,65,45,.62)' } }, "You said it, and it's out."),
      ]),
      phase === 'summary' && h(SummaryView, { key: 'sum', onReflect: reflect, onDone: reset }),
    ]),
  ]);
}

// ============================================================
// Digest + Tab app
// ============================================================
function DigestGrid() {
  const themes = {
    sleep:   { label: 'Little sleep',    c: '#8E7BE8', soft: '#E4E0F8' },
    racing:  { label: 'Racing thoughts', c: '#5BB894', soft: '#DCEDE4' },
    doubt:   { label: 'Self-doubt',      c: '#E8765A', soft: '#F7E0D9' },
  };
  const cols = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const rows = [
    { ic: 'dawn',  data: ['sleep', null, null, null, null, null, null] },
    { ic: 'day',   data: [null, null, 'racing', null, null, 'doubt', null] },
    { ic: 'night', data: [null, 'doubt', 'doubt', null, 'doubt', null, 'doubt'] },
  ];
  const intensity = {
    dawn:  { sleep: 1 },
    day:   { racing: 0.7, doubt: 0.5 },
    night: { doubt: 0.55 },
  };
  const rowIcon = (ic, c) => {
    const p = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: c, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (ic === 'dawn') return h('svg', p, [
      h('path', { key: 'a', d: 'M17 18a5 5 0 0 0-10 0' }), h('line', { key: 'b', x1: 12, y1: 9, x2: 12, y2: 3 }),
      h('line', { key: 'c', x1: 4, y1: 18, x2: 20, y2: 18 }), h('line', { key: 'd', x1: 5, y1: 13, x2: 6.5, y2: 14 }),
      h('line', { key: 'e', x1: 19, y1: 13, x2: 17.5, y2: 14 }), h('polyline', { key: 'f', points: '9,6 12,3 15,6' }),
    ]);
    if (ic === 'day') return h('svg', p, [
      h('circle', { key: 'c', cx: 12, cy: 12, r: 4 }),
      ...[[12,2,12,4],[12,20,12,22],[4.9,4.9,6.3,6.3],[17.7,17.7,19.1,19.1],[2,12,4,12],[20,12,22,12],[4.9,19.1,6.3,17.7],[17.7,6.3,19.1,4.9]].map((l, i) => h('line', { key: i, x1: l[0], y1: l[1], x2: l[2], y2: l[3] })),
    ]);
    return h('svg', p, [h('path', { key: 'm', d: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' })]);
  };
  const gridCols = `26px repeat(7, 1fr)`;
  return h('div', { style: { padding: '18px 18px 16px', background: '#FFFFFF', border: '1px solid #E3DFDA', borderRadius: 20, marginBottom: 22 } }, [
    h('div', { key: 'h', style: { fontFamily: '"Season Serif",Georgia,serif', fontWeight: 500, fontSize: 19, color: '#2A0824', letterSpacing: -0.2, marginBottom: 16 } }, 'Flush since July 7'),
    h('div', { key: 'hd', style: { display: 'grid', gridTemplateColumns: gridCols, gap: 7, marginBottom: 7 } },
      [h('div', { key: 'sp' })].concat(cols.map((c, i) => h('div', { key: i, style: { textAlign: 'center', fontFamily: '"Season Sans",system-ui', fontSize: 11.5, fontWeight: 600, color: 'rgba(42,8,36,.45)' } }, c)))),
    ...rows.map((r, ri) => h('div', { key: ri, style: { display: 'grid', gridTemplateColumns: gridCols, gap: 7, marginBottom: 7, alignItems: 'center' } },
      [h('div', { key: 'ic', style: { display: 'flex', justifyContent: 'center' } }, rowIcon(r.ic, 'rgba(42,8,36,.4)'))].concat(
        r.data.map((k, ci) => {
          const filled = !!k;
          const alpha = filled ? (intensity[r.ic][k] || 0.85) : 0;
          const bg = filled ? (alpha >= 0.9 ? themes[k].c : themes[k].soft) : '#F1EFEC';
          return h('div', { key: ci, style: { aspectRatio: '1 / 1', borderRadius: 9, background: bg, transition: `background .3s ${EASE}` } });
        }))
    )),
    h('div', { key: 'lg', style: { display: 'flex', flexWrap: 'wrap', gap: '10px 16px', marginTop: 12 } }, Object.keys(themes).map(k => h('div', { key: k, style: { display: 'flex', alignItems: 'center', gap: 7 } }, [
      h('span', { key: 'd', style: { width: 11, height: 11, borderRadius: '50%', background: themes[k].c } }),
      h('span', { key: 'l', style: { fontFamily: '"Season Sans",system-ui', fontSize: 12.5, fontWeight: 500, color: 'rgba(42,8,36,.7)' } }, themes[k].label),
    ]))),
  ]);
}

function ReflectionsTree() {
  const branches = [
    { stem: "avoiding what's ahead", cx: 0.26, color: '#E8A33D', soft: '#F6D79B', leaves: [
      { date: 'Jun 17', dx: -0.13, t: 0.62, note: "Kept pushing the hard email to tomorrow. I think I'm scared of what the answer will be." },
      { date: 'Jun 19', dx: 0.02, t: 1.0, note: "Still avoiding it. Naming it out loud helped — it's smaller than the dread made it feel." },
    ] },
    { stem: 'not saying no', cx: 0.72, color: '#D64C8E', soft: '#F2B6D3', leaves: [
      { date: 'Jun 27', dx: -0.16, t: 0.55, note: "Said yes to another favor I didn't have room for. Old habit." },
      { date: 'Jul 2', dx: 0.0, t: 1.0, note: "Noticed the flinch before I agree to things. That pause is new." },
      { date: 'Jul 7', dx: 0.16, t: 0.6, note: "Turned one thing down this week. The world didn't end." },
    ] },
  ];
  const [sel, setSel] = React.useState(null);
  const W = 300, H = 210, topY = 42, joinY = 138, baseY = 186;
  return h('div', { style: { padding: '18px 18px 16px', background: '#FFFFFF', border: '1px solid #E3DFDA', borderRadius: 20, marginBottom: 22 } }, [
    h('div', { key: 'h', style: { fontFamily: '"Season Serif",Georgia,serif', fontWeight: 500, fontSize: 19, color: '#2A0824', letterSpacing: -0.2 } }, 'Reflections'),
    h('div', { key: 'sub', style: { fontFamily: '"Season Sans",system-ui', fontSize: 12.5, color: 'rgba(42,8,36,.45)', marginTop: 2, marginBottom: 8 } }, 'Tap a leaf to read it'),
    h('svg', { key: 'svg', viewBox: `0 0 ${W} ${H}`, width: '100%', style: { display: 'block', overflow: 'visible' } },
      branches.flatMap((b, bi) => {
        const jx = b.cx * W;
        const items = [];
        items.push(h('line', { key: `s${bi}`, x1: jx, y1: joinY, x2: jx, y2: baseY, stroke: b.soft, strokeWidth: 2 }));
        b.leaves.forEach((lf, li) => {
          const lx = jx + lf.dx * W;
          const ly = topY + (1 - lf.t) * 34;
          const active = sel && sel.date === lf.date;
          items.push(h('line', { key: `b${bi}-${li}`, x1: jx, y1: joinY, x2: lx, y2: ly + 6, stroke: active ? b.color : b.soft, strokeWidth: 2, style: { transition: `stroke .25s ${EASE}` } }));
          items.push(h('text', { key: `d${bi}-${li}`, x: lx, y: ly - 12, textAnchor: 'middle', style: { fontFamily: '"Season Sans",system-ui', fontSize: 11, fontWeight: 600, fill: 'rgba(42,8,36,.5)' } }, lf.date));
          items.push(h('ellipse', {
            key: `l${bi}-${li}`, cx: lx, cy: ly + 2, rx: 8, ry: 9,
            transform: `rotate(${lf.dx < 0 ? -14 : lf.dx > 0 ? 14 : 0} ${lx} ${ly + 2})`,
            fill: active ? b.color : b.soft, stroke: b.color, strokeWidth: active ? 0 : 0,
            style: { cursor: 'pointer', transition: `fill .25s ${EASE}` },
            onClick: () => setSel({ ...lf, stem: b.stem, color: b.color }),
          }));
        });
        items.push(h('text', { key: `lb${bi}`, x: jx, y: baseY + 18, textAnchor: 'middle', style: { fontFamily: '"Season Sans",system-ui', fontSize: 12.5, fontWeight: 600, fill: b.color } }, b.stem));
        return items;
      })),
    h('div', { key: 'panel', style: { marginTop: 14, padding: '14px 16px', background: 'linear-gradient(180deg,#F7F3EC 0%,#F1EBE0 100%)', borderRadius: 14, minHeight: 78 } },
      sel ? [
        h('div', { key: 'm', style: { fontFamily: '"Season Sans",system-ui', fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: sel.color, marginBottom: 6 } }, `${sel.date} · ${sel.stem}`),
        h('div', { key: 't', style: { fontFamily: '"Season Serif",Georgia,serif', fontSize: 16, lineHeight: 1.4, color: '#2A0824' } }, sel.note),
      ] : [
        h('div', { key: 'm', style: { fontFamily: '"Season Sans",system-ui', fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: 'rgba(42,8,36,.4)', marginBottom: 6 } }, 'Select a leaf above'),
        h('div', { key: 't', style: { fontFamily: '"Season Serif",Georgia,serif', fontSize: 16, lineHeight: 1.4, color: 'rgba(42,8,36,.6)' } }, 'Tap any leaf on the diagram to read what you wrote that day.'),
      ]),
  ]);
}

function DigestScreen() {
  const sessions = [
    { day: 'Today', time: '9:41 AM', dur: '2 min', tags: [
      { t: 'Work', bg: '#F1F2C6', fg: '#4A412D' },
      { t: 'Not sleeping', bg: '#E4E6F7', fg: '#3B3F73' },
      { t: 'My sister', bg: '#FBE1F2', fg: '#7A2E66' },
    ] },
    { day: 'Yesterday', time: '10:12 PM', dur: '4 min', tags: [
      { t: 'Feeling behind', bg: '#DEEFDC', fg: '#2F5A38' },
      { t: 'Money', bg: '#F6E7C7', fg: '#6B5320' },
    ] },
    { day: 'Sunday', time: '8:03 AM', dur: '1 min', tags: [
      { t: 'Gratitude', bg: '#FBE1F2', fg: '#7A2E66' },
      { t: 'A good week', bg: '#F1F2C6', fg: '#4A412D' },
    ] },
  ];
  return h('div', { style: { position: 'absolute', inset: 0, zIndex: 3, background: 'linear-gradient(180deg,#FCFCFB 0%,#F5EFE4 100%)', overflow: 'auto', padding: '76px 24px 128px', boxSizing: 'border-box', animation: `flush-rise .5s ${EASE} both` } }, [
    h('div', { key: 'ey', style: { fontFamily: '"Season Sans",system-ui', fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(76,29,68,.5)', marginBottom: 8 } }, 'Your digest'),
    h('div', { key: 'h', style: { fontFamily: '"Season Serif",Georgia,serif', fontWeight: 465, fontSize: 34, lineHeight: 1.08, color: '#2A0824', letterSpacing: -0.4, marginBottom: 6 } }, 'Looking back.'),
    h('div', { key: 's', style: { fontFamily: '"Season Sans",system-ui', fontSize: 14.5, lineHeight: 1.5, color: 'rgba(42,8,36,.6)', marginBottom: 26 } }, 'A gentle record of what you let out. Yours alone — nothing is shared.'),
    h(DigestGrid, { key: 'grid' }),
    h(ReflectionsTree, { key: 'tree' }),
    h('div', { key: 'list', style: { display: 'flex', flexDirection: 'column', gap: 14 } }, sessions.map((s, i) => h('div', {
      key: i,
      style: { padding: '18px 18px 16px', background: '#FFFFFF', border: '1px solid #E3DFDA', borderRadius: 20, animation: `flush-rise .5s ${EASE} ${0.06 + i * 0.09}s both` },
    }, [
      h('div', { key: 'top', style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 } }, [
        h('div', { key: 'd', style: { fontFamily: '"Season Sans",system-ui', fontSize: 15, fontWeight: 600, color: '#2A0824' } }, s.day),
        h('div', { key: 't', style: { fontFamily: '"Season Sans",system-ui', fontSize: 12.5, color: 'rgba(42,8,36,.45)' } }, `${s.time} · ${s.dur}`),
      ]),
      h('div', { key: 'tags', style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, s.tags.map((tg, j) => h('span', {
        key: j,
        style: { padding: '6px 13px', borderRadius: 9999, background: tg.bg, color: tg.fg, fontFamily: '"Season Serif",Georgia,serif', fontWeight: 500, fontSize: 14.5, letterSpacing: -0.1 },
      }, tg.t))),
    ]))),
    h('div', { key: 'cta', style: { marginTop: 22, background: '#4C1D44', borderRadius: 24, padding: '26px 24px 28px', position: 'relative', overflow: 'hidden' } }, [
      h('div', { key: 'orb', style: { position: 'absolute', top: -40, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,.05)' } }),
      h('div', { key: 'ey', style: { position: 'relative', fontFamily: '"Season Sans",system-ui', fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: '#FFA2F2', marginBottom: 10 } }, 'A gentle next step'),
      h('div', { key: 'h', style: { position: 'relative', fontFamily: '"Season Serif",Georgia,serif', fontWeight: 465, fontSize: 26, lineHeight: 1.12, color: '#FFFFFF', letterSpacing: -0.4, marginBottom: 10 } }, 'Want a person in your corner?'),
      h('div', { key: 's', style: { position: 'relative', fontFamily: '"Season Sans",system-ui', fontSize: 14.5, lineHeight: 1.5, color: 'rgba(255,255,255,.72)', marginBottom: 22, maxWidth: 300 } }, "Your flush snapshot could go straight to a therapist who fits what you're carrying."),
      h('button', { key: 'b', style: { position: 'relative', appearance: 'none', cursor: 'pointer', border: 'none', background: '#FFFFFF', color: '#010204', borderRadius: 9999, padding: '15px 26px', display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: '"Season Sans",system-ui', fontSize: 15.5, fontWeight: 600 } }, [
        h('span', { key: 'l' }, 'Find a therapist'),
        h('svg', { key: 'a', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }, [
          h('line', { key: '1', x1: 4, y1: 12, x2: 20, y2: 12 }), h('polyline', { key: '2', points: '14 6 20 12 14 18' }),
        ]),
      ]),
    ]),
  ]);
}

function TabBar({ tab, onTab }) {
  const seg = (id, label) => {
    const active = tab === id;
    return h('button', {
      key: id, onClick: () => onTab(id),
      style: {
        appearance: 'none', border: 'none', cursor: 'pointer',
        padding: '10px 26px', borderRadius: 9999,
        background: active ? '#FFFFFF' : 'transparent',
        boxShadow: active ? '0 2px 8px rgba(42,8,36,.12)' : 'none',
        color: active ? '#2A0824' : 'rgba(42,8,36,.38)',
        fontFamily: '"Season Sans",system-ui', fontSize: 15, fontWeight: active ? 600 : 500,
        letterSpacing: 0.1, transition: `background .28s ${EASE}, color .28s ${EASE}, box-shadow .28s ${EASE}`,
      },
    }, label);
  };
  return h('div', {
    style: {
      position: 'absolute', left: 0, right: 0, bottom: 26, zIndex: 8,
      display: 'flex', justifyContent: 'center',
    },
  }, h('div', {
    style: {
      display: 'flex', gap: 2, padding: 3, borderRadius: 9999,
      background: 'rgba(255,255,255,.28)', backdropFilter: 'blur(16px) saturate(1.4)', WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
      border: '1px solid rgba(255,255,255,.5)',
      boxShadow: '0 6px 20px rgba(42,8,36,.10), inset 0 1px 1px rgba(255,255,255,.6)',
    },
  }, [seg('flush', 'Flush'), seg('digest', 'Digest')]));
}

function FlushTabApp() {
  const [tab, setTab] = React.useState('flush');
  const flow = useFlow();
  const showTabs = tab === 'digest' || flow.phase === 'idle';
  return h('div', { style: { position: 'absolute', inset: 0 } }, [
    tab === 'flush' && h(WeatherScene, {
      key: 'flush',
      flow,
      onFinish: () => { setTab('digest'); flow.reset(); },
      renderIdle: ({ start }) => [
        h(CyclingHeadline, { key: 'hl', color: '#2A0824', prompts: [
          'Let it out.',
          "What's on your mind?",
          'Say it however it comes.',
          'No need to explain.',
          "There's no wrong way.",
        ] }),
        h(ShazamButton, {
          key: 'btn', onClick: start, size: 200,
          ringColor: 'rgba(76,29,68,.4)', core: '#010204', coreColor: '#fff',
          glyph: h(WaveGlyph, { color: '#fff', size: 46 }),
        }),
        idleCaption('Tap to start talking', 'rgba(42,8,36,.6)'),
      ],
    }),
    tab === 'digest' && h(DigestScreen, { key: 'digest' }),
    showTabs && h(TabBar, { key: 'tabs', tab, onTab: setTab }),
  ]);
}

// ============================================================
// Named exports
// ============================================================
export function FlushWeather() {
  return <IOSDevice><WeatherScene /></IOSDevice>;
}

export function FlushOrb() {
  return <IOSDevice dark><OrbScene /></IOSDevice>;
}

export function FlushWater() {
  return <IOSDevice><WaterScene /></IOSDevice>;
}

export function FlushWeatherTap() {
  return <IOSDevice><FlushTabApp /></IOSDevice>;
}

export function FlushOrbTap() {
  return (
    <IOSDevice dark>
      {h(OrbScene, {
        hideIdleOrb: true,
        renderIdle: ({ start }) => [
          idleHeadline('Say it out loud.', '#FBF5EC'),
          h(ShazamButton, {
            key: 'btn', onClick: start, size: 168,
            ringColor: 'rgba(251,233,168,.5)',
            core: 'radial-gradient(circle at 38% 34%,#FFF3D6 0%,#FBE9A8 38%,#E8B4D8 100%)',
            coreColor: '#5A3560',
            glyph: h(WaveGlyph, { color: 'rgba(90,53,96,.85)', size: 58 }),
          }),
          idleCaption('Tap the light to begin', 'rgba(251,245,236,.66)'),
        ],
      })}
    </IOSDevice>
  );
}

export function FlushWaterTap() {
  return (
    <IOSDevice>
      {h(WaterScene, {
        renderIdle: ({ start }) => [
          idleHeadline("What's on your mind?", '#2A0824'),
          h(ShazamButton, {
            key: 'btn', onClick: start, size: 132, rings: 2,
            ringColor: 'rgba(76,29,68,.35)',
            core: 'rgba(76,29,68,.06)', coreColor: '#4C1D44',
            coreBorder: '1.5px solid #4C1D44',
            glyph: h(WaveGlyph, { color: '#4C1D44', size: 48 }),
          }),
          idleCaption('Press, then speak freely', 'rgba(42,8,36,.55)'),
        ],
      })}
    </IOSDevice>
  );
}
