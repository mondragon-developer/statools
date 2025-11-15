const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const resourcesDir = path.join(__dirname, 'public', 'resources');

const files = [
  'probability-fundamentals',
  'binomial-distribution',
  'poisson-distribution',
  'normal-distribution',
  't-distribution',
  'central-limit-theorem',
  'hypothesis-testing-one-sample',
  'hypothesis-testing-two-samples',
  'confidence-intervals',
  'linear-regression-basics',
  'regression-step-by-step',
  'interpreting-regression',
  'statistics-calculator-guide',
  'probability-calculator-guide',
  'distribution-calculators-guide',
  'statistical-tables'
];

async function generatePDFs() {
  console.log('🚀 Generating PDFs with Puppeteer...\n');
  console.log('━'.repeat(60));

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const htmlPath = path.join(resourcesDir, `${file}.html`);
    const pdfPath = path.join(resourcesDir, `${file}.pdf`);

    if (!fs.existsSync(htmlPath)) {
      console.log(`⚠️  Skipping ${file}.html - not found`);
      failCount++;
      continue;
    }

    try {
      console.log(`📄 Converting: ${file}.html → ${file}.pdf`);

      const page = await browser.newPage();
      await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, {
        waitUntil: 'networkidle0'
      });

      await page.pdf({
        path: pdfPath,
        format: 'Letter',
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        printBackground: true
      });

      console.log(`✅ Created: ${file}.pdf`);
      successCount++;

    } catch (error) {
      console.log(`❌ Failed: ${file} - ${error.message}`);
      failCount++;
    }
  }

  await browser.close();

  console.log('\n' + '━'.repeat(60));
  console.log(`\n✅ Successfully converted: ${successCount} PDFs`);
  console.log(`❌ Failed: ${failCount} PDFs`);
  console.log('\n🎉 PDFs are ready in: public/resources/\n');
}

generatePDFs().catch(console.error);
