# Homepage accessibility review: WCAG 2.2 AA

Date: October 2, 2026. Baseline production commit: 8570042.
Scope: Statools homepage, interactive dataset, calculator chooser, resource
filters and sampled practice quiz, optional game, AI age gate and chat controls.
The source fixes also affect shared components. This is NOT a declaration of
full WCAG conformance or a complete site/PDF audit.

## Method and evidence

- Chrome browser UI, accessibility tree, DOM geometry, source inspection.
- axe-core 4.13.0 against the local source matching the deployed baseline, then
  against the corrected source. Tags: wcag2a, wcag2aa, wcag21a, wcag21aa,
  wcag22aa, best-practice. No live user conversations or microphone audio used.
- Baseline: prohibited aria-label on a generic dataset div; teal on platinum
  measured 4.38:1; game speed labels measured 4.0:1. Also a skip-link landmark
  best-practice warning, which is not itself a WCAG conformance failure.
- Corrected automated scans: zero violations in the sampled homepage,
  narrow/text-spacing state, open quiz, AI age gate, adult chat controls,
  untimed game, and expanded calculator-chooser state.
- Tested 320 x 800 CSS viewport: no horizontal page overflow, including increased
  text spacing (line height 1.5, paragraph spacing 2em, letter spacing .12em,
  word spacing .16em). Browser scrollbar/scaling yielded a 305px content width.
- Tested 1280 x 800 with root text size doubled to 32px: no page overflow;
  dialog controls remained reachable. This is a text-resize test, not a claim
  that every browser's 200%/400% zoom behavior was tested.
- Tested 800 x 320 landscape: no horizontal page overflow; keyboard-scrolled
  age-confirmation control remained visible.
- Keyboard: dataset slider and reset/outlier controls; modal Shift+Tab containment;
  quiz answer selection, Next, ordering, Submit, results, Escape and focus return;
  calculator chooser moves focus to each new question; game moves one cell in
  untimed mode and pauses when focus leaves, without stealing the hero slider keys.
- axe flagged SVG text/canvas backgrounds as incomplete. The chart's dark text
  (#374151) is on white, and its axis uses #6b7280; the game has dark teal snake
  cells, white letters, and explicit textual positions. These were source/visual
  checks, not an automated pass for every animated frame.

## Changes made

1. Darkened shared teal to #0D6861 and corrected game/quiz contrast.
2. Fixed dataset ARIA grouping; added a diamond marker so the controlled value
   is distinguishable by shape as well as color; strengthened plot-axis contrast.
3. Fixed dialog focus initialization after loading. Background branches become
   inert, Tab stays inside, Escape closes, and focus returns to the launcher.
4. Fixed mobile quiz overflow and kept headers/controls reachable. Quiz choices
   expose selected state; matching selects have labels; ordering retains focus
   on the moved item; each new question receives focus.
5. Made resource rows wrap; filter changes are announced. Added space below page
   content and scroll margins to reduce obstruction by floating controls.
6. Fixed the voice command's obsolete chat selector and excluded inert background
   elements from voice targeting. Feedback no longer disappears after four seconds
   and can be dismissed. No speech-provider integration test was performed.
7. Restricted game keys to game focus, excluded input controls, and pause on exit.
   Added untimed step mode, head/target/body position descriptions, better game
   contrast and adequate small-screen space for start/finish overlays.
8. Added reduced-motion CSS, dark-background navigation focus outlines, a fixed
   skip link, and focus restoration after dismissing the accessibility banner.
9. Updated the public accessibility statement without claiming certification.

## Success-criterion review

Legend: **Sampled** = no remaining issue detected in the stated checks; not a
site-wide pass. **Review** = more evidence needed. **N/A** = absent in this scope.
All applicable A and AA requirements must be met before claiming conformance.

| Criterion | Result | Evidence or limitation |
| --- | --- | --- |
| 1.1.1 Non-text Content | Review | Dataset description and game text added; nonvisual game usability and linked PDFs still require review |
| 1.2.1 Audio-only/Video-only | N/A | No prerecorded media in audited page |
| 1.2.2 Captions (Prerecorded) | N/A | No prerecorded video |
| 1.2.3 Audio Description/Media Alternative | N/A | No prerecorded video |
| 1.2.4 Captions (Live) | N/A | No live synchronized media |
| 1.2.5 Audio Description | N/A | No prerecorded video |
| 1.3.1 Info and Relationships | Sampled | Labels, headings, landmarks, selected states, described chart; matching labels source-reviewed |
| 1.3.2 Meaningful Sequence | Sampled | DOM/accessibility order and responsive layout reviewed |
| 1.3.3 Sensory Characteristics | Sampled | Numeric labels and shapes supplement color; game text describes positions |
| 1.3.4 Orientation | Sampled | Portrait 320x800 and landscape 800x320; no orientation lock |
| 1.3.5 Identify Input Purpose | N/A | No personal-information form in page |
| 1.4.1 Use of Color | Sampled | Selection semantics, text feedback, diamond marker and game position descriptions |
| 1.4.2 Audio Control | N/A | No autoplay audio |
| 1.4.3 Contrast (Minimum) | Sampled | Automated contrast corrected; SVG/canvas manual limits above |
| 1.4.4 Resize Text | Sampled | Root font doubled; controls remained reachable |
| 1.4.5 Images of Text | Sampled | HTML text for content; branding exception; game text also represented in HTML |
| 1.4.10 Reflow | Sampled | No horizontal page overflow at 320px; sampled dialogs checked |
| 1.4.11 Non-text Contrast | Review | Axis/control/game improvements; not every hover/focus/animated frame independently measured |
| 1.4.12 Text Spacing | Sampled | Required spacing values tested at narrow width |
| 1.4.13 Content on Hover or Focus | Sampled | Core audited features do not rely on custom hover-only content |
| 2.1.1 Keyboard | Review | Sampled main controls and quiz flow passed; all randomized questions and full game still need AT testing |
| 2.1.2 No Keyboard Trap | Sampled | Modal cycling plus Escape and focus return verified |
| 2.1.4 Character Key Shortcuts | N/A | No unmodified printable-character shortcut; game uses scoped arrows/Escape |
| 2.2.1 Timing Adjustable | Sampled | Quizzes untimed; game offers no-timer mode; voice feedback persistent |
| 2.2.2 Pause, Stop, Hide | Sampled | Game starts on request and can pause; pauses on leaving |
| 2.3.1 Three Flashes or Below Threshold | Review | No deliberate flashing found; no instrumented flash analysis of every game state |
| 2.4.1 Bypass Blocks | Sampled | Skip link and named landmarks; main target focusable |
| 2.4.2 Page Titled | Sampled | Home - MDragon Data Tools |
| 2.4.3 Focus Order | Sampled | Dialog initialization/return, quiz changes, ordering and chooser checked |
| 2.4.4 Link Purpose (In Context) | Sampled | Named navigation, resources and contextual links |
| 2.4.5 Multiple Ways | Review | Home sections/navigation/resources available; full set of site pages not audited |
| 2.4.6 Headings and Labels | Sampled | Heading hierarchy and control names inspected |
| 2.4.7 Focus Visible | Sampled | Default outlines, white dark-nav outline, dialog focus inspected |
| 2.4.11 Focus Not Obscured (Minimum) | Review | Sampled mobile/short dialogs and focus scrolling checked; exhaustive tab sweep at all sizes pending |
| 2.5.1 Pointer Gestures | Sampled | Standard click/tap controls; no multipoint gesture required |
| 2.5.2 Pointer Cancellation | Sampled | Native click events; no destructive pointer-down action found |
| 2.5.3 Label in Name | Sampled | Visible control text included in names; chat voice selector repaired |
| 2.5.4 Motion Actuation | N/A | No device-motion controls |
| 2.5.7 Dragging Movements | Sampled | Range supports click/keyboard; ordering uses buttons |
| 2.5.8 Target Size (Minimum) | Sampled | axe target-size rule passed sampled states; native/inline exceptions apply |
| 3.1.1 Language of Page | Sampled | html lang=en |
| 3.1.2 Language of Parts | Review | English authored UI; generated AI text not exhaustively assessed |
| 3.2.1 On Focus | Sampled | No navigation/submission on focus |
| 3.2.2 On Input | Sampled | Deliberate state updates; reset-causing game settings explicitly labeled |
| 3.2.3 Consistent Navigation | Review | Shared source inspected; cross-page audit not complete |
| 3.2.4 Consistent Identification | Review | Shared controls reviewed; cross-page audit not complete |
| 3.2.6 Consistent Help | Review | Footer contact and shared chat controls; full site review pending |
| 3.3.1 Error Identification | Review | Chat error UI source-reviewed; live provider/network errors not triggered |
| 3.3.2 Labels or Instructions | Sampled | Slider, age gate, game and sampled quiz controls labeled |
| 3.3.3 Error Suggestion | Review | Retry copy present; full error-state/AT testing pending |
| 3.3.4 Error Prevention (Legal, Financial, Data) | N/A | No financial transaction or legal agreement submission in audited flow |
| 3.3.7 Redundant Entry | Sampled | No repeated data-entry process in sampled task; age declaration held during component lifetime |
| 3.3.8 Accessible Authentication (Minimum) | N/A | No login; self-declared age gate is not identity authentication |
| 4.1.2 Name, Role, Value | Sampled | Corrected dataset group, selected buttons, labels and expanded states |
| 4.1.3 Status Messages | Review | Live regions and filter/game status present; actual screen-reader announcements still need testing |

## Remaining acceptance work

- NVDA + Chrome/Firefox and VoiceOver + Safari: reading, virtual cursor, dialogue
  transitions, error announcements, game usability and chart interpretation.
- Full keyboard traversal at browser zoom levels and all responsive breakpoints;
  Windows forced colors, mobile touch screen readers and speech recognition.
- Every quiz type and result expansion, every calculator, other learning routes,
  PDF tagging/reading order, and external linked resources. No blanket claim that
  a PDF is accessible merely because it downloads.
- Actual AI response/error rendering with synthetic data; long formulas and links.

## Reproducing automated checks

Run `npm run dev`, open `/?audit=1`, and use the development audit controls.
Control+Alt+A scans after five seconds so an open dialog can be audited. Text-size
and spacing controls simulate user overrides. The panel and axe import are gated
by `import.meta.env.DEV` and are absent from production bundles. The panel is
excluded from scans; modal background is inert because it is intentionally
unavailable while a modal is open. Automated checks do not prove conformance.

References: [WCAG 2.2](https://www.w3.org/TR/WCAG22/),
[W3C quick reference](https://www.w3.org/WAI/WCAG22/quickref/),
[axe-core API](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md).
