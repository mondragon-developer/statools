# MDragon Data Tools

Free statistics calculators, lessons, quizzes, and an optional AI study assistant for ages 18 and older.
Live site: https://statools.mdragonsolutions.com/

## What is included

Nine calculators: descriptive statistics, frequency distributions, probability,
normal, binomial, Poisson, one-sample hypothesis tests, two-sample comparisons,
and correlation/regression. The seven-stage learning journey includes practice,
local progress, progress transfer codes, and a self-reported completion certificate.
The resource library includes downloadable guides and quizzes. External tools and
the separate MDC lesson service are labeled as external resources.

## Privacy and limitations

Calculations run in the browser. Progress and preferences use browser storage;
there are no learner accounts or application database. AI chat sends messages and
conversation history through `api/chat.js` to Chatbase. The calculator tutor sends
inputs/results only when the learner turns on sharing (off by default). Switching
sharing off does not delete previously submitted material. Browser speech services
may process microphone audio remotely. Hosting requests produce technical logs.

This is an independent educational project, not an accredited course or a source
of professional advice. AI replies and calculator interpretations require review.
See the site's Privacy, Terms of Use, and Accessibility pages. Do not upload student
records, medical data, or other personal information to AI features.

## Development

Use Node.js 22 or later and npm. Install the locked dependency tree with `npm ci`.

```sh
npm run dev
npm run lint
npm test
npm run notices
npm run check
npm run preview
```

`check` runs lint, regression tests, dependency-notice verification, and a production
build. Tests cover descriptive statistics, relay guards, calculator-context sharing,
and existence of linked resource PDFs. They are not a complete numeric audit of all
calculators, accessibility certification, or legal review.

Vite serves the frontend only. For AI development, configure a local backend or an
approved Vercel preview and `VITE_CHAT_API_URL`. Production rejects localhost origins.
See `.env.example`; never place a secret in a variable beginning with `VITE_`.

## Architecture and deployment

React 19, Vite 6, Tailwind, Chart.js, Recharts, jStat, and React Router. Calculators
and learning pages load by route. Markdown/KaTeX loads when AI rendering is needed.
The homepage uses local HTML/CSS rather than external 3D scenes.

- `src/components/calculators`: calculator UI and charting.
- `src/utils/descriptiveStatistics.js`: tested descriptive-statistics engine;
  quartiles use inclusive linear interpolation at `(n - 1) * p`.
- `src/data/journey`, `src/data/quizzes`: instructional content.
- `src/components/chat`: optional AI interfaces and sharing control.
- `api/chat.js`: Vercel relay with origin/input checks, timeout, and emergency switch.
- `src/data/site.js`: published identity, contact, and legal revision date.
- `public/resources`: educational Markdown, HTML, and PDF artifacts.

Vercel hosts the application and `/api/chat`. Configure `CHATBASE_API_KEY` and
`CHATBASE_BOT_ID` server-side. Set `CHAT_ENABLED=false` and redeploy to disable AI
without disabling calculators. The edge firewall and billing controls are account
settings, not provisioned by this repository. Origin checks alone cannot prevent
scripted quota abuse.

The GitHub Pages workflow validates the app and publishes only the legacy redirect
files. It does not host the AI backend. Pull requests run release checks separately.
Vercel deployment triggers and branch protections must be verified in project settings.

## Launch and maintenance

Read [the launch checklist](docs/LAUNCH_CHECKLIST.md) before public promotion.
It records unresolved operator, vendor, legal, accessibility, and content-rights
checks, plus privacy-request and incident procedures. Re-run security verification
after changes to the relay, headers, dependencies, or provider configuration.
Run `npm audit` after dependency changes and regularly during operation.

The security baseline/report describe a prior point-in-time self-assessment and
are not proof that new changes are secure or that legal obligations are satisfied.

## Licensing

Original application code and technical documentation use the [MIT license](LICENSE).
Educational content and branding are excluded; see [CONTENT_LICENSE.txt](CONTENT_LICENSE.txt).
Third-party code retains its own licenses. `npm run notices` generates
`public/third-party-notices.txt` from installed runtime dependencies. Include it in
releases and check [content provenance](docs/CONTENT_RIGHTS.md) before distributing
materials. Do not assume a repository file proves authorship or institutional permission.

## Contact

Questions, accessibility barriers, privacy requests, and rights concerns:
mondradev@gmail.com. Include a page URL or conversation reference as appropriate;
do not send sensitive datasets. The AI assistant is not a support ticket system.

AI chat requires an adult self-declaration in each mounted tutor. The relay requires
`adultConfirmed: true`; this is not identity or age verification. Deploy frontend
and API together. Lessons and calculators do not require this confirmation.
