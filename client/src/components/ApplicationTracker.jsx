import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/applications');
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to load applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full pt-10">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getCardBgColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/30 border-green-400';
      case 'Pending': return 'bg-yellow-500/30 border-yellow-400';
      case 'Rejected': return 'bg-red-500/30 border-red-400';
      case 'Just Applied': return 'bg-gray-400/30 border-gray-400';
      default: return 'bg-slate-700 border-slate-600';
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 w-full max-w-4xl mx-auto animate-slide-up">
      <h2 className="text-2xl font-bold text-white mb-6">My Applications</h2>
      
      {applications.length === 0 ? (
        <div className="bg-slate-700 rounded-xl p-8 text-center shadow-sm border border-slate-600">
          <p className="text-slate-300">You have no tracked applications yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className={`${getCardBgColor(app.status)} rounded-xl p-5 shadow-sm flex flex-col gap-4 border`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-600/50 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{app.schemeName}</h3>
                  <p className="text-sm text-slate-300 mt-1">Applied on: {app.date}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {app.status === 'Pending' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <Clock size={16} /> Pending
                    </span>
                  )}
                  {app.status === 'Approved' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle size={16} /> Approved
                    </span>
                  )}
                  {app.status === 'Rejected' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <XCircle size={16} /> Rejected
                    </span>
                  )}
                  {app.status === 'Just Applied' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700">
                      <Clock size={16} /> Just Applied
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-sm">
                  <span className="font-semibold text-white">Highlights: </span>
                  <span className="text-slate-300">{app.benefit}</span>
                </div>
                
                {app.link && app.link !== '#' && (
                  <a 
                    href={app.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
                  >
                    Visit Official Portal
                  </a>
                )}
              </div>
            </div>

          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
