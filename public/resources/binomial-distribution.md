# Binomial Distribution Guide
**MDragon Data Tools - Study Guide**

---

## Table of Contents
1. What is a Binomial Distribution?
2. Conditions for Binomial Distribution
3. Formulas and Notation
4. Step-by-Step Examples
5. Using the Calculator
6. Practice Problems

---

## 1. What is a Binomial Distribution?

A **binomial distribution** describes the number of successes in a fixed number of independent trials, where each trial has only two possible outcomes (success or failure) and the probability of success remains constant.

### Real-World Examples
- Number of heads in 10 coin flips
- Number of defective items in a batch of 50
- Number of students passing an exam out of 30
- Number of free throws made out of 20 attempts

---

## 2. Conditions for Binomial Distribution

For a binomial distribution to apply, **all four conditions** must be met:

1. **Fixed number of trials (n)**: The experiment is repeated a specific number of times
2. **Two outcomes**: Each trial has exactly two possible outcomes (success/failure)
3. **Independent trials**: The outcome of one trial doesn't affect another
4. **Constant probability (p)**: The probability of success is the same for each trial

**Memory Tip: FTIC**
- **F**ixed number of trials
- **T**wo outcomes
- **I**ndependent
- **C**onstant probability

---

## 3. Formulas and Notation

### Notation
- **n** = number of trials
- **x** = number of successes
- **p** = probability of success on each trial
- **q** = probability of failure = 1 - p
- **P(X = x)** = probability of exactly x successes

### Binomial Probability Formula
```
P(X = x) = C(n,x) × p^x × q^(n-x)

where C(n,x) = n! / (x! × (n-x)!)
```

### Mean (Expected Value)
```
μ = n × p
```

### Standard Deviation
```
σ = √(n × p × q)
```

### Variance
```
σ² = n × p × q
```

---

## 4. Step-by-Step Examples

### Example 1: Exact Probability
**Problem:** A fair coin is flipped 5 times. What is the probability of getting exactly 3 heads?

**Solution:**
1. **Identify the values:**
   - n = 5 (number of flips)
   - x = 3 (number of heads we want)
   - p = 0.5 (probability of heads)
   - q = 0.5 (probability of tails)

2. **Check conditions:**
   - ✓ Fixed trials: 5 flips
   - ✓ Two outcomes: heads or tails
   - ✓ Independent: each flip independent
   - ✓ Constant probability: p = 0.5 for all flips

3. **Calculate combination:**
   ```
   C(5,3) = 5! / (3! × 2!)
          = (5 × 4) / (2 × 1)
          = 10
   ```

4. **Apply binomial formula:**
   ```
   P(X = 3) = C(5,3) × p^3 × q^2
            = 10 × (0.5)^3 × (0.5)^2
            = 10 × 0.125 × 0.25
            = 10 × 0.03125
            = 0.3125
   ```

**Answer:** 0.3125 or 31.25%

---

### Example 2: Cumulative Probability (At Most)
**Problem:** A basketball player has a 70% free throw success rate. If she takes 8 free throws, what is the probability she makes at most 5?

**Solution:**
1. **Identify the values:**
   - n = 8
   - p = 0.70
   - q = 0.30
   - We need P(X ≤ 5)

2. **Calculate:**
   ```
   P(X ≤ 5) = P(0) + P(1) + P(2) + P(3) + P(4) + P(5)
   ```

3. **Using calculator or table:**
   ```
   P(X ≤ 5) = 0.4482
   ```

**Answer:** 0.4482 or 44.82%

*Note: Use our Binomial Calculator for easier computation of cumulative probabilities*

---

### Example 3: Complement Rule Application
**Problem:** A multiple choice test has 10 questions with 4 choices each. If a student guesses randomly on all questions, what is the probability of getting more than 3 correct?

**Solution:**
1. **Identify the values:**
   - n = 10 (questions)
   - p = 0.25 (probability of guessing correctly)
   - q = 0.75
   - We need P(X > 3)

2. **Use complement:**
   ```
   P(X > 3) = 1 - P(X ≤ 3)
   ```

3. **Calculate P(X ≤ 3):**
   ```
   P(X ≤ 3) = P(0) + P(1) + P(2) + P(3)
   ```

4. **Individual calculations:**
   ```
   P(0) = C(10,0) × 0.25^0 × 0.75^10 = 0.0563
   P(1) = C(10,1) × 0.25^1 × 0.75^9  = 0.1877
   P(2) = C(10,2) × 0.25^2 × 0.75^8  = 0.2816
   P(3) = C(10,3) × 0.25^3 × 0.75^7  = 0.2503

   P(X ≤ 3) = 0.7759
   ```

5. **Apply complement:**
   ```
   P(X > 3) = 1 - 0.7759 = 0.2241
   ```

**Answer:** 0.2241 or 22.41%

---

### Example 4: Mean and Standard Deviation
**Problem:** A factory produces light bulbs, and 5% are defective. In a sample of 200 bulbs, what is the expected number of defective bulbs and the standard deviation?

**Solution:**
1. **Identify the values:**
   - n = 200
   - p = 0.05
   - q = 0.95

2. **Calculate mean:**
   ```
   μ = n × p
     = 200 × 0.05
     = 10
   ```

3. **Calculate standard deviation:**
   ```
   σ = √(n × p × q)
     = √(200 × 0.05 × 0.95)
     = √9.5
     = 3.08
   ```

**Answer:**
- Expected defective bulbs: 10
- Standard deviation: 3.08 bulbs

**Interpretation:** In a sample of 200 bulbs, we expect about 10 defective bulbs, with a typical variation of about 3 bulbs.

---

### Example 5: At Least Probability
**Problem:** The probability of rain on any given day is 0.3. What is the probability it rains on at least 2 of the next 7 days?

**Solution:**
1. **Identify the values:**
   - n = 7
   - p = 0.3
   - q = 0.7
   - We need P(X ≥ 2)

2. **Use complement:**
   ```
   P(X ≥ 2) = 1 - P(X < 2)
            = 1 - [P(0) + P(1)]
   ```

3. **Calculate P(0):**
   ```
   P(0) = C(7,0) × 0.3^0 × 0.7^7
        = 1 × 1 × 0.0824
        = 0.0824
   ```

4. **Calculate P(1):**
   ```
   P(1) = C(7,1) × 0.3^1 × 0.7^6
        = 7 × 0.3 × 0.1176
        = 0.2471
   ```

5. **Apply complement:**
   ```
   P(X ≥ 2) = 1 - (0.0824 + 0.2471)
            = 1 - 0.3295
            = 0.6705
   ```

**Answer:** 0.6705 or 67.05%

---

## 5. Using the MDragon Binomial Calculator

### Steps:
1. Navigate to **Calculators → Binomial Distribution**
2. Enter the following parameters:
   - **n**: Number of trials
   - **p**: Probability of success (as a decimal)
   - **x**: Number of successes

3. Select calculation type:
   - **Exactly (=)**: P(X = x)
   - **At most (≤)**: P(X ≤ x)
   - **At least (≥)**: P(X ≥ x)
   - **Less than (<)**: P(X < x)
   - **Greater than (>)**: P(X > x)

4. Click **Calculate** to see:
   - Probability result
   - Mean and standard deviation
   - Visual distribution graph

---

## 6. Practice Problems

### Problem 1
A survey shows 60% of people prefer chocolate ice cream. If 12 people are randomly selected, what is the probability that exactly 8 prefer chocolate?

### Problem 2
A quality control inspector finds that 3% of items are defective. In a batch of 50 items, what is the probability of finding:
a) Exactly 2 defective items?
b) At most 1 defective item?

### Problem 3
A student has a 75% chance of correctly answering each question on a true/false quiz with 15 questions. What is the expected number of correct answers and the standard deviation?

### Problem 4
The probability a seed germinates is 0.85. If 20 seeds are planted, what is the probability at least 18 germinate?

### Problem 5
A basketball player makes 80% of her free throws. In the next 10 free throw attempts, what is the probability she makes between 7 and 9 (inclusive)?

---

## Answers to Practice Problems

### Problem 1
```
n = 12, x = 8, p = 0.6
P(X = 8) = C(12,8) × 0.6^8 × 0.4^4
         = 495 × 0.0168 × 0.0256
         = 0.2128 or 21.28%
```

### Problem 2
a) **Exactly 2 defective:**
```
n = 50, x = 2, p = 0.03
P(X = 2) = 0.2578 or 25.78%
```

b) **At most 1 defective:**
```
P(X ≤ 1) = P(0) + P(1) = 0.5553 or 55.53%
```

### Problem 3
```
n = 15, p = 0.75
μ = 15 × 0.75 = 11.25 questions
σ = √(15 × 0.75 × 0.25) = 1.68 questions
```

### Problem 4
```
n = 20, p = 0.85
P(X ≥ 18) = P(18) + P(19) + P(20) = 0.4049 or 40.49%
```

### Problem 5
```
n = 10, p = 0.8
P(7 ≤ X ≤ 9) = P(7) + P(8) + P(9) = 0.6778 or 67.78%
```

---

## Quick Reference

| Type | Notation | Formula |
|------|----------|---------|
| Exactly | P(X = x) | C(n,x) × p^x × q^(n-x) |
| At most | P(X ≤ x) | Sum from 0 to x |
| At least | P(X ≥ x) | 1 - P(X < x) |
| Mean | μ | n × p |
| Std Dev | σ | √(n × p × q) |

---

*Use our Binomial Calculator at MDragon Data Tools for quick and accurate calculations!*
