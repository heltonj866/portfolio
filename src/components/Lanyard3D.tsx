import React, { useEffect, useState } from 'react';
import Lanyard from './Lanyard';

const W = 1024;
const H = 1440;

function makeCanvas(w = W, h = H): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Microchip EMV metálico hiper-realista com contatos segmentados
function drawEmvChip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  // Base metálica dourada/platina com brilho
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.25, '#ca8a04');
  grad.addColorStop(0.5, '#fef9c3');
  grad.addColorStop(0.75, '#a16207');
  grad.addColorStop(1, '#eab308');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 10);
  ctx.fill();

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Canais de contato do microchip
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.lineWidth = 2;

  // Linha horizontal central
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.5);
  ctx.lineTo(x + w * 0.32, y + h * 0.5);
  ctx.moveTo(x + w * 0.68, y + h * 0.5);
  ctx.lineTo(x + w, y + h * 0.5);
  ctx.stroke();

  // Linhas verticais
  ctx.beginPath();
  ctx.moveTo(x + w * 0.32, y);
  ctx.lineTo(x + w * 0.32, y + h);
  ctx.moveTo(x + w * 0.68, y);
  ctx.lineTo(x + w * 0.68, y + h);
  ctx.stroke();

  // Ilha central do chip
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.beginPath();
  ctx.roundRect(x + w * 0.35, y + h * 0.28, w * 0.3, h * 0.44, 4);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Barcode industrial de alta densidade
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  let cx = x;
  let s = 8392014;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  while (cx < x + w - 10) {
    const barW = Math.floor(rnd() * 3 + 1) * 2;
    const gapW = Math.floor(rnd() * 2 + 1) * 2;
    ctx.fillStyle = rnd() > 0.12 ? '#090d16' : '#64748b';
    ctx.fillRect(cx, y, barW, h);
    cx += barW + gapW;
  }
  ctx.restore();
}

// QR Code central nítido com cantos arredondados
function drawQr(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, seed: number) {
  const n = 21;
  const cell = size / n;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(x - 16, y - 16, size + 32, size + 32, 16);
  ctx.fill();
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.fillStyle = '#090d16';
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const finder = (fx: number, fy: number) => {
    ctx.fillRect(x + fx * cell, y + fy * cell, 7 * cell, 7 * cell);
    ctx.clearRect(x + (fx + 1) * cell, y + (fy + 1) * cell, 5 * cell, 5 * cell);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + (fx + 1) * cell, y + (fy + 1) * cell, 5 * cell, 5 * cell);
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + (fx + 2) * cell, y + (fy + 2) * cell, 3 * cell, 3 * cell);
  };
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const inFinder = (r < 8 && c < 8) || (r < 8 && c > n - 9) || (r > n - 9 && c < 8);
      if (!inFinder && rnd() > 0.48) ctx.fillRect(x + c * cell, y + r * cell, cell, cell);
    }
  }
  finder(0, 0);
  finder(n - 7, 0);
  finder(0, n - 7);
}

// Selo holográfico geométrico de autenticação
function drawSecuritySeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.translate(cx, cy);

  // Borda metálica
  const grad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.5, '#cbd5e1');
  grad.addColorStop(1, '#090d16');

  ctx.strokeStyle = grad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();

  // Linhas radiais de difração
  ctx.strokeStyle = 'rgba(9, 13, 22, 0.25)';
  ctx.lineWidth = 1.2;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * (r * 0.35), Math.sin(a) * (r * 0.35));
    ctx.lineTo(Math.cos(a) * (r * 0.88), Math.sin(a) * (r * 0.88));
    ctx.stroke();
  }

  // Losango central em ônix
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.45);
  ctx.lineTo(r * 0.45, 0);
  ctx.lineTo(0, r * 0.45);
  ctx.lineTo(-r * 0.45, 0);
  ctx.closePath();
  ctx.fill();

  // Monograma HJ centralizado
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 18px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HJ', 0, 1);

  ctx.restore();
}

// -------------------------------------------------------------
// FACE FRONTAL — CRACHÁ FLAGSHIP / CARTÃO POSTAL DE ALTA DEFINIÇÃO
// -------------------------------------------------------------
function buildFront(photoImg: HTMLImageElement | null): string {
  const [c, ctx] = makeCanvas();

  // 1. CARCAÇA EXTERNA (CASING / BUMPER): Preto Ônix Acetinado com chanfros
  ctx.fillStyle = '#080a10';
  ctx.fillRect(0, 0, W, H);

  // Textura sutil de micro-pontos na moldura externa
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let x = 16; x < W - 16; x += 28) {
    for (let y = 16; y < H - 16; y += 28) {
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  // 2. CORPO DO CARTÃO INTERNO (INSERT): Titânio / Off-white acetinado de alto contraste
  const padX = 40;
  const padY = 138;
  const cardW = W - padX * 2;
  const cardH = H - padY - 36;
  const cardRadius = 22;

  // Sombra e relevo da moldura
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.roundRect(padX - 4, padY - 4, cardW + 8, cardH + 8, cardRadius + 4);
  ctx.fill();

  // Fundo principal do cartão com gradiente titânio acetinado
  const bg = ctx.createLinearGradient(padX, padY, padX + cardW, padY + cardH);
  bg.addColorStop(0, '#ffffff');
  bg.addColorStop(0.35, '#f8fafc');
  bg.addColorStop(0.7, '#f1f5f9');
  bg.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(padX, padY, cardW, cardH, cardRadius);
  ctx.fill();

  // Borda metálica fina do cartão interno
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Micro-grade técnica pontilhada sobre o cartão interno
  ctx.fillStyle = 'rgba(15, 23, 42, 0.04)';
  for (let x = padX + 24; x < padX + cardW - 24; x += 32) {
    for (let y = padY + 24; y < padY + cardH - 24; y += 32) {
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  // Miras/Crosshairs nos 4 cantos do cartão interno
  const drawCornerCross = (x: number, y: number) => {
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 12, y);
    ctx.lineTo(x + 12, y);
    ctx.moveTo(x, y - 12);
    ctx.lineTo(x, y + 12);
    ctx.stroke();
  };
  drawCornerCross(padX + 28, padY + 28);
  drawCornerCross(padX + cardW - 28, padY + 28);
  drawCornerCross(padX + 28, padY + cardH - 28);
  drawCornerCross(padX + cardW - 28, padY + cardH - 28);

  // 3. HEADER SUPERIOR DO CARTÃO (y: 165 - 235)
  // Chip de identificação esquerdo
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.roundRect(padX + 28, padY + 24, 210, 44, 8);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 17px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ENGINEER // ID', padX + 28 + 105, padY + 24 + 22);

  // Instituição à direita
  ctx.textAlign = 'right';
  ctx.fillStyle = '#090d16';
  ctx.font = '800 20px "Space Grotesk", sans-serif';
  ctx.fillText('UNINOVAFAPI', padX + cardW - 28, padY + 36);
  ctx.fillStyle = '#64748b';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillText('EXÉRCITO BRASILEIRO • 2026', padX + cardW - 28, padY + 58);

  // Linha técnica sob o header
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padX + 28, padY + 84);
  ctx.lineTo(padX + cardW - 28, padY + 84);
  ctx.stroke();

  // 4. MICROCHIP EMV METÁLICO REALISTA
  drawEmvChip(ctx, padX + 32, padY + 105, 82, 60);

  // Metadados técnicos ao lado do microchip
  ctx.textAlign = 'left';
  ctx.fillStyle = '#090d16';
  ctx.font = '800 16px "Space Grotesk", sans-serif';
  ctx.fillText('CONTACTLESS SMART PASS', padX + 128, padY + 126);
  ctx.fillStyle = '#64748b';
  ctx.font = '700 12px "JetBrains Mono", monospace';
  ctx.fillText('SECURITY CHIP // LEVEL 04', padX + 128, padY + 148);

  // 5. FOTO DE HELTON JUNIOR CENTRALIZADA COM ALTA DEFINIÇÃO
  const pw = 520;
  const ph = 560;
  const px = (W - pw) / 2;
  const py = padY + 185;

  // Moldura escura posterior da foto com cantos técnicos
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.roundRect(px - 5, py - 5, pw + 10, ph + 10, 16);
  ctx.fill();

  // Fundo de recorte e desenho da foto de Helton
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.roundRect(px, py, pw, ph, 12);
  ctx.fill();

  if (photoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 12);
    ctx.clip();

    // Enquadramento fotográfico focado no rosto, sorriso e postura
    const srcW = photoImg.width;
    const srcH = Math.min(photoImg.height, photoImg.width * (ph / pw));
    ctx.drawImage(photoImg, 0, 0, srcW, srcH, px, py, pw, ph);

    // Efeito sutil de vinheta na base da foto para contraste com o nametag
    const photoVignette = ctx.createLinearGradient(0, py + ph - 80, 0, py + ph);
    photoVignette.addColorStop(0, 'rgba(9, 13, 22, 0)');
    photoVignette.addColorStop(1, 'rgba(9, 13, 22, 0.35)');
    ctx.fillStyle = photoVignette;
    ctx.fillRect(px, py + ph - 80, pw, 80);

    ctx.restore();
  }

  // Linhas de foco HUD nos 4 cantos da foto
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const cLen = 20;
  // Top-Left
  ctx.moveTo(px + 12, py + 12 + cLen); ctx.lineTo(px + 12, py + 12); ctx.lineTo(px + 12 + cLen, py + 12);
  // Top-Right
  ctx.moveTo(px + pw - 12 - cLen, py + 12); ctx.lineTo(px + pw - 12, py + 12); ctx.lineTo(px + pw - 12, py + 12 + cLen);
  // Bottom-Left
  ctx.moveTo(px + 12, py + ph - 12 - cLen); ctx.lineTo(px + 12, py + ph - 12); ctx.lineTo(px + 12 + cLen, py + ph - 12);
  // Bottom-Right
  ctx.moveTo(px + pw - 12 - cLen, py + ph - 12); ctx.lineTo(px + pw - 12, py + ph - 12); ctx.lineTo(px + pw - 12, py + ph - 12 - cLen);
  ctx.stroke();

  // 6. IDENTIFICAÇÃO PRINCIPAL: NOME & ESPECIALIDADE
  const nameY = py + ph + 54;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Nome Principal com tipografia imponente
  ctx.fillStyle = '#090d16';
  ctx.font = '900 58px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '-0.02em';
  ctx.fillText('HELTON JUNIOR', W / 2, nameY);

  // Cargo & Especialidade
  ctx.fillStyle = '#475569';
  ctx.font = '800 19px "JetBrains Mono", monospace';
  ctx.letterSpacing = '0.04em';
  ctx.fillText('SOFTWARE ENGINEER  •  CIÊNCIA DA COMPUTAÇÃO', W / 2, nameY + 36);

  // 7. CÁPSULAS DE COMPETÊNCIAS (PILLS DE ENGENHARIA)
  const pillsY = nameY + 68;
  const skills = ['FULL STACK', 'SAAS & AI', 'INFRAESTRUTURA'];
  const pillW = 220;
  const pillGap = 16;
  const startPillX = (W - (skills.length * pillW + (skills.length - 1) * pillGap)) / 2;

  skills.forEach((skill, i) => {
    const x = startPillX + i * (pillW + pillGap);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x, pillsY, pillW, 42, 8);
    ctx.fill();

    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#090d16';
    ctx.font = '800 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(skill, x + pillW / 2, pillsY + 21);
  });

  // Linha divisória técnica
  const divY = pillsY + 66;
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(padX + 28, divY);
  ctx.lineTo(padX + cardW - 28, divY);
  ctx.stroke();

  // 8. BLOCO INFERIOR DE AUTENTICAÇÃO E CÓDIGO DE BARRAS
  // Selo geométrico à esquerda
  drawSecuritySeal(ctx, padX + 76, divY + 65, 42);

  // Metadados técnicos ao lado do selo
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#090d16';
  ctx.font = '800 17px "Space Grotesk", sans-serif';
  ctx.fillText('CREDENTIAL: HJ-2026-SYS // LEVEL 04', padX + 138, divY + 48);
  ctx.fillStyle = '#64748b';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillText('STACK: REACT • TYPESCRIPT • LARAVEL • POSTGRES • DOCKER', padX + 138, divY + 70);
  ctx.fillText('LOCATION: TERESINA, PI — 05°05\'12"S 42°48\'42"W', padX + 138, divY + 90);

  // Barcode industrial
  const barY = divY + 115;
  drawBarcode(ctx, padX + 28, barY, cardW - 56, 52);

  // Código alfanumérico sob o barcode
  ctx.textAlign = 'center';
  ctx.fillStyle = '#475569';
  ctx.font = '700 15px "JetBrains Mono", monospace';
  ctx.fillText('* HJ-994922976-EB-2026-AUTH-SYS *', W / 2, barY + 76);

  return c.toDataURL('image/png');
}

// -------------------------------------------------------------
// FACE POSTERIOR (VERSO) — NETWORKING & TECH STACK
// -------------------------------------------------------------
function buildBack(): string {
  const [c, ctx] = makeCanvas();

  // Carcaça Externa Preto Ônix
  ctx.fillStyle = '#080a10';
  ctx.fillRect(0, 0, W, H);

  // Cartão Interno
  const padX = 40;
  const padY = 138;
  const cardW = W - padX * 2;
  const cardH = H - padY - 36;
  const cardRadius = 22;

  // Fundo principal do cartão com gradiente titânio acetinado
  const bg = ctx.createLinearGradient(padX, padY, padX + cardW, padY + cardH);
  bg.addColorStop(0, '#ffffff');
  bg.addColorStop(0.35, '#f8fafc');
  bg.addColorStop(0.7, '#f1f5f9');
  bg.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(padX, padY, cardW, cardH, cardRadius);
  ctx.fill();

  ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Tarja magnética escura (Magstripe) no topo do verso
  ctx.fillStyle = '#090d16';
  ctx.fillRect(padX + 2, padY + 24, cardW - 4, 78);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 20px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('IDENTIFICAÇÃO PROFISSIONAL & NETWORKING', W / 2, padY + 63);

  // QR Code central nítido
  const qrSize = 380;
  const qrX = (W - qrSize) / 2;
  const qrY = padY + 130;
  drawQr(ctx, qrX, qrY, qrSize, 8);

  ctx.fillStyle = '#090d16';
  ctx.font = '800 32px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Escaneie para Conectar', W / 2, qrY + qrSize + 48);

  ctx.fillStyle = '#475569';
  ctx.font = '700 19px "JetBrains Mono", monospace';
  ctx.fillText('LinkedIn  •  GitHub  •  WhatsApp', W / 2, qrY + qrSize + 82);
  ctx.fillText('+55 86 99492-2976 // heltonj866@gmail.com', W / 2, qrY + qrSize + 112);

  // Linha divisória técnica
  const divY = qrY + qrSize + 148;
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(padX + 28, divY);
  ctx.lineTo(padX + cardW - 28, divY);
  ctx.stroke();

  // Título Tech Stack
  ctx.fillStyle = '#090d16';
  ctx.font = '800 22px "JetBrains Mono", monospace';
  ctx.fillText('// PRINCIPAIS TECNOLOGIAS', W / 2, divY + 44);

  // Chips industriais para Tech Stack
  const tagsRow1 = ['Python', 'TypeScript', 'Laravel'];
  const tagsRow2 = ['React', 'PostgreSQL', 'Docker'];

  const drawRow = (tags: string[], y: number) => {
    ctx.font = '700 20px "JetBrains Mono", monospace';
    const totalW = tags.reduce((acc, t) => acc + ctx.measureText(t).width + 56, 0) + (tags.length - 1) * 16;
    let startX = (W - totalW) / 2;

    tags.forEach((t) => {
      const tw = ctx.measureText(t).width + 56;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(startX, y - 28, tw, 48, 8);
      ctx.fill();

      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#090d16';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t, startX + tw / 2, y - 4);
      startX += tw + 16;
    });
  };

  drawRow(tagsRow1, divY + 102);
  drawRow(tagsRow2, divY + 164);

  // Barcode de validação no verso
  const backBarY = divY + 220;
  drawBarcode(ctx, padX + 28, backBarY, cardW - 56, 48);

  // Rodapé institucional
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#475569';
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillText('Centro Universitário Uninovafapi // Exército Brasileiro', W / 2, H - 75);
  ctx.fillStyle = '#64748b';
  ctx.font = '600 14px "JetBrains Mono", monospace';
  ctx.fillText('Teresina, PI — Brasil  •  ID 2026-HJ', W / 2, H - 52);

  return c.toDataURL('image/png');
}

// -------------------------------------------------------------
// CORDÃO (STRAP) — DESIGN TÉCNICO EXECUTIVO DE ALTA DEFINIÇÃO
// -------------------------------------------------------------
function buildStrap(): string {
  const along = 2048;
  const across = 192;
  const [c, ctx] = makeCanvas(along, across);

  // 1. Trama preta acetinada
  ctx.fillStyle = '#07080a';
  ctx.fillRect(0, 0, along, across);

  // Textura de tecido trançado
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  for (let x = 0; x < along; x += 3) {
    ctx.fillRect(x, 0, 1.2, across);
  }

  // 2. Costura branca reforçada nas bordas
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.setLineDash([14, 8]);
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.lineTo(along, 14);
  ctx.moveTo(0, across - 14);
  ctx.lineTo(along, across - 14);
  ctx.stroke();

  // 3. Tipografia de Alto Impacto em repetição elegante
  const phrase = 'HELTON JUNIOR  ✦  SOFTWARE ENGINEER  ✦  CIÊNCIA DA COMPUTAÇÃO  ✦  HJ.DEV  ✦  ';

  ctx.setLineDash([]);
  ctx.font = '900 48px "Space Grotesk", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  const textWidth = ctx.measureText(phrase).width;
  const repeats = Math.ceil(along / textWidth) + 1;

  for (let r = 0; r < repeats; r++) {
    const x = r * textWidth;

    // Sombra para contraste
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(phrase, x + 2, across / 2 + 2);

    // Texto em branco puro de alta nitidez
    ctx.fillStyle = '#ffffff';
    ctx.fillText(phrase, x, across / 2);
  }

  return c.toDataURL('image/png');
}

interface Lanyard3DProps {
  variant?: 'full' | 'inline';
}

export const Lanyard3D: React.FC<Lanyard3DProps> = ({ variant = 'inline' }) => {
  const [assets, setAssets] = useState<{ front: string; back: string; strap: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fonts = [
      '800 17px "JetBrains Mono"',
      '800 20px "Space Grotesk"',
      '900 58px "Space Grotesk"',
      '800 19px "JetBrains Mono"',
      '800 15px "JetBrains Mono"',
      '900 48px "Space Grotesk"'
    ];

    Promise.all([
      ...fonts.map((f) => document.fonts.load(f)),
      loadImage('/helton.jpg')
    ]).then(([_, __, ___, ____, _____, ______, photoImg]) => {
      if (!cancelled) {
        setAssets({
          front: buildFront(photoImg as HTMLImageElement | null),
          back: buildBack(),
          strap: buildStrap()
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const full = variant === 'full';

  return (
    <div className={full ? 'absolute inset-0 z-0 select-none' : 'relative w-full h-[520px] sm:h-[600px] select-none'}>
      {assets && (
        <Lanyard
          frontImage={assets.front}
          backImage={assets.back}
          strapImage={assets.strap}
          cardColor="#080a10"
          finish="glossy"
          cornerRadius={0.28}
          anchor={full ? 'right' : 'center'}
          size={full ? 0.5 : 0.62}
          strapLength={full ? 0.6 : 0.5}
          strapColor="#07080a"
          strapWidth={0.72}
          metal="silver"
          gravity={1}
          damping={0.5}
          elasticity={0.5}
          breeze={0.35}
        />
      )}
    </div>
  );
};
