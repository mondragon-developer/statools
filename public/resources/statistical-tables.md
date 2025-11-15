# Statistical Tables Cheat Sheet
**Quick Reference for Critical Values**

## Z-Table (Standard Normal)

### Common Z-Values
| Confidence Level | α | α/2 | z* |
|-----------------|-----|------|-----|
| 90% | 0.10 | 0.05 | 1.645 |
| 95% | 0.05 | 0.025 | 1.96 |
| 98% | 0.02 | 0.01 | 2.33 |
| 99% | 0.01 | 0.005 | 2.576 |

### Percentile Z-Scores
| Percentile | Z |
|-----------|-----|
| 90th | 1.28 |
| 95th | 1.645 |
| 97.5th | 1.96 |
| 99th | 2.33 |

### Area Under Curve
| Z | Area Left | Area Right |
|---|-----------|------------|
| 1.0 | 0.8413 | 0.1587 |
| 1.5 | 0.9332 | 0.0668 |
| 2.0 | 0.9772 | 0.0228 |
| 2.5 | 0.9938 | 0.0062 |
| 3.0 | 0.9987 | 0.0013 |

## T-Table (Student's t)

### Critical t-Values (Two-Tailed)
| df | 90% | 95% | 98% | 99% |
|----|------|------|------|------|
| 5 | 2.015 | 2.571 | 3.365 | 4.032 |
| 10 | 1.812 | 2.228 | 2.764 | 3.169 |
| 15 | 1.753 | 2.131 | 2.602 | 2.947 |
| 20 | 1.725 | 2.086 | 2.528 | 2.845 |
| 25 | 1.708 | 2.060 | 2.485 | 2.787 |
| 30 | 1.697 | 2.042 | 2.457 | 2.750 |
| 40 | 1.684 | 2.021 | 2.423 | 2.704 |
| 60 | 1.671 | 2.000 | 2.390 | 2.660 |
| 100 | 1.660 | 1.984 | 2.364 | 2.626 |
| ∞ | 1.645 | 1.960 | 2.326 | 2.576 |

### One-Tailed t-Values
| df | α=0.05 | α=0.025 | α=0.01 |
|----|---------|----------|---------|
| 10 | 1.812 | 2.228 | 2.764 |
| 20 | 1.725 | 2.086 | 2.528 |
| 30 | 1.697 | 2.042 | 2.457 |

## Chi-Square Table

### Critical χ² Values (α = 0.05)
| df | χ² |
|----|------|
| 1 | 3.841 |
| 2 | 5.991 |
| 3 | 7.815 |
| 4 | 9.488 |
| 5 | 11.071 |
| 10 | 18.307 |
| 15 | 24.996 |
| 20 | 31.410 |

## Quick Formulas

### Sample Size Calculations
```
Mean: n = (z*σ/ME)²
Proportion: n = p̂(1-p̂)(z*/ME)²
```

### Standard Error
```
Mean: SE = σ/√n or s/√n
Proportion: SE = √[p̂(1-p̂)/n]
```

### Confidence Intervals
```
Mean (σ known): x̄ ± z*(σ/√n)
Mean (σ unknown): x̄ ± t*(s/√n)
Proportion: p̂ ± z*√[p̂(1-p̂)/n]
```

### Test Statistics
```
Z-test: z = (x̄ - μ₀)/(σ/√n)
T-test: t = (x̄ - μ₀)/(s/√n)
```

## Interpretation Guide

### P-Value Interpretation
| P-value | Strength of Evidence |
|---------|---------------------|
| < 0.01 | Very strong |
| 0.01-0.05 | Strong |
| 0.05-0.10 | Moderate |
| > 0.10 | Weak/None |

### Effect Size (Cohen's d)
| |d| | Interpretation |
|-----|----------------|
| 0.2 | Small |
| 0.5 | Medium |
| 0.8 | Large |

---
*Keep this reference handy for homework and exams!*
