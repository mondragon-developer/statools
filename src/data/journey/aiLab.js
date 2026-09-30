// One card per journey stage for the home page AI Lab. Wording follows the plan's AI
// message rules: no "AI thinks like a person", scores are not guarantees, and so on.
export const AI_LAB = [
  {
    stage: 1,
    question: 'How does a music app "hear" a song?',
    idea: 'Data and variables',
    teaser: 'It does not hear a song the way you do. The song is turned into numbers first: genre, tempo, how long people listen. Patterns are found in those numbers.',
  },
  {
    stage: 2,
    question: 'Why can a few strange values fool an AI model?',
    idea: 'Mean, median, and outliers',
    teaser: 'A model learns from the examples it is given, mistakes included. Checking center, spread, and outliers before training helps stop a handful of extreme values from pulling it off course.',
  },
  {
    stage: 3,
    question: 'How does predictive text guess your next word?',
    idea: 'Probability',
    teaser: 'A language model estimates how likely each possible next piece of text is, given the words so far, and then picks among the likely options. It is probability, not mind reading.',
  },
  {
    stage: 4,
    question: 'If an AI is "95% confident", is it right?',
    idea: 'Distributions and z-scores',
    teaser: 'A confidence score is not a promise the answer is correct. Knowing what counts as unusual on a distribution helps you decide when a score deserves a closer look.',
  },
  {
    stage: 5,
    question: 'Did the new AI model really get better?',
    idea: 'Confidence intervals and hypothesis tests',
    teaser: 'Teams test models on data the model never learned from. A small gain might just be random variation, and a test tells you how much evidence there really is.',
  },
  {
    stage: 6,
    question: 'How does an AI model "learn"?',
    idea: 'Regression and prediction error',
    teaser: 'Linear regression is one of the simplest learning models: it adjusts a line to shrink its prediction errors. Much bigger models also learn by adjusting settings to reduce error.',
  },
  {
    stage: 7,
    question: 'Can you trust a conclusion that came from AI?',
    idea: 'Putting it all together',
    teaser: 'Good analysis, by a person or an AI tool, states its uncertainty, checks its assumptions, and names its limits. In the final case file you practice doing exactly that.',
  },
];
