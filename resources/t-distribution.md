# T-Distribution Explained
**MDragon Data Tools - Study Guide**

---

## Table of Contents
1. What is the T-Distribution?
2. T-Distribution vs Normal Distribution
3. Degrees of Freedom
4. When to Use T-Distribution
5. Step-by-Step Examples
6. Using T-Tables
7. Practice Problems

---

## 1. What is the T-Distribution?

The **t-distribution** (also called Student's t-distribution) is a probability distribution used when:
- Working with small sample sizes (n < 30)
- Population standard deviation (σ) is unknown
- Estimating population parameters from sample data

### Who Uses It?
- Researchers with limited sample sizes
- Anyone creating confidence intervals
- Hypothesis testing with unknown σ
- Quality control with small batches

---

## 2. T-Distribution vs Normal Distribution

### Similarities
- Both are symmetric and bell-shaped
- Both centered at 0
- Both used for inference about means

### Key Differences

| Feature | Normal Distribution | T-Distribution |
|---------|-------------------|----------------|
| **Shape** | Fixed shape | Varies with df |
| **Tails** | Thinner tails | Heavier/fatter tails |
| **When Used** | σ known, large n | σ unknown, small n |
| **Parameters** | μ and σ | Degrees of freedom (df) |
| **As n grows** | Stays same | Approaches normal |

### Visual Comparison
```
    Normal (thin tails)
    ___________________
   /                   \
  /                     \
 /                       \
|_________________________|

    T-distribution (fat tails)
    ___________________
   /                   \
  /                     \
 /                       \
|                         |  ← More probability in tails
```

---

## 3. Degrees of Freedom (df)

### What is Degrees of Freedom?
Degrees of freedom represents the number of independent pieces of information available to estimate a parameter.

### Formula
For a single sample:
```
df = n - 1

where n = sample size
```

For two samples (pooled):
```
df = n₁ + n₂ - 2
```

### Why df Matters
- **Smaller df** → Heavier tails → More uncertainty
- **Larger df** → Approaches normal distribution
- **df = 30+** → Nearly identical to normal

### Example df Values
| Sample Size (n) | df | Shape |
|----------------|----|--------------------|
| 5 | 4 | Very heavy tails |
| 10 | 9 | Heavy tails |
| 20 | 19 | Moderate tails |
| 30 | 29 | Nearly normal |
| 100 | 99 | Essentially normal |

---

## 4. When to Use T-Distribution

### Use T-Distribution When:
1. **Small sample size** (n < 30)
2. **Population σ is unknown** (use sample s instead)
3. **Assuming normality** (or approximately normal data)

### Use Normal Distribution When:
1. **Large sample size** (n ≥ 30) - Central Limit Theorem applies
2. **Population σ is known**
3. **Working with proportions**

### Decision Flowchart
```
Is σ known?
│
├─ Yes → Use Normal (Z)
│
└─ No → Is n ≥ 30?
         │
         ├─ Yes → Can use Normal (Z) or T (similar results)
         │
         └─ No → Use T-distribution
```

---

## 5. Step-by-Step Examples

### Example 1: Finding a T-Score
**Problem:** A sample of n = 15 students has a mean test score of x̄ = 82 with s = 8. The population mean is hypothesized to be μ = 75. Calculate the t-score.

**Solution:**
1. **Identify the values:**
   - x̄ = 82 (sample mean)
   - μ = 75 (hypothesized population mean)
   - s = 8 (sample standard deviation)
   - n = 15 (sample size)

2. **Calculate degrees of freedom:**
   ```
   df = n - 1 = 15 - 1 = 14
   ```

3. **Calculate t-score:**
   ```
   t = (x̄ - μ) / (s / √n)
     = (82 - 75) / (8 / √15)
     = 7 / (8 / 3.873)
     = 7 / 2.066
     = 3.39
   ```

**Answer:** t = 3.39 with df = 14

**Interpretation:** The sample mean is 3.39 standard errors above the hypothesized population mean.

---

### Example 2: Critical T-Value for Confidence Interval
**Problem:** Find the critical t-value for a 95% confidence interval with n = 20.

**Solution:**
1. **Calculate degrees of freedom:**
   ```
   df = n - 1 = 20 - 1 = 19
   ```

2. **Determine significance level:**
   ```
   Confidence level = 95% = 0.95
   α = 1 - 0.95 = 0.05
   α/2 = 0.025 (two-tailed)
   ```

3. **Look up t-table:**
   - df = 19
   - α/2 = 0.025
   - **t-critical = 2.093**

**Answer:** t* = ±2.093

**Interpretation:** For a 95% CI with 19 df, use t-values of ±2.093.

---

### Example 3: Constructing a Confidence Interval
**Problem:** A sample of 12 measurements has x̄ = 50 and s = 6. Construct a 90% confidence interval for the population mean.

**Solution:**
1. **Identify values:**
   - x̄ = 50
   - s = 6
   - n = 12
   - Confidence level = 90%

2. **Calculate df:**
   ```
   df = 12 - 1 = 11
   ```

3. **Find t-critical (90% CI, df = 11):**
   ```
   α = 0.10, α/2 = 0.05
   t* = 1.796 (from t-table)
   ```

4. **Calculate margin of error:**
   ```
   ME = t* × (s / √n)
      = 1.796 × (6 / √12)
      = 1.796 × (6 / 3.464)
      = 1.796 × 1.732
      = 3.11
   ```

5. **Construct interval:**
   ```
   CI = x̄ ± ME
      = 50 ± 3.11
      = (46.89, 53.11)
   ```

**Answer:** 90% CI: (46.89, 53.11)

**Interpretation:** We are 90% confident the true population mean is between 46.89 and 53.11.

---

### Example 4: Comparing T vs Z
**Problem:** For a 95% confidence interval, compare the critical values for:
a) df = 5
b) df = 30
c) Z-distribution (infinite df)

**Solution:**
1. **For 95% CI, α/2 = 0.025**

2. **Look up values:**
   ```
   df = 5:   t* = 2.571
   df = 30:  t* = 2.042
   Z:        z* = 1.96
   ```

**Answer:**
- Small sample (df=5): t* = 2.571 (much larger)
- Moderate sample (df=30): t* = 2.042 (close to Z)
- Large sample (Z): z* = 1.96

**Interpretation:** As sample size increases, t-values approach z-values. Smaller samples require larger multipliers for the same confidence level.

---

### Example 5: One-Sample T-Test
**Problem:** A company claims their batteries last 100 hours on average. A sample of 8 batteries has x̄ = 95 hours and s = 10 hours. Test at α = 0.05 if the true mean is less than 100.

**Solution:**
1. **Set up hypotheses:**
   ```
   H₀: μ = 100 (claim)
   Hₐ: μ < 100 (left-tailed test)
   ```

2. **Calculate test statistic:**
   ```
   df = 8 - 1 = 7
   t = (95 - 100) / (10 / √8)
     = -5 / (10 / 2.828)
     = -5 / 3.536
     = -1.414
   ```

3. **Find critical value:**
   ```
   α = 0.05 (left-tailed), df = 7
   t-critical = -1.895
   ```

4. **Make decision:**
   ```
   t = -1.414 > t-critical = -1.895
   Fail to reject H₀
   ```

**Answer:** Do not reject the null hypothesis

**Interpretation:** There is insufficient evidence at the 0.05 level to conclude the batteries last less than 100 hours.

---

### Example 6: Determining Sample Size Effect
**Problem:** Compare the margin of error for a 95% CI with s = 10 for:
a) n = 10
b) n = 25

**Solution:**
**a) n = 10:**
```
df = 9, t* = 2.262
ME = 2.262 × (10 / √10)
   = 2.262 × 3.162
   = 7.15
```

**b) n = 25:**
```
df = 24, t* = 2.064
ME = 2.064 × (10 / √25)
   = 2.064 × 2
   = 4.13
```

**Answer:**
- n = 10: ME = ±7.15
- n = 25: ME = ±4.13

**Interpretation:** Increasing sample size from 10 to 25 reduces margin of error by about 42%, giving a more precise estimate.

---

## 6. Using T-Tables

### How to Read a T-Table

1. **Find your df** (rows)
2. **Find your α or confidence level** (columns)
3. **Locate the intersection** - that's your t-critical value

### Common Confidence Levels and α Values

| Confidence Level | α | α/2 (two-tailed) |
|-----------------|-----|------------------|
| 90% | 0.10 | 0.05 |
| 95% | 0.05 | 0.025 |
| 98% | 0.02 | 0.01 |
| 99% | 0.01 | 0.005 |

### Example T-Table Excerpt
```
df   α=0.10  α=0.05  α=0.025  α=0.01
5    1.476   2.015   2.571    3.365
10   1.372   1.812   2.228    2.764
15   1.341   1.753   2.131    2.602
20   1.325   1.725   2.086    2.528
30   1.310   1.697   2.042    2.457
∞    1.282   1.645   1.960    2.326 (Z-values)
```

---

## 7. Practice Problems

### Problem 1
Calculate the t-score for a sample where:
- x̄ = 65, μ = 60, s = 12, n = 18

### Problem 2
Find the critical t-value for:
a) 95% CI, n = 25
b) 99% CI, n = 10

### Problem 3
Construct a 95% confidence interval for μ given:
- x̄ = 120, s = 15, n = 16

### Problem 4
A sample of 9 measurements has x̄ = 48 and s = 8. Test H₀: μ = 50 vs Hₐ: μ ≠ 50 at α = 0.05.

### Problem 5
How does the margin of error change when going from:
a) n = 15 to n = 30 (with s = 5, 95% CI)?

---

## Answers to Practice Problems

### Problem 1
```
df = 18 - 1 = 17
t = (65 - 60) / (12 / √18)
  = 5 / 2.828
  = 1.77
```

### Problem 2
**a) 95% CI, n = 25:**
```
df = 24, α/2 = 0.025
t* = 2.064
```

**b) 99% CI, n = 10:**
```
df = 9, α/2 = 0.005
t* = 3.250
```

### Problem 3
```
df = 15, t* = 2.131
ME = 2.131 × (15 / √16) = 2.131 × 3.75 = 7.99
CI = 120 ± 7.99 = (112.01, 127.99)
```

### Problem 4
```
df = 8, α = 0.05 (two-tailed)
t = (48 - 50) / (8 / √9) = -2 / 2.667 = -0.75
t-critical = ±2.306
|t| < t-critical, so fail to reject H₀
```

### Problem 5
**n = 15:**
```
df = 14, t* = 2.145
ME = 2.145 × (5 / √15) = 2.77
```

**n = 30:**
```
df = 29, t* = 2.045
ME = 2.045 × (5 / √30) = 1.87
```

**Reduction: (2.77 - 1.87) / 2.77 = 32.5% smaller**

---

## Quick Reference

### T-Score Formula
```
t = (x̄ - μ) / (s / √n)
```

### Degrees of Freedom
```
df = n - 1 (single sample)
```

### Confidence Interval
```
CI = x̄ ± t* × (s / √n)
```

### When to Use
- n < 30 AND σ unknown → Use T
- n ≥ 30 OR σ known → Can use Z

---

*Use our Normal Distribution Calculator at MDragon Data Tools - it handles both Z and T distributions!*
