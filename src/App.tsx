import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import {
  Moon, Star, Baby, Clock, Shield, Heart, BookOpen, CheckCircle2,
  ChevronDown, Menu, X, ArrowRight, Sparkles, CloudMoon, Sun,
  MessageCircle, Users, Award, Zap, Headphones, RefreshCw,
  Download, Mail, Send
} from 'lucide-react';

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ─── Reveal Wrapper ─── */
function Reveal({ children, className = '', direction = 'up', stagger = 0 }: {
  children: ReactNode; className?: string;
  direction?: 'up' | 'left' | 'right' | 'scale'; stagger?: number;
}) {
  const ref = useScrollReveal();
  const dirClass = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : direction === 'scale' ? 'reveal-scale' : 'reveal';
  const staggerClass = stagger > 0 ? `stagger-${stagger}` : '';
  return (
    <div ref={ref} className={`${dirClass} ${staggerClass} ${className}`}>
      {children}
    </div>
  );
}

/* ─── Counter Animation ─── */
function AnimatedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            start = Math.floor(eased * end);
            setCount(start);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{prefix}{count.toLocaleString('pt-BR')}{suffix}</span>;
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Benefícios', href: '#beneficios' },
    { label: 'Conteúdo', href: '#conteudo' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Preço', href: '#preco' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass shadow-lg shadow-brand-500/5 py-3' : 'py-5 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lavender-500 to-brand-500 flex items-center justify-center shadow-lg shadow-lavender-500/30 group-hover:shadow-lavender-500/50 transition-shadow">
              <CloudMoon className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-slate-800">
              Guia do <span className="text-gradient">Sono</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-lavender-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-lavender-500 after:transition-all hover:after:w-full">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="#preco" className="btn-shine inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-lavender-600 to-brand-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-lavender-500/30 hover:shadow-lavender-500/50 hover:scale-105 transition-all">
              Quero meu e-book
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-slate-700 hover:text-lavender-600 transition-colors" aria-label="Abrir menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] ${mobileOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileOpen(false)} />
        <div className={`mobile-menu absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl ${mobileOpen ? 'open' : ''} p-6 flex flex-col`}>
          <div className="flex items-center justify-between mb-8">
            <span className="font-serif text-lg font-bold text-slate-800">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-500 hover:text-slate-700" aria-label="Fechar menu">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="px-4 py-3 text-slate-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-xl transition-colors font-medium">
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-auto">
            <a href="#preco" onClick={() => setMobileOpen(false)} className="btn-shine flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-lavender-600 to-brand-600 text-white font-semibold rounded-full shadow-lg">
              Quero meu e-book
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Hero Section ─── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient noise-overlay">
      {/* Ambient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-lavender-300/20 rounded-full blur-3xl animate-orb-1" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-300/20 rounded-full blur-3xl animate-orb-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-peach-200/10 rounded-full blur-3xl" />

      {/* Decorative stars */}
      <div className="absolute top-32 right-20 animate-twinkle">
        <Star className="w-4 h-4 text-lavender-400 fill-lavender-400" />
      </div>
      <div className="absolute top-48 left-32 animate-twinkle-2">
        <Star className="w-3 h-3 text-brand-400 fill-brand-400" />
      </div>
      <div className="absolute bottom-40 left-20 animate-twinkle-3">
        <Star className="w-5 h-5 text-peach-300 fill-peach-300" />
      </div>
      <div className="absolute top-60 right-48 animate-twinkle">
        <Moon className="w-6 h-6 text-lavender-300" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lavender-100/80 border border-lavender-200/50 text-lavender-700 text-sm font-medium mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                Mais de 12.000 famílias já transformaram suas noites
              </div>
            </Reveal>

            <Reveal stagger={1}>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] mb-6">
                Noites{' '}
                <span className="text-gradient italic">tranquilas</span>
                <br />
                para seu bebê{' '}
                <span className="relative inline-block">
                  dormir
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C50 2 150 2 198 8" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" />
                    <defs><linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#0c8ceb" /></linearGradient></defs>
                  </svg>
                </span>
              </h1>
            </Reveal>

            <Reveal stagger={2}>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
                Descubra métodos práticos e seguros, baseados em evidências científicas, para ajudar seu bebê de 0 a 24 meses a dormir melhor — e você também.
              </p>
            </Reveal>

            <Reveal stagger={3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#preco" className="btn-shine inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-lavender-600 to-brand-600 text-white text-lg font-semibold rounded-full shadow-xl shadow-lavender-500/30 hover:shadow-lavender-500/50 hover:scale-105 transition-all">
                  Quero começar agora
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a href="#conteudo" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 text-lg font-semibold rounded-full border border-slate-200 hover:border-lavender-300 hover:text-lavender-600 hover:bg-white transition-all shadow-sm">
                  <BookOpen className="w-5 h-5" />
                  Ver conteúdo
                </a>
              </div>
            </Reveal>

            <Reveal stagger={4}>
              <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {['🧑‍🦱', '👩‍🦰', '👨‍🦱', '👩', '🧑'].map((emoji, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-100 to-brand-100 border-2 border-white flex items-center justify-center text-lg shadow-sm">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">4.9/5</span> ·{' '}
                  <span className="text-yellow-500">★★★★★</span>
                  <br />
                  <span className="text-slate-500">+2.800 avaliações</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Hero Image */}
          <Reveal direction="right" stagger={2}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-lavender-400/20 to-brand-400/20 rounded-3xl blur-2xl scale-105" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-lavender-500/20 animate-float">
                <img
                  src="/images/hero-baby-sleep.jpg"
                  alt="Bebê dormindo tranquilamente"
                  className="w-full h-auto object-cover rounded-3xl"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-lavender-900/20 via-transparent to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 sm:bottom-4 sm:-left-8 glass rounded-2xl p-4 shadow-xl animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-mint-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-mint-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Método seguro</p>
                    <p className="text-xs text-slate-500">Aprovado por pediatras</p>
                  </div>
                </div>
              </div>
              {/* Floating badge 2 */}
              <div className="absolute -top-4 -right-4 sm:top-4 sm:-right-8 glass rounded-2xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-lavender-100 flex items-center justify-center">
                    <Moon className="w-6 h-6 text-lavender-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">+10 horas</p>
                    <p className="text-xs text-slate-500">de sono por noite</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" className="w-full">
          <path d="M0 50C360 0 720 100 1440 50V100H0V50Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

/* ─── Social Proof Bar ─── */
function SocialProof() {
  const stats = [
    { icon: <Users className="w-5 h-5" />, value: 12000, suffix: '+', label: 'Famílias ajudadas' },
    { icon: <Star className="w-5 h-5" />, value: 4.9, suffix: '', label: 'Avaliação média', prefix: '' },
    { icon: <Award className="w-5 h-5" />, value: 98, suffix: '%', label: 'Satisfação' },
    { icon: <Clock className="w-5 h-5" />, value: 7, suffix: ' dias', label: 'Para ver resultados' },
  ];

  return (
    <section className="relative bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-lavender-50 to-brand-50 text-lavender-600 mb-3 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-800 mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} prefix={stat.prefix || ''} />
                </div>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Trust badges */}
        <Reveal stagger={2}>
          <div className="mt-10 pt-10 border-t border-slate-100 flex flex-wrap items-center justify-center gap-8 opacity-50">
            {['Seguro Pediátrico', 'Baseado em Evidências', 'Método Gentil', 'Especialistas em Sono'].map((badge, i) => (
              <span key={i} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{badge}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Pain Points / Agitation ─── */
function PainPoints() {
  const pains = [
    { emoji: '😫', title: 'Noites intermináveis', desc: 'Seu bebê acorda 5, 6, 10 vezes por noite e você não aguenta mais.' },
    { emoji: '😰', title: 'Exaustão total', desc: 'Você está cansada, irritada e sente que não dá conta de nada.' },
    { emoji: '😢', title: 'Culpa e frustração', desc: 'Sente culpa por não conseguir ajudar seu bebê a dormir e já tentou de tudo.' },
    { emoji: '🤯', title: 'Conflitos no casal', desc: 'O cansaço gera brigas e a casa vira um campo de tensão.' },
  ];

  return (
    <section className="relative bg-section-gradient py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-lavender-200/20 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach-50 text-peach-600 text-sm font-medium mb-4">
              <Heart className="w-4 h-4" />
              Nós entendemos você
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Se você se sente assim, <span className="text-gradient italic">não está sozinha</span>
            </h2>
            <p className="text-lg text-slate-600">
              A privação de sono afeta milhões de famílias. Mas existe um caminho gentil e eficaz para transformar essa realidade.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pains.map((pain, i) => (
            <Reveal key={i} stagger={i + 1}>
              <div className="card-hover bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center h-full">
                <div className="text-4xl mb-4">{pain.emoji}</div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">{pain.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{pain.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features / Conteúdo ─── */
function Features() {
  const features = [
    {
      icon: <Moon className="w-6 h-6" />,
      title: 'Rotinas de Sono por Idade',
      desc: 'Schedule personalizado para cada fase: 0-3, 3-6, 6-12 e 12-24 meses, com janelas de sono ideais.',
      color: 'from-lavender-500 to-lavender-600',
      bg: 'bg-lavender-50',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Métodos Gentis e Seguros',
      desc: 'Técnicas de adormecimento respeitosas, sem "deixar chorar", baseadas em evidências científicas.',
      color: 'from-brand-500 to-brand-600',
      bg: 'bg-brand-50',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Solução para Despertares',
      desc: 'Estratégias práticas para reduzir despertares noturnos e ajudar o bebê a reconectar os ciclos de sono.',
      color: 'from-peach-500 to-peach-600',
      bg: 'bg-peach-50',
    },
    {
      icon: <Sun className="w-6 h-6" />,
      title: 'Transições de Sono',
      desc: 'Guia completo para transições difíceis: cochilos, regressões, mudança de berço e muito mais.',
      color: 'from-mint-500 to-mint-600',
      bg: 'bg-mint-50',
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Ambiente Ideal de Sono',
      desc: 'Checklist completo para criar o ambiente perfeito: temperatura, luminosidade, ruído e vestuário.',
      color: 'from-lavender-500 to-brand-500',
      bg: 'bg-lavender-50',
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: 'Suporte de Especialistas',
      desc: 'Acesso a grupo exclusivo de apoio com dúvidas respondidas por especialistas em sono infantil.',
      color: 'from-brand-500 to-lavender-500',
      bg: 'bg-brand-50',
    },
  ];

  return (
    <section id="conteudo" className="relative bg-white py-20 sm:py-28 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-200/10 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              O que você vai encontrar
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Tudo que seu bebê precisa para <span className="text-gradient italic">dormir bem</span>
            </h2>
            <p className="text-lg text-slate-600">
              Um guia completo, passo a passo, com técnicas comprovadas e adaptadas para cada fase do desenvolvimento.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <Reveal key={i} stagger={i + 1}>
              <div className="card-hover bg-white rounded-2xl p-8 border border-slate-100 shadow-sm h-full group">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <div className={`bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Product Showcase ─── */
function ProductShowcase() {
  const chapters = [
    'Entendendo o sono do bebê',
    'Rotinas por faixa etária',
    'Métodos gentis de adormecimento',
    'Resolvendo despertares noturnos',
    'Regressões de sono',
    'Ambiente ideal de sono',
    'Alimentação e sono',
    'Transições e marcos',
    'Bônus: Checklist impresso',
    'Bônus: Acesso ao grupo de apoio',
  ];

  return (
    <section className="relative bg-section-gradient py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-20 right-0 w-72 h-72 bg-lavender-200/20 rounded-full blur-3xl animate-orb-2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* E-book Image */}
          <Reveal direction="left">
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-lavender-400/20 to-brand-400/20 rounded-3xl blur-2xl scale-110" />
              <div className="relative animate-breathe">
                <img
                  src="/images/ebook-mockup.png"
                  alt="E-book Guia do Sono do Bebê"
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                  loading="lazy"
                />
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 sm:top-0 sm:right-0 glass rounded-xl p-3 shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-lavender-100 flex items-center justify-center">
                    <Download className="w-4 h-4 text-lavender-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Acesso imediato</p>
                    <p className="text-[10px] text-slate-500">PDF + Bônus</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <Reveal direction="right">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lavender-50 text-lavender-600 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Conheça o e-book
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Seu guia <span className="text-gradient italic">completo</span> para noites pacíficas
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Mais de 180 páginas com conteúdo prático, organizado e fácil de aplicar — mesmo nos dias mais cansativos.
              </p>

              <div className="space-y-3 mb-8">
                {chapters.map((chapter, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-lavender-500 to-brand-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm text-slate-700 group-hover:text-lavender-600 transition-colors">{chapter}</span>
                  </div>
                ))}
              </div>

              <a href="#preco" className="btn-shine inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-lavender-600 to-brand-600 text-white text-lg font-semibold rounded-full shadow-xl shadow-lavender-500/30 hover:shadow-lavender-500/50 hover:scale-105 transition-all">
                Garantir meu e-book
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Benefits ─── */
function Benefits() {
  const benefits = [
    {
      image: '/images/parent-baby.jpg',
      title: 'Pais mais descansados e presentes',
      desc: 'Quando o bebê dorme bem, toda a família se transforma. Você tem energia para aproveitar cada momento com seu filho.',
    },
    {
      title: 'Bebê mais feliz e saudável',
      desc: 'O sono é fundamental para o desenvolvimento cerebral, imunidade e regulação emocional do bebê. Dormir bem é crescer bem.',
    },
    {
      title: 'Relação familiar mais harmoniosa',
      desc: 'Noites bem dormidas significam menos brigas, mais paciência e mais amor para compartilhar em família.',
    },
  ];

  return (
    <section id="beneficios" className="relative bg-white py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mint-50 text-mint-600 text-sm font-medium mb-4">
              <Heart className="w-4 h-4" />
              Transformação real
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              O que muda quando o bebê <span className="text-gradient italic">dorme bem</span>
            </h2>
          </div>
        </Reveal>

        <div className="space-y-16 lg:space-y-24">
          {benefits.map((benefit, i) => (
            <Reveal key={i} direction={i % 2 === 0 ? 'left' : 'right'}>
              <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${i % 2 !== 0 ? 'lg:direction-rtl' : ''}`}>
                {benefit.image && (
                  <div className={`${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <div className="relative rounded-2xl overflow-hidden shadow-xl">
                      <img
                        src={benefit.image}
                        alt={benefit.title}
                        className="w-full h-64 sm:h-80 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-lavender-900/20 to-transparent" />
                    </div>
                  </div>
                )}
                <div className={`${i % 2 !== 0 ? 'lg:order-1' : ''} ${!benefit.image ? 'lg:col-span-2 lg:text-center' : ''}`}>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lavender-100 to-brand-100 flex items-center justify-center mb-5">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800 mb-4">{benefit.title}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function Testimonials() {
  const testimonials = [
    {
      name: 'Camila R.',
      role: 'Mãe da Valentina, 8 meses',
      text: 'Em apenas 2 semanas seguindo o guia, minha filha começou a dormir a noite toda. Eu chorei de alívio na primeira noite completa. O método é gentil e respeitoso — me senti segura aplicando.',
      rating: 5,
      avatar: '👩‍🦰',
    },
    {
      name: 'Rafael M.',
      role: 'Pai do Thomás, 14 meses',
      text: 'Como pai, eu era cético. Mas o guia é tão bem estruturado e baseado em ciência que convenceu. Hoje nosso filho dorme 11 horas seguidas e a qualidade de vida da família mudou completamente.',
      rating: 5,
      avatar: '🧔',
    },
    {
      name: 'Juliana S.',
      role: 'Mãe dos gêmeos, 6 meses',
      text: 'Dormir dois bebês parecia impossível. O guia tem um capítulo específico para múltiplos que foi nossa salvação. As rotinas sincronizadas funcionaram demais! Recomendo de olhos fechados.',
      rating: 5,
      avatar: '👩',
    },
    {
      name: 'Fernanda L.',
      role: 'Mãe do Pedro, 18 meses',
      text: 'Já tinha tentado de tudo e estava à beira de um esgotamento. O Guia do Sono do Bebê trouxe clareza e método. Em 10 dias, o Pedro já dormia sem despertar. É transformador!',
      rating: 5,
      avatar: '👩‍🦱',
    },
    {
      name: 'Lucas P.',
      role: 'Pai da Isabella, 4 meses',
      text: 'O que mais gostei foi a abordagem gentil. Não tem nenhum método de "deixar chorar". Meu bebê dormiu melhor e eu me senti respeitando o tempo dela. O bônus do grupo de apoio é incrível!',
      rating: 5,
      avatar: '👨',
    },
    {
      name: 'Amanda T.',
      role: 'Mãe do Enzo, 11 meses',
      text: 'Comprei desesperada depois de 11 meses sem dormir. O guia mudou nossa vida. O capítulo sobre regressões de sono salvou nossa sanidade na transição dos 12 meses. Obrigada!',
      rating: 5,
      avatar: '🧑‍🦱',
    },
  ];

  return (
    <section id="depoimentos" className="relative bg-section-gradient py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-lavender-200/20 rounded-full blur-3xl animate-orb-1" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lavender-50 text-lavender-600 text-sm font-medium mb-4">
              <MessageCircle className="w-4 h-4" />
              Histórias reais
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Famílias que já <span className="text-gradient italic">transformaram</span> suas noites
            </h2>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={i} stagger={i + 1}>
              <div className="card-hover bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-100 to-brand-100 flex items-center justify-center text-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
function Pricing() {
  const plans = [
    {
      name: 'Essencial',
      price: '47',
      originalPrice: '97',
      desc: 'O guia completo para transformar o sono do seu bebê.',
      features: [
        'E-book completo (180+ páginas)',
        'Rotinas por faixa etária',
        'Métodos gentis de adormecimento',
        'Soluções para despertares noturnos',
        'Checklist de ambiente ideal',
        'Garantia de 7 dias',
      ],
      excluded: [
        'Grupo de apoio exclusivo',
        'Checklist impresso em PDF',
        'Consultoria de acompanhamento',
      ],
      popular: false,
    },
    {
      name: 'Completo',
      price: '67',
      originalPrice: '147',
      desc: 'O guia + bônus exclusivos para resultados ainda mais rápidos.',
      features: [
        'Tudo do plano Essencial',
        'Grupo de apoio exclusivo',
        'Checklist impresso em PDF',
        'Guia de regressões de sono',
        'Guia de alimentação e sono',
        'Garantia de 15 dias',
      ],
      excluded: [
        'Consultoria de acompanhamento',
      ],
      popular: true,
    },
    {
      name: 'Premium',
      price: '97',
      originalPrice: '247',
      desc: 'A experiência completa com suporte personalizado de especialistas.',
      features: [
        'Tudo do plano Completo',
        '1 consultoria individual (30min)',
        'Plano personalizado de sono',
        'Acompanhamento por 30 dias',
        'Acesso vitalício ao grupo VIP',
        'Garantia de 30 dias',
      ],
      excluded: [],
      popular: false,
    },
  ];

  return (
    <section id="preco" className="relative bg-white py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-200/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-lavender-200/20 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-sm font-medium mb-4">
              <Baby className="w-4 h-4" />
              Invista no sono da sua família
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Escolha o plano <span className="text-gradient italic">ideal</span> para você
            </h2>
            <p className="text-lg text-slate-600">
              Todos os planos incluem o e-book completo. Comece hoje e veja resultados em até 7 dias.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <Reveal key={i} stagger={i + 1}>
              <div
                className={`card-hover relative rounded-2xl p-8 h-full flex flex-col transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-br from-lavender-600 to-brand-600 text-white shadow-2xl shadow-lavender-500/30 scale-[1.02] ring-2 ring-lavender-400'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-peach-400 to-peach-500 text-white text-xs font-bold rounded-full shadow-lg">
                    MAIS POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`font-serif text-xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-slate-800'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.popular ? 'text-lavender-100' : 'text-slate-500'}`}>
                    {plan.desc}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-xs line-through ${plan.popular ? 'text-lavender-200' : 'text-slate-400'}`}>
                      R${plan.originalPrice}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${plan.popular ? 'bg-white/20 text-white' : 'bg-mint-50 text-mint-600'}`}>
                      -{Math.round((1 - parseInt(plan.price) / parseInt(plan.originalPrice)) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-sm ${plan.popular ? 'text-lavender-200' : 'text-slate-500'}`}>R$</span>
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                      {plan.price}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${plan.popular ? 'text-lavender-200' : 'text-slate-400'}`}>
                    Pagamento único · Acesso imediato
                  </p>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-lavender-200' : 'text-mint-500'}`} />
                      <span className={`text-sm ${plan.popular ? 'text-lavender-50' : 'text-slate-600'}`}>{feature}</span>
                    </div>
                  ))}
                  {plan.excluded.map((feature, j) => (
                    <div key={j} className="flex items-start gap-2 opacity-40">
                      <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className="text-sm line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="#cta"
                  className={`btn-shine inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold transition-all hover:scale-105 ${
                    plan.popular
                      ? 'bg-white text-lavender-700 shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r from-lavender-600 to-brand-600 text-white shadow-lg shadow-lavender-500/20 hover:shadow-lavender-500/40'
                  }`}
                >
                  Quero este plano
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Guarantee */}
        <Reveal stagger={4}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 glass rounded-2xl px-6 py-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-mint-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-mint-500" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800 text-sm">Garantia de Satisfação</p>
                <p className="text-xs text-slate-500">Se não amar o conteúdo, devolvemos 100% do seu dinheiro. Sem perguntas.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'O método funciona para bebês de qualquer idade?',
      a: 'Sim! O guia cobre de 0 a 24 meses com rotinas e técnicas específicas para cada fase. Cada capítulo é adaptado para a janela de desenvolvimento do seu bebê, garantindo que as estratégias sejam adequadas e eficazes.',
    },
    {
      q: 'O método envolve "deixar o bebê chorar"?',
      a: 'Absolutamente não! Nossos métodos são gentis e respeitosos, baseados em acompanhamento e acolhimento. Acreditamos que o choro é uma forma de comunicação e tratamos com empatia e responsabilidade.',
    },
    {
      q: 'Em quanto tempo vou ver resultados?',
      a: 'A maioria das famílias percebe melhorias significativas nos primeiros 3-7 dias. Resultados mais consolidados geralmente aparecem em 2-3 semanas, dependendo da consistência e da idade do bebê.',
    },
    {
      q: 'O e-book serve para gêmeos ou múltiplos?',
      a: 'Sim! Temos um capítulo dedicado exclusivamente a bebês múltiplos, com estratégias para sincronizar rotinas e lidar com os desafios específicos de dormir dois ou mais bebês.',
    },
    {
      q: 'Como recebo o e-book?',
      a: 'Imediatamente após a confirmação do pagamento, você recebe o acesso por e-mail. O e-book é em formato PDF, podendo ser lido em qualquer dispositivo: celular, tablet ou computador.',
    },
    {
      q: 'E se eu não gostar do conteúdo?',
      a: 'Oferecemos garantia de até 30 dias (dependendo do plano escolhido). Se por qualquer motivo você não ficar satisfeita, devolvemos 100% do valor investido, sem perguntas e sem burocracia.',
    },
    {
      q: 'O conteúdo é baseado em evidências científicas?',
      a: 'Sim! Todo o conteúdo é fundamentado em pesquisas de sono infantil, pediatria e neurociência do desenvolvimento. As referências bibliográficas estão disponíveis ao final do e-book.',
    },
    {
      q: 'Posso acessar o grupo de apoio?',
      a: 'O grupo de apoio exclusivo está disponível nos planos Completo e Premium. É um espaço seguro para trocar experiências, tirar dúvidas e receber suporte de outras famílias e especialistas.',
    },
  ];

  const toggle = useCallback((i: number) => {
    setOpenIndex(prev => prev === i ? null : i);
  }, []);

  return (
    <section id="faq" className="relative bg-section-gradient py-20 sm:py-28 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lavender-50 text-lavender-600 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Dúvidas frequentes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Perguntas <span className="text-gradient italic">frequentes</span>
            </h2>
          </div>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={i} stagger={i + 1}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-slate-50/50 transition-colors"
                  aria-expanded={openIndex === i}
                >
                  <span className="font-semibold text-slate-800 text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-lavender-500 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`faq-content ${openIndex === i ? 'open' : ''}`}>
                  <div className="px-6 pb-6">
                    <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA / Lead Capture ─── */
function CTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section id="cta" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-lavender-600 via-brand-600 to-brand-700" />
      <div className="absolute inset-0 noise-overlay opacity-10" />

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 animate-twinkle">
        <Star className="w-4 h-4 text-white/30 fill-white/30" />
      </div>
      <div className="absolute top-20 right-20 animate-twinkle-2">
        <Star className="w-3 h-3 text-white/20 fill-white/20" />
      </div>
      <div className="absolute bottom-20 left-1/4 animate-twinkle-3">
        <Star className="w-5 h-5 text-white/25 fill-white/25" />
      </div>
      <div className="absolute top-1/3 right-10">
        <Moon className="w-8 h-8 text-white/10" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
            <CloudMoon className="w-4 h-4" />
            Comece hoje mesmo
          </div>
        </Reveal>

        <Reveal stagger={1}>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Seu bebê merece noites <br className="hidden sm:block" />
            <span className="italic">tranquilas e seguras</span>
          </h2>
        </Reveal>

        <Reveal stagger={2}>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Não espere mais uma noite de privação de sono. Junte-se a mais de 12.000 famílias que já transformaram suas noites com o Guia do Sono do Bebê.
          </p>
        </Reveal>

        <Reveal stagger={3}>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-8">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-full bg-white/95 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lavender-300 shadow-lg"
                  aria-label="Endereço de e-mail"
                />
              </div>
              <button type="submit" className="btn-shine px-8 py-4 bg-gradient-to-r from-peach-400 to-peach-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap">
                Quero meu e-book!
              </button>
            </form>
          ) : (
            <div className="glass-dark rounded-2xl p-6 max-w-lg mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-mint-400 mx-auto mb-3" />
              <p className="text-white font-semibold text-lg">Inscrição confirmada! 🎉</p>
              <p className="text-white/70 text-sm mt-1">Verifique seu e-mail para acessar o conteúdo.</p>
            </div>
          )}
        </Reveal>

        <Reveal stagger={4}>
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Pagamento seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span>Garantia de 7 a 30 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Acesso imediato</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lavender-500 to-brand-500 flex items-center justify-center">
                <CloudMoon className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-lg font-bold">Guia do Sono</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Ajudando famílias a conquistarem noites tranquilas com métodos gentis, seguros e baseados em evidências.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-lavender-600 flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-brand-500 flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-slate-300">Produto</h4>
            <ul className="space-y-2.5">
              {['E-book', 'Bônus', 'Grupo de apoio', 'Consultoria'].map((link) => (
                <li key={link}><a href="#conteudo" className="text-slate-400 hover:text-white text-sm transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-slate-300">Suporte</h4>
            <ul className="space-y-2.5">
              {['FAQ', 'Contato', 'Política de reembolso', 'Termos de uso'].map((link) => (
                <li key={link}><a href="#faq" className="text-slate-400 hover:text-white text-sm transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-slate-300">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-3">Receba dicas de sono infantil no seu e-mail.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 px-3 py-2 bg-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-lavender-500"
                aria-label="E-mail para newsletter"
              />
              <button type="submit" className="px-3 py-2 bg-lavender-600 hover:bg-lavender-500 rounded-lg transition-colors" aria-label="Enviar">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Guia do Sono do Bebê. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Política de privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── App ─── */
export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <Hero />
      <SocialProof />
      <PainPoints />
      <Features />
      <ProductShowcase />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
