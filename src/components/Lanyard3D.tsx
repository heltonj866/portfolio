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

// Fundo oceânico com ondas profundas (estilo exato do backdrop da foto na referência)
function drawOceanBackdrop(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Gradiente base azul oceano profundo
  const oceanBg = ctx.createLinearGradient(x, y, x, y + h);
  oceanBg.addColorStop(0, '#0a1d37');
  oceanBg.addColorStop(0.4, '#0f294a');
  oceanBg.addColorStop(0.8, '#08172c');
  oceanBg.addColorStop(1, '#030a14');
  ctx.fillStyle = oceanBg;
  ctx.fillRect(x, y, w, h);

  // Camadas de ondulação e mar revolto
  const waveLayers = [
    { freq: 0.02, amp: 14, speed: 1.0, color: 'rgba(14, 116, 144, 0.45)' },
    { freq: 0.035, amp: 10, speed: 1.8, color: 'rgba(30, 58, 138, 0.6)' },
    { freq: 0.05, amp: 8, speed: 2.5, color: 'rgba(56, 189, 248, 0.25)' },
    { freq: 0.08, amp: 5, speed: 3.2, color: 'rgba(255, 255, 255, 0.15)' }
  ];

  for (let row = y + 10; row < y + h; row += 22) {
    waveLayers.forEach((wl, idx) => {
      ctx.beginPath();
      ctx.strokeStyle = wl.color;
      ctx.lineWidth = 3 + (idx % 2) * 2;
      for (let px = x; px <= x + w; px += 8) {
        const offset = Math.sin((px + row * 2) * wl.freq) * wl.amp + Math.cos(px * 0.015) * 6;
        const py = row + offset;
        if (px === x) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
  }

  // Respingo de espuma e textura marinha
  let s = 12345;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let i = 0; i < 180; i++) {
    const fx = x + rnd() * w;
    const fy = y + rnd() * h;
    const fr = rnd() * 2 + 0.5;
    ctx.beginPath();
    ctx.arc(fx, fy, fr, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Elo de corrente cromada metálica 3D nos cantos (idêntico à referência)
function drawChromeLink(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, angle: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  // Sombra profunda sob a corrente
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 12;

  // Corpo metálico cromado em degradê
  const grad = ctx.createLinearGradient(-r, -r, r, r);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.2, '#94a3b8');
  grad.addColorStop(0.4, '#1e293b');
  grad.addColorStop(0.6, '#cbd5e1');
  grad.addColorStop(0.85, '#475569');
  grad.addColorStop(1, '#0f172a');

  ctx.strokeStyle = grad;
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 0.55, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Reset shadow para o brilho especular interno
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, r - 5, (r - 5) * 0.55, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// Código de barras industrial de alta resolução
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, lightMode = false) {
  ctx.save();
  let cx = x;
  let s = 9876543;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  while (cx < x + w - 10) {
    const barW = Math.floor(rnd() * 3 + 1) * 2;
    const gapW = Math.floor(rnd() * 2 + 1) * 2;
    ctx.fillStyle = rnd() > 0.14 ? (lightMode ? '#090d16' : '#f8fafc') : (lightMode ? '#94a3b8' : '#475569');
    ctx.fillRect(cx, y, barW, h);
    cx += barW + gapW;
  }
  ctx.restore();
}

// QR Code central nítido
function drawQr(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, seed: number) {
  const n = 21;
  const cell = size / n;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(x - 16, y - 16, size + 32, size + 32, 16);
  ctx.fill();
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 4;
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

// --------------------------------------------------------------------------------------
// FACE FRONTAL — OPÇÃO A: OBSIDIAN DARK POSTER (COM CAMADAS GRÁFICAS DA REFERÊNCIA)
// --------------------------------------------------------------------------------------
function buildFront(photoImg: HTMLImageElement | null): string {
  const [c, ctx] = makeCanvas();

  // 1. FUNDO DO CARTÃO: Grafite Profundo / Azul Petróleo Escuro com textura de papel
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#111622');
  bg.addColorStop(0.4, '#0c101a');
  bg.addColorStop(0.85, '#07090e');
  bg.addColorStop(1, '#040508');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Textura sutil de fibra/grade técnica
  ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
  for (let x = 0; x < W; x += 36) {
    for (let y = 0; y < H; y += 36) {
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  // Linhas diagonais de segurança
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let d = -H; d < W + H; d += 60) {
    ctx.beginPath();
    ctx.moveTo(d, 0);
    ctx.lineTo(d + H, H);
    ctx.stroke();
  }

  // Borda perimetral técnica com margem interna de segurança
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(46, 46, W - 92, H - 92);

  // Miras/Crosshairs nos 4 cantos
  const drawCornerCross = (x: number, y: number) => {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 12, y); ctx.lineTo(x + 12, y);
    ctx.moveTo(x, y - 12); ctx.lineTo(x, y + 12);
    ctx.stroke();
  };
  drawCornerCross(54, 54);
  drawCornerCross(W - 54, 54);
  drawCornerCross(54, H - 54);
  drawCornerCross(W - 54, H - 54);

  // 2. HEADER SUPERIOR TÉCNICO
  // Pílula esquerda: "JUNIOR" ou "SOFTWARE"
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(64, 110, 160, 44, 8);
  ctx.fill();

  ctx.fillStyle = '#090d16';
  ctx.font = '900 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JUNIOR', 144, 132);

  // Instituição à direita: "UNINOVAFAPI" e "EXÉRCITO BRASILEIRO"
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 22px "Space Grotesk", sans-serif';
  ctx.fillText('UNINOVAFAPI', W - 64, 130);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillText('EXÉRCITO BRASILEIRO • 2026', W - 64, 154);

  // 3. TIPOGRAFIA HERO MONUMENTAL: "DEVELOPER"
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 120px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '-0.04em';
  ctx.fillText('DEVELOPER', W / 2, 290);

  // Selo diagonal "ORIGINAL" sobre a letra E de DEVELOPER (detalhe autêntico da referência!)
  ctx.save();
  ctx.translate(330, 230);
  ctx.rotate(-0.16);
  ctx.fillStyle = '#090d16';
  ctx.fillRect(-6, -6, 110, 48);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(-6, -6, 110, 48);

  // Listras diagonais zebra
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  for (let lx = 0; lx < 100; lx += 14) {
    ctx.fillRect(lx, 18, 6, 20);
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ORIGINAL', 48, 14);
  ctx.restore();

  // 4. FOTO DE HELTON JUNIOR COM BACKDROP OCEÂNICO PROFUNDO
  const pw = 480;
  const ph = 590;
  const px = (W - pw) / 2;
  const py = 300;

  // Moldura escura posterior da foto com cantos técnicos
  ctx.fillStyle = '#05070c';
  ctx.fillRect(px - 6, py - 6, pw + 12, ph + 12);

  // Fundo oceânico com ondas profundas atrás do Helton
  drawOceanBackdrop(ctx, px, py, pw, ph);

  // Retrato de Helton Junior sobreposto ao oceano
  if (photoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph);
    ctx.clip();

    // Sombra de profundidade para o recorte
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 24;

    const srcW = photoImg.width;
    const srcH = Math.min(photoImg.height, photoImg.width * (ph / pw));
    ctx.drawImage(photoImg, 0, 0, srcW, srcH, px, py, pw, ph);

    ctx.restore();
  }

  // Linhas de foco HUD na foto
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(px + 10, py + 10, pw - 20, ph - 20);

  // 5. NAMETAG FRONTAL NA FOTO (ETIQUETA ADESIVA DE ALTO CONTRASTE)
  const tagW = 440;
  const tagH = 64;
  const tagX = (W - tagW) / 2;
  const tagY = py + ph - 68;

  // Fundo da etiqueta em branco puro texturizado
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(tagX, tagY, tagW, tagH);
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 4;
  ctx.strokeRect(tagX, tagY, tagW, tagH);

  // Texto do nome
  ctx.fillStyle = '#090d16';
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '-0.01em';
  ctx.fillText('HELTON JUNIOR', W / 2, tagY + tagH / 2);

  // 6. TEXTO VERTICAL ROTACIONADO À DIREITA (IDÊNTICO À REFERÊNCIA)
  ctx.save();
  ctx.translate(W - 70, 600);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 46px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '-0.02em';
  ctx.fillText('CIÊNCIA DA COMPUTAÇÃO', 0, 0);
  ctx.restore();

  // Lateral Esquerda: Coordenadas e identificador
  ctx.save();
  ctx.translate(68, 600);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('05°05\'12"S 42°48\'42"W // TERESINA-PI', 0, 0);
  ctx.restore();

  // 7. SEÇÃO INFERIOR: "PORTFOLIO" & QUOTE
  const bottomY = py + ph + 80;

  // "PORTFOLIO" em destaque monumental à esquerda
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 70px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '-0.03em';
  ctx.fillText('PORTFOLIO', 64, bottomY + 30);

  // Cápsula de lema à direita: "((( Rigor, Precisão & Código )))"
  ctx.textAlign = 'right';
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '700 17px "JetBrains Mono", monospace';
  ctx.fillText('((( Rigor, Precisão & Código )))', W - 64, bottomY);

  // Linha divisória técnica
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(64, bottomY + 54);
  ctx.lineTo(W - 64, bottomY + 54);
  ctx.stroke();

  // 8. CÓDIGO DE BARRAS & METADADOS FINAIS
  const barY = bottomY + 74;
  drawBarcode(ctx, 64, barY, W - 128, 54, false);

  // Rodapé técnico
  ctx.textAlign = 'left';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillText('ID: EB-2026-HJ // FULL STACK • AI • INFRASTRUCTURE', 64, barY + 84);

  ctx.textAlign = 'right';
  ctx.fillText('TERESINA, PI — BRASIL', W - 64, barY + 84);

  // URL LinkedIn centralizada
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748b';
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillText('linkedin.com/in/heltonj866', W / 2, H - 72);

  // 9. ELOS CROMADOS METÁLICOS 3D NOS CANTOS INFERIORES (ESTILO REFERÊNCIA)
  drawChromeLink(ctx, 84, 1260, 72, -0.42);
  drawChromeLink(ctx, W - 84, 1260, 72, 0.42);

  return c.toDataURL('image/png');
}

// --------------------------------------------------------------------------------------
// FACE POSTERIOR (VERSO) — PÔSTER DE NETWORKING COM SCAN HERE (REFERÊNCIA ALFARI)
// --------------------------------------------------------------------------------------
function buildBack(): string {
  const [c, ctx] = makeCanvas();

  // Fundo grafite profundo com textura técnica
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#111622');
  bg.addColorStop(0.4, '#0c101a');
  bg.addColorStop(0.85, '#07090e');
  bg.addColorStop(1, '#040508');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Borda perimetral técnica
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  // Fita adesiva diagonal "SCAN HERE" no topo esquerdo (idêntica à referência!)
  ctx.save();
  ctx.translate(140, 100);
  ctx.rotate(-0.08);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-10, -8, 200, 56);
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 3;
  ctx.strokeRect(-10, -8, 200, 56);

  // Listras zebra
  ctx.fillStyle = '#090d16';
  for (let lx = 0; lx < 190; lx += 18) {
    ctx.fillRect(lx, 24, 8, 20);
  }

  ctx.fillStyle = '#090d16';
  ctx.font = '900 22px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SCAN HERE', 90, 16);
  ctx.restore();

  // Instituição à direita
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 22px "Space Grotesk", sans-serif';
  ctx.fillText('UNINOVAFAPI', W - 64, 120);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillText('EXÉRCITO BRASILEIRO • 2026', W - 64, 144);

  // Bloco central com borda desgastada para o QR Code: "CONNECT OUR NETWORK"
  const boxW = 540;
  const boxH = 680;
  const boxX = (W - boxW) / 2;
  const boxY = 200;

  // Fundo azul marinho escuro do container do QR Code
  ctx.fillStyle = '#0d1527';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // Listras decorativas nos cantos do container
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(boxX + 16, boxY + 80 + i * 24, 16, 12);
    ctx.fillRect(boxX + boxW - 32, boxY + 80 + i * 24, 16, 12);
  }

  // Título: "CONNECT OUR NETWORK"
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CONNECT OUR NETWORK', W / 2, boxY + 54);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(boxX + 60, boxY + 70);
  ctx.lineTo(boxX + boxW - 60, boxY + 70);
  ctx.stroke();

  // QR Code central nítido
  const qrSize = 360;
  const qrX = (W - qrSize) / 2;
  const qrY = boxY + 100;
  drawQr(ctx, qrX, qrY, qrSize, 8);

  // Fita de identificação sob o QR Code: "HELTON JUNIOR • Software Engineer"
  const subTagY = qrY + qrSize + 40;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(boxX + 24, subTagY, boxW - 48, 54);
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 3;
  ctx.strokeRect(boxX + 24, subTagY, boxW - 48, 54);

  ctx.fillStyle = '#090d16';
  ctx.font = '900 24px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HELTON JUNIOR  •  Software Engineer', W / 2, subTagY + 27);

  // Faixa vertical à direita: "TEKNIK / CIÊNCIA DA COMPUTAÇÃO"
  ctx.save();
  ctx.translate(W - 70, 540);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 42px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '-0.02em';
  ctx.fillText('CIÊNCIA DA COMPUTAÇÃO', 0, 0);
  ctx.restore();

  // Seção de Tech Stack no terço inferior
  const stackY = boxY + boxH + 60;
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('// CORE TECH STACK', W / 2, stackY);

  const tagsRow1 = ['Python', 'TypeScript', 'Laravel'];
  const tagsRow2 = ['React', 'PostgreSQL', 'Docker'];

  const drawRow = (tags: string[], y: number) => {
    ctx.font = '700 20px "JetBrains Mono", monospace';
    const totalW = tags.reduce((acc, t) => acc + ctx.measureText(t).width + 56, 0) + (tags.length - 1) * 16;
    let startX = (W - totalW) / 2;

    tags.forEach((t) => {
      const tw = ctx.measureText(t).width + 56;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(startX, y - 28, tw, 48, 8);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t, startX + tw / 2, y - 4);
      startX += tw + 16;
    });
  };

  drawRow(tagsRow1, stackY + 54);
  drawRow(tagsRow2, stackY + 116);

  // Barcode de validação no rodapé do verso
  const backBarY = stackY + 170;
  drawBarcode(ctx, 80, backBarY, W - 160, 48, false);

  // Rodapé institucional
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillText('Centro Universitário Uninovafapi // Exército Brasileiro', W / 2, H - 76);
  ctx.fillStyle = '#64748b';
  ctx.font = '600 14px "JetBrains Mono", monospace';
  ctx.fillText('Teresina, PI — Brasil  •  ID 2026-HJ', W / 2, H - 54);

  return c.toDataURL('image/png');
}

// --------------------------------------------------------------------------------------
// CORDÃO (STRAP) — MONOGRAMA CIRCULAR (HJ) + NOME (IDÊNTICO AO FORMATO DA REFERÊNCIA)
// --------------------------------------------------------------------------------------
function buildStrap(): string {
  // Proporção otimizada para o padrão (F) Alfari Yusuf -> (HJ) Helton Junior
  const along = 1024;
  const across = 256;
  const [c, ctx] = makeCanvas(along, across);

  // 1. Fundo preto puro profundo
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, along, across);

  // 2. Monograma circular estilizado "(HJ)"
  const circleX = 140;
  const circleY = across / 2;
  const circleR = 76;

  // Círculo branco com traço grosso
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2);
  ctx.stroke();

  // Letra HJ em destaque no centro do círculo
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 82px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '-0.04em';
  ctx.fillText('HJ', circleX, circleY + 2);

  // 3. Nome "Helton Junior" em tipografia bold marcante
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 106px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '-0.02em';
  ctx.fillText('Helton Junior', circleX + circleR + 56, across / 2);

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
      '900 20px "JetBrains Mono"',
      '800 22px "Space Grotesk"',
      '900 120px "Space Grotesk"',
      '900 32px "Space Grotesk"',
      '900 46px "Space Grotesk"',
      '900 70px "Space Grotesk"',
      '900 106px "Space Grotesk"'
    ];

    Promise.all([
      ...fonts.map((f) => document.fonts.load(f)),
      loadImage('/helton.jpg')
    ]).then(([_, __, ___, ____, _____, ______, _______, photoImg]) => {
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
          cardColor="#04010e"
          finish="glossy"
          cornerRadius={0.25}
          anchor={full ? 'right' : 'center'}
          size={full ? 0.5 : 0.62}
          strapLength={full ? 0.59 : 0.55}
          strapColor="#111827"
          strapWidth={0.62}
          metal="silver"
          gravity={1.2}
          damping={0.35}
          elasticity={0.7}
          breeze={0.15}
        />
      )}
    </div>
  );
};
