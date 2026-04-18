require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Load schemes data
const schemesPath = path.join(__dirname, '../data/schemes.json');
let schemes = [];
try {
  const data = fs.readFileSync(schemesPath, 'utf8');
  schemes = JSON.parse(data);
  console.log(`Loaded ${schemes.length} schemes.`);
} catch (error) {
  console.error("Error loading schemes.json:", error);
}

// -----------------------------------------------------------------
// Helper functions for NLP extraction
// -----------------------------------------------------------------

function extractIncome(text) {
  const lowerText = text.toLowerCase();

  // Match patterns like "2 lakh", "2.5 lakh", "2l", "2 l", "200000"
  const lakhMatch = lowerText.match(/([\d.]+)\s*(lakh|l|lac|lacs)s?/);
  if (lakhMatch) {
    return parseFloat(lakhMatch[1]) * 100000;
  }

  const thousandMatch = lowerText.match(/([\d.]+)\s*(thousand|k)s?/);
  if (thousandMatch) {
    return parseFloat(thousandMatch[1]) * 1000;
  }

  // Match standalone numbers like 200000 but try to avoid matching random small numbers
  const numMatch = lowerText.match(/\b([1-9][0-9]{4,})\b/);
  if (numMatch) {
    return parseInt(numMatch[1], 10);
  }

  return null; // Return null if no income is found
}

function extractState(text) {
  const lowerText = text.toLowerCase();
  const states = [
    { name: "Andhra Pradesh", keywords: ["andhra pradesh", "ap"] },
    { name: "Arunachal Pradesh", keywords: ["arunachal pradesh", "arunachal"] },
    { name: "Assam", keywords: ["assam"] },
    { name: "Bihar", keywords: ["bihar"] },
    { name: "Chhattisgarh", keywords: ["chhattisgarh"] },
    { name: "Goa", keywords: ["goa"] },
    { name: "Gujarat", keywords: ["gujarat"] },
    { name: "Haryana", keywords: ["haryana"] },
    { name: "Himachal Pradesh", keywords: ["himachal pradesh", "hp"] },
    { name: "Jharkhand", keywords: ["jharkhand"] },
    { name: "Karnataka", keywords: ["karnataka"] },
    { name: "Kerala", keywords: ["kerala"] },
    { name: "Madhya Pradesh", keywords: ["madhya pradesh", "mp"] },
    { name: "Maharashtra", keywords: ["maharashtra", "mh"] },
    { name: "Manipur", keywords: ["manipur"] },
    { name: "Meghalaya", keywords: ["meghalaya"] },
    { name: "Mizoram", keywords: ["mizoram"] },
    { name: "Nagaland", keywords: ["nagaland"] },
    { name: "Odisha", keywords: ["odisha", "orissa"] },
    { name: "Punjab", keywords: ["punjab"] },
    { name: "Rajasthan", keywords: ["rajasthan", "rj"] },
    { name: "Sikkim", keywords: ["sikkim"] },
    { name: "Tamil Nadu", keywords: ["tamil nadu", "tn"] },
    { name: "Telangana", keywords: ["telangana", "ts"] },
    { name: "Tripura", keywords: ["tripura"] },
    { name: "Uttar Pradesh", keywords: ["uttar pradesh", "up"] },
    { name: "Uttarakhand", keywords: ["uttarakhand", "uk"] },
    { name: "West Bengal", keywords: ["west bengal", "wb", "bengal"] }
  ];

  for (const stateObj of states) {
    for (const keyword of stateObj.keywords) {
      if (new RegExp(`\\b${keyword}\\b`).test(lowerText)) {
        return stateObj.name;
      }
    }
  }

  return null;
}

function extractStudentStatus(text) {
  const lowerText = text.toLowerCase();
  const studentKeywords = ["student", "school", "college", "university", "btech", "degree", "diploma", "studying", "class"];
  for (const word of studentKeywords) {
    if (new RegExp(`\\b${word}\\b`).test(lowerText)) {
      return true;
    }
  }
  return false;
}

function extractCategory(text) {
  const lowerText = text.toLowerCase();
  if (/\b(sc)\b/.test(lowerText)) return "sc";
  if (/\b(st)\b/.test(lowerText)) return "st";
  if (/\b(obc)\b/.test(lowerText)) return "obc";
  if (/\b(general|gen|ur)\b/.test(lowerText)) return "general";
  if (/\b(minority)\b/.test(lowerText)) return "minority";
  return null;
}

// -----------------------------------------------------------------
// Routes
// -----------------------------------------------------------------

app.post('/api/analyze', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const profile = {
    income: extractIncome(text),
    state: extractState(text),
    isStudent: extractStudentStatus(text),
    category: extractCategory(text)
  };

  res.json(profile);
});

app.post('/api/recommend', (req, res) => {
  const userProfile = req.body;

  // Required fields for checking:
  // If no state or income provided, we might still return general ones or prompt user.
  // But for this MVP, we will try our best with what we have.

  const income = userProfile.income !== null ? userProfile.income : Infinity;
  const state = userProfile.state;
  const isStudent = userProfile.isStudent || false;

  let matchedSchemes = schemes.filter(scheme => {
    // 1. Income check
    if (scheme.maxIncome && income > scheme.maxIncome) {
      return false;
    }

    // 2. State check
    // If scheme state is "All India", it matches everyone.
    // If scheme state is specific, user state must match it. (If user state is not provided, we might omit state-specific schemes)
    if (scheme.state !== "All India" && scheme.state !== state) {
      return false;
    }

    // 3. Student check
    if (scheme.studentOnly && !isStudent) {
      return false;
    }

    return true;
  });

  // Sort matched schemes to prioritize state-specific ones and schemes with lower max income (more targeted)
  matchedSchemes.sort((a, b) => {
    if (a.state !== "All India" && b.state === "All India") return -1;
    if (a.state === "All India" && b.state !== "All India") return 1;
    return (a.maxIncome || 0) - (b.maxIncome || 0);
  });

  // Limit to top 7 schemes
  matchedSchemes = matchedSchemes.slice(0, 7);

  res.json(matchedSchemes);
});

app.post('/api/form-structure', (req, res) => {
  const { schemeName } = req.body;
  const scheme = schemes.find(s => s.name === schemeName);

  if (!scheme) {
    return res.status(404).json({ error: "Scheme not found" });
  }

  res.json({
    fields: scheme.formFields || [],
    documents: scheme.documentsRequired || scheme.documents || []
  });
});

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Rich local knowledge base for government form terms
const knowledgeBase = {
  en: {
    domicile: "A Domicile Certificate (Residence Certificate) is issued by the state government proving you are a permanent resident. Needed for state schemes, jobs, and admissions. Apply at your local Tehsildar/SDM office with Aadhaar, Voter ID, and utility bills.",
    income: "An Income Certificate certifies your family annual income, issued by Tehsildar/Revenue Department. Required for scholarships, subsidies, and welfare schemes. Submit salary slips, bank statements, or a self-declaration affidavit.",
    aadhaar: "Aadhaar is a 12-digit unique identity number from UIDAI. It is your universal ID and address proof. Link Aadhaar to your bank account to receive Direct Benefit Transfers (DBT) from government schemes.",
    caste: "A Caste Certificate (SC/ST/OBC) from your state Revenue Department proves your social category. Mandatory for reservations in jobs, admissions, and welfare schemes. Apply at your Tehsildar office with family records.",
    bpl: "BPL (Below Poverty Line) status qualifies your family for subsidized food, healthcare, and housing. A BPL/ration card gives access to Ayushman Bharat, PM Awas Yojana, and PMGKY schemes.",
    scholarship: "Government scholarships are available on NSP at scholarships.gov.in for SC/ST/OBC/minority and merit students. Needed: income certificate, caste certificate, marksheets, and Aadhaar-linked bank account.",
    pan: "PAN (Permanent Account Number) is a 10-digit number from the Income Tax Department. Required for transactions above Rs 50,000, tax returns, and some scheme applications. Apply at incometaxindia.gov.in.",
    bank: "An Aadhaar-linked bank account is required to receive DBT from government schemes. Ensure your account is active and Aadhaar is seeded. Visit any nationalized bank with your Aadhaar to link them.",
    kyc: "KYC (Know Your Customer) verifies your identity with a bank. Submit Aadhaar, PAN, address proof, and photo. Full KYC gives access to all banking and financial scheme benefits.",
    affidavit: "An affidavit is a sworn written statement. For government schemes, a self-declaration affidavit on stamp paper may be needed for income, residency, or family details. Get it notarized by a local notary.",
    noc: "NOC (No Objection Certificate) is a letter from an authority with no objections. In government applications, employers or landlords may need to issue an NOC as part of verification.",
    ews: "EWS (Economically Weaker Section) is for general-category families with annual income below Rs 8 lakh. An EWS certificate provides 10% reservation in government jobs and educational institutions. Apply at Tehsildar office.",
    voter: "A Voter ID (EPIC card) from the Election Commission is a valid ID and address proof accepted in most government applications. Apply or update at voterportal.eci.gov.in.",
    passport: "A passport is a valid identity proof for higher-level government scheme applications. Apply at passportindia.gov.in.",
    driving: "A Driving License from the RTO is a valid ID and address proof for government applications. Apply or renew at parivahan.gov.in.",
    ration: "A Ration Card from the state Food Department gives access to subsidized PDS food and serves as address and family proof in many government applications.",
    pmkisan: "PM Kisan Samman Nidhi gives eligible farmer families Rs 6,000/year in 3 installments of Rs 2,000 each as Direct Benefit Transfer. Register at pmkisan.gov.in with land records, Aadhaar, and bank details.",
    ayushman: "Ayushman Bharat (PM-JAY) gives health coverage of up to Rs 5 lakh per family per year for hospitalization. For poor and vulnerable families. Check eligibility at pmjay.gov.in using Aadhaar or ration card.",
    mudra: "PM MUDRA Yojana gives business loans up to Rs 10 lakh: Shishu (up to Rs 50,000), Kishor (Rs 50K-5L), and Tarun (Rs 5L-10L). Apply at any bank or mudra.org.in.",
    pmay: "PM Awas Yojana (PMAY) gives financial help to buy or build a house. Urban: pmaymis.gov.in. Rural: pmayg.nic.in. Eligible for EWS/LIG/MIG families with income proof and Aadhaar.",
    ujjwala: "PM Ujjwala Yojana gives free LPG connections to women from BPL/SC/ST families. Apply at your nearest LPG distributor with BPL ration card, Aadhaar, and bank account.",
    sukanya: "Sukanya Samriddhi Yojana is a savings scheme for girl children with high interest and tax benefits. Open an account for a girl below 10 years at any post office or bank with a minimum Rs 250 deposit.",
    form: "To fill a government form: 1) Read eligibility criteria. 2) Gather all required documents. 3) Fill details exactly as on Aadhaar. 4) Upload clear scans. 5) Note your application number for tracking.",
    document: "Common documents for government schemes: Aadhaar card, income certificate, caste certificate, domicile certificate, bank passbook, passport-size photo, and marksheets. Keep originals and self-attested copies ready.",
    apply: "To apply for a government scheme: 1) Visit the official .gov.in website. 2) Register with mobile number and Aadhaar. 3) Fill the form with correct details. 4) Upload documents. 5) Submit and save the application ID. 6) Track status online.",
    default: "I am Sahayak AI! I can help you with:\n- Documents: Domicile, Income Certificate, Aadhaar, Caste Certificate, PAN, BPL, Voter ID, Ration Card\n- Schemes: PM Kisan, Ayushman Bharat, MUDRA, PM Awas, Ujjwala, Sukanya Samriddhi, Scholarships\n- Processes: How to apply, document checklist, form filling tips\n\nJust ask me anything!"
  },
  hi: {
    domicile: "अधिवास प्रमाण पत्र राज्य सरकार द्वारा जारी दस्तावेज़ है जो आपके स्थायी निवास को साबित करता है। राज्य योजनाओं, नौकरियों और प्रवेश के लिए ज़रूरी है। तहसीलदार/SDM कार्यालय में आधार, मतदाता पहचान पत्र और बिजली बिल के साथ आवेदन करें।",
    income: "आय प्रमाण पत्र आपकी वार्षिक पारिवारिक आय का प्रमाण है। तहसीलदार/राजस्व विभाग जारी करता है। छात्रवृत्ति, सब्सिडी और कल्याण योजनाओं के लिए आवश्यक है।",
    aadhaar: "आधार UIDAI द्वारा जारी 12 अंकों का विशिष्ट पहचान संख्या है। यह आपका सार्वभौमिक ID और पते का प्रमाण है। सरकारी DBT पाने के लिए बैंक खाते से लिंक करें।",
    caste: "जाति प्रमाण पत्र (SC/ST/OBC) राज्य राजस्व विभाग जारी करता है। सरकारी नौकरियों, शिक्षा और योजनाओं में आरक्षण के लिए अनिवार्य है।",
    scholarship: "NSP (राष्ट्रीय छात्रवृत्ति पोर्टल) scholarships.gov.in पर सरकारी छात्रवृत्तियां हैं। आधार, आय प्रमाण, जाति प्रमाण, मार्कशीट और बैंक खाते के साथ आवेदन करें।",
    pmkisan: "PM किसान सम्मान निधि में पात्र किसानों को ₹6,000 सालाना 3 किस्तों में मिलते हैं। pmkisan.gov.in पर भूमि रिकॉर्ड, आधार और बैंक विवरण के साथ पंजीकरण करें।",
    default: "मैं सहायक AI हूँ! मैं इनमें मदद कर सकता हूँ:\n- दस्तावेज़: अधिवास, आय प्रमाण, आधार, जाति प्रमाण, पैन, बीपीएल\n- योजनाएं: पीएम किसान, आयुष्मान भारत, मुद्रा, पीएम आवास, उज्ज्वला\n- प्रक्रिया: आवेदन कैसे करें, दस्तावेज़ सूची\n\nकोई भी प्रश्न पूछें!"
  },
  hinglish: {
    domicile: "Domicile Certificate state government ka official document hai jo aapka permanent residency prove karta hai. State schemes, jobs aur admissions ke liye zaruri hai. Tehsildar/SDM office mein Aadhaar, Voter ID aur utility bills ke saath apply karein.",
    income: "Income Certificate aapki family ki saalana income ka proof hai. Tehsildar/Revenue Department issue karta hai. Scholarship, subsidy aur welfare schemes ke liye chahiye.",
    aadhaar: "Aadhaar UIDAI ka 12-digit unique identity number hai. Universal ID aur address proof hai. Government schemes se DBT ke liye bank account se Aadhaar link karein.",
    caste: "Caste Certificate (SC/ST/OBC) state Revenue Department se milta hai. Government jobs, education aur schemes mein reservation ke liye mandatory hai.",
    scholarship: "NSP (National Scholarship Portal) scholarships.gov.in par government scholarships available hain. Aadhaar, income certificate, caste certificate, marksheets aur bank account ke saath apply karein.",
    pmkisan: "PM Kisan mein eligible farmers ko Rs 6,000 saal mein 3 installments mein milte hain. pmkisan.gov.in par land records, Aadhaar aur bank details ke saath register karein.",
    default: "Main Sahayak AI hoon! Main help kar sakta hoon:\n- Documents: Domicile, Income Certificate, Aadhaar, Caste Certificate, PAN, BPL\n- Schemes: PM Kisan, Ayushman Bharat, MUDRA, PM Awas, Ujjwala\n- Process: Kaise apply karein, document checklist\n\nKuch bhi poochein!"
  }
};

function getLocalAnswer(query, language) {
  const lq = (query || "").toLowerCase();
  const kb = knowledgeBase[language] || knowledgeBase.en;
  const en = knowledgeBase.en;

  if (lq.includes('domicile') || lq.includes('residence certificate') || lq.includes('niwas') || lq.includes('adhiwas') || lq.includes('निवास')) return kb.domicile || en.domicile;
  if ((lq.includes('income') && !lq.includes('kisan')) || lq.includes('salary') || lq.includes('earning') || lq.includes('aay') || lq.includes('aamdani') || lq.includes('आय')) return kb.income || en.income;
  if (lq.includes('aadhaar') || lq.includes('aadhar') || lq.includes('आधार') || lq.includes('uid number')) return kb.aadhaar || en.aadhaar;
  if (lq.includes('caste') || lq.includes('jati') || lq.includes('जाति') || lq.includes(' obc') || lq.match(/\bsc\b/) || lq.match(/\bst\b/)) return kb.caste || en.caste;
  if (lq.includes('bpl') || lq.includes('below poverty') || lq.includes('garibi') || lq.includes('गरीबी')) return en.bpl;
  if (lq.includes('scholarship') || lq.includes('chatravriti') || lq.includes('छात्रवृत्ति') || lq.includes('stipend')) return kb.scholarship || en.scholarship;
  if (lq.includes(' pan ') || lq.includes('pan card') || lq.includes('permanent account')) return en.pan;
  if (lq.includes('bank') || lq.includes('dbt') || lq.includes('direct benefit') || lq.includes('account number')) return en.bank;
  if (lq.includes('kyc') || lq.includes('know your customer')) return en.kyc;
  if (lq.includes('affidavit') || lq.includes('stamp paper') || lq.includes('शपथ')) return en.affidavit;
  if (lq.includes('noc') || lq.includes('no objection')) return en.noc;
  if (lq.includes('ews') || lq.includes('economically weaker')) return en.ews;
  if (lq.includes('voter') || lq.includes('epic card') || lq.includes('election') || lq.includes('मतदाता')) return en.voter;
  if (lq.includes('passport')) return en.passport;
  if (lq.includes('driving') || lq.includes('licence') || lq.includes('license')) return en.driving;
  if (lq.includes('ration card') || lq.includes('pds') || lq.includes('ration shop')) return en.ration;
  if (lq.includes('pm kisan') || lq.includes('kisan samman') || lq.includes('farmer') || lq.includes('किसान')) return kb.pmkisan || en.pmkisan;
  if (lq.includes('ayushman') || lq.includes('pmjay') || lq.includes('health insurance') || lq.includes('hospital cover')) return en.ayushman;
  if (lq.includes('mudra') || lq.includes('business loan') || lq.includes('startup loan') || lq.includes('shishu') || lq.includes('kishor') || lq.includes('tarun')) return en.mudra;
  if (lq.includes('awas') || lq.includes('pmay') || lq.includes('housing') || lq.includes('ghar') || lq.includes('घर')) return en.pmay;
  if (lq.includes('ujjwala') || lq.includes('lpg') || lq.includes('gas connection') || lq.includes('cylinder')) return en.ujjwala;
  if (lq.includes('sukanya') || lq.includes('girl child') || lq.includes('beti') || lq.includes('बेटी')) return en.sukanya;
  if (lq.includes('how to fill') || lq.includes('form fill') || lq.includes('kaise bhare') || lq.includes('form kaise')) return en.form;
  if (lq.includes('document') || lq.includes('required document') || lq.includes('dastaveez') || lq.includes('dastavez')) return en.document;
  if (lq.includes('how to apply') || lq.includes('kaise apply') || lq.includes('where to apply') || lq.includes('apply kahan')) return en.apply;

  return null;
}

app.post('/api/help', async (req, res) => {
  const { query, language } = req.body;
  const langName = language === 'hi' ? 'Hindi' : language === 'hinglish' ? 'Hinglish (Hindi in English script, conversational)' : 'English';

  // First try local knowledge base — instant and always works
  const localAnswer = getLocalAnswer(query, language);
  if (localAnswer) return res.json({ text: localAnswer });

  // For unrecognized queries, try AI API
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `You are Sahayak AI, an expert Indian Government Scheme Assistant. A user asked: "${query}". Respond in ${langName} in 2-3 plain helpful sentences about Indian government schemes or documents.`;
      const result = await model.generateContent(prompt);
      return res.json({ text: result.response.text() });
    } catch (error) {
      console.error("AI Error:", error.status || error.message?.slice(0, 60));
    }
  }

  // Final fallback
  const kb = knowledgeBase[language] || knowledgeBase.en;
  res.json({ text: kb.default });
});

// Mock database for applications
let applications = [
  { id: 1, schemeName: 'PM Mudra Yojana', status: 'Approved', date: '2023-10-15', link: 'https://www.mudra.org.in/', benefit: 'Loans up to â‚¹10 Lakhs' },
  { id: 2, schemeName: 'Bihar Post Matric Scholarship', status: 'Pending', date: '2023-11-02', link: 'https://pmsonline.bih.nic.in/', benefit: 'Full tuition fee waiver & maintenance allowance' }
];

app.get('/api/applications', (req, res) => {
  res.json(applications);
});

app.post('/api/applications', (req, res) => {
  const { schemeName, link, benefit } = req.body;
  if (!schemeName) {
    return res.status(400).json({ error: "Scheme name is required" });
  }
  const newApp = {
    id: applications.length + 1,
    schemeName,
    status: 'Just Applied',
    date: new Date().toISOString().split('T')[0],
    link: link || '#',
    benefit: benefit || 'Details available on portal'
  };
  applications.push(newApp);
  res.json(newApp);
});

// Mock Auth DB
const users = [];
const otps = {};

app.post('/api/auth/signup', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otps[email] = otp;

  console.log(`\n========================================`);
  console.log(`ðŸ” MOCK EMAIL SENT TO: ${email}`);
  console.log(`ðŸ”‘ YOUR OTP IS: ${otp} (But any 4 digits work!)`);
  console.log(`========================================\n`);

  res.json({ success: true, message: "OTP sent" });
});

app.post('/api/auth/verify', (req, res) => {
  const { email, otp } = req.body;
  // Accept ANY 4-digit number
  if (otp && otp.length === 4 && /^\d+$/.test(otp)) {
    if (!users.find(u => u.email === email)) {
      users.push({ email });
    }
    delete otps[email];
    return res.json({ success: true });
  }
  res.json({ success: false, error: "Invalid OTP" });
});

app.post('/api/describe', async (req, res) => {
  const { schemeName, language } = req.body;
  const scheme = schemes.find(s => s.name === schemeName);

  // Create a local fallback description from the JSON data
  let fallbackDescription = "";
  if (scheme) {
    if (language === 'hi') {
      fallbackDescription = `${scheme.name}: à¤¯à¤¹ à¤¯à¥‹à¤œà¤¨à¤¾ "${scheme.benefit}" à¤ªà¥à¤°à¤¦à¤¾à¤¨ à¤•à¤°à¤¤à¥€ à¤¹à¥ˆà¥¤ ${scheme.whyEligible}`;
    } else if (language === 'hinglish') {
      fallbackDescription = `${scheme.name}: Yeh scheme "${scheme.benefit}" provide karti hai. ${scheme.whyEligible}`;
    } else {
      fallbackDescription = `${scheme.name}: This scheme provides "${scheme.benefit}". ${scheme.whyEligible}`;
    }
  } else {
    fallbackDescription = "Details for this scheme are currently unavailable.";
  }

  // If Gemini API is not available, return fallback immediately
  if (!genAI || !process.env.GEMINI_API_KEY || !process.env.GEMINI_API_KEY.startsWith('AIza')) {
    return res.json({ description: fallbackDescription });
  }

  try {
    const prompt = `Provide a very brief, 2-3 sentence description of the government scheme "${schemeName}" in ${language === 'hi' ? 'Hindi' : language === 'hinglish' ? 'Hinglish (Hindi written in English script)' : 'English'}. Focus on the core benefit and who is it for. Make it sound helpful and encouraging.`;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ description: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    // If AI fails, return the local fallback instead of an error message
    res.json({ description: fallbackDescription });
  }
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from server" })
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

