# Linear Regression Basics
**MDragon Data Tools - Study Guide**

## What is Linear Regression?

Linear regression models the relationship between:
- **Dependent variable (Y)**: What we're trying to predict
- **Independent variable (X)**: What we use to make predictions

### The Regression Line
```
ŷ = b₀ + b₁x

where:
ŷ = predicted value
b₀ = y-intercept
b₁ = slope
x = independent variable
```

## Key Formulas

### Slope (b₁)
```
b₁ = r × (sʸ / sˣ)

or

b₁ = Σ[(x-x̄)(y-ȳ)] / Σ(x-x̄)²
```

### Intercept (b₀)
```
b₀ = ȳ - b₁x̄
```

### Correlation Coefficient (r)
```
r = Σ[(x-x̄)(y-ȳ)] / √[Σ(x-x̄)² × Σ(y-ȳ)²]

Range: -1 ≤ r ≤ 1
```

### Coefficient of Determination (R²)
```
R² = r²

Interpretation: % of variance in Y explained by X
```

## Example: Step-by-Step

**Problem:** Study hours (X) vs exam scores (Y):
| Hours | Score |
|-------|-------|
| 2 | 65 |
| 4 | 75 |
| 5 | 82 |
| 6 | 85 |
| 8 | 92 |

**Solution:**

1. **Calculate means:**
```
x̄ = (2+4+5+6+8)/5 = 5
ȳ = (65+75+82+85+92)/5 = 79.8
```

2. **Calculate slope:**
```
Σ(x-x̄)(y-ȳ) = (-3)(-14.8) + (-1)(-4.8) + (0)(2.2) + (1)(5.2) + (3)(12.2) = 91
Σ(x-x̄)² = 9 + 1 + 0 + 1 + 9 = 20
b₁ = 91/20 = 4.55
```

3. **Calculate intercept:**
```
b₀ = 79.8 - 4.55(5) = 57.05
```

4. **Regression equation:**
```
ŷ = 57.05 + 4.55x
```

**Interpretation:**
- For each additional hour studied, expect score to increase by 4.55 points
- Starting point (0 hours): expect 57.05

## Predictions

Using ŷ = 57.05 + 4.55x:

**Predict score for 7 hours:**
```
ŷ = 57.05 + 4.55(7) = 88.9
```

## Assumptions
1. Linearity (relationship is linear)
2. Independence of errors
3. Homoscedasticity (constant variance)
4. Normality of residuals

---
*Use our calculators to perform regression analysis instantly!*
