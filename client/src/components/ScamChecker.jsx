import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Search, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const trustedDomains = ['.gov.in', '.nic.in'];

const ScamChecker = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const checkLink = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    let urlString = input.trim().toLowerCase();
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = 'https://' + urlString;
    }

    try {
      const url = new URL(urlString);
      const hostname = url.hostname;
      const isTrusted = trustedDomains.some(domain => hostname.endsWith(domain));
      
      if (isTrusted) {
        setResult({ safe: true, message: `The domain "${hostname}" appears to be an official government source. Always exercise caution.` });
      } else {
        setResult({ safe: false, message: `Warning: This may be a fake scheme. Do not pay money. Official websites usually end in .gov.in or .nic.in.` });
      }
    } catch {
      setResult({ safe: false, message: "Invalid URL format. Please enter a valid website address (e.g., pmkisan.gov.in)." });
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 w-full max-w-2xl mx-auto animate-slide-up">
      <div className="text-center mb-8">
        <div className="mx-auto bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-blue-400">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white">{t('scam.title')}</h2>
        <p className="text-slate-400 mt-2">{t('scam.subtext')}</p>
      </div>

      <div className="bg-slate-700 rounded-2xl shadow-sm border border-slate-600 p-6">
        <form onSubmit={checkLink} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('scam.placeholder')}
              className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 focus:bg-slate-700 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors shrink-0"
          >
            {t('scam.check')}
          </button>
        </form>

        {result && (
          <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 animate-slide-up ${
            result.safe ? 'bg-green-900/40 border-green-800' : 'bg-red-900/40 border-red-800'
          }`}>
            {result.safe ? (
              <ShieldCheck className="text-green-400 shrink-0 mt-0.5" size={24} />
            ) : (
              <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={24} />
            )}
            <div>
              <h4 className={`font-bold ${result.safe ? 'text-green-200' : 'text-red-200'}`}>
                {result.safe ? t('scam.safe') : t('scam.alert')}
              </h4>
              <p className={`text-sm mt-1 ${result.safe ? 'text-green-300' : 'text-red-300'}`}>
                {result.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScamChecker;
