import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck, MessageSquare, ClipboardList, ShieldAlert, Users, LifeBuoy } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import ApplicationTracker from './components/ApplicationTracker';
import ScamChecker from './components/ScamChecker';
import LocalHelpers from './components/LocalHelpers';
import Auth from './components/Auth';
import FormHelp from './components/FormHelp';
import LandingPage from './components/LandingPage';
import { useLanguage } from './context/LanguageContext';

// Main Application Dashboard
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const { language, changeLanguage, t } = useLanguage();

  return (
    <div className="flex flex-col h-screen bg-slate-800 font-sans">
      {/* Header */}
      <header className="bg-slate-900 shadow-md border-b border-slate-800 px-6 py-4 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-900/20">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Sahayak</h1>
            <p className="text-xs text-slate-400 font-medium italic">{t('app.tagline')}</p>
          </div>
        </div>
        
        <select 
          value={language} 
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-2 py-1.5 outline-none font-medium text-white cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all hover:bg-slate-700"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="hinglish">Hinglish</option>
        </select>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <div className={activeTab === 'chat' ? 'h-full' : 'hidden h-full'}>
          <ChatInterface language={language} />
        </div>
        <div className={activeTab === 'tracker' ? 'h-full' : 'hidden h-full'}>
          <ApplicationTracker language={language} />
        </div>
        <div className={activeTab === 'scam' ? 'h-full' : 'hidden h-full'}>
          <ScamChecker language={language} />
        </div>
        <div className={activeTab === 'helpers' ? 'h-full' : 'hidden h-full'}>
          <LocalHelpers language={language} />
        </div>
        <div className={activeTab === 'help' ? 'h-full' : 'hidden h-full'}>
          <FormHelp language={language} />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-slate-900 border-t border-slate-800 flex justify-around items-center p-2 md:p-3 pb-safe shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] z-20 overflow-x-auto gap-1">
        {[
          { id: 'chat',    icon: <MessageSquare size={20} />, label: t('nav.assistant') },
          { id: 'tracker', icon: <ClipboardList size={20} />, label: t('nav.tracker') },
          { id: 'scam',    icon: <ShieldAlert size={20} />,   label: t('nav.scamCheck') },
          { id: 'helpers', icon: <Users size={20} />,         label: t('nav.helpers') },
          { id: 'help',    icon: <LifeBuoy size={20} />,      label: t('nav.saathiAI') },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 min-w-[60px] md:min-w-[72px] rounded-xl transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg scale-110 font-bold'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span className="text-[9px] md:text-[11px] font-semibold leading-tight text-center">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/app');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/app" />
            : <Auth onLogin={handleLogin} />
        }
      />
      <Route
        path="/app"
        element={
          isAuthenticated
            ? <Dashboard />
            : <Navigate to="/login" />
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
