import React, { useState } from 'react';
import axios from 'axios';
import { Mail, KeyRound, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const Auth = ({ onLogin }) => {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      if (showOtp) {
        // Verify OTP Step
        const res = await axios.post('http://localhost:3000/api/auth/verify', { email, otp });
        if (res.data.success) {
          onLogin(email);
        } else {
          setError(res.data.error || 'Invalid OTP. Please try again.');
        }
      } else {
        // Request OTP Step
        const res = await axios.post('http://localhost:3000/api/auth/signup', { email });
        if (res.data.success) {
          setMessage('OTP Sent to respective E-mail !!!..');
          setShowOtp(true);
          // Auto hide message after 3 seconds
          setTimeout(() => setMessage(''), 3000);
        } else {
          setError(res.data.error || 'Failed to send OTP.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 font-sans items-center justify-center p-6 relative">
      
      {/* Toast Notification */}
      {message && (
        <div className="absolute top-10 right-10 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
          <CheckCircle2 size={24} />
          <p className="font-bold">{message}</p>
        </div>
      )}

      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8 animate-slide-up">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Sahayak</h1>
          <p className="text-slate-400">
            {showOtp 
              ? 'Enter any random 4-digit code' 
              : 'Enter your email to login or sign up'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/40 border border-red-700 p-3 rounded-lg flex items-start gap-2 text-red-200 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!showOtp && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl pl-10 pr-4 py-3 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  required
                />
              </div>
            </div>
          )}

          {showOtp && (
            <div className="space-y-1 animate-slide-up">
              <label className="text-sm font-medium text-slate-300 ml-1">Enter 4-digit OTP</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound size={18} className="text-slate-500" />
                </div>
                <input
                  type="text"
                  maxLength="4"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234"
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl pl-10 pr-4 py-3 text-center tracking-[0.5em] font-bold text-xl focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold rounded-xl py-3.5 shadow-lg flex items-center justify-center gap-2 transition-all mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {showOtp ? 'Verify OTP' : 'Send Magic Code'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
