export interface Project {
  id: string;
  title: string;
  category: 'Sistema Corporativo' | 'Automação & IA' | 'SaaS & Web';
  shortDesc: string;
  fullDesc: string;
  impact: string;
  tags: string[];
  features: string[];
  architecture: string;
  githubUrl?: string;
  liveUrl?: string;
  badge: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  deliverables: string[];
  techs: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  type: 'professional' | 'academic';
}

export interface TechItem {
  name: string;
  category: 'Backend & Linguagens' | 'Automação & IA' | 'Infraestrutura & Redes' | 'Bancos de Dados & DevOps';
  level: 'Avançado' | 'Proficiente' | 'Intermediário';
  highlight?: boolean;
}

export const portfolioData = {
  personal: {
    fullName: "Helton Junior",
    displayName: "Helton Junior",
    title: "Ciência da Computação | Engenharia de Software | Automação com IA & Infraestrutura",
    location: "Teresina, PI — Brasil",
    email: "heltonj866@gmail.com",
    whatsapp: "+55 86 99492-2976",
    whatsappLink: "https://wa.me/5586994922976?text=Ol%C3%A1%20Helton,%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!",
    linkedin: "https://linkedin.com/in/heltonj866",
    github: "https://github.com/heltonj866",
    roles: [
      "Acadêmico de Ciência da Computação",
      "Desenvolvedor de Software Full Stack",
      "Especialista em Automação & IA",
      "Analista de Infraestrutura & TI"
    ],
    bioShort: "Mais de 5 anos de atuação sólida no Exército Brasileiro unindo engenharia de software corporativo, plataformas SaaS escaláveis, automação inteligente e infraestrutura de alta confiabilidade.",
    bioFull: "Acadêmico de Ciência da Computação com perfil técnico e analítico voltado a Desenvolvimento de Software Corporativo, Arquiteturas SaaS Multi-Tenant, Automação de Processos com Inteligência Artificial e Infraestrutura de TI. Experiência de mais de 5 anos no Exército Brasileiro atuando na concepção e sustentação de sistemas críticos, suporte e segurança de redes locais, manutenção de hardware e conformidade rigorosa de fluxos regulamentares. Especialista em identificar gargalos operacionais e construir ferramentas computacionais modernas que asseguram confiabilidade, sigilo e escalabilidade."
  },

  stats: [
    { value: "5+ Anos", label: "Experiência em TI & Exército", detail: "Infraestrutura crítica, segurança e processos corporativos" },
    { value: "3", label: "Sistemas em Produção", detail: "Sismil, IURIS SaaS e Automação Financeira" },
    { value: "Full Stack", label: "Engenharia de Software", detail: "APIs robustas, bancos relacionais e interfaces modernas" },
    { value: "100%", label: "Confiabilidade & Sigilo", detail: "Foco em conformidade, precisão e estabilidade contínua" }
  ],

  services: [
    {
      id: "saas-corporate",
      number: "01",
      title: "Sistemas Corporativos & Plataformas SaaS sob Medida",
      category: "Software Engineering",
      description: "Concepção completa de ponta a ponta: do levantamento minucioso de regras de negócio ao deploy final em produção. Painéis administrativos de alto desempenho, isolamento multi-tenant (por subdomínio), controle granular de permissões (RBAC) e auditoria transparente.",
      deliverables: [
        "Arquitetura Multi-Tenant com isolamento estrito de dados por cliente",
        "Controle de acesso hierárquico por perfis e permissões granulares (RBAC)",
        "Dashboards analíticos reativos em tempo real com relatórios gerenciais",
        "Trilhas de auditoria (audit trail) e conformidade com dados sensíveis"
      ],
      techs: ["Laravel / PHP", "React / Vite", "TypeScript", "Tailwind CSS", "PostgreSQL", "Docker"]
    },
    {
      id: "automation-ai",
      number: "02",
      title: "Automação Inteligente de Processos & Integração com IA",
      category: "AI & Automation",
      description: "Transformação de fluxos operacionais morosos em esteiras automáticas sem atrito. Criação de agentes inteligentes, bots integrados a WhatsApp e Telegram, rotinas de conciliação bancária e pipelines de ingestão de documentos.",
      deliverables: [
        "Assistentes e bots inteligentes conectados a WhatsApp e canais corporativos",
        "Extração automatizada de dados de relatórios, planilhas e extratos bancários",
        "Mecanismos de alerta proativo para prazos regulamentares e eventos críticos",
        "Pipelines de ETL com processamento em background assíncrono"
      ],
      techs: ["Python", "FastAPI / Flask", "Pandas", "Webhooks WhatsApp", "LangChain / LLMs"]
    },
    {
      id: "infra-networks",
      number: "03",
      title: "Infraestrutura de TI, Redes Locais & Servidores Linux",
      category: "Infrastructure & Security",
      description: "Sustentação de ambientes computacionais seguros, rápidos e resilientes. Configuração de servidores corporativos Linux e Windows Server, segmentação de redes locais, firewall, políticas de acesso e diagnóstico elétrico/lógico avançado de hardware.",
      deliverables: [
        "Implementação e gerenciamento de servidores Linux e Windows Server / AD",
        "Configuração de redes locais corporativas, roteamento seguro e firewalls",
        "Políticas de backup automatizado, redundância e planos de contingência",
        "Diagnóstico avançado de falhas em hardware e suporte a estações de trabalho"
      ],
      techs: ["Linux (Debian/Ubuntu)", "Windows Server", "Firewalls / IPTables", "Redes Estruturadas", "Hardware"]
    },
    {
      id: "apis-databases",
      number: "04",
      title: "Arquitetura de APIs, Integrações & Modelagem de Bancos de Dados",
      category: "Backend & Data",
      description: "Construção de APIs RESTful estruturadas, seguras e bem documentadas para conectar plataformas distintas. Modelagem relacional normalizada, otimização de consultas e conciliação de transações com integridade garantida.",
      deliverables: [
        "Desenvolvimento de APIs RESTful seguras com autenticação JWT / OAuth2",
        "Modelagem relacional de bancos de dados PostgreSQL e MySQL de alta performance",
        "Integração bidirecional de webhooks com serviços externos e meios de pagamento",
        "Otimização de consultas lentas, indexação estratégica e migrações seguras"
      ],
      techs: ["PostgreSQL", "MySQL", "RESTful APIs", "Webhooks", "Prisma / Eloquent", "Git"]
    }
  ] as ServiceItem[],

  processSteps: [
    {
      step: "01",
      title: "Diagnóstico & Requisitos",
      description: "Imersão técnica no problema operacional, mapeamento de regras regulamentares, gargalos e definição de métricas de sucesso.",
      deliverable: "Documento de Escopo & Arquitetura Inicial"
    },
    {
      step: "02",
      title: "Modelagem & Arquitetura",
      description: "Estruturação de bancos relacionais, diagramação de fluxos de dados, isolamento de segurança e prototipagem de interfaces intuitivas.",
      deliverable: "Schema de Dados & Wireframes Aprovados"
    },
    {
      step: "03",
      title: "Engenharia & Testes",
      description: "Desenvolvimento modular com código limpo, cobertura de testes de consistência, conformidade com padrões e validação iterativa.",
      deliverable: "Código Homologado em Ambiente de Staging"
    },
    {
      step: "04",
      title: "Deploy & Sustentação",
      description: "Implantação em produção automatizada via Docker/CI-CD, monitoramento contínuo, documentação técnica e transferência de conhecimento.",
      deliverable: "Sistema em Produção com Alta Disponibilidade"
    }
  ] as ProcessStep[],

  projects: [
    {
      id: "sismil",
      title: "Sismil — Sistema de Gestão de Pessoal e Administração",
      category: "Sistema Corporativo",
      badge: "Produção Institucional",
      shortDesc: "Plataforma corporativa completa para modernização e centralização de controle administrativo e efetivo militar.",
      fullDesc: "Idealizado e desenvolvido para suprir a necessidade de centralização dos registros funcionais de efetivo, controle de recompensas e cumprimento de prazos regulamentares. O sistema substituiu controles manuais por fluxos automatizados com alertas proativos e relatórios analíticos auditáveis.",
      impact: "Eliminação de extravio de prazos e redução de 80% no tempo gasto na confecção de pareceres e relatórios de efetivo.",
      tags: ["Python", "Flask", "SQLite/PostgreSQL", "JavaScript", "Bootstrap/Tailwind", "Docker"],
      features: [
        "Módulo inteligente de alertas preventivos de prazos regulamentares",
        "Histórico funcional unificado de cada militar/servidor",
        "Critérios parametrizados para concessão de recompensas e honrarias",
        "Geração automatizada de pareceres técnicos e formulários padronizados",
        "Controle de acesso granular por níveis de permissão hierárquica"
      ],
      architecture: "Arquitetura MVC com camada de persistência em ORM, autenticação baseada em sessão segura e módulo de background tasks para auditoria de prazos."
    },
    {
      id: "iuris",
      title: "IURIS — Plataforma SaaS Multi-Tenant para Escritórios de Advocacia",
      category: "SaaS & Web",
      badge: "SaaS Multi-Tenant",
      shortDesc: "Sistema jurídico corporativo completo com isolamento tenant-by-subdomain, gestão processual, financeiro e automação WhatsApp.",
      fullDesc: "Plataforma SaaS corporativa desenvolvida para digitalização e gestão integral de escritórios de advocacia. Implementa isolamento rigoroso de inquilinos (multi-tenancy por subdomínio), controle de acesso baseado em papéis (RBAC), auditoria completa (audit trail com soft deletes), CRM jurídico, agenda com prazos processuais e integração assíncrona de notificações via WhatsApp.",
      impact: "Isolamento multi-empresa com 100% de conformidade de dados, automação de avisos de audiências e redução drástica no tempo de triagem jurídica.",
      tags: ["Laravel / PHP", "React / Vite", "TypeScript", "Tailwind CSS", "PostgreSQL", "Webhooks WhatsApp", "Docker"],
      features: [
        "Arquitetura Multi-Tenant isolada por subdomínio com migrações seguras",
        "Controle granular de acessos e permissões (RBAC: Administrador, Advogado, Financeiro, Secretária)",
        "Gestão completa de Processos, Prazos e Clientes com histórico de movimentações",
        "Módulo Financeiro com conciliação de honorários, despesas e emissão de cobranças",
        "Integração com Webhooks WhatsApp para notificações automáticas de audiências e prazos",
        "Trilhas de auditoria transparentes e conformidade rigorosa com dados sensíveis"
      ],
      architecture: "Arquitetura desacoplada: Backend RESTful robusto com Laravel e PostgreSQL, Frontend SPA reativo em React + TypeScript + Tailwind, e mensageria assíncrona para webhooks."
    },
    {
      id: "bot-financeiro",
      title: "Bot de Gestão & Automação Financeira",
      category: "Automação & IA",
      badge: "Automação com IA",
      shortDesc: "Sistema integrado para consolidação, categorização e conciliação de transações financeiras com painel analítico.",
      fullDesc: "Plataforma integrada com backend Python para importar extratos, classificar despesas automaticamente por meio de regras de inteligência artificial e heurísticas textuais, oferecendo visão clara de fluxo de caixa e relatórios consolidados em tempo real.",
      impact: "Automação completa do processamento de movimentações financeiras e acompanhamento gráfico de balanços operacionais.",
      tags: ["Python", "Flask", "RESTful APIs", "Chart.js", "Pandas", "Processamento de Dados"],
      features: [
        "Extração e parsing de extratos bancários (OFX, CSV, Excel)",
        "Motor de categorização inteligente baseado em padrões de texto",
        "Dashboard visual interativo com evolução de despesas e receitas",
        "Relatórios executivos periódicos em PDF gerados sob demanda"
      ],
      architecture: "Pipeline de ETL (Extração, Transformação e Carga) com banco relacional e interface REST consumida por dashboard reativo."
    }
  ] as Project[],

  experiences: [
    {
      role: "Analista de Suporte, Infraestrutura e TI / Gestão Administrativa",
      company: "Exército Brasileiro",
      period: "08/2021 – Presente",
      location: "Teresina, PI",
      description: "Atuação central no desenvolvimento de software corporativo, administração de redes de computadores, suporte técnico avançado a usuários e condução de processos administrativos institucionais com elevado padrão de sigilo e rigor formal.",
      achievements: [
        "Idealizou, desenvolveu e implantou o Sismil, sistema corporativo utilizado ativamente na rotina diária da organização militar.",
        "Desenvolveu automações de rotinas administrativas mitigando retrabalho manual e extravio de prazos regulamentares.",
        "Gerenciamento e manutenção preventiva/corretiva de computadores, impressoras corporativas e servidores de arquivos locais.",
        "Implementação de políticas de segurança de rede, firewall e diagnóstico de falhas em infraestrutura física e lógica.",
        "Elaboração de pareceres técnicos, instrução de processos administrativos (Sindicâncias) e controle estrito de prazos legais."
      ],
      type: "professional"
    },
    {
      role: "Bacharelado em Ciência da Computação",
      company: "Centro Universitário Uninovafapi",
      period: "2024 – 2028 (Em andamento)",
      location: "Teresina, PI",
      description: "Formação sólida em fundamentos de computação, estruturas de dados, projeto de algoritmos, engenharia de software e arquiteturas modernas de sistemas.",
      achievements: [
        "Engenharia de Software, Padrões de Projeto e Arquitetura de Microsserviços",
        "Organização, Arquitetura de Computadores e Sistemas Operacionais",
        "Redes de Computadores, Protocolos de Roteamento e Segurança da Informação",
        "Modelagem Relacional Avançada, Otimização de Consultas SQL e Bancos de Dados"
      ],
      type: "academic"
    }
  ] as Experience[],

  techStack: [
    { name: "Python", category: "Backend & Linguagens", level: "Avançado", highlight: true },
    { name: "JavaScript / TypeScript", category: "Backend & Linguagens", level: "Avançado", highlight: true },
    { name: "PHP / Laravel", category: "Backend & Linguagens", level: "Avançado", highlight: true },
    { name: "React / Vite", category: "Backend & Linguagens", level: "Avançado", highlight: true },
    { name: "Node.js", category: "Backend & Linguagens", level: "Proficiente", highlight: true },
    { name: "Flask & FastAPI", category: "Backend & Linguagens", level: "Avançado", highlight: true },
    { name: "APIs RESTful & Webhooks", category: "Backend & Linguagens", level: "Avançado", highlight: true },

    { name: "Automação com IA / LLMs", category: "Automação & IA", level: "Avançado", highlight: true },
    { name: "Pandas & Análise de Dados", category: "Automação & IA", level: "Avançado", highlight: true },
    { name: "Algoritmos & Heurísticas", category: "Automação & IA", level: "Proficiente", highlight: true },
    { name: "Automação de Scripts", category: "Automação & IA", level: "Avançado", highlight: true },
    { name: "Bots WhatsApp / Webhooks", category: "Automação & IA", level: "Avançado", highlight: true },

    { name: "Administração Linux", category: "Infraestrutura & Redes", level: "Avançado", highlight: true },
    { name: "Windows Server / AD", category: "Infraestrutura & Redes", level: "Avançado", highlight: true },
    { name: "Redes Locais & Firewalls", category: "Infraestrutura & Redes", level: "Avançado", highlight: true },
    { name: "Diagnóstico de Hardware", category: "Infraestrutura & Redes", level: "Avançado", highlight: true },
    { name: "Segurança & Conformidade", category: "Infraestrutura & Redes", level: "Avançado", highlight: true },

    { name: "PostgreSQL & SQLite", category: "Bancos de Dados & DevOps", level: "Avançado", highlight: true },
    { name: "Modelagem Relacional (SQL)", category: "Bancos de Dados & DevOps", level: "Avançado", highlight: true },
    { name: "Git & GitHub", category: "Bancos de Dados & DevOps", level: "Avançado", highlight: true },
    { name: "Docker & Containers", category: "Bancos de Dados & DevOps", level: "Proficiente", highlight: true },
    { name: "CI/CD & Cloud Deploy", category: "Bancos de Dados & DevOps", level: "Intermediário" }
  ] as TechItem[]
};
