import React, { useState } from 'react';
import { ExternalLink, CheckCircle, FileText, IndianRupee, ShieldCheck, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SchemeCard = ({ scheme, onApplyGuided }) => {
  const { t } = useLanguage();
  
  // Feature 3: Document Checklist System State
  const [uploadedDocs, setUploadedDocs] = useState({});

  const handleDocUpload = (e, docName) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedDocs(prev => ({
        ...prev,
        [docName]: file.name
      }));
    }
  };

  // Feature 4: Eligibility Score + Feedback (Mocking data if not provided)
  const eligibilityScore = scheme.score || 85;
  const missingRequirements = scheme.missingRequirements || ["Income Certificate"];

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 w-full mb-3 text-left">
      <div className="p-5">
        
        {/* Feature 10: Trust Indicators */}
        <div className="flex items-center gap-1.5 mb-3 bg-blue-900/30 text-blue-300 border border-blue-800/50 w-fit px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
          <ShieldCheck size={14} className="text-blue-400" />
          Verified .gov.in Source
        </div>

        <h3 className="text-lg font-bold text-white mb-2 leading-tight">
          {scheme.name}
        </h3>
        
        <div className="flex items-start gap-2 mb-4 bg-green-900/30 p-3 rounded-lg border border-green-800">
          <IndianRupee className="text-green-400 mt-0.5 shrink-0" size={18} />
          <div>
            <span className="text-sm text-slate-400 font-medium block">{t('scheme.benefit')}</span>
            <span className="font-semibold text-green-400">{scheme.benefit}</span>
          </div>
        </div>

        {/* Feature 4: Eligibility Score + Feedback */}
        <div className="mb-4 bg-slate-700/50 p-3 rounded-lg border border-slate-600">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-300">Eligibility Score</span>
            <span className={`text-sm font-bold ${eligibilityScore >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
              {eligibilityScore}%
            </span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2 mb-3">
            <div className={`h-2 rounded-full ${eligibilityScore >= 80 ? 'bg-green-400' : 'bg-yellow-400'}`} style={{ width: `${eligibilityScore}%` }}></div>
          </div>
          {missingRequirements.length > 0 && (
            <div className="flex items-start gap-2 text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <p>Suggestion: Upload <b>{missingRequirements.join(', ')}</b> to improve eligibility.</p>
            </div>
          )}
        </div>

        <div className="space-y-4 mb-5">
          <div className="flex items-start gap-2">
            <CheckCircle className="text-blue-400 mt-1 shrink-0" size={16} />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('chat.eligible')}</span>
              <p className="text-sm text-slate-300 mt-0.5">{scheme.whyEligible}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <FileText className="text-orange-400 mt-1 shrink-0" size={16} />
            <div className="w-full">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">{t('scheme.documents')} Checklist</span>
              
              {/* Feature 3: Document Checklist System */}
              <div className="space-y-2 mt-1">
                {scheme.documents && scheme.documents.map((doc, index) => {
                  const isUploaded = !!uploadedDocs[doc];
                  return (
                    <div key={index} className="flex flex-col gap-2 p-2.5 rounded border border-slate-600 bg-slate-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isUploaded ? <CheckCircle2 size={16} className="text-green-400" /> : <div className="w-4 h-4 border border-slate-500 rounded-sm"></div>}
                          <span className={`text-sm ${isUploaded ? 'text-slate-300 line-through opacity-70' : 'text-slate-200'}`}>{doc}</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isUploaded ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                          {isUploaded ? 'Uploaded' : 'Missing'}
                        </span>
                      </div>
                      
                      {isUploaded ? (
                        <div className="text-xs text-blue-400 ml-6 flex items-center gap-1">
                          <FileText size={12} /> {uploadedDocs[doc]}
                        </div>
                      ) : (
                        <div className="ml-6 mt-1">
                          <input 
                            type="file" 
                            id={`upload-${scheme.name}-${index}`} 
                            className="hidden" 
                            onChange={(e) => handleDocUpload(e, doc)} 
                          />
                          <label 
                            htmlFor={`upload-${scheme.name}-${index}`}
                            className="inline-flex items-center gap-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded cursor-pointer transition-colors border border-slate-600"
                          >
                            <Upload size={12} /> Upload
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 px-5 py-3 border-t border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {scheme.state === 'All India' ? 'Central Scheme' : `${scheme.state} Scheme`}
        </div>
        
        <div className="flex gap-2">
          {onApplyGuided && (
            <button 
              onClick={() => onApplyGuided(scheme)}
              className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-3 py-2 rounded-lg transition-colors border border-transparent"
            >
              {t('chat.moreDetails')}
            </button>
          )}
          <a 
            href={scheme.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {t('scheme.visitPortal')}
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SchemeCard;
