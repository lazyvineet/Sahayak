import React from 'react';
import { ExternalLink, CheckCircle, FileText, IndianRupee } from 'lucide-react';

const SchemeCard = ({ scheme, onApplyGuided }) => {
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 w-full mb-3 text-left">
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 leading-tight">
          {scheme.name}
        </h3>
        
        <div className="flex items-start gap-2 mb-4 bg-green-900/30 p-3 rounded-lg border border-green-800">
          <IndianRupee className="text-green-400 mt-0.5 shrink-0" size={18} />
          <div>
            <span className="text-sm text-slate-400 font-medium block">Benefit</span>
            <span className="font-semibold text-green-400">{scheme.benefit}</span>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-start gap-2">
            <CheckCircle className="text-blue-400 mt-1 shrink-0" size={16} />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Why you are eligible</span>
              <p className="text-sm text-slate-300 mt-0.5">{scheme.whyEligible}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <FileText className="text-orange-400 mt-1 shrink-0" size={16} />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Required Documents</span>
              <ul className="text-sm text-slate-300 mt-1 list-disc list-inside">
                {scheme.documents && scheme.documents.map((doc, index) => (
                  <li key={index} className="mb-0.5">{doc}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 px-5 py-3 border-t border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {scheme.state === 'All India' ? 'Central Scheme' : `${scheme.state} State Scheme`}
        </div>
        
        <div className="flex gap-2">
          {onApplyGuided && (
            <button 
              onClick={() => onApplyGuided(scheme)}
              className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-3 py-2 rounded-lg transition-colors border border-transparent"
            >
              {scheme.language === 'hi' ? 'अधिक विवरण' : 'More Detail'}
            </button>
          )}
          <a 
            href={scheme.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Official Site
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SchemeCard;
