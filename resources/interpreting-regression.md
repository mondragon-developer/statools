# Interpreting Regression Results
**MDragon Data Tools - Guide**

## Understanding Output

### Slope (b₁)
**Interpretation:** Change in Y for one-unit increase in X
```
b₁ = 5.2
"Each additional X increases Y by 5.2 units"
```

### Intercept (b₀)
**Interpretation:** Expected Y when X = 0
```
b₀ = 12.3
"When X=0, expected Y is 12.3"
```
⚠️ Only meaningful if X=0 is possible!

### Correlation (r)
| Value | Strength |
|-------|----------|
| 0.0-0.3 | Weak |
| 0.3-0.7 | Moderate |
| 0.7-1.0 | Strong |

**Sign:**
- Positive (+): X ↑ then Y ↑
- Negative (-): X ↑ then Y ↓

### R-Squared (R²)
```
R² = 0.82
"82% of variation in Y is explained by X"
```

**Guidelines:**
- R² < 0.3: Poor fit
- 0.3 < R² < 0.7: Moderate fit
- R² > 0.7: Good fit

### Standard Error (SE)
**Interpretation:** Average prediction error
```
SE = 3.5
"Predictions typically off by ±3.5 units"
```

## Common Mistakes

❌ **Causation from Correlation**
- Regression shows association, NOT causation
- Ice cream sales and drowning correlate (both increase in summer)
- Ice cream doesn't CAUSE drowning!

❌ **Extrapolation**
- Don't predict beyond data range
- Relationship may change outside observed values

❌ **Ignoring Outliers**
- One extreme point can drastically change line
- Always check scatter plot!

## Reporting Results

### Template
"We found a [strong/moderate/weak] [positive/negative] relationship between [X] and [Y] (r = __, R² = __). The regression equation is ŷ = __ + __x. For each one-unit increase in [X], [Y] increases/decreases by __ units. The model explains __% of the variation in [Y]."

### Example
"We found a strong positive relationship between study hours and exam scores (r = 0.89, R² = 0.79). The regression equation is ŷ = 45 + 8x. For each additional hour studied, exam scores increase by 8 points. The model explains 79% of the variation in exam scores."

---
*Practice interpretation with real data in our calculators!*
