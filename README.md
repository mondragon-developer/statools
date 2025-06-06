# MDragon Data Tools

A comprehensive web-based statistics education platform providing interactive calculators, curated learning resources, and statistical analysis tools.

## Overview

MDragon Data Tools is a React-based single-page application designed to support statistics education through interactive tools and comprehensive learning materials. The platform combines custom-built calculators with curated external resources and an AI-powered chatbot assistant to create a complete statistical learning environment.

**Live Site**: [https://mondragon-developer.github.io/statools/](https://mondragon-developer.github.io/statools/)

## Features

### Interactive Calculators

The platform includes several custom-built statistical calculators:

- **Probability Calculator**: Multi-function tool covering probability rules, combinatorics, expected value calculations, and dice simulation
- **Poisson Distribution Calculator**: Specialized tool for rare event probability calculations with visualization
- **Additional Calculators**: Binomial distribution, normal distribution, and other statistical tools (in development)

### Statistics Chatbot Assistant

- **Free AI-powered support**: Real-time assistance for statistics questions
- **Concept explanations**: Clear explanations of statistical concepts and methods
- **Problem-solving help**: Step-by-step guidance through statistical problems
- **Available 24/7**: Instant help whenever needed

### External Calculator Directory

Curated collection of 14 third-party statistical calculators organized by category:

**Descriptive Statistics**

- Grouped Frequency Distribution Calculator
- Histogram Generator
- Mean, Median, Variance, Standard Deviation Calculator

**Probability Distributions**

- Z-Score Calculator
- Comprehensive Distribution Calculator (Normal, Binomial, t, F, Chi-square)
- Confidence Intervals Calculator

**Hypothesis Testing**

- One and Two Sample Proportion Tests
- Dependent and Independent t-Tests
- General Hypothesis Test Calculator

**Advanced Analysis**

- Correlation and Regression Calculator
- Prediction Interval Calculator

### Educational Resources

- PDF presentations for core statistical concepts
- Embedded video content from educational channels
- Interactive activities and quizzes
- Local calculator downloads for offline use

### Statistics Chatbot

- **Free AI Assistant**: Interactive chatbot for statistics questions and support
- **24/7 Availability**: Get help with statistical concepts anytime
- **Features**:
  - Answer questions about statistical concepts
  - Provide step-by-step problem-solving guidance
  - Explain calculator results and interpretations
  - Offer practice problems and examples
  - Clarify statistical terminology and formulas

## Technical Stack

- **Framework**: React 19.0.0
- **Build Tool**: Vite 6.3.1
- **Styling**: Tailwind CSS 3.3.3
- **Charts**: Chart.js with react-chartjs-2
- **3D Graphics**: Spline 3D
- **Icons**: Lucide React
- **Statistical Computations**: jStat library
- **AI Chatbot**: Integrated statistics assistant for real-time help
- **Deployment**: GitHub Pages with automated CI/CD

## Project Structure

```
statools/
├── src/
│   ├── components/
│   │   ├── calculators/      # Statistical calculator components
│   │   ├── chatbot/          # AI chatbot assistant
│   │   ├── layout/           # Navigation and footer
│   │   ├── sections/         # Homepage sections
│   │   └── ui/               # Reusable UI components
│   ├── pages/                # Page components
│   ├── App.jsx               # Main application component
│   └── main.jsx              # Application entry point
├── public/                   # Static assets and PDFs
├── .github/workflows/        # CI/CD configuration
└── package.json              # Project dependencies
```

## Installation

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Setup

1. Clone the repository:

```bash
git clone https://github.com/mondragon-developer/statools.git
cd statools
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Calculators

1. Create component in `src/components/calculators/`
2. Implement calculation logic and visualization
3. Add routing in main application
4. Update navigation menu

### Deployment

The project uses GitHub Actions for continuous deployment. Any push to the `main` branch automatically builds and deploys to GitHub Pages.

## Component Architecture

### Calculator Components

Each calculator follows a modular architecture:

- Mathematical computation engine (pure functions)
- User interface with parameter controls
- Real-time visualization using Chart.js
- Educational tooltips and explanations

### Chatbot Integration

- AI-powered conversation interface
- Context-aware responses for statistics questions
- Integration with calculator results for explanations
- Persistent chat history during session

### Responsive Design

- Mobile-first approach using Tailwind CSS
- Breakpoints: mobile (<768px), tablet (768px-1279px), desktop (1280px+)
- Touch-optimized interactions for mobile devices

## Color Scheme

- Dark Grey: `#2A2A2A` - Primary text and headers
- Turquoise: `#4ECDC4` - Primary accent and interactions
- Yellow: `#FFFF00` - Call-to-action elements
- Platinum: `#E6E6E6` - Background and secondary elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-calculator`)
3. Commit changes (`git commit -m 'Add new calculator'`)
4. Push to branch (`git push origin feature/new-calculator`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub or contact the development team.

## Acknowledgments

- Statistical computation powered by jStat
- 3D visualizations by Spline
- AI chatbot assistance for enhanced learning support
- Educational content sourced from leading statistics educators
