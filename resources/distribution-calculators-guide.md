# Distribution Calculators Guide
**How to Use MDragon Distribution Calculators**

## Normal Distribution Calculator

### Inputs Required
- **μ (mean)**: Population/sample mean
- **σ (std dev)**: Standard deviation
- **x**: Value of interest

### What It Calculates
1. **Z-score**: How many SDs from mean
2. **P(X < x)**: Probability below x
3. **P(X > x)**: Probability above x
4. **Percentile**: What % falls below x

### Example
**Problem:** Heights: μ=70", σ=3". Find P(X < 73).

**Steps:**
1. Enter μ = 70
2. Enter σ = 3
3. Enter x = 73
4. Read result: P(X < 73) = 0.8413 or 84.13%

## Binomial Distribution Calculator

### Inputs Required
- **n**: Number of trials
- **p**: Probability of success (0 to 1)
- **x**: Number of successes
- **Type**: =, ≤, ≥, <, >

### Example
**Problem:** 10 coin flips, P(exactly 6 heads)?

**Steps:**
1. n = 10
2. p = 0.5
3. x = 6
4. Type = "Exactly (=)"
5. Result: 0.2051 or 20.51%

### Tips
- For "between" use: P(a ≤ X ≤ b) = P(X ≤ b) - P(X ≤ a-1)
- Check cumulative option for ranges

## Poisson Distribution Calculator

### Inputs Required
- **λ (lambda)**: Average rate
- **x**: Number of occurrences
- **Type**: =, ≤, ≥, <, >

### Example
**Problem:** 4 emails/hour average. P(exactly 6 in next hour)?

**Steps:**
1. λ = 4
2. x = 6
3. Type = "Exactly (=)"
4. Result: 0.1042 or 10.42%

### Important
- Adjust λ for time interval!
- If given "per hour" but want "per 30 min", divide λ by 2

## Hypothesis Test Calculator

### Inputs Required
- **Test type**: One-sample, two-sample, paired
- **α**: Significance level (usually 0.05)
- **Tail**: Two-tailed, right, or left
- **Sample statistics**: x̄, s, n

### Example
**Problem:** Test if μ = 100 when x̄=105, s=15, n=25, α=0.05

**Steps:**
1. Select "One-sample t-test"
2. Enter μ₀ = 100
3. Enter x̄ = 105, s = 15, n = 25
4. Select "Two-tailed"
5. α = 0.05
6. Result shows: t-statistic, p-value, decision

---
*Practice with different values to build intuition!*
