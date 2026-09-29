// All datasets in the journey are fictional and made up for teaching.
const stage7 = {
  id: 7,
  slug: 'final-case-file',
  title: 'Final Case File',
  theme: 'The Data Hero Capstone',
  question: 'Can I answer a real question with data?',
  detectiveCase:
    'You receive a small dataset and a question to investigate: did a study tool improve quiz scores, did a campaign change sign-up rates, or does a feature predict an outcome? No one tells you which tool to use. You frame the question, pick the method, and explain what the evidence does and does not show.',
  skills: [
    'Problem framing',
    'Data inspection',
    'Descriptive statistics and visualization',
    'Choosing a confidence interval or test',
    'Regression where appropriate',
    'Plain-language conclusions and limitations',
  ],
  aiConnection:
    'AI and statistics are tools for making better, evidence-aware decisions. A good analysis, whether a person or an automated system produces it, includes uncertainty, checks its assumptions, and states its limits. A single number or an automated answer is not a conclusion on its own.',
  badge: {
    name: 'Data Hero & AI Apprentice',
    description: 'You can take a question from start to finish: inspect the data, choose and run the right tool, and explain the result with its uncertainty and limits.',
  },
  coachPrompt: "You have the clues. I'll help you choose the next tool, but the conclusion is yours to explain.",
  calculators: ['statistics', 'frequency-distribution', 'hypothesis-test', 'two-sample', 'correlation-regression'],
  resources: ['guide-statistics', 'confidence-intervals', 'hypothesis-one', 'hypothesis-two', 'regression-interpreting'],
  lessons: [
    {
      id: 's7-l1',
      title: 'Frame the Question, Inspect the Clues',
      minutes: 12,
      objective: 'Turn a vague claim into a clear statistical question and check the data before running any test.',
      hook:
        'A teacher says, "The new study app works." Works how? Higher scores? More students passing? Compared to what? Before a detective opens the toolbox, they write down exactly what they are trying to find out.',
      concept: {
        paragraphs: [
          'A good question names three things: the outcome you measure, the groups or conditions you compare, and what would count as a difference. "Did the average quiz score go up after students used the app?" is something data can answer. "Is the app good?" is not.',
          'Next, name the data type. Is the outcome a number (score, time, price) or a category (signed up or not, passed or not)? That one choice decides whether you work with means or with proportions.',
          'Then inspect before you calculate. Look at the raw values, check the sample size, and draw a quick histogram or summary. Typos, missing values, and extreme outliers are easier to catch now than to explain later.',
        ],
        table: {
          caption: 'Turning a vague claim into a question data can answer',
          headers: ['Vague claim', 'Outcome', 'Data type', 'Clear question'],
          rows: [
            ['The app works', 'Quiz score', 'Numerical', 'Did the mean score change after using the app?'],
            ['The ad helped', 'Signed up (yes/no)', 'Categorical', 'Is the sign-up rate different with the new ad?'],
            ['Practice pays off', 'Game score', 'Numerical', 'Does practice time help predict game score?'],
          ],
        },
        keyTerms: [
          { term: 'Research question', definition: 'A specific question that names the outcome, the comparison, and what counts as a difference.' },
          { term: 'Outcome variable', definition: 'The thing you measure to answer the question, such as a score or a yes/no result.' },
          { term: 'Data inspection', definition: 'Looking at the raw values, counts, and a quick chart before running any test.' },
        ],
      },
      ai: {
        paragraphs: [
          'AI teams do the same thing before training or testing a model. They define what "better" means (fewer errors, faster answers, more clicks) and they look at the data first.',
          'A model trained on data with typos or duplicated rows learns those problems too. Inspection is not a formality; it is where many real issues are found.',
        ],
      },
      practice: [
        {
          id: 's7-l1-p1',
          question: 'A company says its new checkout page "is better." Which question can data actually answer?',
          options: [
            'Do customers like the new page more?',
            'Is the share of visitors who complete a purchase different on the new page?',
            'Is the new page the best possible design?',
            'Will the new page work forever?',
          ],
          answer: 1,
          hints: ['Look for an option that names something you can count or measure.', 'Which option has a clear outcome and a clear comparison?'],
          explanation: 'Purchase completion is a measurable outcome, and it compares the new page to the old one. "Like more" and "best possible" are not defined well enough to measure.',
        },
        {
          id: 's7-l1-p2',
          question: 'You paste 12 quiz scores into the statistics calculator. The mean is 68.3 but the median is 73.5, and one score is 7 when the rest are between 66 and 81. What should you do first?',
          options: [
            'Report the mean of 68.3 and move on',
            'Delete the 7 without saying anything',
            'Check whether the 7 is a typo or a real score, and report what you did',
            'Switch to the median and never mention the 7',
          ],
          answer: 2,
          hints: ['A value that far from the rest is a clue. What could explain it?', 'Whatever you decide, would a reader need to know about it?'],
          explanation: 'A 7 among scores in the 60s to 80s could be a typo for 70 or 77. Check the source first. If you fix or remove it, say so, because it changes the mean a lot.',
        },
      ],
      mission: {
        calculator: 'statistics',
        task: 'Inspect a small set of quiz scores and find the suspicious value before doing anything else.',
        dataLabel: 'Quiz scores (12 students)',
        data: '72, 68, 75, 81, 7, 77, 70, 74, 79, 66, 73, 78',
        steps: [
          'Open the calculator and paste the 12 scores.',
          'Compare the mean, the median, and the standard deviation.',
          'Remove the 7 and run it again. Compare the two results.',
        ],
        lookFor: 'How far apart are the mean and median with the 7 included? What happens to the standard deviation when it is removed?',
        interpretation: 'With the 7, the mean is about 68.3, the median is 73.5, and the SD is about 19.8. Without it, the mean is about 73.9 and the SD drops to about 4.7. One suspicious value was driving most of the spread, so it must be checked and reported.',
      },
      reflection: {
        prompt: 'Rewrite the claim "The new study app works" as a question data could answer.',
        sampleAnswer: 'Did the average quiz score of the same students go up after they used the study app for two weeks?',
      },
    },
    {
      id: 's7-l2',
      title: 'Choosing the Right Tool',
      minutes: 14,
      objective: 'Use a short decision path to pick the right calculator from everything you learned in Stages 1 to 6.',
      hook:
        'You have learned a lot of tools. That is the hard part of a real case: nobody tells you which one to use. The good news is that a few questions narrow the choice down quickly.',
      concept: {
        paragraphs: [
          'Question 1: What do you want to do? Describe the data, find a chance, check if a value is unusual, estimate or test a claim, or look for a relationship?',
          'Question 2: Is the outcome a number or a category? Numbers lead to means; yes/no outcomes lead to proportions.',
          'Question 3: How many groups, and how were they collected? One group against a target value, two separate groups, or the same people measured twice?',
          'The last question is the one people miss most. When the same students take a test before and after, the two lists are paired. Subtract each student\'s before score from their after score, then run a one-sample t-test on those differences against 0.',
        ],
        table: {
          caption: 'A quick decision path through the Statools calculators',
          headers: ['Your situation', 'Tool', 'Calculator'],
          rows: [
            ['Summarize or picture one list of numbers', 'Mean, median, SD, histogram', 'Statistics; Frequency Distribution'],
            ['Chance of k successes in n yes/no trials', 'Binomial', 'Binomial'],
            ['Is one value unusual on a bell curve?', 'Z-score', 'Normal'],
            ['One mean or one proportion vs. a target', 'One-sample t or z, with interval', 'Hypothesis Test'],
            ['Same people measured twice', 'Differences, then one-sample t vs. 0', 'Statistics, then Hypothesis Test'],
            ['Two separate groups, numerical outcome', 'Welch t-test', 'Two-Sample (means)'],
            ['Two separate groups, yes/no outcome', 'Two-proportion z-test', 'Two-Sample (proportions)'],
            ['Paired X and Y, predict Y from X', 'Correlation and regression', 'Correlation & Regression'],
          ],
        },
        keyTerms: [
          { term: 'Independent groups', definition: 'Different people or items in each group, so knowing one group tells you nothing about the other.' },
          { term: 'Paired data', definition: 'Two measurements on the same person or item, such as before and after.' },
          { term: 'Proportion', definition: 'The share of a group with a yes outcome, such as 62 sign-ups out of 400 visitors.' },
        ],
      },
      ai: {
        paragraphs: [
          'AI teams face the same choice when they compare models. Scoring two models on the same test questions is paired data. Showing two versions of an app to two different sets of users (an A/B test) gives independent groups.',
          'Using the wrong comparison can hide a real improvement or invent one that is not there. The tool must match how the data was collected.',
        ],
      },
      practice: [
        {
          id: 's7-l2-p1',
          question: 'Twenty runners record their 5 km time before and after a six-week training plan. Which approach fits?',
          options: [
            'Two-Sample (means) with the before and after lists as two groups',
            'Find each runner\'s difference, then a one-sample t-test on the differences vs. 0',
            'Two-Sample (proportions)',
            'Correlation and regression between before and after times',
          ],
          answer: 1,
          hints: ['Are the before and after times from different runners or the same runners?', 'Same people measured twice is paired data. What do you do with pairs?'],
          explanation: 'Each runner appears in both lists, so the data is paired. Subtract to get one difference per runner and test whether the mean difference is 0.',
        },
        {
          id: 's7-l2-p2',
          question: 'A store shows one coupon to 300 shoppers and a different coupon to 300 other shoppers, then records whether each shopper bought something. Which calculator fits?',
          options: [
            'Hypothesis Test, one-sample mean',
            'Two-Sample, means (Welch t)',
            'Two-Sample, proportions (z)',
            'Correlation & Regression',
          ],
          answer: 2,
          hints: ['Is the outcome a number or a yes/no?', 'How many groups are there, and are they the same shoppers?'],
          explanation: 'Bought or did not buy is a yes/no outcome, and the two coupon groups are different shoppers. That is a comparison of two independent proportions.',
        },
      ],
      mission: {
        calculator: 'two-sample',
        task: 'A team tested two chatbot versions on two separate sets of 200 questions. The new version answered 170 correctly; the old version answered 150 correctly. Compare the two accuracy rates.',
        dataLabel: 'Correct answers out of 200 questions (new version, then old version)',
        data: '170, 200, 150, 200',
        steps: [
          'Open the calculator and choose to compare two proportions.',
          'Enter Group 1 (new): 170 successes, sample size 200. Enter Group 2 (old): 150 successes, sample size 200.',
          'Keep a two-tailed test at 0.05 and read the z statistic, p-value, and confidence interval.',
        ],
        lookFor: 'What are the two accuracy rates, and does the interval for the difference include 0?',
        interpretation: 'The rates are 85% and 75%. The test gives z of about 2.50 and a two-tailed p-value of about 0.012. The 95% interval for the difference runs from about 2.2 to 17.8 percentage points, so it does not include 0. The new version likely does better on questions like these, though the true gain could be small or fairly large.',
      },
      reflection: {
        prompt: 'In one sentence, explain how you tell paired data apart from two independent groups.',
        sampleAnswer: 'If each value in one list is linked to a specific value in the other (the same person or item measured twice), it is paired; if the groups are different people, they are independent.',
      },
    },
    {
      id: 's7-l3',
      title: 'Telling the Truth About Your Result',
      minutes: 13,
      objective: 'Write a conclusion that states the result, its uncertainty, the checked assumptions, and at least one limitation.',
      hook:
        'Two analysts get the same p-value. One writes "It works!" The other writes "The data shows an average gain of about 4 points, likely between 3 and 6, in one class with no comparison group." Which one would you trust with your decision?',
      concept: {
        paragraphs: [
          'A strong conclusion answers the original question in plain words, gives the size of the effect (not only "significant"), and shows the uncertainty with a confidence interval.',
          'It also says which assumptions you checked, such as a random or independent sample, enough data, and no extreme outliers driving the result.',
          'Finally, it names a limitation: a small sample, no comparison group, a sample that may not represent everyone, or a relationship that does not prove cause and effect.',
          '"Not enough evidence" is an honest and useful result. It does not mean "no effect." It means the data cannot rule out zero, and more or better data may be needed.',
        ],
        keyTerms: [
          { term: 'Effect size', definition: 'How big the difference or relationship is, in the units people care about.' },
          { term: 'Uncertainty', definition: 'How much the result could reasonably vary, often shown with a confidence interval.' },
          { term: 'Limitation', definition: 'A reason the conclusion might not hold everywhere or might not show cause and effect.' },
        ],
      },
      ai: {
        paragraphs: [
          'Good analysis includes uncertainty, checks assumptions, and communicates limits, not just a number or an automated answer. That is true whether the number comes from a calculator, a spreadsheet, or an AI system.',
          'When an AI tool gives you a confident-sounding answer, ask the same questions you now ask of any result: how sure, based on what data, and where might it be wrong?',
        ],
      },
      practice: [
        {
          id: 's7-l3-p1',
          question: 'A test comparing two sign-up rates gives p = 0.15. Which conclusion is best?',
          options: [
            'The campaign had no effect at all.',
            'There is a 15% chance the campaign worked.',
            'The data does not give enough evidence that the sign-up rates differ; a real difference could still exist.',
            'The campaign definitely worked, just not very well.',
          ],
          answer: 2,
          hints: ['A large p-value means the data is consistent with no difference. Is that the same as proving no difference?', 'A p-value is not the chance that a hypothesis is true.'],
          explanation: 'A p-value of 0.15 means the observed gap is not unusual if the rates were equal. That is not enough evidence of a difference, but it is not proof of zero effect either.',
        },
        {
          id: 's7-l3-p2',
          question: 'Which statement is a limitation, not a result?',
          options: [
            'The mean difference was 4.2 points.',
            'The 95% confidence interval ran from 2.8 to 5.6 points.',
            'All students came from one class, so the result may not apply to other schools.',
            'The p-value was below 0.001.',
          ],
          answer: 2,
          hints: ['Three options report numbers from the analysis. Which one talks about who the result applies to?'],
          explanation: 'A limitation describes why the conclusion might not generalize or might not show cause. The other three are results.',
        },
      ],
      mission: {
        calculator: 'hypothesis-test',
        task: 'An app team targets an average load time of 2.0 seconds. A sample of 25 loads has a mean of 2.14 seconds and a standard deviation of 0.40 seconds. Test whether the true mean differs from 2.0 and write a conclusion with uncertainty.',
        dataLabel: 'Sample mean, standard deviation, and sample size',
        data: '2.14, 0.40, 25',
        steps: [
          'Open the calculator and choose a test for one mean with an unknown standard deviation (t).',
          'Enter mean 2.14, hypothesized mean 2.0, standard deviation 0.40, sample size 25, significance 0.05, two-tailed.',
          'Read the t statistic, the p-value, and the confidence interval.',
        ],
        lookFor: 'Is the p-value below 0.05? Does the confidence interval include 2.0?',
        interpretation: 'The test gives t = 1.75 with a two-tailed p-value of about 0.093, and the 95% interval runs from about 1.97 to 2.31 seconds. The interval includes 2.0, so there is not enough evidence that the mean load time differs from the target. The loads could still be a bit slow, and a larger sample would narrow the interval.',
      },
      reflection: {
        prompt: 'Write a one-sentence conclusion for the load-time mission that includes a number, the uncertainty, and a limitation.',
        sampleAnswer: 'The average load time was 2.14 seconds (95% CI about 1.97 to 2.31), which is not clearly different from the 2.0 target, but with only 25 loads the true mean could still be up to about 0.3 seconds slower.',
      },
    },
  ],
  checkpoints: [
    {
      id: 's7-c1',
      question: 'A school tracks the same 30 students\' reading scores in September and in May. Which analysis fits best?',
      options: [
        'Two-Sample (means) with September and May as two groups',
        'One-sample t-test on each student\'s May minus September difference, vs. 0',
        'Two-Sample (proportions)',
        'A z-score for the May average',
      ],
      answer: 1,
      hints: ['Are the September and May scores from different students?', 'Same students twice means paired data.'],
      explanation: 'Each student has two scores, so the data is paired. Working with the differences removes the student-to-student variation and tests the change directly.',
    },
    {
      id: 's7-c2',
      question: 'You want to know whether hours of sleep help predict reaction time, and you have both values for 15 people. What should you use?',
      options: [
        'Two-Sample (means)',
        'Hypothesis Test for one proportion',
        'Correlation & Regression',
        'Binomial',
      ],
      answer: 2,
      hints: ['You have an X and a Y for each person.', 'Which tool looks for a relationship and makes predictions?'],
      explanation: 'Paired X and Y values with a prediction goal call for correlation and regression. The slope tells you how much reaction time changes per extra hour of sleep.',
    },
    {
      id: 's7-c3',
      question: 'A result has a 95% confidence interval for the difference in means of -1.3 to 8.3 points. What does this suggest?',
      options: [
        'The difference is definitely 3.5 points.',
        'There is strong evidence of a positive difference.',
        'The data is consistent with no difference, as well as with a moderate positive difference.',
        'The analysis must be wrong because the interval includes a negative number.',
      ],
      answer: 2,
      hints: ['Look at whether 0 is inside the interval.', 'Every value in the interval is plausible. What range of stories does that allow?'],
      explanation: 'Because 0 is inside the interval, "no difference" is plausible. So is a gain of several points. The honest conclusion is that there is not enough evidence yet.',
    },
    {
      id: 's7-c4',
      question: 'In an observational dataset, practice hours and game scores have r = 0.94. Which conclusion goes too far?',
      options: [
        'Players who practiced more tended to score higher.',
        'Practice hours are strongly and positively related to score in this sample.',
        'Practicing more causes higher scores for every player.',
        'Practice hours could be useful for predicting score within the observed range.',
      ],
      answer: 2,
      hints: ['Correlation describes a pattern. What else would you need to show cause?', 'Watch for words like "causes" and "every".'],
      explanation: 'A strong correlation in observational data does not prove cause. Motivated players might both practice more and score higher for other reasons.',
    },
    {
      id: 's7-c5',
      question: 'Which final write-up best follows the capstone template?',
      options: [
        'p < 0.05, so the tool works.',
        'The scores improved a lot. Everyone should use the tool.',
        'Question, method, and a p-value, with no limitations because the result was significant.',
        'Question, data, method, result with an interval, a plain-language interpretation, and one limitation.',
      ],
      answer: 3,
      hints: ['Count how many parts of the six-part template each option includes.', 'Does a significant result remove the need to state limits?'],
      explanation: 'A complete answer covers all six parts. Even a significant result has limitations, such as sample size or study design, and the reader needs to know them.',
    },
  ],
  capstone: {
    intro:
      'This is your final case file. Pick one of the three cases, investigate it with the calculators, and fill in the six-part response template. There is no single perfect wording. What matters is that your method fits the data and your conclusion is honest about uncertainty and limits. A model answer appears after you submit.',
    checklist: [
      'Write the question in one sentence: what outcome, compared how?',
      'Name the data type: numbers or yes/no categories? One group, two separate groups, paired, or X and Y pairs?',
      'Inspect the data: check sample sizes, scan for typos and extreme values.',
      'Describe and visualize: find the center and spread, or the rates, and look at a chart.',
      'Choose the method that matches the data type and design.',
      'Run it in the calculator and record the statistic, p-value, and interval (or r, slope, and R-squared).',
      'Interpret the result in plain words, with its size and uncertainty.',
      'State at least one limitation of the data or the design.',
    ],
    template: [
      { id: 'question', label: 'Question', prompt: 'What exactly are you trying to find out? Name the outcome and the comparison.' },
      { id: 'data', label: 'Data', prompt: 'What data do you have? Give the sample size, data type, how it was collected, and anything you noticed while inspecting it.' },
      { id: 'method', label: 'Method', prompt: 'Which calculator and test or model did you use, and why does it fit this data?' },
      { id: 'result', label: 'Result', prompt: 'Report the key numbers: the estimate, the test statistic or r, the p-value, and the confidence interval if there is one.' },
      { id: 'interpretation', label: 'Interpretation', prompt: 'In plain language, what does the result say about your question? Include how big the effect is and how sure you can be.' },
      { id: 'limitation', label: 'Limitation', prompt: 'What could make this conclusion wrong or not apply more widely? Name at least one limitation.' },
    ],
    caseFiles: [
      {
        id: 'study-tool',
        title: 'Did the Study Tool Help?',
        brief:
          'A teacher tried a new flashcard study tool with one class. The same 12 students took a quiz before using the tool and a similar quiz after two weeks of using it. Did quiz scores improve? (All data here is fictional.)',
        datasets: [
          { label: 'Before scores (students 1 to 12)', values: '62,70,55,78,66,59,73,81,64,68,57,75' },
          { label: 'After scores (same students, same order)', values: '68,74,61,80,71,58,79,85,70,72,63,77' },
        ],
        calculators: ['statistics', 'hypothesis-test'],
        hints: [
          'Look at who is in each list. Are these two separate groups of students, or the same students measured twice?',
          'For each student, subtract the before score from the after score. Paste those 12 differences into the statistics calculator to get their mean and standard deviation.',
          'In the Hypothesis Test calculator, test one mean with unknown SD: use the mean and SD of the differences, n = 12, and a hypothesized mean of 0. The question asks about improvement, so think about which tail fits.',
        ],
        sampleAnalysis: {
          question: 'Did the same 12 students score higher on average after using the study tool than before?',
          data: 'Paired numerical data: 12 students, each with a before and an after quiz score. The differences (after minus before) are 6, 4, 6, 2, 5, -1, 6, 4, 6, 4, 6, 2. No typos or extreme values; 11 of 12 students improved.',
          method: 'Because each student appears in both lists, I used the differences and ran a one-sample t-test on them against 0 (right-tailed, alpha = 0.05). The differences have mean 4.17 and SD 2.21 from the statistics calculator.',
          result: 'Mean difference = 4.17 points, SD = 2.21, n = 12. t = about 6.5 with 11 degrees of freedom, one-tailed p < 0.001 (about 0.00002). 95% confidence interval for the mean gain: about 2.8 to 5.6 points.',
          interpretation: 'There is strong evidence that scores went up. The average gain was about 4 points, and plausibly between about 3 and 6 points. Note that treating the lists as two independent groups (Welch t) would give a right-tailed p of about 0.11 and miss this, because the large differences between students hide the consistent change within each student.',
          limitation: 'There was no comparison group, so the gain could come from practice with the quiz format, extra class time, or the second quiz being easier, not only the tool. It is also one class of 12 students, so the result may not carry over to other classes.',
        },
      },
      {
        id: 'signup-campaign',
        title: 'Did the Campaign Change Sign-Ups?',
        brief:
          'A website showed a new sign-up banner to 400 visitors and the old banner to 400 different visitors, chosen at random. The team wants to know whether the sign-up rate changed. (All data here is fictional.)',
        datasets: [
          { label: 'New banner: visitors', values: '400' },
          { label: 'New banner: sign-ups', values: '62' },
          { label: 'Old banner: visitors', values: '400' },
          { label: 'Old banner: sign-ups', values: '48' },
        ],
        calculators: ['two-sample'],
        hints: [
          'Is the outcome a number or a yes/no? Did the same visitors see both banners?',
          'Start by finding each sign-up rate: sign-ups divided by visitors. Then pick the Two-Sample calculator and choose proportions.',
          'The question asks whether the rate changed, not whether it went up, so use a two-tailed test. Read both the p-value and whether the interval for the difference includes 0.',
        ],
        sampleAnalysis: {
          question: 'Is the sign-up rate different for visitors who saw the new banner compared with those who saw the old banner?',
          data: 'Two independent groups of 400 randomly assigned visitors each, with a yes/no outcome (signed up or not). New banner: 62 of 400 signed up (15.5%). Old banner: 48 of 400 (12.0%). Each group has well over 10 sign-ups and non-sign-ups.',
          method: 'Two-proportion z-test in the Two-Sample calculator (proportions mode), two-tailed, alpha = 0.05, because the outcome is yes/no and the groups are different visitors.',
          result: 'Difference = 3.5 percentage points (15.5% vs. 12.0%). Pooled proportion = 0.1375, z = 1.44, two-tailed p = 0.15. 95% confidence interval for the difference: about -1.3 to 8.3 percentage points.',
          interpretation: 'There is not enough evidence to say the sign-up rate changed. The new banner did better in this sample, but a gap of this size could easily happen by chance. The interval includes 0, and it also includes gains of several points, so the new banner might help, do nothing, or even do slightly worse.',
          limitation: 'With 400 visitors per group the test can only detect fairly large differences, so a real but small improvement could be missed. A longer test with more visitors would narrow the interval. The result also only covers the time period and audience in this test.',
        },
      },
      {
        id: 'feature-predicts',
        title: 'Does Practice Predict the Score?',
        brief:
          'A game studio recorded weekly practice hours and the next tournament score (out of 100) for 12 players. Does practice time help predict score, and how much? (All data here is fictional.)',
        datasets: [
          { label: 'X: practice hours per week', values: '1,2,2,3,4,5,5,6,7,8,9,10' },
          { label: 'Y: tournament score (same players, same order)', values: '52,58,49,61,60,70,64,72,69,80,74,85' },
        ],
        calculators: ['correlation-regression', 'statistics'],
        hints: [
          'You have two numbers for each player. Which tool looks at a relationship between X and Y?',
          'Paste practice hours as X and scores as Y. Look at the scatterplot first, then read r, R-squared, the slope, and the intercept.',
          'Try a prediction inside the data (like 6 hours) and one far outside it (like 20 hours). Does the second one make sense for a score out of 100? What can this kind of data not tell you?',
        ],
        sampleAnalysis: {
          question: 'Do weekly practice hours help predict tournament score for these players, and by how much?',
          data: '12 players, each with two numerical values: practice hours (1 to 10) and score (49 to 85). Observational data: players chose how much to practice. The scatterplot shows a clear upward, roughly straight-line pattern with no extreme outliers.',
          method: 'Correlation and simple linear regression in the Correlation & Regression calculator, with practice hours as X and score as Y.',
          result: 'r = 0.94, R-squared = 0.88. Fitted line: predicted score = 48.09 + 3.50 x hours. Predicted score at 6 hours: about 69.1. Residuals range from about -6.1 to 4.4 points.',
          interpretation: 'There is a strong positive linear relationship. Each extra hour of practice goes with about 3.5 more points on average, and practice hours account for about 88% of the variation in scores in this sample. Individual predictions can still miss by around 4 to 6 points.',
          limitation: 'This is observational data, so it does not show that practice causes higher scores; more motivated or more experienced players may both practice more and score higher. The sample is only 12 players, and the line should not be used far outside 1 to 10 hours: at 20 hours it predicts about 118, which is impossible on a 100-point scale.',
        },
      },
    ],
  },
};

export default stage7;
