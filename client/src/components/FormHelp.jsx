import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, LifeBuoy, Mic, MicOff } from 'lucide-react';

const FormHelp = ({ language = 'en' }) => {
  const welcomeMsgEn = "Hello! I am your Sahayak AI. Keep me open in a side window while you fill out your application on the official portal. What term or step do you need help with?";
  const welcomeMsgHi = "नमस्ते! मैं आपका सहायक (Sahayak) AI हूँ। आधिकारिक पोर्टल पर अपना आवेदन भरते समय मुझे साइड विंडो में खुला रखें। आपको किस शब्द या चरण में मदद चाहिए?";
  const welcomeMsgHinglish = "Namaste! Main aapka Sahayak AI hoon. Official portal par form bharte waqt mujhe side window mein khula rakhein. Aapko kis term ya step mein madad chahiye?";

  const getWelcomeMsg = () => language === 'hi' ? welcomeMsgHi : language === 'hinglish' ? welcomeMsgHinglish : welcomeMsgEn;

  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: getWelcomeMsg() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => {
          const current = prev.trim();
          return current ? current + " " + transcript : transcript;
        });
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = (e) => {
    e.preventDefault();
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : language === 'hinglish' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Your browser does not support speech recognition. Try Google Chrome.");
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Update the first message if language changes and it hasn't been overwritten
    if (messages.length === 1 && messages[0].id === 1) {
      setMessages([{ id: 1, sender: 'bot', text: getWelcomeMsg() }]);
    }
    scrollToBottom();
  }, [messages, isTyping, language]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('http://localhost:3000/api/help', { query: userText, language });
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: res.data.text }]);
      }, 500);

    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "Sorry, I am having trouble connecting to the server right now." }]);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto animate-slide-up w-full">
      <div className="bg-slate-800 border-b border-slate-700 p-4 shrink-0 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-full text-white">
          <LifeBuoy size={20} />
        </div>
        <div>
          <h2 className="font-bold text-white">{language === 'hi' ? 'सहायक AI' : 'Sahayak AI'}</h2>
          <p className="text-xs text-slate-400">{language === 'hi' ? 'आधिकारिक फॉर्म भरते समय प्रश्न पूछें' : language === 'hinglish' ? 'Official forms bharte waqt sawaal poochein' : 'Ask questions while filling out official forms'}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 border border-slate-600 text-blue-400'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <LifeBuoy size={16} />}
              </div>
              
              <div className={`px-4 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-slate-700 text-white border border-slate-600 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[75%]">
              <div className="shrink-0 h-8 w-8 rounded-full bg-slate-700 border border-slate-600 text-blue-400 flex items-center justify-center mt-1">
                <LifeBuoy size={16} />
              </div>
              <div className="bg-slate-700 border border-slate-600 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800 border-t border-slate-700 p-4 shadow-sm shrink-0">
        <form onSubmit={handleSend} className="relative flex items-end gap-2">
          <input
            key={`formhelp-input-${messages.length}`}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder={language === 'hi' ? "उदाहरण: अधिवास क्या है?" : language === 'hinglish' ? "E.g., Domicile kya hai?" : "E.g., What is Domicile?"}
            disabled={isTyping}
            className="w-full bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-2xl px-4 py-0 focus:bg-slate-600 focus:border-blue-500 outline-none h-[60px] text-[16px] leading-[60px]"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={toggleListening}
            className={`rounded-full p-3.5 shadow-sm shrink-0 flex items-center justify-center h-[52px] w-[52px] transition-colors ${
              isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600'
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-full p-3.5 shadow-sm shrink-0 flex items-center justify-center h-[52px] w-[52px] transition-colors"
          >
            <Send size={20} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormHelp;
