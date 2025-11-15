// Simple script to convert markdown files to PDFs using markdown-pdf
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const resourcesDir = path.join(__dirname, 'public', 'resources');

// List of markdown files to convert (excluding README)
const markdownFiles = [
  'probability-fundamentals.md',
  'binomial-distribution.md',
  'poisson-distribution.md',
  'normal-distribution.md',
  't-distribution.md',
  'central-limit-theorem.md',
  'hypothesis-testing-one-sample.md',
  'hypothesis-testing-two-samples.md',
  'confidence-intervals.md',
  'linear-regression-basics.md',
  'regression-step-by-step.md',
  'interpreting-regression.md',
  'statistics-calculator-guide.md',
  'probability-calculator-guide.md',
  'distribution-calculators-guide.md',
  'statistical-tables.md'
];

console.log('🔄 Converting markdown files to PDF...\n');
console.log('Note: This requires pandoc to be installed.');
console.log('Install from: https://pandoc.org/installing.html\n');

let successCount = 0;
let failCount = 0;

markdownFiles.forEach((mdFile) => {
  const mdPath = path.join(resourcesDir, mdFile);
  const pdfPath = path.join(resourcesDir, mdFile.replace('.md', '.pdf'));

  if (!fs.existsSync(mdPath)) {
    console.log(`⚠️  Skipping ${mdFile} - file not found`);
    failCount++;
    return;
  }

  try {
    console.log(`📄 Converting ${mdFile}...`);

    // Try using pandoc
    execSync(
      `pandoc "${mdPath}" -o "${pdfPath}" --pdf-engine=wkhtmltopdf`,
      { stdio: 'ignore' }
    );

    console.log(`✅ Created ${mdFile.replace('.md', '.pdf')}`);
    successCount++;
  } catch (error) {
    console.log(`❌ Failed to convert ${mdFile}`);
    console.log(`   Error: ${error.message}`);
    console.log(`   Try installing pandoc or use the manual method below.\n`);
    failCount++;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Successfully converted: ${successCount} files`);
console.log(`❌ Failed: ${failCount} files`);
console.log('='.repeat(50));

if (failCount > 0) {
  console.log('\n📝 Manual conversion options:');
  console.log('1. Install Pandoc: https://pandoc.org/installing.html');
  console.log('2. Use online converter: https://md2pdf.netlify.app/');
  console.log('3. Use VS Code extension: "Markdown PDF" by yzane');
}
