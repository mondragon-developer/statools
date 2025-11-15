# Poisson Distribution Examples
**MDragon Data Tools - Study Guide**

---

## Table of Contents
1. What is a Poisson Distribution?
2. When to Use Poisson Distribution
3. Formulas and Notation
4. Step-by-Step Examples
5. Using the Calculator
6. Practice Problems

---

## 1. What is a Poisson Distribution?

The **Poisson distribution** models the number of times an event occurs in a fixed interval of time or space, given that events occur:
- Independently
- At a constant average rate
- One at a time

### Real-World Examples
- Number of customer arrivals per hour
- Number of emails received per day
- Number of defects per square meter of fabric
- Number of accidents at an intersection per month
- Number of calls to a call center per minute

---

## 2. When to Use Poisson Distribution

Use Poisson when:
1. **Counting occurrences** of an event in an interval
2. **Events are independent** (one doesn't affect another)
3. **Average rate (λ) is known** and constant
4. **Events cannot occur simultaneously** (very unlikely to occur at exactly the same instant)

### Poisson vs Binomial

| Poisson | Binomial |
|---------|----------|
| Number of trials unknown/very large | Fixed number of trials |
| Probability of success very small | Probability can be any value |
| Events over time/space | Fixed trials |
| Example: Calls per hour | Example: Coin flips |

**Rule of Thumb:** Use Poisson when n ≥ 20 and p ≤ 0.05

---

## 3. Formulas and Notation

### Notation
- **λ** (lambda) = average number of occurrences in the interval
- **x** = actual number of occurrences
- **e** = Euler's number ≈ 2.71828
- **P(X = x)** = probability of exactly x occurrences

### Poisson Probability Formula
```
P(X = x) = (λ^x × e^(-λ)) / x!
```

### Mean
```
μ = λ
```

### Standard Deviation
```
σ = √λ
```

### Variance
```
σ² = λ
```

**Key Insight:** For Poisson distribution, the mean equals the variance!

---

## 4. Step-by-Step Examples

### Example 1: Exact Probability
**Problem:** A call center receives an average of 3 calls per minute. What is the probability of receiving exactly 5 calls in the next minute?

**Solution:**
1. **Identify the values:**
   - λ = 3 (average calls per minute)
   - x = 5 (calls we want)
   - e ≈ 2.71828

2. **Apply Poisson formula:**
   ```
   P(X = 5) = (3^5 × e^(-3)) / 5!
            = (243 × 0.0498) / 120
            = 12.10 / 120
            = 0.1008
   ```

**Answer:** 0.1008 or 10.08%

---

### Example 2: At Most
**Problem:** A hospital emergency room sees an average of 2 patients per hour. What is the probability of seeing at most 1 patient in the next hour?

**Solution:**
1. **Identify the values:**
   - λ = 2
   - We need P(X ≤ 1) = P(0) + P(1)

2. **Calculate P(X = 0):**
   ```
   P(0) = (2^0 × e^(-2)) / 0!
        = (1 × 0.1353) / 1
        = 0.1353
   ```

3. **Calculate P(X = 1):**
   ```
   P(1) = (2^1 × e^(-2)) / 1!
        = (2 × 0.1353) / 1
        = 0.2707
   ```

4. **Sum the probabilities:**
   ```
   P(X ≤ 1) = 0.1353 + 0.2707 = 0.4060
   ```

**Answer:** 0.4060 or 40.60%

---

### Example 3: At Least (Using Complement)
**Problem:** A website receives an average of 5 visitors per minute. What is the probability of receiving at least 3 visitors in the next minute?

**Solution:**
1. **Identify the values:**
   - λ = 5
   - We need P(X ≥ 3)

2. **Use complement rule:**
   ```
   P(X ≥ 3) = 1 - P(X < 3)
            = 1 - [P(0) + P(1) + P(2)]
   ```

3. **Calculate individual probabilities:**
   ```
   P(0) = (5^0 × e^(-5)) / 0! = 0.0067
   P(1) = (5^1 × e^(-5)) / 1! = 0.0337
   P(2) = (5^2 × e^(-5)) / 2! = 0.0842

   P(X < 3) = 0.0067 + 0.0337 + 0.0842 = 0.1246
   ```

4. **Apply complement:**
   ```
   P(X ≥ 3) = 1 - 0.1246 = 0.8754
   ```

**Answer:** 0.8754 or 87.54%

---

### Example 4: Adjusting the Interval
**Problem:** A bookstore sells an average of 10 books per hour. What is the probability of selling exactly 3 books in 15 minutes?

**Solution:**
1. **Adjust λ for the new interval:**
   - Original: 10 books per 60 minutes
   - Need: books per 15 minutes
   ```
   λ_new = 10 × (15/60)
         = 10 × 0.25
         = 2.5 books per 15 minutes
   ```

2. **Calculate probability:**
   ```
   P(X = 3) = (2.5^3 × e^(-2.5)) / 3!
            = (15.625 × 0.0821) / 6
            = 1.283 / 6
            = 0.2138
   ```

**Answer:** 0.2138 or 21.38%

**Key Lesson:** Always adjust λ to match your time interval!

---

### Example 5: Range of Values
**Problem:** A restaurant receives an average of 8 delivery orders per hour. What is the probability of receiving between 6 and 9 orders (inclusive) in the next hour?

**Solution:**
1. **Identify the values:**
   - λ = 8
   - We need P(6 ≤ X ≤ 9) = P(6) + P(7) + P(8) + P(9)

2. **Calculate each probability:**
   ```
   P(6) = (8^6 × e^(-8)) / 6! = 0.1221
   P(7) = (8^7 × e^(-8)) / 7! = 0.1396
   P(8) = (8^8 × e^(-8)) / 8! = 0.1396
   P(9) = (8^9 × e^(-8)) / 9! = 0.1241
   ```

3. **Sum the probabilities:**
   ```
   P(6 ≤ X ≤ 9) = 0.1221 + 0.1396 + 0.1396 + 0.1241
                 = 0.5254
   ```

**Answer:** 0.5254 or 52.54%

---

### Example 6: Mean and Standard Deviation
**Problem:** A highway has an average of 1.5 accidents per month. What is the standard deviation of accidents per month?

**Solution:**
1. **Identify λ:**
   - λ = 1.5

2. **Calculate standard deviation:**
   ```
   σ = √λ
     = √1.5
     = 1.225
   ```

3. **Calculate mean:**
   ```
   μ = λ = 1.5
   ```

**Answer:**
- Mean: 1.5 accidents per month
- Standard deviation: 1.225 accidents

**Interpretation:** The typical variation from the average is about 1.2 accidents.

---

### Example 7: Zero Occurrences
**Problem:** A rare bird is spotted an average of 0.5 times per week in a nature preserve. What is the probability of NOT seeing the bird in a given week?

**Solution:**
1. **Identify the values:**
   - λ = 0.5
   - We need P(X = 0)

2. **Calculate:**
   ```
   P(0) = (0.5^0 × e^(-0.5)) / 0!
        = (1 × 0.6065) / 1
        = 0.6065
   ```

**Answer:** 0.6065 or 60.65%

**Interpretation:** There's about a 61% chance of not seeing the rare bird in any given week.

---

## 5. Using the MDragon Poisson Calculator

### Steps:
1. Navigate to **Calculators → Poisson Distribution**
2. Enter the parameters:
   - **λ (lambda)**: Average rate of occurrence
   - **x**: Number of events

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

### Tips:
- Adjust λ to match your time interval
- For "between" problems, use cumulative probabilities
- Check that conditions for Poisson are met

---

## 6. Practice Problems

### Problem 1
A store receives an average of 4 customers per hour. What is the probability of receiving exactly 6 customers in the next hour?

### Problem 2
A typist makes an average of 2 errors per page. What is the probability of:
a) Exactly 0 errors on a page?
b) At most 3 errors on a page?

### Problem 3
A factory produces items at a rate where defects occur at an average of 0.8 per day. What is the probability of at least 2 defects tomorrow?

### Problem 4
Phone calls arrive at a rate of 12 per hour. What is the probability of receiving exactly 3 calls in a 10-minute period?

### Problem 5
A radioactive source emits particles at an average rate of 50 per minute. What is the mean and standard deviation of particle emissions per minute?

---

## Answers to Practice Problems

### Problem 1
```
λ = 4, x = 6
P(X = 6) = (4^6 × e^(-4)) / 6!
         = 0.1042 or 10.42%
```

### Problem 2
**a) Exactly 0 errors:**
```
λ = 2, x = 0
P(X = 0) = (2^0 × e^(-2)) / 0!
         = 0.1353 or 13.53%
```

**b) At most 3 errors:**
```
P(X ≤ 3) = P(0) + P(1) + P(2) + P(3)
         = 0.1353 + 0.2707 + 0.2707 + 0.1804
         = 0.8571 or 85.71%
```

### Problem 3
```
λ = 0.8, need P(X ≥ 2)
P(X ≥ 2) = 1 - [P(0) + P(1)]
         = 1 - [0.4493 + 0.3595]
         = 1 - 0.8088
         = 0.1912 or 19.12%
```

### Problem 4
```
First adjust λ: 12 calls per 60 min = 2 calls per 10 min
λ = 2, x = 3
P(X = 3) = (2^3 × e^(-2)) / 3!
         = 0.1804 or 18.04%
```

### Problem 5
```
λ = 50
μ = 50 particles per minute
σ = √50 = 7.07 particles per minute
```

---

## Quick Reference

| Measure | Formula |
|---------|---------|
| P(X = x) | (λ^x × e^(-λ)) / x! |
| Mean (μ) | λ |
| Std Dev (σ) | √λ |
| Variance (σ²) | λ |

### Common λ Adjustments
- Per hour → Per minute: divide by 60
- Per day → Per hour: divide by 24
- Per year → Per month: divide by 12

---

*Use our Poisson Calculator at MDragon Data Tools for quick calculations!*
