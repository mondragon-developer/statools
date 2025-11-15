# Regression Analysis Step-by-Step
**MDragon Data Tools - Comprehensive Guide**

## The Complete Process

### Step 1: Collect and Examine Data
- Plot scatter diagram
- Check for linear relationship
- Identify outliers

### Step 2: Calculate Regression Equation
1. Find means: x̄, ȳ
2. Calculate b₁ (slope)
3. Calculate b₀ (intercept)
4. Form equation: ŷ = b₀ + b₁x

### Step 3: Assess Model Fit
- Calculate r (correlation)
- Calculate R² (coefficient of determination)
- Examine residual plots

### Step 4: Test Significance
- Test H₀: β₁ = 0 vs Hₐ: β₁ ≠ 0
- Use t-test or ANOVA F-test

### Step 5: Make Predictions
- Interpolation (within data range): reliable
- Extrapolation (outside data range): risky

## Detailed Example

**Data:** Advertising spend (X, $1000s) vs Sales (Y, $1000s)
```
X: 1, 2, 3, 4, 5
Y: 10, 15, 18, 22, 26
```

### Calculations

**1. Means:**
```
x̄ = 3, ȳ = 18.2
```

**2. Slope:**
```
b₁ = 72/10 = 3.6
```

**3. Intercept:**
```
b₀ = 18.2 - 3.6(3) = 7.4
```

**4. Equation:**
```
ŷ = 7.4 + 3.6x
```

**5. Correlation:**
```
r = 0.985 (strong positive)
R² = 0.97 (97% of variance explained)
```

**Interpretation:**
- Each $1,000 increase in advertising → $3,600 increase in sales
- Model explains 97% of sales variation
- Very strong linear relationship

---
*Master regression with our interactive tools!*
