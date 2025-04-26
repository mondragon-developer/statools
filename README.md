### MDragon Data Tools
A modern statistics class website built with React, Vite, and Tailwind CSS. This project aims to provide an intuitive interface for students to access statistical tools, resources, and learning materials.
Live site: https://mondragon-developer.github.io/statools/
Features

Modern, responsive design
Statistical calculators and tools
Data visualization components
Learning resources for statistics concepts
Clean, intuitive user interface

### Tech Stack

React: Frontend library for building user interfaces
Vite: Next-generation frontend build tool
Tailwind CSS: Utility-first CSS framework
Lucide React: Icon library for React
GitHub Actions: CI/CD for automatic deployment
GitHub Pages: Hosting platform

## Color Scheme

Dark Grey: #2A2A2A
Muted Turquoise: #4ECDC4
Electric Yellow: #FFFF00
Light Platinum: #E6E6E6

## Project Setup
# Prerequisites

Node.js (version 18 or later)
npm (comes with Node.js)
Git

# Installation

Clone the repository:
bashgit clone https://github.com/mondragon-developer/statools.git
cd statools

Install dependencies:
bashnpm install

Start the development server:
bashnpm run dev

Open your browser and navigate to:
http://localhost:5173


## Development Workflow

Create or modify components in the src/components directory
Test changes locally using npm run dev
Commit changes with meaningful commit messages
Push to GitHub to trigger automatic deployment:
bashgit add .
git commit -m "Description of changes"
git push origin main


## Project Structure
statools/
├── .github/
│   └── workflows/        # GitHub Actions workflow files
│       └── deploy.yml    # Deployment workflow
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application styles
│   ├── index.css         # Global styles (includes Tailwind)
│   └── main.jsx          # Application entry point
├── index.html            # HTML template
├── package.json          # Project dependencies and scripts
├── postcss.config.cjs    # PostCSS configuration
├── tailwind.config.cjs   # Tailwind CSS configuration
└── vite.config.js        # Vite configuration
Deployment
The site is automatically deployed to GitHub Pages whenever changes are pushed to the main branch. The deployment process:

GitHub Actions workflow is triggered by push to main
The workflow builds the site using npm run build
Built files are deployed to the gh-pages branch
GitHub Pages serves the site from this branch

# Troubleshooting
If you encounter issues with Tailwind CSS configuration or other setup problems, refer to the Troubleshooting Guide.
Common issues:

Module system conflicts between ES Modules and CommonJS
Tailwind CSS and PostCSS configuration problems
GitHub Pages deployment issues

# Future Enhancements

Add more statistical calculators
Implement interactive data visualizations
Create tutorials and guides for common statistical methods
Add user authentication for saving preferences

# Contributing
Contributions are welcome! Feel free to submit issues or pull requests.
License
MIT License