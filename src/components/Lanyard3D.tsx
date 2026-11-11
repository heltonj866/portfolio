import React, { useEffect, useState } from 'react';
import Lanyard from './Lanyard';

const W = 1024;
const H = 1440;

function makeCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
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

// Código de barras biométrico industrial de alta resolução
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  let cx = x;
  let s = 9876543;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  while (cx < x + w - 12) {
    const barW = Math.floor(rnd() * 3 + 1) * 2;
    const gapW = Math.floor(rnd() * 2 + 1) * 2;
    ctx.fillStyle = rnd() > 0.12 ? '#0f172a' : '#94a3b8';
    ctx.fillRect(cx, y, barW, h);
    cx += barW + gapW;
  }
  ctx.restore();
}

function drawQr(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, seed: number) {
  const n = 21;
  const cell = size / n;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(x - 18, y - 18, size + 36, size + 36, 18);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const finder = (fx: number, fy: number) => {
    ctx.fillRect(x + fx * cell, y + fy * cell, 7 * cell, 7 * cell);
    ctx.clearRect(x + (fx + 1) * cell, y + (fy + 1) * cell, 5 * cell, 5 * cell);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + (fx + 1) * cell, y + (fy + 1) * cell, 5 * cell, 5 * cell);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + (fx + 2) * cell, y + (fy + 2) * cell, 3 * cell, 3 * cell);
  };
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const inFinder = (r < 8 && c < 8) || (r < 8 && c > n - 9) || (r > n - 9 && c < 8);
      if (!inFinder && rnd() > 0.52) ctx.fillRect(x + c * cell, y + r * cell, cell, cell);
    }
  }
  finder(0, 0);
  finder(n - 7, 0);
  finder(0, n - 7);
}

// Desenho de elo cromado metálico 3D nos cantos (estilo visual da referência)
function drawChromeRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, angle: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  const grad = ctx.createLinearGradient(-r, -r, r, r);
  grad.addColorStop(0, '#f8fafc');
  grad.addColorStop(0.25, '#94a3b8');
  grad.addColorStop(0.5, '#475569');
  grad.addColorStop(0.75, '#cbd5e1');
  grad.addColorStop(1, '#1e293b');

  ctx.strokeStyle = grad;
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 0.55, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Brilho interno
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, r - 4, (r - 4) * 0.55, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function buildFront(photoImg: HTMLImageElement | null): string {
  const [c, ctx] = makeCanvas();

  // ---------- FUNDO DO CRACHÁ (ESTILO REFERÊNCIA: OFF-WHITE / PRATA INDUSTRIAL) ----------
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#f9fafb');
  bg.addColorStop(0.5, '#f1f5f9');
  bg.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Micro-grade pontilhada/técnica suave
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.04)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Borda perimetral técnica com margem interna de segurança
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.18)';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  // Marcas de corte / miras nos cantos (Crosshairs)
  const drawCross = (x: number, y: number) => {
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x + 10, y);
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y + 10);
    ctx.stroke();
  };
  drawCross(54, 54);
  drawCross(W - 54, 54);
  drawCross(54, H - 54);
  drawCross(W - 54, H - 54);

  // ---------- HEADER SUPERIOR ----------
  // Pill esquerdo: "SOFTWARE"
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(64, 110, 160, 44, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SOFTWARE', 144, 139);

  // Instituição à direita: "UNINOVAFAPI" / "EXÉRCITO BRASILEIRO"
  ctx.textAlign = 'right';
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 22px "Space Grotesk", sans-serif';
  ctx.fillText('UNINOVAFAPI', W - 64, 130);
  ctx.fillStyle = '#64748b';
  ctx.font = '700 14px "JetBrains Mono", monospace';
  ctx.fillText('EXÉRCITO BRASILEIRO', W - 64, 154);

  // ---------- TIPOGRAFIA HERO GIGANTE: "DEVELOPER" ----------
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 120px "Space Grotesk", sans-serif';
  ctx.fillText('DEVELOPER', W / 2, 295);

  // ---------- FOTO CENTRAL COM POSTER FRAME & RECORTE ----------
  const pw = 480;
  const ph = 600;
  const px = (W - pw) / 2;
  const py = 295;

  // Moldura escura posterior da foto (com cantos retos técnicos e borda de destaque)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px - 6, py - 6, pw + 12, ph + 12);

  // Fundo interno da foto
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(px, py, pw, ph);

  if (photoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph);
    ctx.clip();

    // Enquadramento focado na face, sorriso e tronco com a nova foto
    const srcW = photoImg.width;
    const srcH = Math.min(photoImg.height, photoImg.width * (ph / pw));
    ctx.drawImage(photoImg, 0, 0, srcW, srcH, px, py, pw, ph);
    ctx.restore();
  }

  // Linhas de foco técnico sobre a foto
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(px + 10, py + 10, pw - 20, ph - 20);

  // ---------- NAMETAG FRONTAL NA FOTO (IDÊNTICO À REFERÊNCIA) ----------
  const tagW = 440;
  const tagH = 58;
  const tagX = (W - tagW) / 2;
  const tagY = py + ph - 64;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(tagX, tagY, tagW, tagH);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(tagX, tagY, tagW, tagH);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 30px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HELTON JUNIOR', W / 2, tagY + 40);

  // ---------- TEXTO VERTICAL ROTACIONADO À DIREITA (IDÊNTICO À REFERÊNCIA) ----------
  ctx.save();
  ctx.translate(W - 68, 600);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 44px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CIÊNCIA DA COMPUTAÇÃO', 0, 0);
  ctx.restore();

  // ---------- SEÇÃO INFERIOR: "PORTFOLIO" & QUOTE ----------
  // Palavra "PORTFOLIO" em destaque gigante à esquerda
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 68px "Space Grotesk", sans-serif';
  ctx.fillText('PORTFOLIO', 64, 1010);

  // Cápsula de lema/motto à direita: "((( Soluções com Rigor & Precisão )))"
  ctx.textAlign = 'right';
  ctx.fillStyle = '#334155';
  ctx.font = '700 17px "JetBrains Mono", monospace';
  ctx.fillText('((( Rigor, Precisão & Código )))', W - 64, 995);

  // Linha divisória técnica
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(64, 1045);
  ctx.lineTo(W - 64, 1045);
  ctx.stroke();

  // Código de barras industrial
  drawBarcode(ctx, 64, 1070, W - 128, 56);

  // Metadados técnicos do rodapé
  ctx.textAlign = 'left';
  ctx.fillStyle = '#475569';
  ctx.font = '700 17px "JetBrains Mono", monospace';
  ctx.fillText('ID: EB-2026-CC // FULL STACK • AI • INFRASTRUCTURE', 64, 1160);

  ctx.textAlign = 'right';
  ctx.fillText('TERESINA, PI — BRASIL', W - 64, 1160);

  // URL LinkedIn discreta
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748b';
  ctx.font = '600 18px "JetBrains Mono", monospace';
  ctx.fillText('linkedin.com/in/heltonj866', W / 2, 1375);

  // ---------- DETALHES VISUAIS EM CROMO 3D NOS CANTOS INFERIORES ----------
  drawChromeRing(ctx, 80, 1260, 68, -0.4);
  drawChromeRing(ctx, W - 80, 1260, 68, 0.4);

  return c.toDataURL('image/png');
}

function buildBack(): string {
  const [c, ctx] = makeCanvas();

  // Fundo off-white com acabamento industrial
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#f9fafb');
  bg.addColorStop(0.5, '#f1f5f9');
  bg.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Borda perimetral técnica
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.18)';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  // Faixa superior preta sólida
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(36, 60, W - 72, 90);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 24px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('IDENTIFICAÇÃO PROFISSIONAL & CONTATOS', W / 2, 115);

  // QR Code central de alta precisão
  drawQr(ctx, W / 2 - 210, 240, 420, 9);

  ctx.fillStyle = '#0f172a';
  ctx.font = '800 34px "Space Grotesk", sans-serif';
  ctx.fillText('Escaneie para Conectar', W / 2, 740);

  ctx.fillStyle = '#475569';
  ctx.font = '600 22px "Inter", sans-serif';
  ctx.fillText('LinkedIn  •  GitHub  •  WhatsApp', W / 2, 785);

  // Linha divisória
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 835);
  ctx.lineTo(W - 80, 835);
  ctx.stroke();

  // Título Tech Stack
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 22px "JetBrains Mono", monospace';
  ctx.fillText('// PRINCIPAIS TECNOLOGIAS', W / 2, 885);

  // Chips industriais para Tech Stack
  const tagsRow1 = ['Python', 'TypeScript', 'Laravel'];
  const tagsRow2 = ['React', 'PostgreSQL', 'Docker'];

  const drawRow = (tags: string[], y: number) => {
    ctx.font = '700 22px "JetBrains Mono", monospace';
    const totalW = tags.reduce((acc, t) => acc + ctx.measureText(t).width + 56, 0) + (tags.length - 1) * 16;
    let startX = (W - totalW) / 2;

    tags.forEach((t) => {
      const tw = ctx.measureText(t).width + 56;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(startX, y - 34, tw, 50, 8);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.fillText(t, startX + tw / 2, y + 2);
      startX += tw + 16;
    });
  };

  drawRow(tagsRow1, 955);
  drawRow(tagsRow2, 1025);

  // Barcode de autenticidade no verso
  drawBarcode(ctx, 80, 1120, W - 160, 45);

  // Rodapé institucional
  ctx.textAlign = 'center';
  ctx.fillStyle = '#475569';
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText('Centro Universitário Uninovafapi // Exército Brasileiro', W / 2, 1230);
  ctx.fillStyle = '#64748b';
  ctx.font = '500 16px "JetBrains Mono", monospace';
  ctx.fillText('Teresina, PI — Brasil  •  ID 2026-HJ', W / 2, 1265);

  return c.toDataURL('image/png');
}

// Cordão personalizado (Strap) idêntico à referência: tecido preto com texto branco em repetição
function buildStrap(): string {
  const along = 1536;
  const across = 192;
  const c = document.createElement('canvas');
  c.width = along;
  c.height = across;
  const ctx = c.getContext('2d')!;

  // Trama sólida do cordão preto
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, along, across);

  // Filetes brancos elegantes nas bordas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 12, along, 4);
  ctx.fillRect(0, across - 16, along, 4);

  // Tipografia do cordão (idêntica à referência: nome limpo em repetição)
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 66px "Space Grotesk", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  const parts = ['Helton Junior', 'Software Engineer', 'Helton Junior', 'Computer Science'];
  const sep = 60;
  const widths = parts.map((p) => ctx.measureText(p).width);
  const total = widths.reduce((a, b) => a + b, 0) + sep * parts.length;
  const scale = Math.min(1, (along - 40) / total);
  ctx.save();
  ctx.scale(scale, 1);
  let x = 20 / scale;
  parts.forEach((p, i) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillText(p, x, across / 2 + 2);
    x += widths[i];
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(x + sep / 2, across / 2 + 2, 7, 0, Math.PI * 2);
    ctx.fill();
    x += sep;
  });
  ctx.restore();
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
      '800 20px "JetBrains Mono"',
      '900 120px "Space Grotesk"',
      '900 30px "Space Grotesk"',
      '900 44px "Space Grotesk"',
      '900 68px "Space Grotesk"'
    ];

    Promise.all([
      ...fonts.map((f) => document.fonts.load(f)),
      loadImage('/helton.jpg')
    ]).then(([_, __, ___, ____, _____, photoImg]) => {
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
          cardColor="#0a0a0e"
          finish="glossy"
          cornerRadius={0.3}
          anchor={full ? 'right' : 'center'}
          size={full ? 0.5 : 0.62}
          strapLength={full ? 0.6 : 0.5}
          strapColor="#0a0a0c"
          strapWidth={0.75}
          metal="silver"
          gravity={1}
          damping={0.5}
          elasticity={0.5}
          breeze={0.4}
        />
      )}
    </div>
  );
};
