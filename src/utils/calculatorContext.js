export function buildCalculatorContext(guide, shareCalculator, getSnapshot) {
  const list = (title, items) => (items?.length ? `${title}:\n- ${items.join('\n- ')}` : '');
  return [
    `Calculator: ${guide.name}`,
    `Purpose: ${guide.purpose}`,
    list('Use it when', guide.whenToUse),
    list('Not the right tool for', guide.notFor),
    list('Modes', guide.modes),
    list('Inputs', guide.inputs),
    list('Steps', guide.steps),
    list('Outputs', guide.outputs),
    list('Common mistakes', guide.mistakes),
    shareCalculator ? `ON THE STUDENT'S SCREEN RIGHT NOW\n${getSnapshot()}` : 'Calculator inputs and results are not shared. Ask the student which values they want to discuss.',
  ].filter(Boolean).join('\n\n');
}

