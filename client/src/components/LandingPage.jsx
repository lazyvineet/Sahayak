import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MessageSquare, 
  Search, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  ShieldAlert, 
  Users, 
  LifeBuoy,
  Menu,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const features = [
    { icon: <Zap className="text-blue-400" size={24} />, title: t('landing.feature1Title'), description: t('landing.feature1Desc') },
    { icon: <MessageSquare className="text-green-400" size={24} />, title: t('landing.feature2Title'), description: t('landing.feature2Desc') },
    { icon: <LifeBuoy className="text-orange-400" size={24} />, title: t('landing.feature3Title'), description: t('landing.feature3Desc') },
    { icon: <ShieldCheck className="text-purple-400" size={24} />, title: t('landing.feature4Title'), description: t('landing.feature4Desc') },
  ];

  const steps = [
    { number: t('landing.step1Number'), title: t('landing.step1Title'), description: t('landing.step1Desc') },
    { number: t('landing.step2Number'), title: t('landing.step2Title'), description: t('landing.step2Desc') },
    { number: t('landing.step3Number'), title: t('landing.step3Title'), description: t('landing.step3Desc') },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans scroll-smooth">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Sahayak</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-sm font-medium hover:text-blue-400 transition-colors">{t('nav.home')}</a>
              <a href="#features" className="text-sm font-medium hover:text-blue-400 transition-colors">{t('nav.features')}</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-blue-400 transition-colors">{t('nav.howItWorks')}</a>
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-2 py-1.5 text-white outline-none cursor-pointer hover:bg-slate-700"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="hinglish">Hinglish</option>
              </select>
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/20"
              >
                {t('nav.login')}
              </button>
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-b border-slate-700 p-4 space-y-4 animate-slide-up">
            <a href="#home" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium">{t('nav.home')}</a>
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium">{t('nav.features')}</a>
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium">{t('nav.howItWorks')}</a>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl"
            >
              {t('nav.login')}
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full text-blue-400 text-sm font-bold mb-8">
            <Zap size={16} /> {t('landing.badge')}
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            {t('landing.headline')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{t('landing.headlineHighlight')}</span> {t('landing.headlineEnd')}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('landing.subtext')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl shadow-blue-600/20"
            >
              {t('landing.getStarted')} <ArrowRight size={20} />
            </button>
            <a 
              href="#how-it-works"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-2xl text-lg flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              {t('landing.learnMore')}
            </a>
          </div>
          
          {/* Hero Visual */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full"></div>
            <div className="relative bg-slate-800/50 border border-slate-700 p-2 rounded-3xl shadow-2xl backdrop-blur-sm max-w-4xl mx-auto overflow-hidden">
              <div className="bg-slate-900 rounded-2xl p-6 flex flex-col gap-4 text-left">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">B</div>
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-sm text-sm">Hi! How can I help you find a scheme today?</div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">U</div>
                  <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-sm text-sm">I'm a student from Bihar looking for scholarships.</div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">B</div>
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-sm text-sm">Searching... I found the Bihar Post Matric Scholarship! Would you like more details?</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-800/50 border-y border-slate-800 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('landing.featuresTitle')}</h2>
          <p className="text-slate-400">{t('landing.featuresSubtext')}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all group">
              <div className="bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('landing.howItWorksTitle')}</h2>
            <p className="text-slate-400">{t('landing.howItWorksSubtext')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 -translate-y-1/2 z-0"></div>
            
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl mb-6 shadow-xl shadow-blue-600/30">
                  {s.number}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-slate-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <ShieldCheck size={64} className="mx-auto text-white/90 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('landing.trustTitle')}</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-2">
                <CheckCircle size={20} />
                <span className="font-medium">{t('landing.trust1')}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-2">
                <Users size={20} />
                <span className="font-medium">{t('landing.trust2')}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="mt-10 bg-white text-blue-600 hover:bg-slate-100 font-bold px-10 py-4 rounded-2xl transition-all hover:scale-105"
            >
              {t('landing.startFree')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-6 justify-center md:justify-start">
              <ShieldCheck size={28} className="text-blue-500" />
              <span className="text-2xl font-bold text-white tracking-tight">Sahayak</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">{t('landing.footerDesc')}</p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">{t('landing.quickLinks')}</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#home" className="hover:text-blue-400">{t('nav.home')}</a></li>
              <li><a href="#features" className="hover:text-blue-400">{t('nav.features')}</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-400">{t('nav.howItWorks')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">{t('landing.contactUs')}</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li>{t('landing.contactEmail')}</li>
              <li>{t('landing.contactCity')}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">{t('landing.legal')}</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-blue-400">{t('landing.privacyPolicy')}</a></li>
              <li><a href="#" className="hover:text-blue-400">{t('landing.terms')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-slate-900 pt-10 text-center">
          <p className="text-slate-600 text-[10px] md:text-xs mb-4">{t('landing.disclaimer')}</p>
          <p className="text-slate-700 text-xs">© {new Date().getFullYear()} Sahayak. {t('landing.copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
