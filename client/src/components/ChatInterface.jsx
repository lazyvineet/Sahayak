import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, ShieldCheck, Upload, ArrowRight, Mic, MicOff, LifeBuoy, CheckCircle, Edit3 } from 'lucide-react';
import SchemeCard from './SchemeCard';
import { useLanguage } from '../context/LanguageContext';

const statesList = [
  "Select State", "All India", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const getDiscoveryQuestions = (lang) => {
  if (lang === 'hi') {
    return [
      { key: 'name', type: 'text', text: "नमस्ते! सहायक (Sahayak) में आपका स्वागत है। आपका नाम क्या है?" },
      { key: 'income', type: 'text', text: "आपकी वार्षिक पारिवारिक आय कितनी है? (कृपया केवल संख्याएं दर्ज करें, उदा., 150000)" },
      { key: 'category', type: 'dropdown', text: "आपकी सामाजिक श्रेणी क्या है?", options: ["श्रेणी चुनें", "General", "OBC", "SC", "ST", "Minority"] },
      { key: 'state', type: 'dropdown', text: "आप किस राज्य में रहते हैं?", options: statesList },
      { key: 'isStudent', type: 'dropdown', text: "क्या आप अभी छात्र हैं?", options: ["विकल्प चुनें", "हाँ (Yes)", "नहीं (No)"] }
    ];
  } else if (lang === 'hinglish') {
    return [
      { key: 'name', type: 'text', text: "Namaste! Sahayak mein aapka swagat hai. Aapka naam kya hai?" },
      { key: 'income', type: 'text', text: "Aapki saalana family income kitni hai? (Kripya sirf numbers likhein, e.g., 150000)" },
      { key: 'category', type: 'dropdown', text: "Aapki social category kya hai?", options: ["Category chunein", "General", "OBC", "SC", "ST", "Minority"] },
      { key: 'state', type: 'dropdown', text: "Aap kis state mein rehte hain?", options: statesList },
      { key: 'isStudent', type: 'dropdown', text: "Kya aap abhi student hain?", options: ["Option chunein", "Haan (Yes)", "Nahi (No)"] }
    ];
  }
  return [
    { key: 'name', type: 'text', text: "Namaste! Welcome to Sahayak. What is your name?" },
    { key: 'income', type: 'text', text: "What is your annual family income? (Please enter numbers only, e.g., 150000)" },
    { key: 'category', type: 'dropdown', text: "What is your social category?", options: ["Select Category", "General", "OBC", "SC", "ST", "Minority"] },
    { key: 'state', type: 'dropdown', text: "Which state do you live in?", options: statesList },
    { key: 'isStudent', type: 'dropdown', text: "Are you currently a student?", options: ["Select Option", "Yes", "No"] }
  ];
};

const getTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatInterface = ({ language = 'en' }) => {
  const { t, changeLanguage } = useLanguage();
  const discoveryQuestions = getDiscoveryQuestions(language);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Discovery Mode State
  const [mode, setMode] = useState('discovery'); // 'discovery' | 'application' | 'finished' | 'suggestions'
  const [discoveryStep, setDiscoveryStep] = useState(0);
  const [discoveryData, setDiscoveryData] = useState({});

  // Application Mode State
  const [appScheme, setAppScheme] = useState(null);
  const [appQuestions, setAppQuestions] = useState([]);
  const [appStep, setAppStep] = useState(0);
  const [appData, setAppData] = useState({});
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const isComponentMounted = useRef(true);

  const fetchRecommendations = async (profile) => {
    setIsTyping(true);
    try {
      const recommendRes = await axios.post('http://localhost:8000/api/recommend', profile);
      const recommendedSchemes = recommendRes.data;

      if (!isComponentMounted.current) return;
      setIsTyping(false);

      let botResponseText = language === 'hi' ? `धन्यवाद, ${profile.name}। आपकी प्रोफ़ाइल के आधार पर, ` : language === 'hinglish' ? `Thank you, ${profile.name}. Aapki profile ke hisaab se, ` : `Thank you, ${profile.name}. Based on your profile, `;

      if (recommendedSchemes.length > 0) {
        botResponseText += language === 'hi'
          ? `मुझे ${recommendedSchemes.length} योजनाएं मिली हैं जिनके लिए आप पात्र हो सकते हैं।`
          : language === 'hinglish'
            ? `mujhe ${recommendedSchemes.length} schemes mili hain jinke liye aap eligible ho sakte hain.`
            : `I found ${recommendedSchemes.length} schemes you might be eligible for.`;

        // Feature 9: Benefit Summary Calculation (Mock estimate based on count)
        const estBenefit = recommendedSchemes.length * 15000 + 5000;
        const benefitText = language === 'hi'
          ? `👉 आप प्रति वर्ष लगभग ₹${estBenefit.toLocaleString()} के लाभ प्राप्त कर सकते हैं!`
          : language === 'hinglish'
            ? `👉 Aap per year lagbhag ₹${estBenefit.toLocaleString()} ke benefits receive kar sakte hain!`
            : `👉 You can receive benefits worth approximately ₹${estBenefit.toLocaleString()} per year!`;

        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'bot',
          text: botResponseText + '\n\n' + benefitText,
          schemes: recommendedSchemes,
          timestamp: getTimestamp()
        }]);

        // Feature 6: Smart Follow-up Suggestions
        setTimeout(() => {
          if (isComponentMounted.current) {
            setMessages(prev => [...prev, {
              id: Date.now() + 1,
              sender: 'bot',
              text: language === 'hi' ? "आप आगे क्या करना चाहेंगे?" : language === 'hinglish' ? "Aap aage kya karna chahenge?" : "What would you like to do next?",
              suggestions: [
                { id: 'apply', label: language === 'hi' ? "आवेदन करने में मदद करें" : language === 'hinglish' ? "Apply karne mein help karein" : "Help me apply" },
                { id: 'helpers', label: language === 'hi' ? "पास के सहायक खोजें" : language === 'hinglish' ? "Nearby helpers dhundein" : "Find nearby help" }
              ],
              timestamp: getTimestamp()
            }]);
            setMode('suggestions');
          }
        }, 1500);

      } else {
        botResponseText += language === 'hi'
          ? `मुझे इस समय आपकी प्रोफ़ाइल से मेल खाने वाली कोई विशिष्ट योजना नहीं मिली।`
          : language === 'hinglish'
            ? `Mujhe abhi aapki profile se match karti koi specific scheme nahi mili.`
            : `I couldn't find any specific schemes matching your profile at the moment.`;
        setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: botResponseText, timestamp: getTimestamp() }]);
      }
    } catch (error) {
      if (!isComponentMounted.current) return;
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "Error fetching schemes.", timestamp: getTimestamp() }]);
    }
  };

  useEffect(() => {
    // Feature 1: Profile Memory
    const savedProfileStr = localStorage.getItem('sahayak_profile');
    if (savedProfileStr) {
      try {
        const savedProfile = JSON.parse(savedProfileStr);
        setDiscoveryData(savedProfile);
        setDiscoveryStep(discoveryQuestions.length); // skip questions

        setMessages([
          {
            id: Date.now(),
            sender: 'bot',
            text: language === 'hi' ? `वापसी पर स्वागत है, ${savedProfile.name}! मुझे आपकी प्रोफ़ाइल याद है।` : language === 'hinglish' ? `Welcome back, ${savedProfile.name}! Mujhe aapki profile yaad hai.` : `Welcome back, ${savedProfile.name}! I remember your details. Let me fetch the latest schemes for you...`,
            timestamp: getTimestamp()
          }
        ]);

        // Auto fetch
        setTimeout(() => fetchRecommendations(savedProfile), 800);
      } catch (e) {
        setMessages([{ id: Date.now(), sender: 'bot', text: discoveryQuestions[0].text, timestamp: getTimestamp() }]);
      }
    } else {
      setMessages([{ id: Date.now(), sender: 'bot', text: discoveryQuestions[0].text, timestamp: getTimestamp() }]);
    }

    return () => { isComponentMounted.current = false; };
  }, []);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);

        // Feature 2: Voice Input Auto-Send
        setTimeout(() => {
          handleSend(null, null, transcript);
        }, 800);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language, mode, discoveryStep, appStep, discoveryData, appData, appQuestions, appScheme]);

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
        alert("Your browser does not support speech recognition.");
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const resetChat = (clearProfile = false) => {
    if (clearProfile) {
      localStorage.removeItem('sahayak_profile');
    }
    setMessages([{ id: Date.now(), sender: 'bot', text: discoveryQuestions[0].text, timestamp: getTimestamp() }]);
    setDiscoveryStep(0);
    setDiscoveryData({});
    setMode('discovery');
    setInput('');
    setAppScheme(null);
    setAppQuestions([]);
    setAppStep(0);
    setAppData({});
  };

  const handleMoreDetail = async (scheme) => {
    setIsTyping(true);
    try {
      const res = await axios.post('http://localhost:8000/api/describe', { schemeName: scheme.name, language });
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: res.data.description, timestamp: getTimestamp() }]);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "Sorry, I couldn't fetch more details right now.", timestamp: getTimestamp() }]);
    }
  };

  const finishApplication = async (scheme, data) => {
    setMode('finished');
    try {
      await axios.post('http://localhost:8000/api/applications', {
        schemeName: scheme.name, link: scheme.link, benefit: scheme.benefit || 'Standard Scheme Benefits'
      });
      setMessages(prev => [...prev, { id: Date.now() - 1, sender: 'bot', text: "✅ I've automatically added this to your Application Tracker so you can follow up later.", timestamp: getTimestamp() }]);
    } catch (err) { }

    let summaryText = `Excellent! You have provided all necessary details for ${scheme.name}. Here is your application summary:\n\n`;
    Object.keys(data).forEach(k => { summaryText += `• ${k}: ${data[k]}\n`; });

    setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: summaryText, timestamp: getTimestamp() }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'bot', text: "Are you ready to proceed to the official portal to submit this information?",
        isFinalRedirect: true, schemeLink: scheme.link, timestamp: getTimestamp()
      }]);
    }, 800);
  };

  const handleSend = async (e, filePayload = null, autoText = null) => {
    if (e) e.preventDefault();

    const inputText = (autoText !== null ? autoText : input).trim();

    if (mode === 'suggestions') {
      if (!inputText) return;
      setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: inputText, timestamp: getTimestamp() }]);
      setInput('');
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "Please select an option from above or navigate to the respective tabs.", timestamp: getTimestamp() }]);
      }, 500);
      return;
    }

    if (mode === 'discovery') {
      if (!inputText || inputText.startsWith('Select')) return;
      setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: inputText, timestamp: getTimestamp() }]);
      setInput('');

      // Feature 7: Auto Language Detection
      const hasHindi = /[\u0900-\u097F]/.test(inputText);
      if (hasHindi && language !== 'hi' && language !== 'hinglish') {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 10, sender: 'bot',
            text: "मैंने देखा कि आप हिंदी में लिख रहे हैं। क्या आप भाषा को हिंदी में बदलना चाहेंगे?",
            isLangSuggest: true,
            timestamp: getTimestamp()
          }]);
        }, 800);
      }

      const currentKey = discoveryQuestions[discoveryStep].key;

      if (currentKey === 'income' && isNaN(inputText.replace(/ /g, ''))) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: Date.now() + 1, sender: 'bot',
            text: language === 'hi' ? "अमान्य इनपुट! कृपया अपनी आय केवल संख्याओं में दर्ज करें।" : "Invalid input! Please enter numbers only.",
            isError: true, timestamp: getTimestamp()
          }]);
        }, 300);
        return;
      }

      const newFormData = { ...discoveryData, [currentKey]: inputText };
      setDiscoveryData(newFormData);
      setIsTyping(true);

      setTimeout(async () => {
        setIsTyping(false);
        if (discoveryStep < discoveryQuestions.length - 1) {
          const nextStep = discoveryStep + 1;
          setDiscoveryStep(nextStep);
          setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: discoveryQuestions[nextStep].text, timestamp: getTimestamp() }]);
        } else {
          setIsTyping(true);
          setDiscoveryStep(discoveryStep + 1);

          try {
            const combinedText = `Income is ${newFormData.income}. Category is ${newFormData.category}. I live in ${newFormData.state}. Student status: ${newFormData.isStudent}.`;
            const analyzeRes = await axios.post('http://localhost:8000/api/analyze', { text: combinedText });
            const profile = analyzeRes.data;

            const finalProfile = {
              name: newFormData.name,
              income: profile.income || parseInt(newFormData.income.replace(/\D/g, ''), 10) || null,
              category: profile.category || newFormData.category,
              state: profile.state || newFormData.state,
              isStudent: profile.isStudent !== null ? profile.isStudent : (newFormData.isStudent.toLowerCase() === 'yes')
            };

            // Save to Profile Memory (Feature 1)
            localStorage.setItem('sahayak_profile', JSON.stringify(finalProfile));

            await fetchRecommendations(finalProfile);
          } catch (error) {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "Error fetching schemes.", timestamp: getTimestamp() }]);
          }
        }
      }, 600);
    }

    else if (mode === 'application') {
      const currentQ = appQuestions[appStep];
      let userDisplay = "";
      let answerValue = "";

      if (currentQ.isDoc) {
        if (!filePayload) return;
        userDisplay = `📄 Uploaded: ${filePayload.name}`;
        answerValue = `[File] ${filePayload.name}`;
      } else {
        if (!inputText) return;
        answerValue = inputText;
        userDisplay = answerValue;

        if (currentQ.type === 'number' && isNaN(answerValue.replace(/ /g, ''))) {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: "Invalid input! Please enter numbers only.", isError: true, timestamp: getTimestamp() }]);
          }, 300);
          return;
        }
      }

      setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userDisplay, timestamp: getTimestamp() }]);
      setInput('');

      const newAppData = { ...appData, [currentQ.name]: answerValue };
      setAppData(newAppData);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        if (appStep < appQuestions.length - 1) {
          const nextStep = appStep + 1;
          setAppStep(nextStep);
          setMessages(prev => [...prev, {
            id: Date.now(), sender: 'bot', text: appQuestions[nextStep].text,
            progress: `Step ${nextStep + 1} of ${appQuestions.length}`, timestamp: getTimestamp()
          }]);
        } else {
          finishApplication(appScheme, newAppData);
        }
      }, 600);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleSend(null, file);
  };

  const renderInputArea = () => {
    if (mode === 'finished') {
      return <div className="w-full bg-slate-700 border border-slate-600 rounded-2xl px-4 py-3.5 text-slate-300 text-center opacity-70">Guided application complete.</div>;
    }
    if (mode === 'suggestions') {
      return <div className="w-full bg-slate-700 border border-slate-600 rounded-2xl px-4 py-3.5 text-slate-400 text-center opacity-70">Please select an option above.</div>;
    }

    if (mode === 'discovery') {
      if (discoveryStep >= discoveryQuestions.length) {
        return <textarea value="" disabled placeholder="Chat finished. Restart to search again." className="w-full bg-slate-700 border border-slate-600 rounded-2xl px-4 py-3 opacity-50 outline-none resize-none h-[52px] text-white" />;
      }
      const q = discoveryQuestions[discoveryStep];
      if (q.type === 'dropdown') {
        return (
          <select value={input} onChange={(e) => setInput(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2 focus:bg-slate-600 focus:border-blue-500 outline-none cursor-pointer h-[52px]">
            {q.options.map((opt, idx) => (
              <option key={idx} value={idx === 0 ? "" : opt} disabled={idx === 0}>{opt}</option>
            ))}
          </select>
        );
      }
      return (
        <input
          key={`discovery-${discoveryStep}`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(e); } }}
          placeholder={language === 'hi' ? "अपना उत्तर यहाँ लिखें..." : "Type your answer..."}
          className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-2xl px-4 py-2 focus:bg-slate-600 focus:border-blue-500 outline-none h-[52px] text-[16px] leading-normal"
          autoComplete="off"
        />
      );
    }

    if (mode === 'application') {
      const q = appQuestions[appStep];
      if (!q) return null;

      if (q.isDoc) {
        return (
          <div className="w-full relative h-[52px]">
            <input type="file" id="fileUpload" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
            <label htmlFor="fileUpload" className="w-full h-full bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded-2xl flex items-center justify-center gap-2 cursor-pointer text-blue-400 font-medium transition-colors">
              <Upload size={18} /> Select File to Upload
            </label>
          </div>
        );
      }

      return (
        <input
          key={`app-${appStep}`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(e); } }}
          placeholder="Type your answer..."
          className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-2xl px-4 py-2 focus:bg-slate-600 focus:border-blue-500 outline-none h-[52px] text-[16px] leading-normal"
          autoComplete="off"
        />
      );
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto animate-slide-up w-full relative">

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} mb-2`}>
            {msg.progress && (
              <span className="text-xs font-bold text-gray-400 mb-1 ml-12 uppercase tracking-widest">{msg.progress}</span>
            )}
            <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 ${msg.sender === 'user' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-700 text-blue-400 border border-slate-500 shadow-md'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <ShieldCheck size={16} />}
              </div>

              <div className={`flex flex-col gap-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap ${msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : msg.isError
                      ? 'bg-red-900/40 border border-red-800 text-red-200 rounded-tl-sm font-medium'
                      : 'bg-slate-700 text-slate-100 border border-slate-600 rounded-tl-sm'
                  }`}>
                  {msg.text}
                </div>

                {/* Feature 8: Timestamps */}
                {msg.timestamp && (
                  <span className="text-[10px] text-slate-500 font-medium px-1">
                    {msg.timestamp}
                  </span>
                )}

                {/* Feature 7: Language Suggestion Action */}
                {msg.isLangSuggest && (
                  <button onClick={() => changeLanguage('hi')} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-bold shadow transition-colors">
                    हाँ, हिंदी में बदलें (Switch to Hindi)
                  </button>
                )}

                {msg.schemes && (
                  <div className="w-full flex flex-col gap-3 mt-3">
                    {msg.schemes.map((scheme) => (
                      <SchemeCard
                        key={scheme.id}
                        scheme={{ ...scheme, language }}
                        onApplyGuided={handleMoreDetail}
                      />
                    ))}
                  </div>
                )}

                {/* Feature 6: Smart Follow-ups */}
                {msg.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.suggestions.map((sug) => (
                      <button key={sug.id} onClick={() => setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: sug.label, timestamp: getTimestamp() }])} className="bg-slate-700 hover:bg-blue-600 border border-slate-500 text-slate-200 hover:text-white text-sm px-4 py-2 rounded-full font-medium transition-colors shadow-sm">
                        {sug.label}
                      </button>
                    ))}
                  </div>
                )}

                {msg.isFinalRedirect && (
                  <a href={msg.schemeLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-md shadow-blue-200">
                    {language === 'hi' ? "आधिकारिक पोर्टल पर जाएं" : "Proceed to Official Portal"} <ArrowRight size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-2">
            <div className="flex gap-3 max-w-[75%]">
              <div className="shrink-0 h-8 w-8 rounded-full bg-slate-700 border border-slate-500 text-blue-400 flex items-center justify-center mt-1"><ShieldCheck size={16} /></div>
              <div className="bg-slate-700 border border-slate-600 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800 border-t border-slate-700 p-4 shadow-sm shrink-0">
        <form onSubmit={(e) => handleSend(e)} className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            {renderInputArea()}
          </div>
          {(!appQuestions[appStep]?.isDoc || mode !== 'application') && mode !== 'suggestions' && (
            <>
              <button
                type="button"
                onClick={toggleListening}
                className={`rounded-full p-3.5 shadow-sm shrink-0 flex items-center justify-center h-[52px] w-[52px] transition-colors ${isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600'
                  }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button
                type="submit"
                disabled={(!input.trim() && mode !== 'finished') || input.startsWith('Select') || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-full p-3.5 shadow-sm shrink-0 flex items-center justify-center h-[52px] w-[52px] transition-colors"
              >
                <Send size={20} className="ml-1" />
              </button>
            </>
          )}
        </form>
        {/* Reset / Edit Profile Actions */}
        <div className="flex justify-end gap-2 mt-3 pr-1">
          {localStorage.getItem('sahayak_profile') && (
            <button
              onClick={() => resetChat(true)}
              className="flex items-center gap-1.5 bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-800/50 transition-all"
            >
              <Edit3 size={12} />
              {language === 'hi' ? "प्रोफ़ाइल संपादित करें" : "Edit Profile"}
            </button>
          )}
          <button
            onClick={() => resetChat(false)}
            className="flex items-center gap-1.5 bg-slate-700/60 hover:bg-slate-600 text-slate-400 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-600 transition-all"
          >
            <LifeBuoy size={12} />
            {t('chat.resetChat')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
