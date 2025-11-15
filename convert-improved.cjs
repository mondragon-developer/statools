const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const resourcesDir = path.join(__dirname, 'public', 'resources');

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

const htmlTemplate = (title, content) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        @media print {
            body { margin: 0.5in; }
            @page {
                size: letter;
                margin: 0.5in;
            }
            .page-break { page-break-before: always; }
            h1, h2, h3 { page-break-after: avoid; }
            table { page-break-inside: avoid; }
            pre { page-break-inside: avoid; }
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.7;
            color: #2A2A2A;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }

        /* Headers */
        h1 {
            color: #4ECDC4;
            border-bottom: 4px solid #4ECDC4;
            padding-bottom: 12px;
            margin-top: 0;
            margin-bottom: 25px;
            font-size: 26pt;
            font-weight: 700;
        }

        h2 {
            color: #2A2A2A;
            border-bottom: 3px solid #4ECDC4;
            padding-bottom: 10px;
            margin-top: 30px;
            margin-bottom: 18px;
            font-size: 20pt;
            font-weight: 600;
        }

        h3 {
            color: #4ECDC4;
            font-size: 15pt;
            font-weight: 600;
            margin-top: 25px;
            margin-bottom: 12px;
        }

        h4 {
            color: #2A2A2A;
            font-size: 13pt;
            font-weight: 600;
            margin-top: 18px;
            margin-bottom: 10px;
        }

        /* Paragraphs */
        p {
            margin: 12px 0;
            text-align: justify;
        }

        /* Lists */
        ul, ol {
            margin: 15px 0;
            padding-left: 35px;
        }

        li {
            margin: 8px 0;
            line-height: 1.6;
        }

        /* Code and formulas */
        code {
            background-color: #f8f8f8;
            border: 1px solid #e0e0e0;
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 10pt;
            color: #c7254e;
            font-weight: 500;
        }

        pre {
            background-color: #f8f8f8;
            border: 2px solid #4ECDC4;
            border-left: 6px solid #4ECDC4;
            padding: 18px 20px;
            overflow-x: auto;
            border-radius: 6px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        pre code {
            background: none;
            border: none;
            padding: 0;
            color: #2A2A2A;
            font-size: 10.5pt;
            line-height: 1.6;
            display: block;
            white-space: pre-wrap;
            font-weight: normal;
        }

        /* Tables */
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }

        thead {
            background: linear-gradient(135deg, #4ECDC4 0%, #3db3aa 100%);
        }

        th {
            background-color: #4ECDC4;
            color: white;
            padding: 14px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 11pt;
            border: none;
        }

        td {
            border: 1px solid #e0e0e0;
            padding: 12px;
            font-size: 10.5pt;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        tr:hover {
            background-color: #f0f9f9;
        }

        /* Blockquotes */
        blockquote {
            border-left: 5px solid #FFFF00;
            background-color: #fffef0;
            padding: 15px 20px;
            margin: 20px 0;
            color: #555;
            font-style: italic;
            border-radius: 0 6px 6px 0;
        }

        /* Strong text */
        strong {
            color: #2A2A2A;
            font-weight: 600;
        }

        /* Horizontal rules */
        hr {
            border: none;
            border-top: 3px solid #E6E6E6;
            margin: 30px 0;
        }

        /* Special formatting for examples */
        .example-box {
            background: #f9f9f9;
            border: 2px solid #4ECDC4;
            border-radius: 8px;
            padding: 18px;
            margin: 20px 0;
        }

        .solution-box {
            background: #f0f9f9;
            border-left: 4px solid #4ECDC4;
            padding: 15px 20px;
            margin: 15px 0 15px 20px;
        }

        /* Answer highlighting */
        .answer {
            background-color: #fffacd;
            border: 2px solid #FFFF00;
            border-radius: 6px;
            padding: 12px 16px;
            margin: 15px 0;
            font-weight: 600;
        }

        /* Footer */
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #E6E6E6;
            text-align: center;
            color: #888;
            font-size: 9pt;
        }

        .footer a {
            color: #4ECDC4;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        /* Improve readability */
        em {
            font-style: italic;
            color: #555;
        }

        /* Math-like formatting */
        .formula {
            font-family: 'Times New Roman', serif;
            font-style: italic;
        }
    </style>
</head>
<body>
${content}
<div class="footer">
    <p><strong>MDragon Data Tools</strong> | Statistics Education Platform</p>
    <p><a href="https://mondragon-developer.github.io/statools/" target="_blank">mondragon-developer.github.io/statools</a></p>
</div>
</body>
</html>`;

// Configure marked options
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
});

console.log('🚀 Creating improved HTML files...\n');
console.log('━'.repeat(60));

files.forEach(file => {
    const mdPath = path.join(resourcesDir, file);
    const htmlPath = path.join(resourcesDir, file.replace('.md', '.html'));

    if (!fs.existsSync(mdPath)) {
        console.log(`⚠️  Skipping ${file} - not found`);
        return;
    }

    try {
        let markdown = fs.readFileSync(mdPath, 'utf-8');

        // Enhance formatting for better PDF output
        markdown = markdown.replace(/\*\*Answer:\*\*/g, '**✅ Answer:**');
        markdown = markdown.replace(/\*\*Problem:\*\*/g, '**📝 Problem:**');
        markdown = markdown.replace(/\*\*Solution:\*\*/g, '**💡 Solution:**');

        const htmlContent = marked.parse(markdown);
        const title = file.replace('.md', '').replace(/-/g, ' ').toUpperCase();
        const fullHTML = htmlTemplate(title, htmlContent);

        fs.writeFileSync(htmlPath, fullHTML);
        console.log(`✅ Created: ${file.replace('.md', '.html')}`);
    } catch (error) {
        console.log(`❌ Failed: ${file} - ${error.message}`);
    }
});

console.log('\n' + '━'.repeat(60));
console.log('\n✅ Improved HTML files created!');
console.log('📄 Next: Run generate-pdfs.cjs to create PDFs\n');
