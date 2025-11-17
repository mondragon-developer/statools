# Measures of Deviation (Dispersion/Variability)

## Introduction

While measures of central tendency tell us about the "center" of data, **measures of deviation** (also called dispersion or variability) tell us how **spread out** the data is. Two datasets can have the same mean but very different spreads!

**Example:**
- Dataset A: 10, 10, 10, 10, 10 (Mean = 10, No spread)
- Dataset B: 0, 5, 10, 15, 20 (Mean = 10, Large spread)

The main measures of deviation are: **range**, **variance**, **standard deviation**, and **interquartile range (IQR)**.

---

## 1. Range

### Definition
The **range** is the difference between the maximum and minimum values.

### Formula
```
Range = Maximum value - Minimum value
```

### Example
Find the range of: 12, 18, 15, 22, 9, 25, 14

```
Maximum = 25
Minimum = 9
Range = 25 - 9 = 16
```

### When to Use
- ✅ For a **quick, simple** measure of spread
- ✅ When you need the **total span** of data
- ✅ For initial data exploration

### Limitations
- ❌ **Highly sensitive to outliers** (one extreme value changes everything)
- ❌ Ignores all middle values
- ❌ Not useful for statistical inference

---

## 2. Variance

### Definition
**Variance** measures the average squared deviation from the mean. It quantifies how far data points spread from the average.

### Formulas

**Population Variance (σ²):**
```
σ² = Σ(x - μ)² / N
```

**Sample Variance (s²):**
```
s² = Σ(x - x̄)² / (n - 1)
```

Where:
- x = each data value
- μ (or x̄) = mean
- N (or n) = number of values
- (n-1) = degrees of freedom for sample

### Example
Calculate variance for: 4, 8, 6, 10, 7

```
Step 1: Find the mean
x̄ = (4 + 8 + 6 + 10 + 7) / 5 = 35 / 5 = 7

Step 2: Find deviations from mean
4 - 7 = -3
8 - 7 = 1
6 - 7 = -1
10 - 7 = 3
7 - 7 = 0

Step 3: Square the deviations
(-3)² = 9
(1)² = 1
(-1)² = 1
(3)² = 9
(0)² = 0

Step 4: Sum the squared deviations
9 + 1 + 1 + 9 + 0 = 20

Step 5: Divide by (n-1) for sample variance
s² = 20 / (5-1) = 20 / 4 = 5
```

### Key Properties
- Always non-negative (≥ 0)
- Variance = 0 means no variability (all values identical)
- Units are squared (e.g., if data is in cm, variance is in cm²)
- Larger variance = more spread

---

## 3. Standard Deviation

### Definition
**Standard deviation (SD)** is the square root of variance. It's the most commonly used measure of spread.

### Formulas

**Population SD (σ):**
```
σ = √[Σ(x - μ)² / N]
```

**Sample SD (s):**
```
s = √[Σ(x - x̄)² / (n - 1)]
```

### Example
Using the variance from the previous example:

```
Variance (s²) = 5
Standard Deviation (s) = √5 ≈ 2.24
```

### Why Use SD Instead of Variance?
**Same units as original data!**
- Data in cm → SD in cm (not cm²)
- Makes interpretation easier
- More intuitive to understand

### Interpreting Standard Deviation

**Small SD:** Data points cluster close to the mean
```
Data: 10, 11, 10, 9, 10
Mean = 10, SD ≈ 0.71 (very small spread)
```

**Large SD:** Data points spread far from the mean
```
Data: 0, 5, 10, 15, 20
Mean = 10, SD ≈ 7.91 (large spread)
```

### Empirical Rule (for Normal Distributions)
- **68%** of data within 1 SD of mean
- **95%** of data within 2 SD of mean
- **99.7%** of data within 3 SD of mean

### When to Use
- ✅ With **normally distributed** data
- ✅ When you need a measure in **original units**
- ✅ For statistical testing and inference
- ✅ Most widely understood measure

### Limitations
- ❌ **Sensitive to outliers**
- ❌ Less useful with skewed distributions
- ❌ Requires more calculation than range

---

## 4. Interquartile Range (IQR)

### Definition
The **IQR** is the range of the middle 50% of data. It measures the spread of the central portion, ignoring extreme values.

### Formula
```
IQR = Q3 - Q1
```

Where:
- Q1 = First quartile (25th percentile)
- Q3 = Third quartile (75th percentile)

### How to Calculate

**Step 1:** Order the data
**Step 2:** Find the median (Q2)
**Step 3:** Find Q1 (median of lower half)
**Step 4:** Find Q3 (median of upper half)
**Step 5:** Calculate IQR = Q3 - Q1

### Example
Find IQR of: 3, 5, 7, 8, 12, 15, 18, 20, 24

```
Data is already ordered: 3, 5, 7, 8, 12, 15, 18, 20, 24

Median (Q2) = 12

Lower half: 3, 5, 7, 8
Q1 = (5 + 7) / 2 = 6

Upper half: 15, 18, 20, 24
Q3 = (18 + 20) / 2 = 19

IQR = Q3 - Q1 = 19 - 6 = 13
```

### Identifying Outliers with IQR

**Outlier boundaries:**
```
Lower boundary = Q1 - 1.5 × IQR
Upper boundary = Q3 + 1.5 × IQR
```

Any values outside these boundaries are potential outliers.

### When to Use
- ✅ With **skewed** data
- ✅ When data has **outliers**
- ✅ For **robust** measure of spread
- ✅ In **box plots**

### Advantages
- **Resistant to outliers** (uses middle 50% only)
- Works well with any distribution
- Easy to visualize

---

## 5. Comparing Measures of Spread

### Quick Reference Table

| Measure | Formula | Pros | Cons | Best Use |
|---------|---------|------|------|----------|
| **Range** | Max - Min | Simple, quick | Very sensitive to outliers | Initial exploration |
| **Variance** | Average of (x - x̄)² | Uses all data | Squared units, hard to interpret | Statistical calculations |
| **Standard Deviation** | √Variance | Uses all data, original units | Sensitive to outliers | Normal distributions |
| **IQR** | Q3 - Q1 | Resistant to outliers | Ignores extreme values | Skewed data, outliers |

### Relationship Between Measures

**For the same dataset:**
- Range is always ≥ IQR
- Variance = (Standard Deviation)²
- Larger values of any measure = more spread

---

## 6. Real-World Applications

### Scenario 1: Test Scores
**Data:** 85, 88, 90, 92, 95, 97, 98

```
Mean = 92.1
SD = 4.53 (small - scores are consistent)
```

**Interpretation:** Low SD means students performed similarly. Teacher can proceed with confidence.

### Scenario 2: Stock Prices
**Stock A:** Mean = $100, SD = $2 (stable)
**Stock B:** Mean = $100, SD = $15 (volatile)

**Interpretation:** Both stocks average $100, but Stock B has much higher risk (variability).

### Scenario 3: Manufacturing Quality
**Widget lengths:** Mean = 10cm, SD = 0.05cm

**Quality Control Rule:** Parts must be within 2 SD of mean
- Acceptable range: 10 ± 2(0.05) = 9.9cm to 10.1cm
- Parts outside this range are defective

### Scenario 4: Income Distribution
**Data:** $20K, $25K, $30K, $35K, $40K, $500K (outlier!)

```
Mean = $108K (misleading due to outlier)
SD = $190K (inflated by outlier)
IQR = $15K (better representation)
```

**Interpretation:** IQR is more useful here because the billionaire outlier doesn't affect it.

---

## 7. Sample vs. Population

### Population (Entire Group)
- Use **N** in denominator
- Symbol: **σ** (sigma) for SD, **σ²** for variance
- Example: All students in the entire school

### Sample (Subset of Population)
- Use **n-1** in denominator (Bessel's correction)
- Symbol: **s** for SD, **s²** for variance
- Example: 30 randomly selected students

**Why n-1?**
- Corrects for bias in sample estimates
- Provides better estimate of population variance
- Standard practice in statistics

---

## 8. Common Mistakes to Avoid

### ❌ Mistake 1: Using range with outliers
**Problem:** One extreme value makes range meaningless
```
Data: 10, 12, 14, 15, 100
Range = 90 (misleading!)
IQR = 3 (better representation)
```

### ❌ Mistake 2: Confusing variance and standard deviation
**Remember:**
- Variance is **squared units**
- Standard deviation is **original units**
- SD = √variance

### ❌ Mistake 3: Thinking low SD always means "good"
**Context matters!**
- Test scores: Low SD = consistency ✓
- Innovation metrics: Low SD = lack of diversity ✗

### ❌ Mistake 4: Using wrong formula (n vs n-1)
**Sample data:** Use n-1
**Population data:** Use N

---

## 9. Coefficient of Variation (CV)

### Definition
**CV** compares standard deviation to the mean, expressed as a percentage. Useful for comparing variability across different scales.

### Formula
```
CV = (SD / Mean) × 100%
```

### Example
**Dataset A:** Mean = 10, SD = 2
```
CV = (2/10) × 100% = 20%
```

**Dataset B:** Mean = 1000, SD = 20
```
CV = (20/1000) × 100% = 2%
```

**Interpretation:** Even though Dataset B has larger SD, it has LESS relative variability (2% vs 20%).

---

## 10. Practice Problems

### Problem 1
Find the range, variance, and standard deviation of: 5, 8, 10, 12, 15

<details>
<summary>Click for solution</summary>

**Range:** 15 - 5 = 10

**Mean:** (5 + 8 + 10 + 12 + 15) / 5 = 10

**Variance:**
- Deviations: -5, -2, 0, 2, 5
- Squared: 25, 4, 0, 4, 25
- Sum: 58
- s² = 58 / 4 = 14.5

**Standard Deviation:** s = √14.5 ≈ 3.81
</details>

### Problem 2
Two machines produce widgets:
- Machine A: Mean = 100g, SD = 5g
- Machine B: Mean = 100g, SD = 15g

Which machine is more consistent?

<details>
<summary>Click for solution</summary>

**Answer:** Machine A

Both produce widgets averaging 100g, but Machine A has smaller SD (5g vs 15g), meaning its output is more consistent with less variability.
</details>

---

## Key Takeaways

1. **Range** = Quick measure, sensitive to outliers
2. **Variance** = Average squared deviation, hard to interpret
3. **Standard Deviation** = Most common measure, same units as data
4. **IQR** = Resistant to outliers, uses middle 50%
5. Choose measure based on **distribution** and **presence of outliers**
6. Larger values = **more spread/variability**
7. Use **n-1** for sample variance/SD, **N** for population

---

## Additional Resources

- Use the **Statistics Calculator** to automatically calculate all measures
- Take the **Practice Quiz** to test your understanding
- Learn about the **Empirical Rule** for normal distributions

---

**Ready to test your knowledge?** Take the interactive quiz to master measures of deviation!
