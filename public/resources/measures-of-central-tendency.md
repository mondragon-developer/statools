# Measures of Central Tendency

## Introduction

Measures of central tendency are statistical values that describe the center or typical value of a dataset. The three main measures are the **mean**, **median**, and **mode**. Understanding when and how to use each measure is essential for accurately describing and analyzing data.

---

## 1. The Mean (Average)

### Definition
The **mean** is the arithmetic average of all values in a dataset.

### Formula
```
Mean (x̄) = (Sum of all values) / (Number of values)
         = (x₁ + x₂ + ... + xₙ) / n
```

### Example
Calculate the mean of: 4, 8, 6, 5, 3, 7

```
Mean = (4 + 8 + 6 + 5 + 3 + 7) / 6
     = 33 / 6
     = 5.5
```

###When to Use
- ✅ When data is **normally distributed** (bell curve)
- ✅ When you need to use **all data values**
- ✅ For **interval or ratio data**

### When NOT to Use
- ❌ When data has **outliers** (extreme values)
- ❌ When data is **skewed** (not symmetric)
- ❌ With **ordinal or categorical data**

### Key Properties
- Uses every data value in its calculation
- Sensitive to extreme values (outliers)
- Can be a value that doesn't exist in the dataset
- Most commonly used measure

---

## 2. The Median

### Definition
The **median** is the middle value when data is arranged in order. Half the values are above it, half are below.

### How to Calculate

**For ODD number of values:**
1. Arrange data in ascending order
2. Find the middle value

**For EVEN number of values:**
1. Arrange data in ascending order
2. Find the two middle values
3. Calculate their average

### Example 1 (Odd): Find median of: 12, 15, 8, 19, 22, 10, 13

```
Step 1: Order the data
8, 10, 12, 13, 15, 19, 22

Step 2: Find middle value (position 4)
Median = 13
```

### Example 2 (Even): Find median of: 2, 5, 7, 10

```
Step 1: Order the data
2, 5, 7, 10

Step 2: Find two middle values
Middle values: 5 and 7

Step 3: Calculate average
Median = (5 + 7) / 2 = 6
```

### When to Use
- ✅ When data has **outliers**
- ✅ When data is **skewed**
- ✅ With **ordinal data** (ranked categories)
- ✅ When you need a **resistant measure**

### Key Properties
- Resistant to outliers
- Only depends on position, not actual values
- Always a real data value (for odd n) or average of two values (for even n)
- Better represents "typical" value in skewed distributions

---

## 3. The Mode

### Definition
The **mode** is the value that appears most frequently in a dataset.

### Types of Distributions by Mode
- **Unimodal**: One mode
- **Bimodal**: Two modes
- **Multimodal**: More than two modes
- **No mode**: All values occur equally (or all unique)

### Example 1 (Unimodal)
Dataset: 5, 8, 8, 12, 15, 8, 20

```
Value 8 appears 3 times (most frequent)
Mode = 8
```

### Example 2 (Bimodal)
Dataset: 2, 3, 3, 4, 5, 5, 6

```
Values 3 and 5 both appear twice
Modes = 3 and 5 (bimodal)
```

### Example 3 (No Mode)
Dataset: 1, 2, 3, 4, 5

```
All values appear once
No mode
```

### When to Use
- ✅ With **categorical data** (colors, categories)
- ✅ To find the **most common value**
- ✅ When frequency matters more than magnitude
- ✅ With **any type of data**

### Key Properties
- Only measure that works with categorical data
- Can have multiple modes or no mode
- Not affected by extreme values
- May not be near the center of the distribution

---

## 4. Comparing Mean, Median, and Mode

### Relationship in Different Distributions

**Symmetric Distribution (Normal)**
```
Mean = Median = Mode
```
All three measures give the same value.

**Right-Skewed Distribution**
```
Mode < Median < Mean
```
The mean is pulled toward the high values (right tail).

**Left-Skewed Distribution**
```
Mean < Median < Mode
```
The mean is pulled toward the low values (left tail).

### Quick Reference Table

| Feature | Mean | Median | Mode |
|---------|------|--------|------|
| **Formula** | Sum ÷ Count | Middle value | Most frequent |
| **Data Type** | Numerical only | Ordinal/Numerical | Any type |
| **Affected by outliers** | Yes | No | No |
| **Unique value** | Always | Always | Not always |
| **Uses all data** | Yes | No | No |

---

## 5. Real-World Applications

### Scenario 1: Test Scores
**Data:** 85, 88, 90, 92, 95, 97, 98

- **Best measure:** Mean (data is normally distributed, no outliers)
- Mean = 92.1 ← Use this!
- Median = 92
- Mode = None

### Scenario 2: House Prices
**Data:** $200K, $220K, $230K, $240K, $2.5M

- **Best measure:** Median (extreme outlier: $2.5M mansion)
- Mean = $678K ← Misleading!
- Median = $230K ← Better representation
- Mode = None

### Scenario 3: Shoe Sizes Sold
**Data:** 7, 7, 8, 8, 8, 9, 9, 10

- **Best measure:** Mode (finding most common size)
- Mean = 8.25 (not a real shoe size)
- Median = 8
- Mode = 8 ← Most useful!

---

## 6. Common Mistakes to Avoid

### ❌ Mistake 1: Using mean with skewed data
**Problem:** Income data with billionaires
- Mean income = $500,000 (misleading!)
- Median income = $50,000 (better)

### ❌ Mistake 2: Forgetting to order data for median
**Wrong:** Find median of 5, 2, 9, 3
- Middle of 5, 2, 9, 3 = average of 2 and 9 = 5.5 ❌

**Correct:** Order first!
- 2, 3, 5, 9 → Median = (3 + 5) / 2 = 4 ✅

### ❌ Mistake 3: Assuming mode is always near center
Mode can be anywhere in the distribution! It's about frequency, not position.

---

## 7. Practice Problems

### Problem 1
Find mean, median, and mode of: 10, 15, 12, 10, 20, 18, 10

<details>
<summary>Click for solution</summary>

**Mean:** (10 + 15 + 12 + 10 + 20 + 18 + 10) / 7 = 95 / 7 = 13.57

**Median:** Order: 10, 10, 10, 12, 15, 18, 20 → Middle = 12

**Mode:** 10 (appears 3 times)
</details>

### Problem 2
Which measure is best for describing typical salary in a company with one CEO making $5M and 100 employees making $40K-$60K?

<details>
<summary>Click for solution</summary>

**Answer:** Median

The CEO's $5M salary is an extreme outlier that would inflate the mean. The median better represents the "typical" employee salary.
</details>

---

## Key Takeaways

1. **Mean** = arithmetic average, uses all data, sensitive to outliers
2. **Median** = middle value, resistant to outliers, best for skewed data
3. **Mode** = most frequent value, works with any data type
4. Choose the measure based on your data's **distribution** and **purpose**
5. In symmetric distributions, all three measures are similar
6. In skewed distributions, median is usually preferred

---

## Additional Resources

- Use the **Statistics Calculator** on our website to automatically calculate all three measures
- Take the **Practice Quiz** to test your understanding
- Download the **Statistical Tables Cheat Sheet** for quick reference

---

**Ready to test your knowledge?** Take the interactive quiz to reinforce these concepts!
