const fs = require('fs');
const path = require('path');
const mdToPdf = require('md-to-pdf').mdToPdf;

const resourcesDir = path.join(__dirname, 'public', 'resources');

// List of markdown files to convert
const files = [
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

// PDF styling options
const pdfOptions = {
  pdf_options: {
    format: 'Letter',
    margin: {
      top: '25mm',
      right: '20mm',
      bottom: '25mm',
      left: '20mm'
    },
    printBackground: true
  },
  stylesheet: `
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #2A2A2A;
    }
    h1 {
      color: #4ECDC4;
      border-bottom: 3px solid #4ECDC4;
      padding-bottom: 10px;
      font-size: 24pt;
    }
    h2 {
      color: #2A2A2A;
      border-bottom: 2px solid #E6E6E6;
      padding-bottom: 8px;
      margin-top: 20px;
      font-size: 18pt;
    }
    h3 {
      color: #4ECDC4;
      font-size: 14pt;
      margin-top: 15px;
    }
    code {
      background-color: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 10pt;
    }
    pre {
      background-color: #f8f8f8;
      border-left: 4px solid #4ECDC4;
      padding: 15px;
      overflow-x: auto;
      border-radius: 4px;
    }
    pre code {
      background: none;
      padding: 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 15px 0;
    }
    th {
      background-color: #4ECDC4;
      color: white;
      padding: 10px;
      text-align: left;
    }
    td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    blockquote {
      border-left: 4px solid #FFFF00;
      padding-left: 15px;
      margin-left: 0;
      color: #555;
      font-style: italic;
    }
    strong {
      color: #2A2A2A;
    }
  `
};

async function convertFiles() {
  console.log('🚀 Starting PDF conversion...\n');
  console.log('━'.repeat(60));

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const mdPath = path.join(resourcesDir, file);
    const pdfPath = path.join(resourcesDir, file.replace('.md', '.pdf'));

    if (!fs.existsSync(mdPath)) {
      console.log(`⚠️  Skipping ${file} - not found`);
      failCount++;
      continue;
    }

    try {
      console.log(`📄 Converting: ${file}`);

      await mdToPdf(
        { path: mdPath },
        {
          dest: pdfPath,
          ...pdfOptions
        }
      );

      console.log(`✅ Created: ${file.replace('.md', '.pdf')}`);
      successCount++;
    } catch (error) {
      console.log(`❌ Failed: ${file}`);
      console.log(`   Error: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n' + '━'.repeat(60));
  console.log(`\n✅ Successfully converted: ${successCount} files`);
  console.log(`❌ Failed: ${failCount} files`);
  console.log('\n🎉 Done! PDFs are in: public/resources/\n');
}

convertFiles().catch(console.error);
