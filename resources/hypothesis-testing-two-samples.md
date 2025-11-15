# Hypothesis Testing: Two Samples
**MDragon Data Tools - Study Guide**

## Comparing Two Population Means

### When to Use
- Comparing two groups (treatment vs control, before vs after, etc.)
- Independent samples OR paired/dependent samples

## Independent Samples T-Test

### Conditions
1. Random, independent samples
2. Approximately normal distributions OR n₁, n₂ ≥ 30
3. Equal or unequal variances

### Test Statistic (Equal Variances)
```
t = (x̄₁ - x̄₂) / √[s²ₚ(1/n₁ + 1/n₂)]

Pooled variance: s²ₚ = [(n₁-1)s₁² + (n₂-1)s₂²] / (n₁ + n₂ - 2)
df = n₁ + n₂ - 2
```

### Example: Independent Samples
**Problem:** Group A (n=20): x̄₁=85, s₁=10. Group B (n=25): x̄₂=80, s₂=12. Test if means differ (α=0.05).

**Solution:**
1. H₀: μ₁ = μ₂; Hₐ: μ₁ ≠ μ₂
2. s²ₚ = [19(100) + 24(144)] / 43 = 5356/43 = 124.56
3. t = (85-80) / √[124.56(1/20 + 1/25)] = 5 / 3.35 = 1.49
4. df = 43, p-value ≈ 0.143
5. 0.143 > 0.05, **Fail to reject H₀**

**Conclusion:** No significant difference between groups.

## Paired Samples T-Test

### When to Use
- Before/after measurements
- Matched pairs
- Same subjects measured twice

### Test Statistic
```
t = d̄ / (sᵈ / √n)

where:
d̄ = mean of differences
sᵈ = standard deviation of differences
df = n - 1
```

### Example: Paired Samples
**Problem:** Weight loss program. 8 people: before={180,175,200,165,190,185,195,170}, after={175,170,195,162,185,180,190,165}. Test if program works (α=0.05).

**Solution:**
1. Differences: d = {5,5,5,3,5,5,5,5}
2. d̄ = 4.75, sᵈ = 0.886
3. H₀: μᵈ = 0; Hₐ: μᵈ > 0 (right-tailed)
4. t = 4.75 / (0.886/√8) = 15.16, df=7
5. p-value ≈ 0.000001
6. **Reject H₀**

**Conclusion:** Program significantly reduces weight.

## Two Proportion Z-Test

### Test Statistic
```
z = (p̂₁ - p̂₂) / √[p̄(1-p̄)(1/n₁ + 1/n₂)]

Pooled proportion: p̄ = (x₁ + x₂) / (n₁ + n₂)
```

### Example
**Problem:** Survey: 60/100 men prefer product A, 45/80 women prefer it. Test if proportions differ (α=0.05).

**Solution:**
1. p̂₁ = 0.60, p̂₂ = 0.5625
2. p̄ = 105/180 = 0.583
3. z = 0.0375 / 0.074 = 0.507
4. p-value = 0.612
5. **Fail to reject H₀**

---
*Use our Hypothesis Test Calculator for quick analysis!*
