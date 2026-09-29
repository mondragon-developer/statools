// All datasets in the journey are fictional and made up for teaching.
const stage1 = {
  id: 1,
  slug: 'data-foundations',
  title: "The Detective's First Clues",
  theme: 'Data Foundations',
  question: 'How do computers turn real things into data?',
  detectiveCase:
    'A music app wants to recommend songs, but a computer cannot "hear" music the way a person does. What information can it record, count, and compare?',
  skills: [
    'Observations and variables',
    'Categorical vs. numerical data',
    'Frequency tables',
    'Grouped data',
    'Histograms and bar charts',
  ],
  aiConnection:
    'AI systems work with representations of information. Text, images, audio, clicks, and ratings must be turned into numbers before a model can find patterns. An AI does not understand a song like a person does; it processes useful numerical features.',
  badge: {
    name: 'Clue Collector',
    description: 'You can describe a dataset, tell categories from numbers, and organize data into a table or chart.',
  },
  coachPrompt: "Do you have categories or a list of numbers? Let's organize the clues before making a conclusion.",
  calculators: ['frequency-distribution'],
  resources: ['guide-statistics'],
  lessons: [
    {
      id: 's1-l1',
      title: 'Rows, Columns, and Clues',
      minutes: 10,
      objective: 'Read a small dataset and name its observations and variables.',
      hook:
        'Maya opens her music app and it suggests a song she has never heard, but it is exactly her style. How did the app know? It started by writing down clues about every song and every listener, in a table.',
      concept: {
        paragraphs: [
          'A dataset is a table of clues. Each row is one observation: one song, one person, one day. Each column is a variable: one kind of information recorded about every observation.',
          'Here is a tiny playlist dataset. Each row is a song. The columns are the variables the app recorded.',
        ],
        table: {
          caption: 'A fictional playlist (5 songs)',
          headers: ['Song', 'Genre', 'Minutes listened', 'Thumbs up'],
          rows: [
            ['Night Drive', 'Electronic', '41', 'Yes'],
            ['Sunday Porch', 'Folk', '12', 'No'],
            ['Neon Rain', 'Electronic', '37', 'Yes'],
            ['Brass Parade', 'Jazz', '8', 'No'],
            ['Low Tide', 'Folk', '29', 'Yes'],
          ],
        },
        keyTerms: [
          { term: 'Observation', definition: 'One row: the thing you recorded information about.' },
          { term: 'Variable', definition: 'One column: a characteristic that can change from row to row.' },
          { term: 'Data quality', definition: 'Whether the values are complete, accurate, and recorded the same way every time.' },
        ],
      },
      ai: {
        paragraphs: [
          'A recommendation system learns from tables like this one, only with millions of rows. If the table has missing values, typos, or songs recorded differently, the system learns from those mistakes too.',
          'That is why data quality matters before any statistic or model can help.',
        ],
      },
      practice: [
        {
          id: 's1-l1-p1',
          question: 'In the playlist table, what does one row represent?',
          options: ['One variable', 'One song', 'One genre', 'The whole playlist'],
          answer: 1,
          hints: ['Look at the first column. What changes from one row to the next?'],
          explanation: 'Each row is one song, so each song is one observation.',
        },
        {
          id: 's1-l1-p2',
          question: 'How many variables does the table record about each song (not counting the song name)?',
          options: ['2', '3', '4', '5'],
          answer: 1,
          hints: ['Variables are columns. Count the columns after "Song".'],
          explanation: 'Genre, Minutes listened, and Thumbs up are the 3 variables recorded about each song.',
        },
      ],
      mission: {
        calculator: 'frequency-distribution',
        task: 'Turn the "Minutes listened" column into a quick table so you can see it as data, not just a list.',
        dataLabel: 'Minutes listened (5 songs)',
        data: '41, 12, 37, 8, 29',
        steps: [
          'Open the calculator and choose quantitative (numerical) data.',
          'Paste the minutes listened values.',
          'Look at the frequency table it builds.',
        ],
        lookFor: 'How many songs were listened to for more than 30 minutes?',
        interpretation: 'Each class in the table groups songs with similar listening times. The frequency is how many songs fall in that class.',
      },
      reflection: {
        prompt: 'In one sentence: what is the difference between an observation and a variable?',
        sampleAnswer: 'An observation is one row, like one song; a variable is one column, like genre, that is recorded for every song.',
      },
    },
    {
      id: 's1-l2',
      title: 'Categories or Numbers?',
      minutes: 12,
      objective: 'Classify variables as categorical or numerical and explain why it matters.',
      hook:
        'The app can average how many minutes people listen. But can it average a genre? What would "the average of Jazz and Folk" even mean? Some clues are labels, and some are measurements.',
      concept: {
        paragraphs: [
          'Categorical variables place each observation into a group or label: genre, yes/no, blood type, favorite color. You count them.',
          'Numerical (quantitative) variables are measured or counted numbers where arithmetic makes sense: minutes listened, price, age. You can average them.',
          'Numerical variables can be discrete (counts like number of plays: 0, 1, 2) or continuous (measurements like 12.7 minutes).',
          'Watch out: a number is not always numerical data. A ZIP code or jersey number is a label, so it is categorical.',
        ],
        keyTerms: [
          { term: 'Categorical', definition: 'Values are groups or labels. Summarize with counts and percentages.' },
          { term: 'Numerical', definition: 'Values are quantities. Summarize with averages and spread.' },
          { term: 'Discrete vs. continuous', definition: 'Discrete values are countable steps; continuous values can take any value in a range.' },
        ],
      },
      ai: {
        paragraphs: [
          'Before an AI can use a category like "Jazz", it has to turn it into numbers. A common method is one column per category with 1 for yes and 0 for no.',
          'Treating a label as a real quantity (for example, coding Jazz = 1, Folk = 2, Pop = 3 and averaging) can mislead a model, because it invents an order and distance that do not exist.',
        ],
      },
      practice: [
        {
          id: 's1-l2-p1',
          question: 'Which variable is categorical?',
          options: ['Minutes listened', 'Number of plays', 'Song genre', 'Song length in seconds'],
          answer: 2,
          hints: ['Ask: would it make sense to average this variable?'],
          explanation: 'Genre is a label. You can count how many songs are Jazz, but you cannot average genres.',
        },
        {
          id: 's1-l2-p2',
          question: 'A survey records each listener\'s ZIP code. What type of variable is it?',
          options: ['Numerical, continuous', 'Numerical, discrete', 'Categorical', 'It depends on the ZIP code'],
          answer: 2,
          hints: ['ZIP codes are digits. Does adding two ZIP codes give a meaningful answer?'],
          explanation: 'A ZIP code is a label for a place. Its digits are not a quantity, so it is categorical.',
        },
        {
          id: 's1-l2-p3',
          question: 'Which chart fits the variable "Thumbs up (Yes/No)"?',
          options: ['Histogram', 'Bar chart of counts', 'Scatterplot', 'Line graph over time'],
          answer: 1,
          hints: ['Yes/No is a category. Which chart shows a count for each category?'],
          explanation: 'A bar chart shows how many observations fall in each category. Histograms are for numerical data.',
        },
      ],
      mission: {
        calculator: 'frequency-distribution',
        task: 'Count the genres in a bigger playlist using categorical mode.',
        dataLabel: 'Genres of 20 songs',
        data: 'Pop, Jazz, Pop, Folk, Electronic, Pop, Folk, Pop, Jazz, Electronic, Pop, Folk, Pop, Electronic, Jazz, Pop, Folk, Pop, Electronic, Pop',
        steps: [
          'Open the calculator and choose categorical data with raw input.',
          'Paste the genre list.',
          'Read the frequency and relative frequency columns, then look at the bar chart.',
        ],
        lookFor: 'Which genre is most common, and what percentage of the playlist is it?',
        interpretation: 'Relative frequency is the share of all songs in that category. Pop appears 9 times out of 20, so it makes up 45% of the playlist.',
      },
      reflection: {
        prompt: 'Name one variable a music app might record that is categorical and one that is numerical.',
        sampleAnswer: 'Categorical: the device used (phone, laptop, speaker). Numerical: how many times a song was skipped.',
      },
    },
    {
      id: 's1-l3',
      title: 'Grouping the Clues',
      minutes: 12,
      objective: 'Build a grouped frequency table and read what it says about the data.',
      hook:
        'The app has listening times for 30 sessions. Reading 30 separate numbers is hard. Detectives group their clues into piles. Statisticians do the same thing with classes.',
      concept: {
        paragraphs: [
          'A grouped frequency table splits numerical data into equal-width classes (for example 0-9, 10-19, 20-29 minutes) and counts how many values fall in each class.',
          'Each value must land in exactly one class, so classes cannot overlap and must cover every value.',
          'Relative frequency is the count divided by the total. Cumulative frequency adds up counts from the first class, answering "how many are at or below this class?"',
        ],
        table: {
          caption: "The 30 listening sessions from this lesson's mission, grouped by minutes",
          headers: ['Minutes', 'Frequency', 'Relative frequency', 'Cumulative frequency'],
          rows: [
            ['0-9', '4', '13%', '4'],
            ['10-19', '9', '30%', '13'],
            ['20-29', '11', '37%', '24'],
            ['30-39', '4', '13%', '28'],
            ['40-49', '2', '7%', '30'],
          ],
        },
        keyTerms: [
          { term: 'Class', definition: 'A range of values that are grouped together.' },
          { term: 'Frequency', definition: 'How many observations fall in a class.' },
          { term: 'Cumulative frequency', definition: 'Running total of frequencies up to and including a class.' },
        ],
      },
      ai: {
        paragraphs: [
          'Grouping is a simple form of feature engineering: turning raw values into more useful signals. A system might group listening time into "skipped", "sampled", and "full listen" rather than use every exact second.',
        ],
      },
      practice: [
        {
          id: 's1-l3-p1',
          question: 'In the example table, how many sessions lasted less than 20 minutes?',
          options: ['4', '9', '13', '23'],
          answer: 2,
          hints: ['Less than 20 means the 0-9 and 10-19 classes together.', 'The cumulative frequency column already adds them up.'],
          explanation: '4 + 9 = 13. The cumulative frequency for the 10-19 class shows the same answer.',
        },
        {
          id: 's1-l3-p2',
          question: 'Why can the classes not be 0-10 and 10-20?',
          options: [
            'The classes would be too wide',
            'A value of 10 would belong to two classes',
            'Classes must start at 1',
            'There would be too few classes',
          ],
          answer: 1,
          hints: ['Where would a session of exactly 10 minutes go?'],
          explanation: 'Overlapping boundaries make a value like 10 fit in two classes, so it could be counted twice.',
        },
      ],
      mission: {
        calculator: 'frequency-distribution',
        task: 'Build the grouped frequency table for 30 listening sessions.',
        dataLabel: 'Minutes listened (30 sessions)',
        data: '3, 7, 12, 15, 18, 22, 25, 27, 31, 36, 14, 19, 21, 24, 28, 11, 16, 23, 26, 29, 5, 9, 13, 17, 20, 33, 38, 42, 47, 24',
        steps: [
          'Open the calculator and choose quantitative data.',
          'Paste the 30 values.',
          'Try 5 classes, then read the relative and cumulative frequency columns.',
        ],
        lookFor: 'Which class has the most sessions, and what percentage of sessions lasted under 30 minutes?',
        interpretation: 'The class with the highest frequency is where most sessions cluster. The cumulative relative frequency just before 30 tells you the share of sessions under 30 minutes.',
      },
      reflection: {
        prompt: 'In your own words, what does the cumulative frequency of a class tell you?',
        sampleAnswer: 'It tells how many observations are in that class or any class below it.',
      },
    },
    {
      id: 's1-l4',
      title: 'Seeing the Shape',
      minutes: 13,
      objective: 'Read a histogram and describe center, spread, shape, and unusual values.',
      hook:
        'The table shows counts, but a picture shows the story at a glance. Where do most listening times land? Is anyone listening far longer than everyone else?',
      concept: {
        paragraphs: [
          'A histogram draws a bar for each class. The bars touch because the classes are next to each other on a number line.',
          'When you read a histogram, describe four things: center (where the middle is), spread (how wide the values go), shape (symmetric, skewed right, or skewed left), and unusual values (gaps or outliers).',
          'Skewed right means a long tail toward larger values: most sessions are short, with a few long ones. Skewed left is the mirror image.',
        ],
        keyTerms: [
          { term: 'Histogram', definition: 'Bars for numerical classes, drawn touching.' },
          { term: 'Skewed right', definition: 'A long tail toward the high values.' },
          { term: 'Outlier', definition: 'A value far away from the rest of the data.' },
        ],
      },
      ai: {
        paragraphs: [
          'Data scientists look at histograms of every feature before training a model. A strange spike or a long tail often reveals a recording error or a group of users the model might treat unfairly.',
        ],
      },
      practice: [
        {
          id: 's1-l4-p1',
          question: 'Most listeners play a song for 2-4 minutes, but a few leave it on repeat for hours. What shape would the histogram have?',
          options: ['Symmetric', 'Skewed right', 'Skewed left', 'Flat (uniform)'],
          answer: 1,
          hints: ['Where is the long tail: toward small values or large values?'],
          explanation: 'A few very large values create a long tail on the right, so the distribution is skewed right.',
        },
        {
          id: 's1-l4-p2',
          question: 'Why do histogram bars touch while bar chart bars have gaps?',
          options: [
            'It is only a style choice',
            'Histogram classes are neighboring ranges on a number line',
            'Bar charts always have more categories',
            'Histograms only show percentages',
          ],
          answer: 1,
          hints: ['Think about what sits between the classes 10-19 and 20-29.'],
          explanation: 'Numerical classes are continuous neighbors, so the bars touch. Categories like Jazz and Folk are separate, so bar charts have gaps.',
        },
      ],
      mission: {
        calculator: 'frequency-distribution',
        task: 'Draw the histogram of the 30 listening sessions and describe it.',
        dataLabel: 'Minutes listened (30 sessions)',
        data: '3, 7, 12, 15, 18, 22, 25, 27, 31, 36, 14, 19, 21, 24, 28, 11, 16, 23, 26, 29, 5, 9, 13, 17, 20, 33, 38, 42, 47, 24',
        steps: [
          'Open the calculator with the same 30 values.',
          'Scroll to the histogram.',
          'Describe the center, spread, shape, and any unusual values.',
        ],
        lookFor: 'Where do most listening times appear? Are there any unusually high values?',
        interpretation: 'The tallest bars show where most sessions cluster (around 10-30 minutes). The shorter bars on the right show a small group of long sessions, a slight right skew.',
      },
      reflection: {
        prompt: 'Describe the listening-time histogram in one or two sentences, using the words center, spread, and shape.',
        sampleAnswer: 'Most sessions are around 20 minutes, ranging from about 3 to 47 minutes, with a slight tail to the right from a few long sessions.',
      },
    },
  ],
  checkpoints: [
    {
      id: 's1-c1',
      question: 'A dataset records 200 students. Each student has an age, a major, and a GPA. How many observations are there?',
      options: ['3', '200', '203', '600'],
      answer: 1,
      hints: ['Observations are rows. What is each row about?'],
      explanation: 'Each student is one row, so there are 200 observations and 3 variables.',
    },
    {
      id: 's1-c2',
      question: 'Which variable is numerical?',
      options: ['Favorite streaming service', 'Phone number', 'Number of songs in a playlist', 'Music genre'],
      answer: 2,
      hints: ['Which one would make sense to average?'],
      explanation: 'Number of songs is a count, so averaging it makes sense. A phone number is a label.',
    },
    {
      id: 's1-c3',
      question: 'Which chart is best for showing how many students chose each major?',
      options: ['Histogram', 'Bar chart', 'Scatterplot', 'Box plot'],
      answer: 1,
      hints: ['Major is categorical.'],
      explanation: 'A bar chart shows counts for each category.',
    },
    {
      id: 's1-c4',
      question: 'A histogram of delivery times has most values between 20 and 30 minutes and a long tail up to 90 minutes. Its shape is:',
      options: ['Skewed left', 'Symmetric', 'Skewed right', 'Uniform'],
      answer: 2,
      hints: ['The tail points toward the larger values.'],
      explanation: 'A long tail toward larger values means skewed right.',
    },
  ],
};

export default stage1;
