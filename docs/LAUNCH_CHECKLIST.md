# Public launch checklist

Review date: October 2, 2026. Scope: free statistics education site, optional AI,
no accounts or school records database. This checklist is not legal clearance.
The October 1 security assessment is historical evidence, not a current certification.

## Release gates

- Run `npm ci`, `npm run check`, and `npm audit`. Investigate advisories; do not
  treat a successful build as a security audit.
- On a preview deployment, test every calculator with a published worked example
  and invalid/boundary inputs. Automated numeric coverage currently covers the
  descriptive-statistics engine, not all nine calculators.
- Test 390px mobile layout, desktop, keyboard-only use, zoom/reflow, a screen
  reader, quiz navigation, progress export/import, certificate printing, and PDFs.
  The accessibility page reports the incomplete manual audit.
- Confirm AI notices appear, calculator sharing starts unchecked, and disabling
  sharing excludes NEW snapshots. Previous shared context may remain in the
  provider's stored conversation; do not describe this toggle as deletion.
- Test the real chat integration using synthetic data only. Verify 403 for foreign
  origins, generic errors, hosting headers, and the deployed firewall rule.
- Check external calculator/lesson links manually. The automated resource check
  only verifies local linked PDFs, not external availability or PDF accessibility.
- Review the diff, publish, then repeat production smoke checks and retain the
  deployment URL/commit and results. A code push can trigger deployment.

## Operator and legal evidence still required

| Item | Evidence needed | Status |
| --- | --- | --- |
| Publisher | Actual legal operator name, business/trade-name status, appropriate contact details | Jose Mondragon confirmed he operates Statools; no separate entity status inferred |
| Audience | Launch countries, ages, and whether schools will adopt the service | Owner confirmed general learners and his high-school/college students across institutions; owner approved AI tutor restricted to 18+; non-AI resources retain 13+ positioning; launch countries remain unconfirmed |
| Legal review | Florida counsel review of terms, liability exclusions, assent, minors, venue, mandatory rights, and operator identity | Not performed |
| School relationship | Authorization for MDC references; distinguish external lessons, institution accounts, and this independent site | External-service explanation added; permissions not verified |
| Content rights | Authorship/employment rights and source/license evidence for PDFs, question banks, lessons, and logo | See CONTENT_RIGHTS.md; owner verification required |
| International privacy | Applicability, legal bases, disclosures, transfers, rights handling, and local storage/cookie rules for selected markets | Counsel review needed if expanding internationally |
| Accessibility | Manual audit and remediation evidence for supported browsers, assistive technologies, charts, quizzes, and PDFs | Full audit pending |

## Chatbase and Vercel evidence still required

Review the Statools bot specifically; do not assume settings on another bot apply.
Do not accept a contract or alter retention without reviewing the actual terms
and the consequences for existing data.

- Confirm the applicable Chatbase DPA/version and account agreement. The current
  published DPA says it supplements the agreement; do not assume a dashboard
  checkbox or separate signature is required.
- Record model provider/subprocessors, hosting regions, and how the published
  no-training statement applies to the account. Do not invent an opt-out toggle.
- Set and document a retention policy the service can actually implement. If
  automatic retention is unavailable on the plan, document a deletion schedule.
  The public notice currently makes no automatic fixed-day deletion promise.
- Run a deletion drill using a synthetic conversation and its reference. Record
  how active copies and backups are handled and when provider confirmation arrives.
- Record Vercel logging retention and access. Confirm upstream response bodies
  are not logged by this application's relay.
- Verified in the Vercel dashboard on October 2: the enabled rule matches request
  path `/api/chat`, with a fixed window of 40 requests per 60 seconds per IP and
  Deny (403). No HTTP-method condition was displayed; the prior report described
  a POST-only rule. A shared campus IP may hit the limit. This was a configuration
  inspection, not a new runtime burst test.
- Configure available usage/spending alerts and limits in hosting and AI accounts.
  Confirm who receives them. Application CORS checks alone do not prevent scripts
  from forging Origin; retain edge rate limiting and usage monitoring.
- Chatbase read-only inspection on October 2 located AI Statistics Assistant;
  its agent ID matches the fallback in `api/chat.js`. The deployed environment
  override was not inspected. Its monthly credit limit is enabled at 1,000 credits.
  This is a credit cap, not a verified dollar spending cap or notification setup.
- Chatbase's website-widget limit is 10 messages per device per 300 seconds.
  The UI describes iframe/chat-bubble traffic; do not assume it protects the
  custom API relay. Spam detection is off. The Vercel rule above protects the relay.
- Owner reports the Chatbase instructions are now fixed, following the proposed
  transparent, learning-first tutor instructions and aligned guardrails. This
  supersedes the earlier instruction-conflict finding. Saved settings and actual
  tutoring behavior have not been independently rechecked since that update.
- Review and refresh authorized knowledge sources: the UI reports last sync over
  one year ago, auto-resync off, and still lists the former GitHub Pages URL.
  Uploaded PDF provenance also needs review (see CONTENT_RIGHTS.md).
- The selected model is displayed as OpenAI GPT-5.6 Terra, temperature 0.1.
  This observation does not verify hosting regions, all subprocessors, contractual
  no-training coverage, or retention. No timed-retention control was visible in
  the inspected bot screens; a bulk-delete control alone does not establish policy.
- Rehearse `CHAT_ENABLED=false` on a preview environment and redeploy. Confirm
  POST `/api/chat` returns 503 while calculators and lessons remain available.

## Privacy-request procedure

1. Receive requests at the contact address in `src/data/site.js`. Ask for the
   conversation reference and approximate date, not a copy of sensitive chat text.
2. Locate the conversation and verify the requester's authority with proportionate
   information. A reference helps locate a conversation; it is not proof of identity.
3. Record request date, applicable deadline, scope, provider request, and response
   in a restricted operational record, never this public repository.
4. Coordinate access/correction/deletion with the provider. Explain any lawful
   retention exceptions and remaining backup handling. Do not promise deletion
   merely because browser storage was cleared.
5. Respond within the applicable legal deadline and retain only necessary evidence.

## Incident procedure

1. For suspected exposure or runaway usage, disable chat with `CHAT_ENABLED=false`
   and redeploy; preserve restricted evidence without copying conversation content
   or secrets into public tickets.
2. Inspect provider access and usage. Rotate compromised keys, contain affected
   services, and contact the provider. Obtain legal advice about notification
   obligations and deadlines; do not assume every event has the same deadline.
3. Fix and validate using synthetic data, review headers/firewall/billing settings,
   then restore chat deliberately. Record the cause and preventive action.

## Primary references checked during the review

- [FTC privacy promises](https://www.ftc.gov/business-guidance/privacy-security)
- [FTC COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- [Education Department: service providers and FERPA](https://studentprivacy.ed.gov/resources/responsibilities-third-party-service-providers-under-ferpa)
- [Chatbase privacy](https://www.chatbase.co/legal/privacy) and [DPA](https://www.chatbase.co/legal/dpa)
- [DOJ web accessibility guidance](https://www.ada.gov/resources/web-guidance/)
- [EU GDPR scope](https://europa.eu/youreurope/business/governance-and-sustainability/digital-and-data-compliance/data-protection-gdpr/index_en.htm)

Recheck references and vendor terms before relying on them for a new launch.

## Local verification on October 2, 2026

- `npm run check`: passed (lint: zero errors/warnings; 9 tests passed; notices
  current; production build succeeded).
- `npm audit --omit=dev`: zero known production dependency vulnerabilities.
- Chrome production preview: homepage navigation, statistics route, worked-example
  calculation (mean 5, sample SD 2.6458), population toggle (SD 2.3664), and unchecked
  calculator-sharing control verified. No real chat was sent during these checks.
- Mobile viewport requested at 390 x 844: homepage had equal document/client widths
  (375 CSS pixels after browser scaling), with no horizontal overflow.
- Removed multi-megabyte Spline/physics chunks. The largest remaining output chunk
  is approximately 711 kB minified; Vite still warns about chunks over 500 kB.
- After explicit read-only authorization, the active Vercel firewall rule was
  inspected and verified as described above. The separately authorized Chatbase
  selector was used to locate Statools, and its sources, general settings,
  guardrails, and instructions were inspected. No vendor settings were changed,
  agreements accepted, or conversations deleted or opened.
- No production deployment or counsel review was performed. Manual accessibility,
  all-calculator numerical validation, and provider deletion drills remain open.

## AI age restriction implementation

Owner approved an 18+ restriction for AI tutoring only. Both chat panels now
require an explicit adult self-declaration before exposing messages, starter
prompts, calculator sharing, or chat dictation controls. The confirmation is held
in component memory (not a persistent cookie or age record); reloading resets it.
No date of birth or identity document is requested. The API rejects requests
without literal `adultConfirmed: true` before calling Chatbase. This is a
self-declaration that can be falsified, not verified age or legal clearance.
Older frontend clients without this field fail closed; deploy frontend and API
together. Direct Chatbase channels, if offered separately, are outside this gate.

Terms and Privacy now distinguish adult-only AI from the other resources.
Teachers must not assign AI tutor use to students under 18. Other launch items
remain open and are deferred at the owner's request, not marked complete.

Validation: lint, nine tests, notices, and build passed. API tests cover missing,
false, string, and numeric age flags with no upstream request. Browser preview
confirmed both gates, general-chat controls after confirmation, and return to the
calculator using Continue without AI. No live AI message was sent or deployment made.

## Homepage accessibility review

See [ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md) for the October 2 homepage
review, corrected issues, sampled zero-violation axe scans, and criterion-by-criterion
limits. Full assistive-technology, all-page, and PDF conformance remain unverified.
