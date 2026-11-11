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

// Barcode industrial de alta densidade
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  let cx = x;
  let s = 4567891;
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

// Carimbo técnico circular de autenticação
function drawInspectionStamp(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.14); // Leve inclinação de carimbo autêntico

  // Borda dupla carmim / terracota industrial
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, r - 5, 0, Math.PI * 2);
  ctx.stroke();

  // Texto circular
  ctx.fillStyle = '#dc2626';
  ctx.font = '800 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★ VERIFIED DEV ★', 0, -r * 0.45);
  ctx.font = '900 16px "Space Grotesk", sans-serif';
  ctx.fillText('PASSED', 0, 0);
  ctx.font = '700 10px "JetBrains Mono", monospace';
  ctx.fillText('EB // 2026', 0, r * 0.45);

  ctx.restore();
}

// -------------------------------------------------------------
// FACE FRONTAL — EDITORIAL TECH VIP (ESTILO ALFARI REFINADO)
// -------------------------------------------------------------
function buildFront(photoImg: HTMLImageElement | null): string {
  const [c, ctx] = makeCanvas();

  // 1. Fundo do Cartão: Off-white acetinado industrial com gradiente suave
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#f8fafc');
  bg.addColorStop(0.5, '#f1f5f9');
  bg.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Micro-grade técnica pontilhada
  ctx.fillStyle = 'rgba(15, 23, 42, 0.04)';
  for (let x = 40; x < W - 40; x += 32) {
    for (let y = 140; y < H - 40; y += 32) {
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  // Borda perimetral técnica com margem interna de segurança
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(36, 130, W - 72, H - 166);

  ctx.strokeStyle = 'rgba(15, 23, 42, 0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(44, 138, W - 88, H - 182);

  // Miras/Crosshairs nos 4 cantos
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
  drawCornerCross(56, 150);
  drawCornerCross(W - 56, 150);
  drawCornerCross(56, H - 56);
  drawCornerCross(W - 56, H - 56);

  // 2. HEADER SUPERIOR TÉCNICO (y: 165 - 230)
  // Pill esquerdo: "SOFTWARE // DEV"
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.roundRect(64, 165, 200, 44, 8);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 18px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SOFTWARE // DEV', 164, 187);

  // Instituição à direita: "UNINOVAFAPI" e "EXÉRCITO BRASILEIRO"
  ctx.textAlign = 'right';
  ctx.fillStyle = '#090d16';
  ctx.font = '800 22px "Space Grotesk", sans-serif';
  ctx.fillText('UNINOVAFAPI', W - 64, 178);
  ctx.fillStyle = '#64748b';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillText('EXÉRCITO BRASILEIRO • 2026', W - 64, 202);

  // 3. TIPOGRAFIA HERO MONUMENTAL: "DEVELOPER"
  ctx.textAlign = 'center';
  ctx.fillStyle = '#090d16';
  ctx.font = '900 114px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '-0.03em';
  ctx.fillText('DEVELOPER', W / 2, 318);

  // 4. FOTO DE HELTON JUNIOR CENTRALIZADA
  const pw = 500;
  const ph = 560;
  const px = (W - pw) / 2;
  const py = 330;

  // Moldura escura posterior com cantos retos técnicos
  ctx.fillStyle = '#090d16';
  ctx.fillRect(px - 6, py - 6, pw + 12, ph + 12);

  // Fundo de corte da foto
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(px, py, pw, ph);

  if (photoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph);
    ctx.clip();

    // Enquadramento de retrato focado no rosto, sorriso e tronco
    const srcW = photoImg.width;
    const srcH = Math.min(photoImg.height, photoImg.width * (ph / pw));
    ctx.drawImage(photoImg, 0, 0, srcW, srcH, px, py, pw, ph);

    // Efeito sutil de vinheta na base da foto para contraste com o nametag
    const photoVignette = ctx.createLinearGradient(0, py + ph - 80, 0, py + ph);
    photoVignette.addColorStop(0, 'rgba(9, 13, 22, 0)');
    photoVignette.addColorStop(1, 'rgba(9, 13, 22, 0.45)');
    ctx.fillStyle = photoVignette;
    ctx.fillRect(px, py + ph - 80, pw, 80);

    ctx.restore();
  }

  // Linhas de foco HUD sobre a foto
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(px + 12, py + 12, pw - 24, ph - 24);

  // 5. NAMETAG FRONTAL NA FOTO (ESTILO OFICIAL DA REFERÊNCIA)
  const tagW = 460;
  const tagH = 62;
  const tagX = (W - tagW) / 2;
  const tagY = py + ph - 68;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(tagX, tagY, tagW, tagH);
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(tagX, tagY, tagW, tagH);

  ctx.fillStyle = '#090d16';
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HELTON JUNIOR', W / 2, tagY + tagH / 2);

  // 6. TEXTO VERTICAL ROTACIONADO À DIREITA (IDÊNTICO À REFERÊNCIA)
  ctx.save();
  ctx.translate(W - 70, 610);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = '#090d16';
  ctx.font = '900 44px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CIÊNCIA DA COMPUTAÇÃO', 0, 0);
  ctx.restore();

  // Lateral Esquerda: Coordenadas e ID técnico
  ctx.save();
  ctx.translate(68, 610);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#64748b';
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('05°05\'12"S 42°48\'42"W // TERESINA-PI', 0, 0);
  ctx.restore();

  // Carimbo de inspeção militar/dev
  drawInspectionStamp(ctx, px + 70, py + 70, 48);

  // 7. SEÇÃO INFERIOR: "PORTFOLIO" & QUOTE
  const bottomY = py + ph + 80;

  // "PORTFOLIO" em destaque gigante à esquerda
  ctx.textAlign = 'left';
  ctx.fillStyle = '#090d16';
  ctx.font = '900 70px "Space Grotesk", sans-serif';
  ctx.fillText('PORTFOLIO', 64, bottomY + 30);

  // Cápsula de lema à direita: "((( Rigor, Precisão & Código )))"
  ctx.textAlign = 'right';
  ctx.fillStyle = '#334155';
  ctx.font = '700 17px "JetBrains Mono", monospace';
  ctx.fillText('((( Rigor, Precisão & Código )))', W - 64, bottomY);

  // Linha divisória técnica
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(64, bottomY + 54);
  ctx.lineTo(W - 64, bottomY + 54);
  ctx.stroke();

  // 8. CÓDIGO DE BARRAS & METADADOS FINAIS
  const barY = bottomY + 74;
  drawBarcode(ctx, 64, barY, W - 128, 54);

  // Rodapé técnico
  ctx.textAlign = 'left';
  ctx.fillStyle = '#475569';
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillText('ID: EB-2026-HJ // FULL STACK • AI • INFRASTRUCTURE', 64, barY + 84);

  ctx.textAlign = 'right';
  ctx.fillText('TERESINA, PI — BRASIL', W - 64, barY + 84);

  // URL LinkedIn discreta centralizada
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748b';
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillText('linkedin.com/in/heltonj866', W / 2, H - 72);

  return c.toDataURL('image/png');
}

// -------------------------------------------------------------
// FACE POSTERIOR (VERSO) — NETWORKING & TECH STACK
// -------------------------------------------------------------
function buildBack(): string {
  const [c, ctx] = makeCanvas();

  // Fundo off-white com acabamento industrial
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#f8fafc');
  bg.addColorStop(0.5, '#f1f5f9');
  bg.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Borda perimetral técnica
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(36, 130, W - 72, H - 166);

  // Faixa superior preta sólida
  ctx.fillStyle = '#090d16';
  ctx.fillRect(36, 150, W - 72, 85);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 24px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('IDENTIFICAÇÃO PROFISSIONAL & CONTATOS', W / 2, 192);

  // QR Code central nítido
  const qrSize = 380;
  const qrX = (W - qrSize) / 2;
  const qrY = 275;
  drawQr(ctx, qrX, qrY, qrSize, 8);

  ctx.fillStyle = '#090d16';
  ctx.font = '800 32px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Escaneie para Conectar', W / 2, qrY + qrSize + 48);

  ctx.fillStyle = '#475569';
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText('LinkedIn  •  GitHub  •  WhatsApp', W / 2, qrY + qrSize + 85);
  ctx.fillText('+55 86 99492-2976 // heltonj866@gmail.com', W / 2, qrY + qrSize + 118);

  // Linha divisória técnica
  const divY = qrY + qrSize + 155;
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(80, divY);
  ctx.lineTo(W - 80, divY);
  ctx.stroke();

  // Título Tech Stack
  ctx.fillStyle = '#090d16';
  ctx.font = '800 22px "JetBrains Mono", monospace';
  ctx.fillText('// PRINCIPAIS TECNOLOGIAS', W / 2, divY + 45);

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

  drawRow(tagsRow1, divY + 105);
  drawRow(tagsRow2, divY + 168);

  // Barcode de validação no verso
  const backBarY = divY + 225;
  drawBarcode(ctx, 80, backBarY, W - 160, 48);

  // Rodapé institucional
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#475569';
  ctx.font = '700 17px "JetBrains Mono", monospace';
  ctx.fillText('Centro Universitário Uninovafapi // Exército Brasileiro', W / 2, H - 95);
  ctx.fillStyle = '#64748b';
  ctx.font = '600 15px "JetBrains Mono", monospace';
  ctx.fillText('Teresina, PI — Brasil  •  ID 2026-HJ', W / 2, H - 70);

  return c.toDataURL('image/png');
}

// -------------------------------------------------------------
// CORDÃO (STRAP) — DESIGN STREETWEAR TECH DE ALTA DENSIDADE
// -------------------------------------------------------------
function buildStrap(): string {
  const along = 2048;
  const across = 192;
  const [c, ctx] = makeCanvas(along, across);

  // 1. Trama preta acetinada
  ctx.fillStyle = '#0a0a0d';
  ctx.fillRect(0, 0, along, across);

  // Textura de tecido trançado
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
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
  // Estilo conferência internacional: HELTON JUNIOR ✦ SOFTWARE ENGINEER ✦ DEV // EB ✦ COMPUTER SCIENCE
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
      '800 18px "JetBrains Mono"',
      '800 22px "Space Grotesk"',
      '900 114px "Space Grotesk"',
      '900 32px "Space Grotesk"',
      '900 44px "Space Grotesk"',
      '900 70px "Space Grotesk"',
      '900 48px "Space Grotesk"'
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
          cardColor="#090d16"
          finish="glossy"
          cornerRadius={0.28}
          anchor={full ? 'right' : 'center'}
          size={full ? 0.5 : 0.62}
          strapLength={full ? 0.6 : 0.5}
          strapColor="#0a0a0d"
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
