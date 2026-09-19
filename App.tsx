import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Award, 
  Calendar, 
  FileText, 
  Briefcase, 
  Scale, 
  BookOpen, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  Star, 
  ChevronRight, 
  ChevronLeft,
  Quote,
  LayoutGrid,
  SlidersHorizontal,
  Lock,
  Sparkles, 
  Menu, 
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sun,
  Moon,
  Check,
  MessageCircle,
  Linkedin
} from 'lucide-react';

import { initAuth, googleSignIn, logout, getAccessToken, setAccessToken } from './firebase';
import { BookingCalendar } from './components/BookingCalendar';
import { DriveCabinet } from './components/DriveCabinet';
import { ForensicTools } from './components/ForensicTools';
import { VideoGenerator } from './components/VideoGenerator';
import { WorkspaceHub } from './components/WorkspaceHub';
import { ToastContainer } from './components/Toast';
import { EliteLogo } from './components/EliteLogo';
import { FAQAccordion } from './components/FAQAccordion';

import { PatientPortalOnHome } from './components/PatientPortalOnHome';
import { UserProfileSettings } from './components/UserProfileSettings';

interface Testimonial {
  id: number;
  author: string;
  role: string;
  category: 'juridico' | 'clinica';
  text: string;
  date: string;
  badge: string;
  rating: number;
  highlight: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author: "Dr. Arthur M.",
    role: "Advogado Sócio em Direito Civil & Indenizações",
    category: "juridico",
    text: "O laudo pericial complementar elaborado para nossa banca foi o fiel da balança em uma disputa cível de altíssima complexidade. A precisão científica em refutar queixas sem nexo causal e o rigor impecável na resposta aos nossos quesitos garantiram o acolhimento fundamentado pelo juiz sentenciante.",
    date: "Maio de 2026",
    badge: "Parceiro de Advocacia",
    rating: 5,
    highlight: "Precisão científica impecável e nexo causal indubitável."
  },
  {
    id: 2,
    author: "P. S., Engenheiro Aeroespacial",
    category: "clinica",
    role: "Paciente de Medicina Integrativa & Funcional",
    text: "Após meses peregrinando por pronto-atendimentos que tratavam apenas meus sintomas de fadiga extrema de maneira superficial, a investigação molecular de base integrativa conduzida pela Dra. Joyce identificou e corrigiu minhas disfunções metabólicas celulares. Minha qualidade de vida diária renasceu.",
    date: "Março de 2026",
    badge: "Paciente Clínico",
    rating: 5,
    highlight: "Olhar investigativo avançado que mudou minha vida."
  },
  {
    id: 3,
    author: "Dra. Carolina F.",
    role: "Assessora Jurídica e Especialista em Responsabilidade Civil",
    category: "juridico",
    text: "Atuar em assistência técnica médica exige extrema destreza contra-argumentativa. O suporte intelectual oferecido pela Dra. Joyce, pautado na perfeita articulação doutrinária e conformidade total com a LGPD e o Código de Processo Civil, confereu a nossa tese defensiva uma solidez técnica irrefutável.",
    date: "Junho de 2026",
    badge: "Assistência Médica Premium",
    rating: 5,
    highlight: "Conformidade técnico-legal absoluta em sede civil."
  },
  {
    id: 4,
    author: "M. R., Executiva C-Level",
    category: "clinica",
    role: "Acompanhamento Preventivo & Alta Performance",
    text: "Buscava uma profissional de saúde soberana, capaz de planejar longevidade ativa sem cartilhas genéricas. A consulta minuciosa de quase duas horas e o mapeamento personalizado de marcadores preventivos me deram o direcionamento exato para conciliar imunidade excelente e alta performance executiva.",
    date: "Janeiro de 2026",
    badge: "Suporte Preventivo Integrado",
    rating: 5,
    highlight: "Planejamento de longevidade customizado e sem pressa."
  },
  {
    id: 5,
    author: "Dr. Felipe G.",
    role: "Advogado de Bancas Trabalhistas",
    category: "juridico",
    text: "O domínio analítico da Dra. Joyce sobre as escalas de avaliação de sequelas e o cômputo matemático da incapacidade física (como a aplicação criteriosa das tabelas de Dano Corporal) desarma argumentos infundados de supostas lesões ocupacionais. Um trabalho forense de extrema idoneidade.",
    date: "Fevereiro de 2026",
    badge: "Defesa Técnico-Forense",
    rating: 5,
    highlight: "Domínio analítico de incapacidades e dano corporal."
  },
  {
    id: 6,
    author: "T. B., Economista Sênior",
    category: "clinica",
    role: "Tratamento Integrado de Dor Crônica",
    text: "Enxergar o organismo humano como uma constelação integrada de fatores bioquímicos e físicos, e não apenas prescrever analgésicos genéricos, é a grande virtude da Dra. Joyce. O seu acolhimento empático e o direcionamento de rotina mudaram severamente minhas recorrências de enxaqueca.",
    date: "Abril de 2026",
    badge: "Cuidado de Alta Complexidade",
    rating: 5,
    highlight: "Acolhimento empático e melhora palpável de dor crônica."
  }
];

export const App: React.FC = () => {
  // Navigation / Custom App States
  const [activeTab, setActiveTab] = useState<'home' | 'booking' | 'cabinet' | 'simulator' | 'lawyers' | 'about' | 'connect'>('home');
  const [portalView, setPortalView] = useState<'dashboard' | 'profile'>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Dark Mode State
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Initialize Auth state on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessTokenState(token);
        setAuthLoading(false);
      },
      () => {
        setUser(null);
        setAccessTokenState(null);
        setAuthLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const response = await googleSignIn();
      if (response) {
        setUser(response.user);
        setAccessTokenState(response.accessToken);
        setActiveTab('home');
      }
    } catch (e) {
      console.error('Falha de login:', e);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setAccessTokenState(null);
    handleTabChange('home');
  };

  const handleTabChange = (tab: 'home' | 'booking' | 'cabinet' | 'simulator' | 'lawyers' | 'about' | 'connect') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Apple-like transition variables
  const animationVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  // Scroll Effects for Nav
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-stone-900 dark:text-stone-50 font-sans antialiased text-base selection:bg-[#C5B485]/30 transition-colors duration-300">
      
      {/* Toast Notifications container */}
      <ToastContainer />

      {/* Highly Interactive Floating WhatsApp Button (Elite Concierge Style) */}
      <div className="fixed bottom-6 right-6 z-[9990] flex items-center gap-3">
        <a
          href="https://wa.me/5527998134032?text=Olá%20Dra.%20Joyce,%20gostaria%20de%20saber%20mais%20sobre%20seus%20serviços."
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl hover:shadow-[#25D366]/20 transition-all duration-300 hover:scale-110 group cursor-pointer border border-[#25D366]/40"
          aria-label="Falar no WhatsApp"
        >
          {/* Pulsing ring indicator */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-pulse group-hover:scale-110 transition-all" />
          <span className="absolute -inset-3 rounded-full bg-[#C5B485] opacity-10 animate-ping pointer-events-none" />

          {/* Icon */}
          <MessageCircle size={25} className="fill-white text-[#25D366] relative z-10 transition-transform duration-500 group-hover:rotate-12" />
          
          {/* Slide-out tooltip to the LEFT */}
          <span className="absolute right-16 bg-stone-900/95 dark:bg-[#0A0A0A]/95 text-[#F5F5F0] border border-[#C5B485]/30 text-[10px] uppercase tracking-widest font-extrabold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 whitespace-nowrap shadow-xl pointer-events-none select-none flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-ping" />
            Fale com a Doutora
          </span>
        </a>
      </div>

      {/* ==================== GLOBAL PREMIUM MENU ==================== */}
      <nav 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-header py-2' : 'bg-transparent py-5'}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          
          {/* Logo Name */}
          <div 
            onClick={() => handleTabChange('home')}
            className="flex items-center cursor-pointer group"
          >
            <EliteLogo />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { id: 'home', label: 'Início' },
              { id: 'about', label: 'A Médica' },
              { id: 'booking', label: 'Pacientes' },
              { id: 'lawyers', label: 'Advogados' }
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`text-[11px] font-semibold uppercase tracking-[0.1em] transition-all relative py-1 ${
                    isSelected 
                      ? 'text-stone-900 dark:text-stone-100' 
                      : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                  }`}
                >
                  <span className="relative z-10">{tab.label}</span>
                  {isSelected && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5B485]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Login / Auth Control Panel & Dark Mode Toggle */}
          <div className="hidden md:flex items-center gap-4">
            {/* Quick Dark Mode Toggle (Desktop) */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all cursor-pointer active:scale-95"
              title={isDark ? "Modo Claro" : "Modo Escuro"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {authLoading ? (
              <span className="text-[10px] uppercase tracking-widest text-[#C5B485] font-semibold">...</span>
            ) : !user ? (
              <button
                onClick={handleSignIn}
                className="px-5 py-2.5 bg-stone-950 dark:bg-stone-50 text-white dark:text-stone-950 border-0 text-xs font-semibold uppercase tracking-widest transition-all hover:bg-stone-800 dark:hover:bg-stone-200 cursor-pointer"
              >
                Área Restrita
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right shrink-0">
                  <span className="text-xs font-serif font-semibold text-stone-900 dark:text-stone-100 block">{user.displayName}</span>
                  <span className="text-[9px] uppercase tracking-wider text-[#A1B886] font-semibold block">Conectado</span>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="h-8 w-8 rounded-full border border-stone-200 dark:border-stone-800 shrink-0" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-[#C5B485] text-white flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                    {user.email[0]}
                  </div>
                )}
                <button 
                  onClick={handleSignOut}
                  className="p-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white shrink-0 transition-all cursor-pointer"
                  title="Sair"
                >
                  <LogOut size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-stone-500 dark:text-stone-400 transition-all"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-900 dark:text-stone-100 transition-all"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white dark:bg-[#0A0A0A] border-b border-stone-100 dark:border-stone-900 overflow-hidden flex flex-col px-6 pb-6"
            >
              <div className="flex flex-col space-y-4 pt-4">
                {[
                  { id: 'home', label: 'Início' },
                  { id: 'about', label: 'A Médica' },
                  { id: 'booking', label: 'Agendar Consulta' },
                  { id: 'lawyers', label: 'Solicitar Laudo' },
                  { id: 'simulator', label: 'Ferramentas' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as any)}
                    className={`text-left text-sm font-semibold uppercase tracking-widest transition-all ${
                      activeTab === tab.id 
                        ? 'text-[#C5B485]' 
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 dark:border-stone-900">
                {!user ? (
                  <button
                    onClick={handleSignIn}
                    className="w-full py-3 bg-stone-950 dark:bg-stone-50 text-white dark:text-stone-950 font-semibold text-xs uppercase tracking-widest cursor-pointer"
                  >
                    Área Restrita
                  </button>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-serif font-semibold text-stone-900 dark:text-stone-100 block">{user.displayName}</span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest block">{user.email}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white cursor-pointer"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ==================== CONTENT PORTAL (PAGINATED VIEW) ==================== */}
      <div className="flex flex-col min-h-[60vh] pt-24">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animationVariants}
            >
              {/* HOMEPAGE - PORTFOLIO VIEW */}
              <section
                id="home"
                className="space-y-20 max-w-7xl mx-auto px-6 pb-12"
              >
            {/* Elegant Cinematic Hero */}
            <header className="relative py-8 md:py-16 flex flex-col md:flex-row gap-12 items-center justify-between">
              <div className="space-y-8 md:w-1/2 relative z-10">
                <div className="space-y-4">
                  <h1 className="font-serif text-5xl md:text-7xl font-normal text-stone-950 dark:text-stone-50 leading-[1.1]">
                    Medicina <br/>
                    <span className="italic text-[#C5B485]">Clínica, Perícia & Tecnologia.</span>
                  </h1>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm text-base">
                    Atuação médica em pronto-socorro, perícia judicial e desenvolvimento de ferramentas para fluxos clínicos e médico-legais.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={() => handleTabChange('booking')}
                    className="px-8 py-4 bg-stone-950 dark:bg-stone-50 hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-950 text-xs font-semibold uppercase tracking-[0.15em] transition-all cursor-pointer text-center"
                  >
                    Marcar Consulta
                  </button>
                  <button
                    onClick={() => handleTabChange('lawyers')}
                    className="px-8 py-4 border border-stone-200 dark:border-stone-800 hover:border-[#C5B485] dark:hover:border-[#C5B485] text-stone-900 dark:text-stone-100 text-xs font-semibold uppercase tracking-[0.15em] transition-all cursor-pointer text-center"
                  >
                    Solicitar Laudo
                  </button>
                </div>
              </div>

              {/* Elegant Graphic Illustration / Avatar Placeholder */}
              <div className="md:w-1/2 flex justify-end relative w-full">
                <div className="relative h-[32rem] w-full md:w-[28rem] overflow-hidden group">
                  <img src="/src/assets/images/minimalist_clinic_office_1782157322056.jpg" alt="Estrutura Clínica e Pericial" className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105" />
                </div>
              </div>
            </header>

            {user && (
              <section className="space-y-6 mt-12 bg-white dark:bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-855 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-150 dark:border-stone-800 pb-5">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-105">Portal do Correntista Paciente</h3>
                    <p className="text-stone-400 text-xs mt-1">Configure suas preferências e sincronize as agendas médicas periciais.</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-950 p-1 rounded-2xl border border-stone-200/40 dark:border-stone-800/60 w-fit">
                    <button 
                      onClick={() => setPortalView('dashboard')} 
                      className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                        portalView === 'dashboard' 
                          ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm' 
                          : 'text-stone-500 hover:text-stone-910 dark:text-stone-405'
                      }`}
                    >
                      Resumo da Conta
                    </button>
                    <button 
                      onClick={() => setPortalView('profile')} 
                      className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                        portalView === 'profile' 
                          ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm' 
                          : 'text-stone-500 hover:text-stone-910 dark:text-stone-405'
                      }`}
                    >
                      Preferenciais & Perfil
                    </button>
                  </div>
                </div>

                {portalView === 'dashboard' ? (
                  <PatientPortalOnHome user={user} accessToken={accessToken} onNavigate={handleTabChange} />
                ) : (
                  <UserProfileSettings user={user} />
                )}
              </section>
            )}

            {/* Eixos de Atuação Section */}
            <section className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center max-w-2xl mx-auto space-y-2"
              >
                <span className="text-[10px] uppercase font-mono tracking-widest bg-[#B5A475]/10 dark:bg-stone-900 border border-[#B5A475]/20 text-[#B5A475] px-3 py-1 rounded-full font-semibold">
                  Áreas de atuação
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-stone-100 font-medium">Medicina, perícia e sistemas</h3>
                <p className="text-stone-500 dark:text-stone-400 text-xs">Atuação profissional descrita sem ampliar títulos, especialidades ou resultados.</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-8 space-y-4">
                  <UserIcon size={20} className="text-[#B5A475]" />
                  <h4 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">Pronto-socorro e cuidado agudo</h4>
                  <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed">
                    Atuação assistencial como médica generalista em contextos de urgência e emergência.
                  </p>
                </div>

                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-8 space-y-4">
                  <Scale size={20} className="text-[#B5A475]" />
                  <h4 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">Perícia médica judicial</h4>
                  <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed">
                    Atuação como médica perita nomeada em processos judiciais, com delimitação do objeto, análise documental e fundamentação técnica.
                  </p>
                </div>

                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-8 space-y-4">
                  <Briefcase size={20} className="text-[#B5A475]" />
                  <h4 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">Clinical software e healthtech</h4>
                  <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed">
                    Desenvolvimento de ferramentas a partir de problemas reais de documentação, workflow, rastreabilidade e apoio à decisão.
                  </p>
                </div>
              </div>
            </section>

            {/* Bento Grid Features */}
            <section className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center max-w-2xl mx-auto space-y-2"
              >
                <span className="text-[10px] uppercase font-mono tracking-widest bg-[#B5A475]/10 dark:bg-stone-900 border border-[#B5A475]/20 text-[#B5A475] px-3 py-1 rounded-full font-semibold">
                  Elegância & Praticidade Digital
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-stone-105 font-medium">Estrutura de Apoio</h3>
                <p className="text-stone-550 dark:text-stone-400 text-xs">Conveniência e segurança em todo o ciclo de contato com a Dra. Joyce.</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1: Calendario */}
                <motion.div 
                  initial={{ opacity: 0, y: 50, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 flex flex-col justify-between h-72 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-wider text-[#B5A475] font-semibold">Paciente</span>
                    <h5 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-101">Agendamento Simples</h5>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-sans leading-normal">
                      Organize sua consulta médica pelo nosso calendário. Integrado ao seu ecossistema sem burocracias.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleTabChange('booking')}
                    className="text-xs text-[#B5A475] hover:text-[#C5B485] font-medium flex items-center gap-1.5 hover:underline text-left mt-4 cursor-pointer"
                  >
                    Acessar Calendário <ChevronRight size={14} />
                  </button>
                </motion.div>

                {/* Card 2: Armario Drive */}
                <motion.div 
                  initial={{ opacity: 0, y: 50, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 flex flex-col justify-between h-72 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-wider text-[#B5A475] font-semibold">Documentação</span>
                    <h5 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-101">Armário de Exames</h5>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-sans leading-normal">
                      Centralize laudos, pedidos e exames laboratoriais na sua área do cliente de forma confidencial.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleTabChange('cabinet')}
                    className="text-xs text-[#B5A475] hover:text-[#C5B485] font-medium flex items-center gap-1.5 hover:underline text-left mt-4 cursor-pointer"
                  >
                    Acessar Dossiê <ChevronRight size={14} />
                  </button>
                </motion.div>

                {/* Card 3: Segurança */}
                <motion.div 
                  initial={{ opacity: 0, y: 50, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-stone-50/50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 flex flex-col justify-between h-72 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Forense</span>
                    <h5 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-101">Simulador de Danos</h5>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-sans leading-normal">
                      Uma ferramenta exclusiva para escritórios advocatícios simularem tabelas de incapacidade baseadas na teoria.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleTabChange('simulator')}
                    className="text-xs text-[#B5A475] dark:text-[#B5A475] hover:text-[#C5B485] font-medium flex items-center gap-1.5 hover:underline text-left mt-4 cursor-pointer"
                  >
                    Acessar Área do Advogado <ChevronRight size={14} />
                  </button>
                </motion.div>

              </div>
            </section>

                      </section>
        </motion.div>
      )}

          {activeTab === 'booking' && (
            <motion.div
              key="booking"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animationVariants}
            >
              {/* BOOKING ENGINE VIEW */}
              <section
                id="booking"
                className="max-w-7xl mx-auto px-6 py-12"
              >
                <BookingCalendar 
                  user={user} 
                  accessToken={accessToken} 
                  onLoginNeeded={handleSignIn} 
                />
              </section>
            </motion.div>
          )}

          {activeTab === 'cabinet' && (
            <motion.div
              key="cabinet"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animationVariants}
            >
              {/* DOCUMENT CABINET (GOOGLE DRIVE) VIEW */}
              <section
                id="cabinet"
                className="max-w-7xl mx-auto px-6 py-12"
              >
                <DriveCabinet 
                  user={user} 
                  accessToken={accessToken} 
                  onLoginNeeded={handleSignIn} 
                />
              </section>
            </motion.div>
          )}

          {activeTab === 'lawyers' && (
            <motion.div
              key="lawyers"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animationVariants}
            >
              {/* LAWYERS DIRECT CONTACT VIEW */}
              <section
                id="lawyers"
                className="max-w-4xl mx-auto px-6 py-12"
              >
                <div className="text-center space-y-4 mb-10">
                  <span className="text-[10px] bg-[#B5A475]/10 text-[#B5A475] border border-[#B5A475]/20 px-4 py-1.5 rounded-full uppercase tracking-widest font-black inline-flex items-center gap-2">
                    <Scale size={12} /> Exclusivo para Bancas Jurídicas
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl font-medium text-stone-900 dark:text-stone-100 mt-2">
                    Solicitação de Parecer Pericial
                  </h2>
                  <p className="text-stone-500 dark:text-stone-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                    Para demandas médico-legais, envie o objeto da análise e a documentação disponível para alinhamento de escopo técnico e disponibilidade.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* WhatsApp Quick CTA */}
                  <div className="bg-white dark:bg-stone-900 border border-[#25D366]/30 rounded-3xl p-8 hover:shadow-xl transition-all flex flex-col items-center text-center space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#25D366]/10 to-transparent pointer-events-none" />
                    <div className="w-16 h-16 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                      <MessageCircle size={32} className="text-[#25D366]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl font-semibold text-stone-900 dark:text-stone-100">WhatsApp Direto</h3>
                      <p className="text-stone-500 dark:text-stone-400 text-xs">Resposta mais rápida para alinhamento inicial do caso e documentação.</p>
                    </div>
                    <a
                      href="https://wa.me/5527998134032?text=Olá%20Dra.%20Joyce,%20sou%20advogado%20e%20gostaria%20de%20solicitar%20um%20laudo%20pericial/assistência%20técnica."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto px-8 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md group-hover:scale-105"
                    >
                      Solicitar via WhatsApp
                    </a>
                  </div>

                  {/* Email CTA */}
                  <div className="bg-white dark:bg-stone-900 border border-[#B5A475]/30 rounded-3xl p-8 hover:shadow-xl transition-all flex flex-col items-center text-center space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#B5A475]/10 to-transparent pointer-events-none" />
                    <div className="w-16 h-16 rounded-full bg-[#B5A475]/10 flex items-center justify-center">
                      <Mail size={32} className="text-[#B5A475]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl font-semibold text-stone-900 dark:text-stone-100">E-mail Profissional</h3>
                      <p className="text-stone-500 dark:text-stone-400 text-xs">Para o envio inicial de prontuários em PDF, quesitação e históricos longos.</p>
                    </div>
                    <a
                      href="mailto:contato@drajoyceradis.com?subject=Solicitação de Laudo/Assistência Técnica Jurídica"
                      className="mt-auto px-8 py-3 bg-stone-900 dark:bg-[#B5A475] hover:bg-stone-800 dark:hover:bg-[#a99767] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md group-hover:scale-105"
                    >
                      Enviar E-mail com Anexos
                    </a>
                  </div>
                </div>

              </section>
            </motion.div>
          )}

          {activeTab === 'simulator' && (
            <motion.div
              key="simulator"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animationVariants}
            >
              {/* INCARSION SIMULATOR VIEW */}
              <section
                id="simulator"
                className="max-w-7xl mx-auto px-6 py-12 space-y-12"
              >
                <ForensicTools />
                <VideoGenerator />
              </section>
            </motion.div>
          )}

          {activeTab === 'connect' && (
            <motion.div
              key="connect"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animationVariants}
            >
              {/* WORKSPACE HUB VIEW */}
              <section
                id="connect"
                className="max-w-7xl mx-auto px-6 py-12"
              >
                <WorkspaceHub />
              </section>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animationVariants}
            >
              <section id="about" className="max-w-5xl mx-auto px-6 py-12 md:py-24">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <span className="text-[10px] bg-[#B5A475]/10 text-[#B5A475] px-3.5 py-1.5 rounded-full uppercase tracking-widest font-black inline-block font-mono border border-[#B5A475]/15">
                      Perfil profissional
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-light text-stone-900 dark:text-stone-100 leading-tight">
                      Dra. Joyce Radis
                    </h2>
                    <p className="text-stone-550 dark:text-stone-400 font-sans text-sm leading-relaxed max-w-3xl">
                      Médica, CRM/ES 21188, com atuação em pronto-socorro e perícia médica judicial. Também desenvolvo software e ferramentas digitais a partir de problemas que encontro na prática clínica e médico-legal.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-stone-150 dark:border-stone-850 p-6 rounded-2xl bg-white/40 dark:bg-stone-900/10 space-y-2">
                      <Award size={18} className="text-[#B5A475]" />
                      <h3 className="font-serif font-bold text-stone-900 dark:text-white">Medicina assistencial</h3>
                      <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed">
                        Experiência em urgência, emergência e cuidado agudo, com foco em documentação clara e continuidade do atendimento.
                      </p>
                    </div>

                    <div className="border border-stone-150 dark:border-stone-850 p-6 rounded-2xl bg-white/40 dark:bg-stone-900/10 space-y-2">
                      <Scale size={18} className="text-[#B5A475]" />
                      <h3 className="font-serif font-bold text-stone-900 dark:text-white">Perícia médica judicial</h3>
                      <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed">
                        Trabalho orientado por objeto pericial, documentação, método, nexo e limites técnicos da conclusão médica.
                      </p>
                    </div>

                    <div className="border border-stone-150 dark:border-stone-850 p-6 rounded-2xl bg-white/40 dark:bg-stone-900/10 space-y-2">
                      <Briefcase size={18} className="text-[#B5A475]" />
                      <h3 className="font-serif font-bold text-stone-900 dark:text-white">Medicina × software</h3>
                      <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed">
                        Projetos em documentação clínica, workflow, educação médica, auditoria e tecnologia médico-legal.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-stone-50 dark:bg-stone-950 border border-stone-150 dark:border-stone-850 rounded-3xl">
                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      Princípio de trabalho: automação pode reduzir trabalho repetitivo, mas não deve transformar ausência de dado em achado, sugestão em fato ou evidência em conclusão.
                    </p>
                    <a
                      href="https://github.com/joyceradis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-xs font-semibold text-[#B5A475] hover:underline"
                    >
                      Ver projetos públicos no GitHub
                    </a>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FAQAccordion />

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-stone-100 border-t border-stone-200/50 py-12 px-6 mt-0 text-xs text-stone-500 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="font-serif text-sm font-black text-stone-850 block">DRA. JOYCE RADIS</span>
            <p className="text-[10px] text-stone-400">Copyright © 2026. Todos os direitos reservados. Perícias Médicas & Longevidade.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase font-black tracking-widest text-[#B5A475] items-center">
            <span className="hover:text-stone-800 cursor-pointer" onClick={() => handleTabChange('home')}>Início</span>
            <span className="hover:text-stone-800 cursor-pointer" onClick={() => handleTabChange('about')}>A Dra. Joyce</span>
            <span className="hover:text-stone-800 cursor-pointer" onClick={() => handleTabChange('booking')}>Pacientes (Agendar)</span>
            <span className="hover:text-stone-800 cursor-pointer" onClick={() => handleTabChange('lawyers')}>Advogados (Solicitar)</span>
            <span className="hover:text-stone-800 cursor-pointer" onClick={() => handleTabChange('cabinet')}>Área do Cliente</span>
            <a href="https://www.linkedin.com/in/joyceradis" target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 flex items-center gap-1">
              <Linkedin size={11} className="shrink-0" /> LinkedIn
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
