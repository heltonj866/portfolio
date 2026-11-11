import React, { useState, useEffect, useRef } from 'react';

const sanitizedTerminalLines = [
  { prompt: 'helton@arch:~$', cmd: 'php artisan iuris:tenant-migrate --subdomain="advocacia-silva"' },
  { out: '>> [IURIS SaaS] Schema PostgreSQL isolado com sucesso para tenant.', color: 'text-slate-300' },
  { out: '>> [AUTH & RBAC] Permissões granulares e roles inicializadas.', color: 'text-emerald-400' },
  { prompt: 'helton@arch:~$', cmd: 'python -m sismil.core --verify-deadlines --compliance' },
  { out: '>> [SISMIL] 100% dos prazos regulamentares em conformidade (Zero extravios).', color: 'text-emerald-400' },
  { prompt: 'helton@arch:~$', cmd: 'python -m finance_bot.etl --channel="whatsapp-webhook" --run' },
  { out: '>> [ETL] 240 transações conciliadas via webhook assíncrono em 42.1ms.', color: 'text-slate-200' },
  { prompt: 'helton@arch:~$', cmd: 'docker compose ps --services --filter "status=running"' },
  { out: '>> sismil-app (healthy) | iuris-saas (healthy) | postgres-cluster (healthy)', color: 'text-slate-300' },
  { prompt: 'helton@arch:~$', cmd: 'uptime && free -h' },
  { out: '>> up 42 days | Mem: 3.4Gi / 16Gi | Load avg: 0.12, 0.08, 0.02', color: 'text-slate-400' }
];

export const Terminal3D: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => (prev < sanitizedTerminalLines.length ? prev + 1 : 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setTilt({ x: y * 12, y: x * 15 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[480px] sm:h-[560px] flex items-center justify-center p-4 select-none perspective-[1200px]"
    >
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out'
        }}
        className="relative w-full max-w-lg rounded-2xl glass-panel border border-white/15 bg-black/90 shadow-2xl overflow-hidden backdrop-blur-2xl transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
      >
        {/* Terminal Header Bar */}
        <div className="px-4 py-3 bg-zinc-950/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
            <span className="ml-2 font-mono text-xs text-slate-400 font-medium tracking-tight">
              helton@workstation: ~/workspace
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SYS ONLINE
            </span>
          </div>
        </div>

        {/* System Sub-bar */}
        <div className="px-4 py-1.5 bg-black/70 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>CPU: <strong className="text-white">2.4%</strong></span>
            <span>MEM: <strong className="text-white">21%</strong></span>
            <span>ENV: <strong className="text-slate-300">Linux x86_64</strong></span>
          </div>
          <span className="text-slate-500 font-mono text-[10px]">BASH 5.2</span>
        </div>

        {/* Console Body */}
        <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200 h-80 overflow-y-auto space-y-2.5">
          {sanitizedTerminalLines.slice(0, visibleCount).map((line, idx) => (
            <div key={idx} className="animate-fadeIn">
              {line.prompt ? (
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 font-semibold">{line.prompt}</span>
                  <span className="text-white font-medium">{line.cmd}</span>
                </div>
              ) : (
                <div className={`pl-2 ${line.color} font-normal tracking-wide`}>
                  {line.out}
                </div>
              )}
            </div>
          ))}

          {/* Typing Cursor */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-slate-400 font-semibold">helton@arch:~$</span>
            <span className="w-2.5 h-4 bg-white animate-pulse inline-block"></span>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-zinc-950/90 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 text-[10px]">Laravel</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 text-[10px]">React</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 text-[10px]">Python</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 text-[10px]">Docker</span>
          </div>
          <span className="text-slate-500 text-[10px] font-mono">3D TILT ENABLED</span>
        </div>
      </div>
    </div>
  );
};
