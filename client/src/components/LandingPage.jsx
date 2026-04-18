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

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const features = [
    {
      icon: <Zap className="text-blue-400" size={24} />,
      title: "AI-based Eligibility Detection",
      description: "Our smart assistant analyzes your profile to find exactly which schemes you qualify for in seconds."
    },
    {
      icon: <MessageSquare className="text-green-400" size={24} />,
      title: "Works in Simple Language",
      description: "No complex jargon. Talk to us in English, Hindi, or Hinglish just like you're chatting with a friend."
    },
    {
      icon: <LifeBuoy className="text-orange-400" size={24} />,
      title: "Step-by-Step Help",
      description: "We guide you through the entire process, explaining required documents and application steps clearly."
    },
    {
      icon: <ShieldCheck className="text-purple-400" size={24} />,
      title: "Verified Govt Sources",
      description: "We only provide information and links from official .gov.in websites to ensure your safety."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Tell us about yourself",
      description: "Answer a few simple questions about your income, state, and occupation."
    },
    {
      number: "02",
      title: "See eligible schemes",
      description: "Get a curated list of government schemes designed specifically for your profile."
    },
    {
      number: "03",
      title: "Get expert guidance",
      description: "Learn how to apply and track your application progress in one single dashboard."
    }
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
              <a href="#home" className="text-sm font-medium hover:text-blue-400 transition-colors">Home</a>
              <a href="#features" className="text-sm font-medium hover:text-blue-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-blue-400 transition-colors">How It Works</a>
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/20"
              >
                Login
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
            <a href="#home" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium">Home</a>
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium">Features</a>
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium">How It Works</a>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl"
            >
              Login
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full text-blue-400 text-sm font-bold mb-8 animate-pulse-slow">
            <Zap size={16} /> Now powered by Advanced AI
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Find Government Schemes You <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Actually Qualify</span> For
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            No long forms. No confusion. Just tell us about yourself in simple language, and let our AI assistant do the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl shadow-blue-600/20"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <a 
              href="#how-it-works"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-2xl text-lg flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              Learn More
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
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Built for Everyone</h2>
          <p className="text-slate-400">Simplifying the complex world of Indian government benefits.</p>
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
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400">Get matched with your benefits in three easy steps.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Safe, Secure & Verified</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-2">
                <CheckCircle size={20} />
                <span className="font-medium">Uses verified .gov.in sources</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-2">
                <Users size={20} />
                <span className="font-medium">Built for students & families</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="mt-10 bg-white text-blue-600 hover:bg-slate-100 font-bold px-10 py-4 rounded-2xl transition-all hover:scale-105"
            >
              Start Free Today
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
            <p className="text-slate-500 text-sm leading-relaxed">
              Your AI-powered companion for navigating Indian government schemes and benefits.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#home" className="hover:text-blue-400">Home</a></li>
              <li><a href="#features" className="hover:text-blue-400">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-400">How It Works</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li>support@sarkarsaathi.com</li>
              <li>New Delhi, India</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-slate-900 pt-10 text-center">
          <p className="text-slate-600 text-[10px] md:text-xs mb-4">
            DISCLAIMER: This is an independent assistant tool. It is NOT an official government website and we do not represent any government entity. We provide information based on publicly available government data.
          </p>
          <p className="text-slate-700 text-xs">
            © {new Date().getFullYear()} Sahayak. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
