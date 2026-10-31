// Hambúrguer que se separa no scroll. Passe o mouse (ou toque) num ingrediente:
// ele ganha destaque e uma seta curva mostra o que é.
// Uso: const stop = initBurgerScroll(elemento, { frames: [urls...], heightVh: 600 });
export function initBurgerScroll(root, opts) {
  const frames = opts.frames, N = frames.length, heightVh = opts.heightVh || 600;
  // Ordem de cima para baixo (índices pares = etiqueta à esquerda, ímpares = à direita)
  const ITEMS = [
    ['01', 'Brioche artesanal', 'Fermentação natural 24h', 'Brioche macio, tostado na chapa com um toque de mel e fubá.'],
    ['02', 'Cebola roxa', 'Fatias finas e crocantes', 'Cortada na hora e gelada, equilibra a gordura com acidez.'],
    ['03', 'Bacon defumado', 'Lenha de macieira · 8h', 'Defumação lenta e artesanal, dourado até ficar crocante.'],
    ['04', 'Cheddar inglês', 'Derretido no vapor', 'Cheddar curado que derrete sobre a carne e escorre.'],
    ['05', 'Blend Angus & Wagyu', '200g · fogo aberto', 'Blend grelhado no fogo aberto, suculento por dentro.'],
    ['06', 'Carne na grelha', 'Marcas de brasa', 'Segunda carne, selada com as marcas da brasa.'],
    ['07', 'Alface crespa', 'Fresca e resfriada', 'Folhas frescas que dão leveza e protegem o pão.'],
    ['08', 'Base tostada', 'Brioche dourado', 'Base tostada que sustenta tudo sem amolecer.'],
  ];
  // Posição de cada ingrediente (px no frame recortado 565x647) em frames-chave do vídeo.
  const KF = [0, 24, 44, 60, 84, 144];
  const KY = [[150,275,330,385,425,450,480,540],[103,228,285,350,395,425,440,508],[81,200,250,305,345,445,500,560],[105,205,255,322,358,457,535,588],[129,230,275,340,375,472,548,600],[134,230,275,340,372,475,553,600]];
  const KX = [.18, .25, .33, .38, .40, .40];
  const FH = 647, LAST = 144, ANIM_END = 0.58, HOVER_FROM = 0.3;
  // classes de cor usadas para achar o ingrediente sob o mouse e recortar o destaque
  const EXCL = { 0: [1, 2], 2: [1, 3], 4: [3, 2], 5: [3, 2], 7: [2] };
  const cls = (r, g, b) => (b > g + 8 && r > g + 25 && r > 90) ? 1 : (g > r * .95 && g > b + 25) ? 2 : (r > 185 && g > 112 && b < 100 && g > b + 55) ? 3 : 0;

  if (!document.getElementById('bs-style')) {
    const st = document.createElement('style'); st.id = 'bs-style';
    st.textContent = `
.bs-scene{position:relative}
.bs-stick{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;font-family:system-ui,-apple-system,sans-serif;color:var(--bs-fg,#f4efea)}
.bs-canvas,.bs-svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.bs-svg{pointer-events:none;overflow:visible}
.bs-line{fill:none;stroke:var(--bs-accent,#e85d1a);stroke-width:2;stroke-linecap:round;stroke-dasharray:3 7;animation:bsMarch .9s linear infinite;filter:drop-shadow(0 0 4px rgba(232,93,26,.7))}
@keyframes bsMarch{to{stroke-dashoffset:-20}}
.bs-head{fill:var(--bs-accent,#e85d1a);filter:drop-shadow(0 0 5px rgba(232,93,26,.8))}
.bs-dot{fill:var(--bs-accent,#e85d1a);stroke:#fff;stroke-width:1.5}
.bs-ring{fill:none;stroke:var(--bs-accent,#e85d1a);stroke-width:1.5;transform-box:fill-box;transform-origin:center;animation:bsPulse 1.4s ease-out infinite}
@keyframes bsPulse{from{transform:scale(.7);opacity:.95}to{transform:scale(2.6);opacity:0}}
.bs-card{position:absolute;left:0;top:0;display:flex;gap:.75rem;align-items:center;padding:.65rem .9rem .65rem .65rem;border-radius:12px;background:var(--bs-card,rgba(20,14,10,.82));border:1.5px solid var(--bs-accent,#e85d1a);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 8px 28px rgba(0,0,0,.35),0 0 18px rgba(232,93,26,.25);opacity:0;pointer-events:none;will-change:transform,opacity}
.bs-num{font:700 .8rem ui-monospace,Menlo,monospace;color:#fff;background:var(--bs-accent,#e85d1a);border-radius:7px;padding:.45rem .5rem;flex:none}
.bs-t{font:800 1.02rem Impact,'Arial Narrow Bold','Arial Narrow',system-ui,sans-serif;letter-spacing:.05em;text-transform:uppercase;line-height:1.1;color:var(--bs-accent,#e85d1a)}
.bs-s{font:.66rem ui-monospace,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--bs-muted,#a89c91);margin-top:.2rem}
.bs-d{font-size:.74rem;line-height:1.35;margin-top:.4rem;color:var(--bs-fg,#f4efea)}
.bs-bar{position:absolute;left:0;bottom:0;height:3px;width:0;background:var(--bs-accent,#e85d1a)}
.bs-hint{position:absolute;left:0;right:0;bottom:calc(2rem + env(safe-area-inset-bottom,0px));text-align:center;font:.72rem ui-monospace,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--bs-muted,#a89c91);transition:opacity .3s}
.bs-detail{display:none}
@media(max-width:720px){
 .bs-card{padding:.3rem;border-radius:50%;width:36px;height:36px;justify-content:center}
 .bs-card .bs-txt{display:none}
 .bs-num{background:none;padding:0}
 .bs-detail{display:block;position:absolute;left:12px;right:12px;bottom:calc(14px + env(safe-area-inset-bottom,0px));padding:.8rem 1rem;border-radius:14px;background:var(--bs-card,rgba(20,14,10,.85));border:1px solid var(--bs-border,rgba(255,255,255,.12));backdrop-filter:blur(10px);opacity:0;transition:opacity .25s}
 .bs-detail b{font:800 1rem Impact,'Arial Narrow',sans-serif;letter-spacing:.05em;text-transform:uppercase;color:var(--bs-accent,#e85d1a);display:block;margin-bottom:.2rem}
 .bs-detail span{font-size:.8rem;color:var(--bs-muted,#a89c91);line-height:1.4}
 .bs-hint{bottom:calc(90px + env(safe-area-inset-bottom,0px))}
}`;
    document.head.appendChild(st);
  }

  root.innerHTML = '<div class="bs-scene"><div class="bs-stick"><canvas class="bs-canvas"></canvas><svg class="bs-svg"></svg><div class="bs-hint"></div><div class="bs-detail"><b></b><span></span></div><div class="bs-bar"></div></div></div>';
  const scene = root.firstChild, stick = scene.firstChild;
  scene.style.height = heightVh + 'vh';
  const cv = stick.querySelector('canvas'), ctx = cv.getContext('2d'), svg = stick.querySelector('svg');
  const bar = stick.querySelector('.bs-bar'), hint = stick.querySelector('.bs-hint'), det = stick.querySelector('.bs-detail');
  const base = document.createElement('canvas'), bctx = base.getContext('2d', { willReadFrequently: true }), mk = document.createElement('canvas');
  const NS = 'http://www.w3.org/2000/svg';
  const imgs = frames.map(u => { const i = new Image(); i.src = u; return i; });
  const els = ITEMS.map((it) => {
    const card = document.createElement('div'); card.className = 'bs-card';
    card.innerHTML = `<span class="bs-num">${it[0]}</span><div class="bs-txt"><div class="bs-t">${it[1]}</div><div class="bs-s">${it[2]}</div><div class="bs-d">${it[3]}</div></div>`;
    stick.appendChild(card);
    const g = document.createElementNS(NS, 'g'), mkEl = (t, c) => { const e = document.createElementNS(NS, t); e.setAttribute('class', c); g.appendChild(e); return e; };
    const line = mkEl('path', 'bs-line'), head = mkEl('path', 'bs-head'), ring = mkEl('circle', 'bs-ring'), dot = mkEl('circle', 'bs-dot');
    ring.setAttribute('r', 7); dot.setAttribute('r', 4.5); svg.appendChild(g); g.style.display = 'none';
    return { card, g, line, head, ring, dot, h: 70 };
  });

  let target = 0, cur = 0, last = -1, W = 0, H = 0, raf = 0, alive = true;
  let ptr = null, tap = false, sticky = null, hov = null, fadeI = null, dim = 0, lastDim = -1, lastHov = -2, hintTxt = '';
  const vis = ITEMS.map(() => 0);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mobile = () => W <= 720;
  function resize() {
    const d = Math.min(devicePixelRatio || 1, 2), r = stick.getBoundingClientRect();
    W = r.width; H = r.height; cv.width = base.width = W * d; cv.height = base.height = H * d; last = -1;
    const cw = mobile() ? 36 : clamp(W * .22, 220, 290);
    els.forEach(e => { e.card.style.width = cw + 'px'; e.h = e.card.offsetHeight; });
  }
  function onScroll() { const r = scene.getBoundingClientRect(); target = clamp(-r.top / (r.height - innerHeight), 0, 1); }
  function interp(arr, f) {
    let k = 0; while (k < KF.length - 2 && f > KF[k + 1]) k++;
    return arr[k] + (arr[k + 1] - arr[k]) * clamp((f - KF[k]) / (KF[k + 1] - KF[k]), 0, 1);
  }
  // faixas verticais (px de tela) de cada ingrediente
  function bandsOf(ays, ry, rh) {
    return ays.map((y, i) => [i === 0 ? ry - 5 : (ays[i - 1] + y) / 2, i === 7 ? ry + rh + 5 : (y + ays[i + 1]) / 2]);
  }
  // qual ingrediente está sob o ponto (x,y)?
  function hit(mx, my, ays, bands) {
    const d = cv.width / W, cx = Math.round(mx * d), cy = Math.round(my * d), R = 5;
    if (cx < 0 || cy < 0 || cx >= cv.width || cy >= cv.height) return null;
    const x0 = Math.max(0, cx - R), y0 = Math.max(0, cy - R), w = Math.min(cv.width, cx + R + 1) - x0, h = Math.min(cv.height, cy + R + 1) - y0;
    const dat = bctx.getImageData(x0, y0, w, h).data; let best = -1, bd = 1e9;
    for (let j = 0; j < w * h; j++) { if (dat[j * 4 + 3] < 90) continue; const dd = Math.hypot(x0 + j % w - cx, y0 + ((j / w) | 0) - cy); if (dd < bd) { bd = dd; best = j; } }
    if (best < 0) return null;
    const c = cls(dat[best * 4], dat[best * 4 + 1], dat[best * 4 + 2]);
    let b = bands.findIndex(bd2 => my >= bd2[0] && my < bd2[1]); if (b < 0) b = my < bands[0][0] ? 0 : 7;
    const near = a => a.reduce((p, q) => Math.abs(my - ays[q]) < Math.abs(my - ays[p]) ? q : p);
    if (c === 1) return 1; if (c === 2) return 6; if (c === 3 && b >= 2 && b <= 5) return 3;
    if (b === 1) return near([0, 2]); if (b === 3) return near([2, 4]); if (b === 6) return near([5, 7]);
    return b;
  }
  // recorta só o ingrediente destacado
  function maskOf(i, bands, rect, d) {
    const [lo, hi] = bands[i], colr = i === 1 || i === 3 || i === 6;
    const y0 = Math.max(0, Math.floor((colr ? lo - 45 : lo) * d)), y1 = Math.min(base.height, Math.ceil((colr ? hi + (i === 3 ? 70 : 45) : hi) * d));
    const x0 = Math.max(0, Math.floor(rect.x * d)), x1 = Math.min(base.width, Math.ceil((rect.x + rect.w) * d)), w = x1 - x0, h = y1 - y0;
    if (h <= 0 || w <= 0) return null;
    const src = bctx.getImageData(x0, y0, w, h), dat = src.data, ex = EXCL[i] || [];
    for (let p = 0; p < dat.length; p += 4) {
      if (!dat[p + 3]) continue;
      const c = cls(dat[p], dat[p + 1], dat[p + 2]); let keep;
      if (i === 1) keep = c === 1; else if (i === 3) keep = c === 3; else if (i === 6) keep = c === 2;
      else { const y = y0 + (((p >> 2) / w) | 0); keep = y >= lo * d && y < hi * d && ex.indexOf(c) < 0; }
      if (!keep) dat[p + 3] = 0;
    }
    mk.width = w; mk.height = h; mk.getContext('2d').putImageData(src, 0, 0);
    return { x: x0, y: y0 };
  }
  function frame() {
    if (!alive) return;
    cur += (target - cur) * 0.14;
    const p = cur, q = clamp(p / ANIM_END, 0, 1), f = q * LAST, idx = Math.round(q * (N - 1)), im = imgs[idx];
    const asp = (imgs[0].naturalWidth && imgs[0].naturalHeight) ? imgs[0].naturalWidth / imgs[0].naturalHeight : 565 / 647;
    const rh = Math.min(H * .86, (W * .9) / asp), rw = rh * asp, rx = (W - rw) / 2, ry = (H - rh) / 2, d = cv.width / W;
    const fxl = interp(KX, f), ays = ITEMS.map((_, i) => ry + (interp(KY.map(r => r[i]), f) / FH) * rh), bands = bandsOf(ays, ry, rh);
    // 1) desenha o frame limpo numa tela auxiliar (usada para detectar o ingrediente)
    const redraw = idx !== last;
    if (redraw && im && im.naturalWidth) { bctx.clearRect(0, 0, base.width, base.height); bctx.drawImage(im, rx * d, ry * d, rw * d, rh * d); }
    // 2) qual ingrediente está sob o mouse / dedo?
    let h = null;
    if (q > HOVER_FROM) {
      if (tap && ptr) { sticky = hit(ptr.x, ptr.y, ays, bands); tap = false; }
      h = ptr && ptr.mouse ? hit(ptr.x, ptr.y, ays, bands) : sticky;
    } else sticky = null;
    if (h !== null) fadeI = h;
    hov = h; dim += ((h !== null ? 1 : 0) - dim) * 0.18; if (dim < .005) { dim = 0; if (h === null) fadeI = null; }
    // 3) composição: frame + escurece o resto + brilho no ingrediente destacado
    if (redraw || fadeI !== lastHov || Math.abs(dim - lastDim) > .004) {
      ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(base, 0, 0);
      if (fadeI !== null && dim > 0) {
        ctx.save(); ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = `rgba(0,0,0,${.6 * dim})`; ctx.fillRect(0, 0, cv.width, cv.height); ctx.restore();
        const m = maskOf(fadeI, bands, { x: rx, w: rw }, d);
        if (m) { ctx.save(); ctx.globalAlpha = dim; ctx.shadowColor = 'rgba(255,140,40,.95)'; ctx.shadowBlur = 24 * d; try { ctx.filter = 'brightness(1.12) saturate(1.15)'; } catch (e) {} ctx.drawImage(mk, m.x, m.y); ctx.restore(); }
      }
      if (im && im.naturalWidth) last = idx; lastHov = fadeI; lastDim = dim;
    }
    stick.style.cursor = h !== null ? 'pointer' : 'default';
    // 4) etiqueta + seta curva do ingrediente destacado
    const mob = mobile(), cw = mob ? 36 : clamp(W * .22, 220, 290), pad = mob ? 8 : Math.max(16, W * .03);
    els.forEach((e, i) => {
      vis[i] += ((h === i ? 1 : 0) - vis[i]) * 0.22; const v = vis[i];
      if (v < .01) { e.card.style.opacity = 0; e.g.style.display = 'none'; return; }
      const left = i % 2 === 0, dir = left ? 1 : -1, ax = rx + (left ? fxl : 1 - fxl) * rw, ay = ays[i];
      const edge = left ? rx + (fxl - .12) * rw - 26 : rx + (1 - fxl + .12) * rw + 26;
      const cx = mob ? (left ? pad : W - pad - cw) : clamp(left ? edge - cw : edge, pad, W - pad - cw);
      const cy = clamp(ay + (left ? -34 : 34), e.h / 2 + 12, H - e.h / 2 - 12 - (mob ? 96 : 0));
      const sx = left ? cx + cw : cx, dx = Math.max(60, Math.abs(ax - sx));
      const s = cy > ay ? 1 : -1, c1x = sx + dir * dx * .55, c1y = cy, c2x = ax - dir * dx * .2, c2y = ay + s * dx * .4;
      let ux = ax - c2x, uy = ay - c2y; const ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul;
      const tx = ax - ux * 11, ty = ay - uy * 11, bx = tx - ux * 13, by = ty - uy * 13, nx = -uy * 6, ny = ux * 6;
      e.line.setAttribute('d', `M${sx} ${cy} C${c1x} ${c1y} ${c2x} ${c2y} ${bx} ${by}`);
      e.head.setAttribute('d', `M${tx} ${ty} L${bx + nx} ${by + ny} L${bx - nx} ${by - ny}Z`);
      [e.dot, e.ring].forEach(c => { c.setAttribute('cx', ax); c.setAttribute('cy', ay); });
      e.g.style.display = ''; e.g.style.opacity = v;
      e.card.style.opacity = v;
      e.card.style.transform = `translate(${cx + (1 - v) * dir * -14}px,${cy - e.h / 2}px) rotate(${left ? -2 : 1.8}deg) scale(${.92 + .08 * v})`;
    });
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    bar.style.width = p * 100 + '%';
    const ht = q < .55 ? 'Role para separar ↓' : (h === null ? 'Passe o mouse (ou toque) nas camadas' : '');
    if (ht !== hintTxt) { hintTxt = ht; hint.textContent = ht; } hint.style.opacity = ht && p < .98 ? 1 : 0;
    if (mob) { det.style.opacity = h !== null ? 1 : 0; if (h !== null) { det.firstChild.textContent = ITEMS[h][1]; det.lastChild.textContent = ITEMS[h][3]; } }
    raf = requestAnimationFrame(frame);
  }
  const pos = (ev) => { const r = stick.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top }; };
  const onMove = ev => { if (ev.pointerType === 'mouse') ptr = Object.assign(pos(ev), { mouse: true }); };
  const onDown = ev => { if (ev.pointerType !== 'mouse') { ptr = Object.assign(pos(ev), { mouse: false }); tap = true; } };
  const onLeave = ev => { if (ev.pointerType === 'mouse') ptr = null; };
  stick.addEventListener('pointermove', onMove); stick.addEventListener('pointerdown', onDown); stick.addEventListener('pointerleave', onLeave);
  addEventListener('resize', resize); addEventListener('scroll', onScroll, { passive: true });
  imgs[0].addEventListener('load', () => { last = -1; });
  resize(); onScroll(); frame();
  return () => { alive = false; cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('scroll', onScroll); root.innerHTML = ''; };
}
