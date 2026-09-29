// All datasets in the journey are fictional and made up for teaching.
const stage4 = {
  id: 4,
  slug: 'what-is-unusual',
  title: 'What Is Unusual?',
  theme: 'Distributions, Z-Scores & Confidence',
  question: 'How rare or unusual is this result?',
  detectiveCase:
    'A camera system on a delivery robot gives a high confidence score that an object ahead is a pedestrian. Is that score ordinary, unusually high, or worth a closer look?',
  skills: [
    'The normal distribution (bell curve)',
    'The 68-95-99.7 rule',
    'Standardization and z-scores',
    'Percentiles and tails',
    'Optional: Poisson counts and the t distribution',
  ],
  aiConnection:
    'AI classifiers often produce a score for each possible label, such as "pedestrian" or "sign". A model confidence score is not a promise that the model is correct. This stage separates three ideas: the score a model reports, the uncertainty around it, and how reliable the model actually is when it is tested in the real world.',
  badge: {
    name: 'Pattern Navigator',
    description: 'You can read a bell curve, turn values into z-scores, find areas and percentiles, and explain why a high score is not the same as certainty.',
  },
  coachPrompt: 'Want to see whether a value is typical or rare? Convert it into a z-score and read its position.',
  calculators: ['normal', 'poisson'],
  resources: ['normal', 'poisson', 't-distribution', 'guide-distributions', 'tables'],
  lessons: [
    {
      id: 's4-l1',
      title: 'The Bell Curve and the 68-95-99.7 Rule',
      minutes: 12,
      objective: 'Describe a normal distribution and use the 68-95-99.7 rule to say which values are common and which are rare.',
      hook:
        'A coffee machine is set to pour 350 ml per cup. It never pours exactly 350 ml. Most cups land close to it, a few are a little off, and almost none are way off. If you drew all those cups as a histogram, you would see a familiar shape: a bell.',
      concept: {
        paragraphs: [
          'A normal distribution is a smooth, symmetric, bell-shaped curve. Most values sit near the middle, and fewer and fewer values appear as you move out toward either side.',
          'Two numbers describe the whole curve. The mean is the center, where the peak is. The standard deviation (SD) is the typical distance of values from the mean. A bigger SD makes a wider, flatter bell.',
          'The 68-95-99.7 rule is a shortcut for any normal distribution. About 68% of values fall within 1 SD of the mean, about 95% within 2 SDs, and about 99.7% within 3 SDs.',
          'The ends of the curve are called the tails. Values out in the tails are rare. For our coffee machine (mean 350 ml, SD 10 ml), here is what the rule says.',
        ],
        table: {
          caption: 'A fictional coffee machine: mean 350 ml, SD 10 ml',
          headers: ['Distance from the mean', 'Range of cup sizes', 'Share of cups (about)'],
          rows: [
            ['Within 1 SD', '340 to 360 ml', '68%'],
            ['Within 2 SDs', '330 to 370 ml', '95%'],
            ['Within 3 SDs', '320 to 380 ml', '99.7%'],
            ['Beyond 3 SDs (both tails together)', 'Below 320 or above 380 ml', '0.3%'],
          ],
        },
        keyTerms: [
          { term: 'Normal distribution', definition: 'A symmetric, bell-shaped distribution described by its mean and standard deviation.' },
          { term: 'Tail', definition: 'The far left or far right end of a distribution, where values are rare.' },
          { term: '68-95-99.7 rule', definition: 'In a normal distribution, about 68%, 95%, and 99.7% of values fall within 1, 2, and 3 SDs of the mean.' },
        ],
      },
      ai: {
        paragraphs: [
          'Many measurements an AI system works with, like sensor readings or small measurement errors, are roughly bell-shaped. Knowing the usual range lets a system, or a person checking it, notice when a new value is far out in a tail.',
          'Not everything is bell-shaped, though. Before using this rule, look at a histogram of the data and check that the shape really is close to a symmetric bell.',
        ],
      },
      practice: [
        {
          id: 's4-l1-p1',
          question: 'For the coffee machine (mean 350 ml, SD 10 ml), about what percentage of cups hold between 330 and 370 ml?',
          options: ['50%', '68%', '95%', '99.7%'],
          answer: 2,
          hints: ['How many SDs away from 350 is 330? How many is 370?', '330 and 370 are both 2 SDs from the mean.'],
          explanation: '330 and 370 are 2 SDs below and above the mean, and about 95% of values fall within 2 SDs.',
        },
        {
          id: 's4-l1-p2',
          question: 'About what percentage of cups hold more than 360 ml?',
          options: ['5%', '16%', '32%', '34%'],
          answer: 1,
          hints: ['68% of cups are between 340 and 360 ml. What share is left outside that range?', 'The leftover 32% is split evenly between the two tails.'],
          explanation: '100% - 68% = 32% of cups are outside 340 to 360 ml. The curve is symmetric, so half of that, about 16%, is above 360 ml.',
        },
        {
          id: 's4-l1-p3',
          question: 'Which cup sizes are outside the range that holds about 99.7% of cups?',
          options: ['Below 340 or above 360 ml', 'Below 330 or above 370 ml', 'Below 320 or above 380 ml', 'Below 310 or above 390 ml'],
          answer: 2,
          hints: ['99.7% goes with 3 SDs.', '3 SDs is 3 x 10 = 30 ml on each side of 350.'],
          explanation: 'The 99.7% range is 350 - 30 = 320 ml to 350 + 30 = 380 ml, so only cups below 320 or above 380 ml fall outside it.',
        },
      ],
      mission: {
        calculator: 'normal',
        task: 'Check the 68-95-99.7 rule for the coffee machine with the calculator.',
        steps: [
          'Open the calculator and set Mean to 350 and Standard Deviation to 10.',
          'Keep the "Value → Probability" mode and X values as the input type.',
          'Choose "Between two values" as the calculation type and enter 340 and 360.',
          'Read the probability, then change the values to 330 and 370 and read it again.',
        ],
        lookFor: 'What probability does the calculator show for 340 to 360 ml, and for 330 to 370 ml?',
        interpretation: 'The calculator shows about 0.6827 (68.27%) for 340 to 360 ml and about 0.9545 (95.45%) for 330 to 370 ml. The rule rounds these to 68% and 95%.',
      },
      reflection: {
        prompt: 'In one sentence: why is a cup of 385 ml a surprise for this machine?',
        sampleAnswer: 'It is more than 3 SDs above the mean, out in the tail where fewer than 1 in 300 cups should land.',
      },
    },
    {
      id: 's4-l2',
      title: 'Z-Scores: One Ruler for Every Scale',
      minutes: 12,
      objective: 'Calculate a z-score and use it to compare values measured on different scales.',
      hook:
        "Lena scored 82 on a math quiz and 88 on a reading quiz. Which result is more impressive? It is tempting to say 88, but the quizzes had different averages and different spreads. To compare fairly, we need one ruler that works for both.",
      concept: {
        paragraphs: [
          'A z-score tells you how many standard deviations a value is from the mean. The formula is z = (value - mean) / SD.',
          'A positive z-score means above the mean, a negative z-score means below the mean, and z = 0 means exactly at the mean.',
          'Turning a value into a z-score is called standardization. It puts every variable on the same scale, so values from different scales can be compared directly.',
          'A common rule of thumb: a value with a z-score beyond 2 or -2 is considered unusual, because only about 5% of values in a normal distribution are that far out.',
        ],
        table: {
          caption: "Lena's two fictional quizzes",
          headers: ['Quiz', "Lena's score", 'Class mean', 'Class SD', 'Z-score'],
          rows: [
            ['Math', '82', '70', '8', '(82 - 70) / 8 = 1.5'],
            ['Reading', '88', '80', '4', '(88 - 80) / 4 = 2.0'],
          ],
        },
        keyTerms: [
          { term: 'Z-score', definition: 'How many SDs a value is above (positive) or below (negative) the mean.' },
          { term: 'Standardization', definition: 'Converting values to z-scores so different scales can be compared.' },
          { term: 'Unusual value', definition: 'A common rule of thumb: a value with a z-score greater than 2 or less than -2.' },
        ],
      },
      ai: {
        paragraphs: [
          'Before training, data scientists often standardize features. Without it, a feature measured in large numbers (like income in dollars) could overpower one measured in small numbers (like age in years), just because of its units.',
          "Different cameras or models can also report scores on different scales, one from 0 to 100 and another from 0 to 1. Comparing raw scores across them is like comparing Lena's quizzes by raw points. A z-score asks the fairer question: how unusual is this score for this particular system?",
        ],
      },
      practice: [
        {
          id: 's4-l2-p1',
          question: 'On the math quiz (mean 70, SD 8), Theo scored 62. What is his z-score?',
          options: ['-8', '-1', '1', '0.89'],
          answer: 1,
          hints: ['Subtract the mean first: 62 - 70.', 'Then divide the result by the SD, 8.'],
          explanation: '(62 - 70) / 8 = -8 / 8 = -1. Theo scored 1 SD below the class mean.',
        },
        {
          id: 's4-l2-p2',
          question: 'Camera A scores from 0 to 100 (mean 78, SD 6) and gives an object 87. Camera B scores from 0 to 1 (mean 0.70, SD 0.10) and gives another object 0.92. Which score is more unusual for its own camera?',
          options: [
            "Camera A's 87, because 87 is a bigger number",
            "Camera B's 0.92, because its z-score is 2.2 versus 1.5",
            'They are equally unusual',
            'They cannot be compared because the scales differ',
          ],
          answer: 1,
          hints: ['Compute a z-score for each camera using its own mean and SD.', 'Camera A: (87 - 78) / 6. Camera B: (0.92 - 0.70) / 0.10.'],
          explanation: "Camera A: (87 - 78) / 6 = 1.5. Camera B: (0.92 - 0.70) / 0.10 = 2.2. Camera B's score is farther from its own average, so it is more unusual. Z-scores are exactly what make this comparison possible.",
        },
        {
          id: 's4-l2-p3',
          question: 'A value has a z-score of 0. What does that tell you?',
          options: ['The value is zero', 'The value equals the mean', 'The value is an error', 'The value is 1 SD above the mean'],
          answer: 1,
          hints: ['In z = (value - mean) / SD, when is the top of the fraction zero?'],
          explanation: 'A z-score of 0 means the value is 0 SDs from the mean, so it sits exactly at the mean.',
        },
      ],
      mission: {
        calculator: 'normal',
        task: "Use the calculator to find the z-scores for Lena's two quizzes.",
        steps: [
          'Open the calculator. Set Mean to 70 and Standard Deviation to 8 (the math quiz).',
          'Keep the "Value → Probability" mode, X values as the input type, and "Left tail" as the calculation type.',
          'Enter 82 as the value and read the Z-score in the results.',
          'Now set Mean to 80, Standard Deviation to 4, and the value to 88. Read the new Z-score.',
        ],
        lookFor: 'Which quiz gives Lena the larger z-score, and what left-tail probability goes with each one?',
        interpretation: 'Math: z = 1.5 with a left-tail probability of about 0.9332. Reading: z = 2.0 with about 0.9772. Lena did better than about 93% of the class in math and about 98% in reading, so her reading score is the stronger result, even though her math score is further above its class average in raw points (12 versus 8).',
      },
      reflection: {
        prompt: 'In your own words, why can a z-score compare two values that raw points cannot?',
        sampleAnswer: "A z-score measures each value against its own group's mean and spread, so it shows how unusual each value is on the same scale.",
      },
    },
    {
      id: 's4-l3',
      title: 'Areas, Percentiles, and Tails',
      minutes: 14,
      objective: 'Use the normal calculator to find tail areas and percentiles, and decide whether a value is unusual.',
      hook:
        'Back to the delivery robot. Its camera has logged thousands of objects that really were pedestrians. The scores it gave them (from 0 to 100) averaged 78 with an SD of 6. Today it gives an object a score of 95. Is that an ordinary score for a pedestrian, or something to look at more closely?',
      concept: {
        paragraphs: [
          'The total area under a normal curve is 1, or 100%. The area to the left of a value is the share of values at or below it. The area to the right is the share above it. The two always add to 1.',
          'A percentile is the value with a given percentage of the data below it. If a score is at the 90th percentile, 90% of values are at or below it and 10% are above.',
          'The far ends are the tails. A right-tail area answers "how rare is a value this high or higher?" A small tail area, like 2% or less, signals that the value is unusual.',
          'For the fictional camera log (mean 78, SD 6), here is where a few scores land.',
          'One caution: real confidence scores often bunch up near the top instead of forming a neat bell. We treat this fictional log as roughly bell-shaped, but with real data you should check a histogram first.',
          'Side note for later: when the SD has to be estimated from a small sample, statisticians use the t distribution instead. It looks like a bell with heavier tails, and it gets closer to the normal curve as the sample grows. You will use it in Stage 5.',
        ],
        table: {
          caption: 'Fictional pedestrian scores: mean 78, SD 6',
          headers: ['Score', 'Z-score', 'Share of scores below (percentile)', 'Share of scores above (right tail)'],
          rows: [
            ['72', '-1.00', '15.9%', '84.1%'],
            ['84', '1.00', '84.1%', '15.9%'],
            ['90', '2.00', '97.7%', '2.3%'],
            ['95', '2.83', '99.8%', '0.2%'],
          ],
        },
        keyTerms: [
          { term: 'Area under the curve', definition: 'The share (probability) of values in a range. The whole curve has area 1.' },
          { term: 'Percentile', definition: 'The value with a given percentage of the data at or below it.' },
          { term: 'Right-tail probability', definition: 'The share of values greater than a given value.' },
        ],
      },
      ai: {
        paragraphs: [
          "A score of 95 has a z-score of about 2.83, so only about 0.2% of past pedestrian scores were that high. It is unusually high compared with this camera's own history.",
          'Unusual does not mean correct, and it does not mean wrong. It means "worth a closer look". Maybe the object was very clear and close. Maybe something about the scene was different from the data the system learned from. The z-score tells you where the score sits, not why it is there.',
        ],
      },
      practice: [
        {
          id: 's4-l3-p1',
          question: 'For the camera log (mean 78, SD 6), about what share of pedestrian scores are higher than 90?',
          options: ['2.3%', '5%', '16%', '97.7%'],
          answer: 0,
          hints: ['First find the z-score: (90 - 78) / 6.', 'z = 2. About 95% lie within 2 SDs, so about 5% are outside, split between two tails.'],
          explanation: 'The z-score is 2, and the right-tail area beyond z = 2 is about 0.0228, or 2.3%. The 97.7% is the share below 90, not above.',
        },
        {
          id: 's4-l3-p2',
          question: 'Using the rule of thumb that a z-score beyond 2 or -2 is unusual, which pedestrian score counts as unusual for this camera?',
          options: ['84', '72', '88', '65'],
          answer: 3,
          hints: ['Compute z = (score - 78) / 6 for each option.', 'Unusual can happen in the low tail too, not just the high tail.'],
          explanation: 'The z-scores are 1.00, -1.00, 1.67, and -2.17. Only 65 is beyond -2, so it is unusually low for a real pedestrian and worth a closer look.',
        },
        {
          id: 's4-l3-p3',
          question: 'About which score is the 90th percentile for this camera log?',
          options: ['70.3', '85.7', '87.9', '90.0'],
          answer: 1,
          hints: ['The 90th percentile has z of about 1.28.', 'Score = mean + z x SD = 78 + 1.28 x 6.'],
          explanation: '78 + 1.2816 x 6 is about 85.7. So 90% of pedestrian scores were at or below 85.7. (70.3 is the 10th percentile, and 87.9 is the 95th.)',
        },
      ],
      mission: {
        calculator: 'normal',
        task: 'Find how rare scores of 90 and 95 are for this camera, then find its 90th percentile.',
        steps: [
          'Open the calculator. Set Mean to 78 and Standard Deviation to 6.',
          'In "Value → Probability" mode, keep X values as the input type and choose "Right tail".',
          'Enter 90 and read the probability and the Z-score. Then enter 95 and read them again.',
          'Switch to "Probability → Value" mode, set the Target Probability to 0.90, and read the value marked "90.0% below".',
          'Optional: turn on the Key Percentiles table and compare the 90th, 95th, and 99th percentiles.',
        ],
        lookFor: 'What share of pedestrian scores are above 90, and above 95? What score is the 90th percentile?',
        interpretation: 'Above 90: about 0.0228 (z = 2). Above 95: about 0.0023 (z = 2.83). The 90th percentile is about 85.69. A score of 95 sits far in the right tail: unusually high for this camera, and worth a closer look.',
      },
      reflection: {
        prompt: 'In one or two sentences, explain what it means that a score of 95 is in the right tail for this camera.',
        sampleAnswer: 'Only about 0.2% of past pedestrian scores were 95 or higher, so it is rare for this camera. That makes it worth checking, but it does not prove the detection is right or wrong.',
      },
    },
    {
      id: 's4-l4',
      title: 'Rare Events and Why a Score Is Not Certainty',
      minutes: 15,
      objective: 'Explain the difference between a model score, uncertainty, and real-world reliability, and optionally measure a rare count with the Poisson distribution.',
      hook:
        "The robot's camera reports a pedestrian score of 97. Should the robot, or the people who built it, treat that as a fact? Before answering, a good detective asks: how often has a score like this turned out to be right?",
      concept: {
        paragraphs: [
          'Three ideas are easy to mix up. The score is the number the model outputs for a label. Uncertainty is how unsure we should be about a single answer, for example because the image is blurry or the situation is new. Reliability is how often the model is actually right, measured by testing it.',
          'To check reliability, teams test the model on examples it did not use to learn, where the true answer is known, and ask: among detections with scores in a certain range, what share were really pedestrians? When the share matches the score well, the model is called well calibrated.',
          'Here is a fictional test of the robot camera. Notice two things: higher scores were right more often, and the same high scores were less reliable at night.',
        ],
        table: {
          caption: 'Fictional test results for the robot camera',
          headers: ['Score range', 'Conditions', 'Detections', 'Really pedestrians', 'Share correct'],
          rows: [
            ['50-69', 'Daytime', '300', '174', '58%'],
            ['70-89', 'Daytime', '900', '729', '81%'],
            ['90-100', 'Daytime', '1,800', '1,692', '94%'],
            ['90-100', 'Night', '200', '164', '82%'],
          ],
        },
        keyTerms: [
          { term: 'Score', definition: 'The number a model reports for a label. It is an output, not a guarantee.' },
          { term: 'Uncertainty', definition: 'How unsure we should be about one particular answer.' },
          { term: 'Reliability', definition: 'How often the model is actually correct, measured on test data it did not learn from.' },
          { term: 'Poisson distribution (side quest)', definition: 'A model for counts of events in a fixed interval, like false alarms per day, when events happen independently at a steady average rate.' },
        ],
      },
      ai: {
        paragraphs: [
          'A model confidence score is not a promise that the model is correct. Even in the best daytime band, about 6 out of every 100 detections were not pedestrians.',
          'Reliability also depends on the situation. The same 90-100 scores were right 94% of the time in daylight but only 82% at night. Data choices matter: if the model saw fewer night images while learning, its scores may sound just as confident while being less trustworthy.',
          'Side quest: rare events can be counted too. Suppose the fictional camera averages 1.5 false alarms per day. The Poisson distribution tells us how surprising a day with 5 false alarms would be. If it is very unlikely, that day deserves a closer look, the same way a far-out z-score does.',
        ],
      },
      practice: [
        {
          id: 's4-l4-p1',
          question: 'The camera reports "pedestrian: 97". Which statement is most accurate?',
          options: [
            'There is definitely a pedestrian, because 97 is very high',
            'The model is correct 97% of the time on every image',
            'It is a score from the model; how often such scores are right must be checked by testing',
            'The score is meaningless and should be ignored',
          ],
          answer: 2,
          hints: ['A score is an output. What does it take to know how often outputs like it are right?'],
          explanation: 'A high score is useful information, but it is not a guarantee. Testing on data the model did not learn from shows how reliable scores in that range really are.',
        },
        {
          id: 's4-l4-p2',
          question: 'In the daytime test, 1,800 detections scored 90-100 and 94% were really pedestrians. About how many were NOT pedestrians?',
          options: ['6', '94', '108', '1,692'],
          answer: 2,
          hints: ['If 94% were correct, what percentage were not?', '6% of 1,800 = 0.06 x 1,800.'],
          explanation: '1,800 - 1,692 = 108, which is 6% of 1,800. Even very high scores came with over a hundred mistakes in this test.',
        },
        {
          id: 's4-l4-p3',
          question: 'Side quest: the camera averages 1.5 false alarms per day. The Poisson calculator shows P(at least 5) = 0.0186. What does that mean?',
          options: [
            'About 1.9% of days would have 5 or more false alarms if the average stays 1.5',
            'About 18.6% of days would have exactly 5 false alarms',
            'The camera is broken on 1.9% of days',
            'There is a 98.1% chance the camera is working correctly',
          ],
          answer: 0,
          hints: ['"At least 5" means 5, 6, 7, and so on.', '0.0186 is a probability. Convert it to a percentage.'],
          explanation: '0.0186 is about 1.9%, the chance of 5 or more false alarms on a day when the true average is 1.5. It makes such a day rare and worth investigating, but it does not by itself prove the camera is broken.',
        },
      ],
      mission: {
        calculator: 'poisson',
        task: 'Side quest: measure how rare a day with 5 or more false alarms is, when the average is 1.5 per day.',
        steps: [
          'Open the Poisson calculator and move the Rate parameter (λ) slider to 1.5.',
          'Set the Target value (x) to 5.',
          'Choose the "At least" probability type and read the probability.',
          'For comparison, set x to 0 and choose "Exactly" to see how common a day with no false alarms is.',
        ],
        lookFor: 'How likely is a day with 5 or more false alarms? How likely is a day with none?',
        interpretation: 'P(at least 5) is about 0.0186, or roughly 1 day in 54. P(exactly 0) is about 0.2231, so roughly 1 day in 4 or 5 has no false alarms at all. A day with 5 or more is rare, so it is worth a closer look, just like a score far out in a tail.',
      },
      reflection: {
        prompt: 'In one or two sentences, explain to a friend why a confidence score of 97 does not mean the answer is definitely right.',
        sampleAnswer: 'The score is just the number the model outputs. To know how often scores like 97 are right, you have to test the model on new data, and even then it can be less reliable in conditions like night-time.',
      },
    },
  ],
  checkpoints: [
    {
      id: 's4-c1',
      question: 'Test scores are normal with mean 100 and SD 15. About what percentage of scores fall between 85 and 115?',
      options: ['50%', '68%', '95%', '99.7%'],
      answer: 1,
      hints: ['How many SDs from 100 are 85 and 115?'],
      explanation: '85 and 115 are 1 SD below and above the mean, and about 68% of values fall within 1 SD.',
    },
    {
      id: 's4-c2',
      question: 'A battery normally lasts a mean of 60 hours with an SD of 5 hours. One battery lasts 45 hours. What is its z-score?',
      options: ['-15', '-3', '3', '-0.33'],
      answer: 1,
      hints: ['z = (value - mean) / SD.', '(45 - 60) / 5.'],
      explanation: '(45 - 60) / 5 = -15 / 5 = -3. The battery lasted 3 SDs less than average, which is very unusual.',
    },
    {
      id: 's4-c3',
      question: 'Which value is the most unusual?',
      options: ['z = 1.8', 'z = -2.5', 'z = 0.4', 'z = 2.1'],
      answer: 1,
      hints: ['Ignore the sign and look at the distance from 0.'],
      explanation: 'Unusual means far from the mean in either direction. -2.5 is 2.5 SDs away, farther than any of the others.',
    },
    {
      id: 's4-c4',
      question: 'On a normal curve, a value sits at about the 84th percentile. About what is its z-score?',
      options: ['0.84', '-1', '1', '2'],
      answer: 2,
      hints: ['50% is below the mean, and about 34% more lies between the mean and 1 SD above it.'],
      explanation: '50% + 34% = 84%, so the 84th percentile is about 1 SD above the mean, z = 1. (More precisely, 84.1% of values fall below z = 1.)',
    },
    {
      id: 's4-c5',
      question: 'An image model labels a photo "cat" with a confidence score of 0.99. What is the best next question to ask?',
      options: [
        'None, because 0.99 means the label is correct',
        'How often were scores this high actually correct when the model was tested on new data?',
        'Why did the model not reach 1.00?',
        'Is the score above 0.5?',
      ],
      answer: 1,
      hints: ['Think about the difference between a score and reliability.'],
      explanation: 'A model confidence score is not a promise that the model is correct. Its reliability has to be checked on data the model did not learn from, ideally in conditions like the ones where it will be used.',
    },
  ],
};

export default stage4;
