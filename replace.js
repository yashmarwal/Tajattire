const fs = require('fs');
const file = 'src/components/site/Sections.tsx';
const content = fs.readFileSync(file, 'utf8');

const newCode = fs.readFileSync('payload.txt', 'utf8');

const startIndex = content.indexOf('/* ─────────── INQUIRY FORM ─────────── */');
if (startIndex !== -1) {
  const newFileContent = content.substring(0, startIndex) + newCode;
  fs.writeFileSync(file, newFileContent);
  console.log("Rewrite successful.");
} else {
  console.log("Could not find start index.");
}
