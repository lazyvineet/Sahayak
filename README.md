# Sarkar Saathi

Sarkar Saathi is an AI-powered government scheme discovery assistant for Indian users. Users can describe their situations in natural language, and the system extracts structured data to recommend eligible schemes locally.

## Features
- **Conversational UI**: Clean, ChatGPT-like interface.
- **Rule-based NLP**: Extracts `income`, `state`, `student` status, and `category` natively in Node.js.
- **Dynamic Filtering**: Matches 40+ mock government schemes without needing a database.
- **Voice Input**: Integrated Web Speech API for voice-to-text.
- **Bilingual Interface**: Static toggle between English and Hindi text.
- **No External APIs**: Runs entirely on your local machine.

---

## 🚀 Run Instructions

### 1. Requirements
Ensure you have Node.js installed (v18+ recommended).

### 2. Setup

The project is structured with a backend `server` and a frontend `client`.

**Install Backend Dependencies:**
```powershell
cd server
npm install
```

**Install Frontend Dependencies:**
```powershell
cd client
npm install
```

### 3. Running the Application

**Run the Backend:**
Open a terminal and start the Express server.
```powershell
cd server
node server.js
```
The server will run on `http://localhost:3000`.

**Run the Frontend:**
Open a new terminal and start the Vite React app.
```powershell
cd client
npm run dev
```
The frontend will run on a local port (e.g., `http://localhost:5173` or `5175`). Open the provided URL in your browser.

---

## 🛠 Example API Requests

If you want to interact with the backend API directly, here are examples:

### 1. Analyze User Input
**Endpoint:** `POST /api/analyze`
```powershell
curl -X POST http://localhost:3000/api/analyze ^
     -H "Content-Type: application/json" ^
     -d '{"text": "I am a BTech student from Bihar, my family income is 2 lakh per year"}'
```

**Expected Response:**
```json
{
  "income": 200000,
  "state": "Bihar",
  "isStudent": true,
  "category": null
}
```

### 2. Get Recommendations
**Endpoint:** `POST /api/recommend`
```powershell
curl -X POST http://localhost:3000/api/recommend ^
     -H "Content-Type: application/json" ^
     -d '{"income": 200000, "state": "Bihar", "isStudent": true}'
```

**Expected Response:**
```json
[
  {
    "id": "5",
    "name": "Bihar Post Matric Scholarship",
    "state": "Bihar",
    "maxIncome": 300000,
    "studentOnly": true,
    "benefit": "Full tuition fee waiver & maintenance allowance",
    "whyEligible": "As a student from Bihar within the income limit, you qualify for post-matric benefits.",
    "documents": [
      "Aadhar Card",
      "Income Certificate",
      "Caste Certificate",
      "Bonafide Certificate"
    ],
    "link": "https://pmsonline.bih.nic.in/"
  },
  ...
]
```
