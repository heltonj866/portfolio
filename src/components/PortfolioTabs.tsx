import React, { useState } from 'react';
import { portfolioData, type Project } from '../data/portfolioData';

// Visual preview banner for each project (Apple Black & Silver Glassmorphism)
const ProjectBanner: React.FC<{ id: string }> = ({ id }) => {
  if (id === 'sismil') {
    return (
      <div className="relative w-full h-36 rounded-2xl bg-[#090b10] p-4 border border-white/10 overflow-hidden mb-5 flex flex-col justify-between group-hover:border-white/25 transition-colors">
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
            <span className="ml-2 font-mono text-[10px] text-slate-400">sismil.core.eb.mil.br</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-400/25 text-[10px] font-mono text-emerald-300">
            ONLINE // PROD
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-300 z-10 space-y-1">
          <div className="text-white font-medium">&gt; Gestão Funcional Militar &amp; Prazos</div>
          <div className="text-slate-400 text-[10px] flex items-center gap-2">
            <span>● Permissões RBAC</span>
            <span>● Auditoria Ativa</span>
            <span>● PostgreSQL</span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </div>
    );
  }

  if (id === 'iuris') {
    return (
      <div className="relative w-full h-36 rounded-2xl bg-[#090b10] p-4 border border-white/10 overflow-hidden mb-5 flex flex-col justify-between group-hover:border-white/25 transition-colors">
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
            <span className="ml-2 font-mono text-[10px] text-slate-400">advocacia-silva.iuris.law.br</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-[10px] font-mono text-slate-200">
            SaaS MULTI-TENANT
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-300 z-10 space-y-1">
          <div className="text-white font-medium">&gt; Gestão Jurídica, Prazos &amp; WhatsApp</div>
          <div className="text-slate-400 text-[10px] flex items-center gap-2">
            <span>● Multi-Tenancy Subdomínio</span>
            <span>● Webhooks</span>
            <span>● Laravel + React</span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </div>
    );
  }

  // bot-financeiro
  return (
    <div className="relative w-full h-36 rounded-2xl bg-[#090b10] p-4 border border-white/10 overflow-hidden mb-5 flex flex-col justify-between group-hover:border-white/25 transition-colors">
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
          <span className="ml-2 font-mono text-[10px] text-slate-400">finance::etl-pipeline</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-[10px] font-mono text-slate-200">
          AUTOMAÇÃO IA
        </span>
      </div>
      <div className="flex items-end gap-2 h-10 z-10 px-2 my-auto">
        <div className="w-1/6 bg-slate-700 hover:bg-slate-500 rounded-t h-4 transition-all"></div>
        <div className="w-1/6 bg-slate-500 hover:bg-slate-300 rounded-t h-7 transition-all"></div>
        <div className="w-1/6 bg-slate-600 hover:bg-slate-400 rounded-t h-5 transition-all"></div>
        <div className="w-1/6 bg-white hover:bg-slate-200 rounded-t h-9 transition-all"></div>
        <div className="w-1/6 bg-slate-500 hover:bg-slate-300 rounded-t h-6 transition-all"></div>
        <div className="w-1/6 bg-emerald-400 hover:bg-emerald-300 rounded-t h-10 transition-all"></div>
      </div>
      <div className="font-mono text-[10px] text-slate-400 z-10 flex items-center justify-between">
        <span>Conciliação Automática</span>
        <span className="text-slate-300">Python + REST</span>
      </div>
      <div className="absolute bottom-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
    </div>
  );
};

export const PortfolioTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'stack'>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="w-full">
      {/* Segmented Pill Tabs Navigation (Zero Emojis, Apple Silver Pill) */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1.5 rounded-full bg-zinc-900/90 border border-white/15 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'projects'
                ? 'bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>Projetos em Destaque ({portfolioData.projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stack')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'stack'
                ? 'bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Tech Stack &amp; Habilidades</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {portfolioData.projects.map((project) => (
            <article
              key={project.id}
              className="glass-panel rounded-3xl p-6 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div>
                {/* Visual Preview Graphic */}
                <ProjectBanner id={project.id} />

                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 text-[11px] font-mono font-semibold">
                    {project.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 text-[10px] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {project.badge}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="font-heading font-bold text-xl text-white group-hover:text-slate-200 transition-colors mb-2.5 leading-snug">
                  {project.title}
                </h3>

                {/* Short Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 text-justify">
                  {project.shortDesc}
                </p>

                {/* Impact Highlight Box */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-4 shadow-inner">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold block mb-1">
                    // Impacto Operacional:
                  </span>
                  <span className="text-xs text-slate-200 leading-snug font-medium">
                    {project.impact}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black text-xs font-semibold border border-white/15 shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Ver Detalhes da Arquitetura</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </article>
          ))}
        </div>
      )}

      {/* TAB 2: TECH STACK */}
      {activeTab === 'stack' && (
        <div className="space-y-8">
          {(['Backend & Linguagens', 'Automação & IA', 'Infraestrutura & Redes', 'Bancos de Dados & DevOps'] as const).map(
            (category) => {
              const items = portfolioData.techStack.filter((t) => t.category === category);
              return (
                <div key={category} className="glass-panel rounded-3xl p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                    <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                      <span>{category}</span>
                    </h3>
                    <span className="font-mono text-xs text-slate-400">{items.length} competências</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {items.map((tech) => (
                      <div
                        key={tech.name}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 flex flex-col justify-between gap-2.5 transition-all group hover:scale-[1.02] hover:shadow-lg"
                      >
                        <span className="font-semibold text-slate-100 text-xs sm:text-sm group-hover:text-white transition-colors">
                          {tech.name}
                        </span>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span className="text-slate-300">{tech.level}</span>
                          {tech.highlight && (
                            <span className="text-[10px] text-slate-200 font-mono px-2 py-0.5 rounded-full bg-white/10 border border-white/20 font-semibold">
                              Destaque
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* MODAL: PROJECT DETAILS */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 bg-[#07070a] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
              <div>
                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 text-[11px] font-mono font-semibold">
                  {selectedProject.category}
                </span>
                <h3 className="font-heading font-bold text-2xl text-white mt-2">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Fechar detalhes"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-white/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 text-sm">
              <div>
                <h4 className="font-heading font-semibold text-slate-400 text-xs uppercase tracking-wider mb-1.5">
                  Visão Geral &amp; Desafio Resolvido
                </h4>
                <p className="text-slate-300 leading-relaxed text-justify">
                  {selectedProject.fullDesc}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="font-heading font-semibold text-slate-300 text-xs uppercase tracking-wider mb-1">
                  Impacto &amp; Ganho Operacional
                </h4>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {selectedProject.impact}
                </p>
              </div>

              <div>
                <h4 className="font-heading font-semibold text-slate-400 text-xs uppercase tracking-wider mb-2">
                  Funcionalidades Principais
                </h4>
                <ul className="space-y-2">
                  {selectedProject.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300 text-xs sm:text-sm">
                      <svg className="w-3.5 h-3.5 text-slate-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-heading font-semibold text-slate-400 text-xs uppercase tracking-wider mb-1.5">
                  Arquitetura de Software
                </h4>
                <p className="text-slate-300 leading-relaxed font-mono text-xs bg-black/60 p-3.5 rounded-xl border border-white/10">
                  {selectedProject.architecture}
                </p>
              </div>

              <div>
                <h4 className="font-heading font-semibold text-slate-400 text-xs uppercase tracking-wider mb-2">
                  Tecnologias Utilizadas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-semibold text-xs transition-all shadow-sm"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
