# MDragon Data Tools - Resources

This directory contains educational materials for statistics learning, organized into 4 categories.

## Current Status

✅ **Markdown source files created** (16 guides)
📝 **PDF conversion needed**

## File Structure

### Category 1: Probability & Distributions
- `probability-fundamentals.md` → `probability-fundamentals.pdf`
- `binomial-distribution.md` → `binomial-distribution.pdf`
- `poisson-distribution.md` → `poisson-distribution.pdf`
- `normal-distribution.md` → `normal-distribution.pdf`
- `t-distribution.md` → `t-distribution.pdf`

### Category 2: Statistical Inference
- `central-limit-theorem.md` → `central-limit-theorem.pdf`
- `hypothesis-testing-one-sample.md` → `hypothesis-testing-one-sample.pdf`
- `hypothesis-testing-two-samples.md` → `hypothesis-testing-two-samples.pdf`
- `confidence-intervals.md` → `confidence-intervals.pdf`

### Category 3: Regression Analysis
- `linear-regression-basics.md` → `linear-regression-basics.pdf`
- `regression-step-by-step.md` → `regression-step-by-step.pdf`
- `interpreting-regression.md` → `interpreting-regression.pdf`

### Category 4: Calculator Guides & Tables
- `statistics-calculator-guide.md` → `statistics-calculator-guide.pdf`
- `probability-calculator-guide.md` → `probability-calculator-guide.pdf`
- `distribution-calculators-guide.md` → `distribution-calculators-guide.pdf`
- `statistical-tables.md` → `statistical-tables.pdf`

## Converting Markdown to PDF

### Option 1: Using Pandoc (Recommended)

**Install Pandoc:**
- Windows: Download from https://pandoc.org/installing.html
- Mac: `brew install pandoc`
- Linux: `sudo apt-get install pandoc`

**Convert all files:**
```bash
cd public/resources

# Convert single file
pandoc probability-fundamentals.md -o probability-fundamentals.pdf --pdf-engine=xelatex -V geometry:margin=1in

# Convert all files (Windows PowerShell)
Get-ChildItem *.md | ForEach-Object {
    pandoc $_.Name -o ($_.BaseName + ".pdf") --pdf-engine=xelatex -V geometry:margin=1in
}

# Convert all files (Mac/Linux)
for file in *.md; do
    pandoc "$file" -o "${file%.md}.pdf" --pdf-engine=xelatex -V geometry:margin=1in
done
```

**With styling:**
```bash
pandoc probability-fundamentals.md -o probability-fundamentals.pdf \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V fontsize=11pt \
  -V documentclass=article \
  --toc \
  --highlight-style=tango
```

### Option 2: Using Online Converters

**Recommended sites:**
1. **CloudConvert** - https://cloudconvert.com/md-to-pdf
2. **Markdown to PDF** - https://md2pdf.netlify.app/
3. **Dillinger** - https://dillinger.io/ (export as PDF)

**Steps:**
1. Open markdown file
2. Copy content
3. Paste into converter
4. Download PDF
5. Save to `/public/resources/` directory

### Option 3: VS Code Extension

**Install "Markdown PDF" extension:**
1. Open VS Code
2. Extensions (Ctrl+Shift+X)
3. Search "Markdown PDF"
4. Install
5. Right-click .md file → "Markdown PDF: Export (pdf)"

### Option 4: Professional Design Tools

For publication-quality PDFs:
- **Canva** - Import content and design
- **Adobe InDesign** - Professional layout
- **LaTeX** - Academic-quality typesetting

## Styling Recommendations

### Fonts
- **Headings**: Arial, Helvetica, or Open Sans (bold)
- **Body**: Times New Roman, Georgia, or Merriweather
- **Code**: Courier New or Consolas

### Colors
Use brand colors from the project:
- **Primary**: #4ECDC4 (Turquoise) - for headings
- **Accent**: #FFFF00 (Yellow) - for highlights
- **Text**: #2A2A2A (Dark Grey)
- **Background**: #E6E6E6 (Platinum) - for code blocks

### Layout
- **Page size**: Letter (8.5" × 11")
- **Margins**: 1 inch all sides
- **Line spacing**: 1.15 or 1.5
- **Font size**:
  - Body: 11pt
  - Headings: 14-18pt
  - Code: 9-10pt

## Adding Branding

Include in each PDF:
1. **Header**: "MDragon Data Tools" logo/title
2. **Footer**: Website URL, page numbers
3. **Cover page** (optional): Title, description, logo
4. **Color scheme**: Match website theme

## Quality Checklist

Before finalizing PDFs:
- [ ] All formulas render correctly
- [ ] Tables are properly formatted
- [ ] Code blocks are readable
- [ ] Examples are complete
- [ ] Practice problems have answers
- [ ] Page breaks are logical
- [ ] Headers/footers consistent
- [ ] File size reasonable (<5MB each)

## Batch Conversion Script

**PowerShell script** (`convert-all.ps1`):
```powershell
$files = Get-ChildItem *.md
foreach ($file in $files) {
    $output = $file.BaseName + ".pdf"
    pandoc $file.Name -o $output `
        --pdf-engine=xelatex `
        -V geometry:margin=1in `
        -V fontsize=11pt `
        --toc `
        --highlight-style=tango `
        -V colorlinks=true `
        -V linkcolor=blue
    Write-Host "Converted $file to $output"
}
```

## Deployment

After creating PDFs:
1. Place all PDFs in `/public/resources/` directory
2. Ensure file names match those in `Tools.jsx`
3. Test downloads in development: `npm run dev`
4. Build and deploy: `npm run build`

## Maintenance

Update content when:
- Calculators are enhanced
- New statistical methods added
- Errors or typos found
- User feedback received

## License

These educational materials are © MDragon Data Tools.
Free for educational use.

---

**Need help?** Contact the development team or open an issue on GitHub.
