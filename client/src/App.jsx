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

// Main Application Dashboard Component
const Dashboard = ({ language, setLanguage }) => {
  const [activeTab, setActiveTab] = useState('chat');

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
            <p className="text-xs text-slate-400 font-medium italic">Your AI Government Companion</p>
          </div>
        </div>
        
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-2 py-1.5 outline-none font-medium text-white cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all hover:bg-slate-700"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="hinglish">Hinglish</option>
        </select>
      </header>

      {/* Main Content Area */}
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
      <nav className="bg-slate-900 border-t border-slate-800 flex justify-around items-center p-2 md:p-4 pb-safe shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] z-20 overflow-x-auto gap-1">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 p-2 w-16 md:w-20 rounded-xl transition-all duration-300 ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-lg scale-110 opacity-100 font-bold' : 'text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-800'}`}
        >
          <MessageSquare size={22} />
          <span className="text-[10px] md:text-xs font-semibold">Assistant</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('tracker')}
          className={`flex flex-col items-center gap-1 p-2 w-16 md:w-20 rounded-xl transition-all duration-300 ${activeTab === 'tracker' ? 'bg-blue-600 text-white shadow-lg scale-110 opacity-100 font-bold' : 'text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-800'}`}
        >
          <ClipboardList size={22} />
          <span className="text-[10px] md:text-xs font-semibold">Tracker</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('scam')}
          className={`flex flex-col items-center gap-1 p-2 w-16 md:w-20 rounded-xl transition-all duration-300 ${activeTab === 'scam' ? 'bg-blue-600 text-white shadow-lg scale-110 opacity-100 font-bold' : 'text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-800'}`}
        >
          <ShieldAlert size={22} />
          <span className="text-[10px] md:text-xs font-semibold">Scam Check</span>
        </button>

        <button 
          onClick={() => setActiveTab('helpers')}
          className={`flex flex-col items-center gap-1 p-2 w-16 md:w-20 rounded-xl transition-all duration-300 ${activeTab === 'helpers' ? 'bg-blue-600 text-white shadow-lg scale-110 opacity-100 font-bold' : 'text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-800'}`}
        >
          <Users size={22} />
          <span className="text-[10px] md:text-xs font-semibold">Helpers</span>
        </button>

        <button 
          onClick={() => setActiveTab('help')}
          className={`flex flex-col items-center gap-1 p-2 w-16 md:w-20 rounded-xl transition-all duration-300 ${activeTab === 'help' ? 'bg-blue-600 text-white shadow-lg scale-110 opacity-100 font-bold' : 'text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-800'}`}
        >
          <LifeBuoy size={22} />
          <span className="text-[10px] md:text-xs font-semibold">Saathi AI</span>
        </button>
      </nav>
    </div>
  );
};

function App() {
  const [language, setLanguage] = useState('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = (email) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    navigate('/app');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to="/app" />
          ) : (
            <Auth onLogin={handleLogin} />
          )
        } 
      />
      <Route 
        path="/app" 
        element={
          isAuthenticated ? (
            <Dashboard language={language} setLanguage={setLanguage} />
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
