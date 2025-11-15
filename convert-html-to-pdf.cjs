const fs = require('fs');
const path = require('path');

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
            @page { size: letter; margin: 0.5in; }
        }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #2A2A2A;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #4ECDC4;
            border-bottom: 3px solid #4ECDC4;
            padding-bottom: 10px;
            font-size: 24pt;
            page-break-after: avoid;
        }
        h2 {
            color: #2A2A2A;
            border-bottom: 2px solid #E6E6E6;
            padding-bottom: 8px;
            margin-top: 20px;
            font-size: 18pt;
            page-break-after: avoid;
        }
        h3 {
            color: #4ECDC4;
            font-size: 14pt;
            margin-top: 15px;
            page-break-after: avoid;
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
            page-break-inside: avoid;
        }
        pre code {
            background: none;
            padding: 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
            page-break-inside: avoid;
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
            font-weight: 600;
        }
        ul, ol {
            margin: 10px 0;
            padding-left: 30px;
        }
        li {
            margin: 5px 0;
        }
        hr {
            border: none;
            border-top: 2px solid #E6E6E6;
            margin: 20px 0;
        }
        .example {
            background: #f9f9f9;
            padding: 10px;
            border-left: 3px solid #FFFF00;
            margin: 10px 0;
        }
    </style>
</head>
<body>
${content}
<br><br>
<hr>
<p style="text-align: center; color: #888; font-size: 10pt;">
    MDragon Data Tools | <a href="https://mondragon-developer.github.io/statools/">https://mondragon-developer.github.io/statools/</a>
</p>
</body>
</html>`;

function convertMarkdownToHTML(markdown) {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Code blocks
    html = html.replace(/```([\\s\\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up
    html = html.replace(/<p><h/g, '<h');
    html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
    html = html.replace(/<p><pre>/g, '<pre>');
    html = html.replace(/<\/pre><\/p>/g, '</pre>');
    html = html.replace(/<p><hr><\/p>/g, '<hr>');
    html = html.replace(/<p><\/p>/g, '');

    return html;
}

console.log('🚀 Creating HTML files for PDF conversion...\n');

files.forEach(file => {
    const mdPath = path.join(resourcesDir, file);
    const htmlPath = path.join(resourcesDir, file.replace('.md', '.html'));

    if (!fs.existsSync(mdPath)) {
        console.log(`⚠️  Skipping ${file} - not found`);
        return;
    }

    try {
        const markdown = fs.readFileSync(mdPath, 'utf-8');
        const title = file.replace('.md', '').replace(/-/g, ' ').toUpperCase();
        const htmlContent = convertMarkdownToHTML(markdown);
        const fullHTML = htmlTemplate(title, htmlContent);

        fs.writeFileSync(htmlPath, fullHTML);
        console.log(`✅ Created: ${file.replace('.md', '.html')}`);
    } catch (error) {
        console.log(`❌ Failed: ${file} - ${error.message}`);
    }
});

console.log('\n━'.repeat(60));
console.log('\n✅ HTML files created!');
console.log('\n📝 Next steps:');
console.log('1. Open each .html file in Chrome/Edge');
console.log('2. Press Ctrl+P (Print)');
console.log('3. Select "Save as PDF"');
console.log('4. Save with same name but .pdf extension');
console.log('5. Save to: public/resources/\n');
