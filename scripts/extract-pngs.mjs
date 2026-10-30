import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('public/assets/ingredients');
fs.mkdirSync(outDir, { recursive: true });

const W = 1200;
const H = 670;

const ingredients = [
  {
    id: 'layer-01-top-bun',
    src: 'public/assets/aistudio/Generated_Image_October_30__2026_-_12_34AM_c9224c5c.jpg',
    isOnion: false,
    isLettuce: false,
    isBacon: false,
  },
  {
    id: 'layer-02-onion',
    src: 'public/assets/aistudio/Generated_Image_October_30__2026_-_12_34AM__1__68bd05da.jpg',
    isOnion: true,
    isLettuce: false,
    isBacon: false,
  },
  {
    id: 'layer-03-lettuce',
    src: 'public/assets/aistudio/Generated_Image_October_30__2026_-_12_34AM__2__bc5726b2.jpg',
    isOnion: false,
    isLettuce: true,
    isBacon: false,
  },
  {
    id: 'layer-04-cheddar',
    src: 'public/assets/aistudio/Generated_Image_October_30__2026_-_12_34AM__3__3bd69a13.jpg',
    isOnion: false,
    isLettuce: false,
    isBacon: false,
  },
  {
    id: 'layer-05-patty',
    src: 'public/assets/aistudio/Generated_Image_October_30__2026_-_12_34AM__4__30ff3da8.jpg',
    isOnion: false,
    isLettuce: false,
    isBacon: false,
  },
  {
    id: 'layer-06-bacon',
    src: 'public/assets/aistudio/Generated_Image_October_30__2026_-_12_35AM_157be673.jpg',
    isOnion: false,
    isLettuce: false,
    isBacon: true,
  },
  {
    id: 'layer-07-bottom-bun',
    src: 'public/assets/aistudio/Generated_Image_October_30__2026_-_12_35AM__1__5ff37527.jpg',
    isOnion: false,
    isLettuce: false,
    isBacon: false,
  },
];

for (const item of ingredients) {
  console.log(`Processing ${item.id}...`);
  const rawBuf = execSync(`convert "${item.src}" -resize ${W}x${H}! -depth 8 rgba:-`, {
    maxBuffer: 50 * 1024 * 1024,
  });

  const pixels = new Uint8Array(rawBuf);
  const bgMask = new Uint8Array(W * H); // 1 = background

  const isBgCandidate = (idx) => {
    const r = pixels[idx * 4];
    const g = pixels[idx * 4 + 1];
    const b = pixels[idx * 4 + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;

    if (item.isLettuce) {
      if (g > r + 4 && g > b + 4) return false;
      return min >= 242 && sat <= 8;
    }
    if (item.isOnion) {
      if (r > g + 5 || b > g + 5) return false;
      return min >= 245 && sat <= 5;
    }
    return min >= 238 && sat <= 15;
  };

  const queue = new Int32Array(W * H);
  let head = 0;
  let tail = 0;

  const pushSeed = (x, y) => {
    const p = y * W + x;
    if (bgMask[p] === 0 && isBgCandidate(p)) {
      bgMask[p] = 1;
      queue[tail++] = p;
    }
  };

  for (let x = 0; x < W; x++) {
    pushSeed(x, 0);
    pushSeed(x, H - 1);
  }
  for (let y = 0; y < H; y++) {
    pushSeed(0, y);
    pushSeed(W - 1, y);
  }

  // For Bacon: also seed any pure white interior gaps between the two strips
  if (item.isBacon) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const p = y * W + x;
        const r = pixels[p * 4];
        const g = pixels[p * 4 + 1];
        const b = pixels[p * 4 + 2];
        if (r >= 246 && g >= 246 && b >= 246 && bgMask[p] === 0) {
          bgMask[p] = 1;
          queue[tail++] = p;
        }
      }
    }
  }

  // For Onion: seed the inner hole of the left ring and the top crescent gap between ring 1 & 2
  if (item.isOnion) {
    // Scan for 5x5 blocks of pure studio white (min >= 253, sat <= 2) to seed enclosed holes
    for (let y = 10; y < H - 10; y += 4) {
      for (let x = 10; x < W - 10; x += 4) {
        let allPureWhite = true;
        for (let dy = -2; dy <= 2 && allPureWhite; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const p = (y + dy) * W + (x + dx);
            const r = pixels[p * 4];
            const g = pixels[p * 4 + 1];
            const b = pixels[p * 4 + 2];
            if (Math.min(r, g, b) < 253 || Math.max(r, g, b) - Math.min(r, g, b) > 2) {
              allPureWhite = false;
              break;
            }
          }
        }
        if (allPureWhite) {
          pushSeed(x, y);
        }
      }
    }
  }

  while (head < tail) {
    const p = queue[head++];
    const x = p % W;
    const y = (p / W) | 0;

    if (x > 0) {
      const n = p - 1;
      if (bgMask[n] === 0 && isBgCandidate(n)) {
        bgMask[n] = 1;
        queue[tail++] = n;
      }
    }
    if (x < W - 1) {
      const n = p + 1;
      if (bgMask[n] === 0 && isBgCandidate(n)) {
        bgMask[n] = 1;
        queue[tail++] = n;
      }
    }
    if (y > 0) {
      const n = p - W;
      if (bgMask[n] === 0 && isBgCandidate(n)) {
        bgMask[n] = 1;
        queue[tail++] = n;
      }
    }
    if (y < H - 1) {
      const n = p + W;
      if (bgMask[n] === 0 && isBgCandidate(n)) {
        bgMask[n] = 1;
        queue[tail++] = n;
      }
    }
  }

  // Distance transform from background (up to 4px inward)
  const distToBg = new Uint8Array(W * H);
  distToBg.fill(255);
  let dHead = 0;
  let dTail = 0;
  for (let i = 0; i < W * H; i++) {
    if (bgMask[i] === 1) {
      distToBg[i] = 0;
      queue[dTail++] = i;
    }
  }

  while (dHead < dTail) {
    const p = queue[dHead++];
    const d = distToBg[p];
    if (d >= 4) continue;
    const x = p % W;
    const y = (p / W) | 0;
    const neighbors = [];
    if (x > 0) neighbors.push(p - 1);
    if (x < W - 1) neighbors.push(p + 1);
    if (y > 0) neighbors.push(p - W);
    if (y < H - 1) neighbors.push(p + W);
    for (const n of neighbors) {
      if (distToBg[n] === 255) {
        distToBg[n] = d + 1;
        queue[dTail++] = n;
      }
    }
  }

  let minX = W, maxX = 0, minY = H, maxY = 0;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const d = distToBg[i];
      if (d === 0) {
        pixels[i * 4 + 3] = 0;
        continue;
      }

      let r = pixels[i * 4];
      let g = pixels[i * 4 + 1];
      let b = pixels[i * 4 + 2];
      let a = 255;

      if (d <= 3) {
        const minC = Math.min(r, g, b);
        const maxC = Math.max(r, g, b);
        const sat = maxC - minC;
        const whiteness = Math.max(0, (minC - 160) / 95) * Math.max(0, 1 - sat / 75);

        if (d === 1) {
          a = Math.round(255 * Math.max(0, Math.min(1, (1 - whiteness * 0.95) * 0.45)));
        } else if (d === 2) {
          a = Math.round(255 * Math.max(0.15, Math.min(1, (1 - whiteness * 0.75) * 0.85)));
        } else if (d === 3) {
          a = Math.round(255 * Math.max(0.55, Math.min(1, 1 - whiteness * 0.4)));
        }

        if (a > 10 && a < 252) {
          const alphaNorm = Math.max(0.22, a / 255);
          r = Math.max(0, Math.min(255, Math.round((r - (1 - alphaNorm) * 252) / alphaNorm)));
          g = Math.max(0, Math.min(255, Math.round((g - (1 - alphaNorm) * 252) / alphaNorm)));
          b = Math.max(0, Math.min(255, Math.round((b - (1 - alphaNorm) * 252) / alphaNorm)));
        }
      }

      pixels[i * 4] = r;
      pixels[i * 4 + 1] = g;
      pixels[i * 4 + 2] = b;
      pixels[i * 4 + 3] = a;

      if (a > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = 12;
  const cropY = Math.max(0, minY - pad);
  const cropH = Math.min(H - cropY, (maxY - minY + 1) + pad * 2);
  const cropX = Math.max(0, minX - pad);
  const cropW = Math.min(W - cropX, (maxX - minX + 1) + pad * 2);

  const cropped = new Uint8Array(cropW * cropH * 4);
  for (let row = 0; row < cropH; row++) {
    const srcOffset = ((cropY + row) * W + cropX) * 4;
    const dstOffset = row * cropW * 4;
    cropped.set(pixels.subarray(srcOffset, srcOffset + cropW * 4), dstOffset);
  }

  const outPath = path.join(outDir, `${item.id}.png`);
  execSync(`convert -size ${cropW}x${cropH} -depth 8 rgba:- "${outPath}"`, {
    input: Buffer.from(cropped.buffer),
    maxBuffer: 50 * 1024 * 1024,
  });
  console.log(`Saved ${outPath} (${cropW}x${cropH})`);
}
