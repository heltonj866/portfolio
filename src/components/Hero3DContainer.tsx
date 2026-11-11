import React, { useEffect, useState } from 'react';
import { Lanyard3D } from './Lanyard3D';
import { Terminal3D } from './Terminal3D';

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isDesktop;
}

export const Hero3DContainer: React.FC = () => {
  const [mode, setMode] = useState<'lanyard' | 'terminal'>('lanyard');
  const isDesktop = useIsDesktop();

  const tabClass = (active: boolean) =>
    `flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
      active
        ? 'bg-white text-black shadow-[0_0_14px_rgba(255,255,255,0.2)] font-semibold'
        : 'text-slate-400 hover:text-white'
    }`;

  return (
    <>
      {/* No desktop, o crachá ocupa toda a seção Hero e a fita nasce no topo da tela. */}
      {mode === 'lanyard' && isDesktop && <Lanyard3D variant="full" />}

      <div className="w-full flex flex-col items-center lg:absolute lg:bottom-8 lg:left-[73%] lg:w-auto lg:-translate-x-1/2 lg:z-20">
        <div className="z-20 flex items-center p-1 rounded-full bg-zinc-900/90 border border-white/15 shadow-xl backdrop-blur-md">
          <button type="button" onClick={() => setMode('lanyard')} className={tabClass(mode === 'lanyard')}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="3" strokeWidth="2" />
              <circle cx="9" cy="10" r="2" strokeWidth="2" />
              <path d="M15 8h2M15 12h2M7 16h10" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Credencial 3D</span>
          </button>
          <button type="button" onClick={() => setMode('terminal')} className={tabClass(mode === 'terminal')}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 17l6-6-6-6M12 19h8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Terminal 3D</span>
          </button>
        </div>
        {mode === 'lanyard' && (
          <p className="mt-2 text-[11px] font-mono text-slate-400 text-center">
            Arraste para balançar • Clique para virar
          </p>
        )}
      </div>

      {mode === 'lanyard' && !isDesktop && <Lanyard3D variant="inline" />}
      {mode === 'terminal' && <Terminal3D />}
    </>
  );
};
