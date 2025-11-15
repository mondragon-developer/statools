# Normal Distribution & Z-Scores
**MDragon Data Tools - Study Guide**

---

## Table of Contents
1. What is a Normal Distribution?
2. Properties and Characteristics
3. The Standard Normal Distribution
4. Z-Scores Explained
5. Step-by-Step Examples
6. Using the Calculator
7. Practice Problems

---

## 1. What is a Normal Distribution?

The **normal distribution** (also called Gaussian distribution or bell curve) is a continuous probability distribution that is:
- Symmetric and bell-shaped
- Completely defined by two parameters: mean (μ) and standard deviation (σ)
- The most important distribution in statistics

### Real-World Examples
- Heights of adults
- Test scores (IQ, SAT, etc.)
- Measurement errors
- Blood pressure readings
- Manufacturing tolerances

---

## 2. Properties and Characteristics

### Key Properties
1. **Symmetric** about the mean
2. **Bell-shaped** curve
3. **Mean = Median = Mode** (all at the center)
4. **Total area under curve = 1** (represents 100% probability)
5. **Continuous** (can take any value)

### The Empirical Rule (68-95-99.7 Rule)

For any normal distribution:
- **68%** of data falls within **1 standard deviation** of the mean (μ ± 1σ)
- **95%** of data falls within **2 standard deviations** of the mean (μ ± 2σ)
- **99.7%** of data falls within **3 standard deviations** of the mean (μ ± 3σ)

```
      |← 68% →|
   |←── 95% ──→|
|←──── 99.7% ────→|
μ-3σ  μ-2σ  μ-1σ  μ  μ+1σ  μ+2σ  μ+3σ
```

---

## 3. The Standard Normal Distribution

The **standard normal distribution** is a special case where:
- Mean (μ) = 0
- Standard deviation (σ) = 1
- Denoted as **Z ~ N(0, 1)**

### Why It's Useful
Any normal distribution can be converted to the standard normal distribution using z-scores, allowing us to use standard tables.

---

## 4. Z-Scores Explained

### What is a Z-Score?
A **z-score** tells you how many standard deviations a value is from the mean.

### Z-Score Formula
```
z = (x - μ) / σ

where:
x = raw score
μ = population mean
σ = population standard deviation
```

### Interpreting Z-Scores
- **z = 0**: Value equals the mean
- **z = 1**: Value is 1 standard deviation above the mean
- **z = -1**: Value is 1 standard deviation below the mean
- **z = 2.5**: Value is 2.5 standard deviations above the mean

### Z-Score Sign
- **Positive z**: Value is above the mean
- **Negative z**: Value is below the mean

---

## 5. Step-by-Step Examples

### Example 1: Calculating a Z-Score
**Problem:** SAT scores are normally distributed with μ = 1000 and σ = 200. What is the z-score for a student who scored 1300?

**Solution:**
1. **Identify the values:**
   - x = 1300 (student's score)
   - μ = 1000 (mean)
   - σ = 200 (standard deviation)

2. **Apply z-score formula:**
   ```
   z = (x - μ) / σ
     = (1300 - 1000) / 200
     = 300 / 200
     = 1.5
   ```

**Answer:** z = 1.5

**Interpretation:** The student's score is 1.5 standard deviations above the mean.

---

### Example 2: Finding Probability Using Z-Score
**Problem:** Using the SAT example above, what percentage of students score below 1300?

**Solution:**
1. **From Example 1, we know z = 1.5**

2. **Look up z = 1.5 in standard normal table:**
   ```
   P(Z < 1.5) = 0.9332
   ```

3. **Convert to percentage:**
   ```
   0.9332 × 100% = 93.32%
   ```

**Answer:** 93.32% of students score below 1300

**Interpretation:** A score of 1300 is better than about 93% of test-takers.

---

### Example 3: Finding Probability Between Two Values
**Problem:** Heights of adult men are normally distributed with μ = 70 inches and σ = 3 inches. What percentage of men are between 67 and 73 inches tall?

**Solution:**
1. **Calculate z-score for x = 67:**
   ```
   z₁ = (67 - 70) / 3 = -1
   ```

2. **Calculate z-score for x = 73:**
   ```
   z₂ = (73 - 70) / 3 = 1
   ```

3. **Find probabilities:**
   ```
   P(Z < -1) = 0.1587
   P(Z < 1) = 0.8413
   ```

4. **Calculate difference:**
   ```
   P(-1 < Z < 1) = P(Z < 1) - P(Z < -1)
                  = 0.8413 - 0.1587
                  = 0.6826
   ```

**Answer:** 68.26% of men are between 67 and 73 inches tall

**Note:** This confirms the empirical rule (68% within 1 standard deviation)!

---

### Example 4: Finding a Raw Score from a Percentage
**Problem:** On a normally distributed test with μ = 75 and σ = 10, what score represents the 90th percentile?

**Solution:**
1. **Find z-score for 90th percentile:**
   - Look up 0.90 in z-table (or use calculator)
   - z ≈ 1.28

2. **Rearrange z-score formula to solve for x:**
   ```
   z = (x - μ) / σ
   x = μ + (z × σ)
   x = 75 + (1.28 × 10)
   x = 75 + 12.8
   x = 87.8
   ```

**Answer:** 87.8 points

**Interpretation:** To score in the top 10%, you need to score at least 88 points.

---

### Example 5: Using the Empirical Rule
**Problem:** IQ scores are normally distributed with μ = 100 and σ = 15. Between what two values do the middle 95% of IQ scores fall?

**Solution:**
1. **Apply empirical rule:**
   - 95% of data falls within μ ± 2σ

2. **Calculate boundaries:**
   ```
   Lower bound = μ - 2σ = 100 - 2(15) = 100 - 30 = 70
   Upper bound = μ + 2σ = 100 + 2(15) = 100 + 30 = 130
   ```

**Answer:** Between 70 and 130

**Interpretation:** 95% of people have IQ scores between 70 and 130.

---

### Example 6: Finding Probability in the Upper Tail
**Problem:** Reaction times are normally distributed with μ = 200 ms and σ = 25 ms. What is the probability of a reaction time greater than 250 ms?

**Solution:**
1. **Calculate z-score:**
   ```
   z = (250 - 200) / 25 = 2
   ```

2. **Find P(Z < 2):**
   ```
   P(Z < 2) = 0.9772
   ```

3. **Use complement rule:**
   ```
   P(Z > 2) = 1 - P(Z < 2)
            = 1 - 0.9772
            = 0.0228
   ```

**Answer:** 0.0228 or 2.28%

**Interpretation:** About 2.3% of reaction times exceed 250 ms.

---

### Example 7: Unusual Values
**Problem:** Exam scores have μ = 65 and σ = 12. A student scores 92. Is this score unusually high?

**Solution:**
1. **Calculate z-score:**
   ```
   z = (92 - 65) / 12
     = 27 / 12
     = 2.25
   ```

2. **Determine if unusual:**
   - **Rule of thumb**: |z| > 2 is considered unusual
   - Since z = 2.25 > 2, this is unusual

**Answer:** Yes, this score is unusually high

**Interpretation:** The score is more than 2 standard deviations above average, occurring in less than 5% of cases.

---

## 6. Using the MDragon Normal Distribution Calculator

### Steps:
1. Navigate to **Calculators → Normal Distribution**
2. Enter the parameters:
   - **μ (mean)**: Average value
   - **σ (standard deviation)**: Spread of data
   - **x**: Value of interest

3. The calculator will show:
   - Z-score
   - P(X < x): Probability below x
   - P(X > x): Probability above x
   - Visual representation

### Tips:
- For "between" problems: Calculate P(X < upper) - P(X < lower)
- For percentiles: Use inverse calculator feature
- Verify empirical rule with μ ± 1σ, μ ± 2σ, μ ± 3σ

---

## 7. Practice Problems

### Problem 1
Weights of apples are normally distributed with μ = 150g and σ = 20g.
a) What is the z-score for an apple weighing 180g?
b) What percentage of apples weigh less than 180g?

### Problem 2
The average commute time is 35 minutes with σ = 8 minutes. What percentage of commutes are between 27 and 43 minutes?

### Problem 3
Test scores have μ = 80 and σ = 5. What score represents the 75th percentile?

### Problem 4
Battery life is normally distributed with μ = 500 hours and σ = 40 hours. What is the probability a battery lasts more than 600 hours?

### Problem 5
Using the empirical rule, if μ = 50 and σ = 4, between what two values do:
a) The middle 68% of values fall?
b) The middle 99.7% of values fall?

---

## Answers to Practice Problems

### Problem 1
**a) Z-score:**
```
z = (180 - 150) / 20 = 1.5
```

**b) Percentage below 180g:**
```
P(Z < 1.5) = 0.9332 or 93.32%
```

### Problem 2
```
z₁ = (27 - 35) / 8 = -1
z₂ = (43 - 35) / 8 = 1
P(-1 < Z < 1) = 0.8413 - 0.1587 = 0.6826 or 68.26%
```

### Problem 3
```
z for 75th percentile ≈ 0.67
x = 80 + (0.67 × 5) = 80 + 3.35 = 83.35
Score needed: 83.35 or about 83-84 points
```

### Problem 4
```
z = (600 - 500) / 40 = 2.5
P(Z > 2.5) = 1 - 0.9938 = 0.0062 or 0.62%
```

### Problem 5
**a) Middle 68% (μ ± 1σ):**
```
Lower: 50 - 4 = 46
Upper: 50 + 4 = 54
Between 46 and 54
```

**b) Middle 99.7% (μ ± 3σ):**
```
Lower: 50 - 12 = 38
Upper: 50 + 12 = 62
Between 38 and 62
```

---

## Quick Reference

### Z-Score Formula
```
z = (x - μ) / σ
```

### Finding Raw Score from Z
```
x = μ + (z × σ)
```

### Empirical Rule
- 68% within μ ± 1σ
- 95% within μ ± 2σ
- 99.7% within μ ± 3σ

### Common Z-Values
| Percentile | Z-Score |
|------------|---------|
| 90th | 1.28 |
| 95th | 1.645 |
| 97.5th | 1.96 |
| 99th | 2.33 |

---

*Use our Normal Distribution Calculator at MDragon Data Tools for instant calculations!*
