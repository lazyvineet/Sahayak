const fs = require('fs');
const path = require('path');

const schemesPath = path.join(__dirname, '../data/schemes.json');
let schemes = JSON.parse(fs.readFileSync(schemesPath, 'utf8'));

schemes = schemes.map(scheme => {
  return {
    ...scheme,
    formFields: [
      { name: "Full Name", type: "text", required: true },
      { name: "Aadhaar Number", type: "number", required: true },
      { name: "Bank Account Number", type: "number", required: true }
    ],
    documentsRequired: scheme.documents && scheme.documents.length > 0 
      ? scheme.documents 
      : ["Aadhaar Card", "Income Certificate"]
  };
});

fs.writeFileSync(schemesPath, JSON.stringify(schemes, null, 2));
console.log("Updated schemes.json with formFields and documentsRequired.");
