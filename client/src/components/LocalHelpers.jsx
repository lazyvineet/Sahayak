import React, { useState } from 'react';
import { MapPin, Phone, Star, UserCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const mockHelpers = [
  {
    id: 1,
    name: "Common Service Centre (CSC) - Patna",
    type: "Official Center",
    rating: 4.8,
    reviews: 124,
    contact: "+91 98765 43210",
    distance: "1.2 km",
    address: "Boring Road, Patna, Bihar",
    workingHours: "9:00 AM - 6:00 PM"
  },
  {
    id: 2,
    name: "Ramesh Kumar",
    type: "Verified Agent",
    rating: 4.5,
    reviews: 89,
    contact: "+91 91234 56789",
    distance: "2.5 km",
    address: "Kankarbagh, Patna, Bihar",
    workingHours: "10:00 AM - 5:00 PM"
  },
  {
    id: 3,
    name: "Gram Panchayat Office",
    type: "Govt Office",
    rating: 4.2,
    reviews: 45,
    contact: "0612-223344",
    distance: "3.8 km",
    address: "Phulwari Sharif, Patna",
    workingHours: "10:00 AM - 4:00 PM"
  }
];

const LocalHelpers = () => {
  const { t } = useLanguage();
  const [contactedHelpers, setContactedHelpers] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const handleContact = (helper) => {
    if (!contactedHelpers.includes(helper.id)) {
      setContactedHelpers([...contactedHelpers, helper.id]);
      setToastMessage(`Contact request sent to ${helper.name}!`);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 w-full max-w-4xl mx-auto animate-slide-up relative pb-20">
      
      {toastMessage && (
        <div className="fixed top-20 right-10 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
          <CheckCircle2 size={24} />
          <p className="font-bold">{toastMessage}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">{t('helpers.title')}</h2>
          <p className="text-slate-400 mt-1">{t('helpers.subtext')}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockHelpers.map((helper) => (
          <div key={helper.id} className="bg-slate-700 rounded-xl border border-slate-600 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-white">{helper.name}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-900/40 text-blue-300 mt-1 border border-blue-800">
                  <UserCheck size={12} /> {helper.type}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-yellow-900/40 px-2 py-1 rounded text-yellow-400 font-bold text-sm border border-yellow-700">
                <Star size={14} className="fill-yellow-500 text-yellow-500" />
                {helper.rating}
              </div>
            </div>

            <div className="space-y-2 mt-4 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-white">{helper.distance} {t('helpers.away')}</p>
                  <p className="text-xs text-slate-400">{helper.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <p className="font-medium text-blue-400">{helper.contact}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 shrink-0 text-[10px] uppercase font-bold tracking-wider px-1 bg-slate-600 rounded">HOURS</span>
                <p className="text-xs font-medium text-slate-300">{helper.workingHours}</p>
              </div>
              <p className="text-xs text-slate-500 pt-1">{helper.reviews} {t('helpers.reviews')}</p>
            </div>
            
            <div className="mt-5 pt-4 border-t border-slate-600 grid grid-cols-2 gap-2">
              <a 
                href={`tel:${helper.contact.replace(/\s+/g, '')}`}
                className="w-full bg-slate-600 hover:bg-slate-500 text-white font-medium py-2 rounded-lg border border-slate-500 flex items-center justify-center gap-2 transition-colors"
              >
                <Phone size={16} /> Call Now
              </a>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(helper.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg border border-blue-500 flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin size={16} /> Map
              </a>
            </div>
            
            <div className="mt-2">
              {contactedHelpers.includes(helper.id) ? (
                <button 
                  disabled
                  className="w-full bg-green-900/50 text-green-400 text-sm font-medium py-2 rounded-lg border border-green-700 flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <CheckCircle2 size={16} /> {t('helpers.contacted')}
                </button>
              ) : (
                <button 
                  onClick={() => handleContact(helper)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium py-2 rounded-lg border border-slate-600 transition-colors"
                >
                  {t('helpers.contact')} Online
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocalHelpers;
