# Confidence Intervals Step-by-Step
**MDragon Data Tools - Study Guide**

## What is a Confidence Interval?

A **confidence interval** provides a range of plausible values for a population parameter, with a specified level of confidence.

### Interpretation
"We are 95% confident that the true population mean is between 50 and 60."

**Correct**: The method captures the true parameter 95% of the time.
**Incorrect**: "95% probability the parameter is in this interval" (it either is or isn't).

## CI for Population Mean (σ known)

### Formula
```
CI = x̄ ± z* × (σ / √n)

where z* = critical value for desired confidence level
```

### Common Critical Values
| Confidence Level | z* |
|-----------------|-----|
| 90% | 1.645 |
| 95% | 1.96 |
| 98% | 2.33 |
| 99% | 2.58 |

### Example 1
**Problem:** Sample of 50 has x̄=100, σ=15. Find 95% CI.

**Solution:**
```
CI = 100 ± 1.96 × (15/√50)
   = 100 ± 1.96 × 2.12
   = 100 ± 4.16
   = (95.84, 104.16)
```

**Answer:** 95% CI: (95.84, 104.16)

## CI for Population Mean (σ unknown)

### Formula
```
CI = x̄ ± t* × (s / √n)

where t* depends on df and confidence level
```

### Example 2
**Problem:** Sample of 15 has x̄=72, s=8. Find 90% CI.

**Solution:**
```
df = 14
t* = 1.761 (from t-table)
CI = 72 ± 1.761 × (8/√15)
   = 72 ± 1.761 × 2.066
   = 72 ± 3.64
   = (68.36, 75.64)
```

**Answer:** 90% CI: (68.36, 75.64)

## CI for Population Proportion

### Formula
```
CI = p̂ ± z* × √[p̂(1-p̂)/n]

where p̂ = x/n (sample proportion)
```

### Example 3
**Problem:** 120 out of 200 support a policy. Find 95% CI for true proportion.

**Solution:**
```
p̂ = 120/200 = 0.60
CI = 0.60 ± 1.96 × √[0.60(0.40)/200]
   = 0.60 ± 1.96 × 0.0346
   = 0.60 ± 0.068
   = (0.532, 0.668)
```

**Answer:** 95% CI: (53.2%, 66.8%)

## Sample Size Determination

### For Mean
```
n = (z*σ / ME)²

where ME = desired margin of error
```

### Example 4
**Problem:** How many samples needed for 95% CI with ME=2, σ=10?

**Solution:**
```
n = (1.96 × 10 / 2)²
  = (9.8)²
  = 96.04
  Round up: n = 97
```

### For Proportion
```
n = p̂(1-p̂)(z*/ME)²

Use p̂=0.5 if no estimate available (most conservative)
```

## Factors Affecting CI Width

1. **Sample Size (n)**: Larger n → Narrower CI
2. **Confidence Level**: Higher confidence → Wider CI
3. **Standard Deviation**: Larger σ or s → Wider CI

### Trade-offs
- Want narrow CI? Increase sample size or decrease confidence
- Want high confidence? Accept wider CI or increase sample size

---
*Practice with our calculators to build intuition!*
