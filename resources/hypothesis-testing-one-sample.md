# Hypothesis Testing: One Sample
**MDragon Data Tools - Study Guide**

## What is Hypothesis Testing?
A statistical method to make decisions about population parameters based on sample data.

## The Five-Step Process

### Step 1: State Hypotheses
- **H₀ (Null Hypothesis)**: Status quo, no effect, equality (=)
- **Hₐ (Alternative Hypothesis)**: What we're trying to prove (≠, <, >)

### Step 2: Choose Significance Level
- **α (alpha)**: Probability of Type I error
- Common: α = 0.05, 0.01, 0.10

### Step 3: Calculate Test Statistic
**Z-test (σ known, n ≥ 30):**
```
z = (x̄ - μ₀) / (σ / √n)
```

**T-test (σ unknown, small n):**
```
t = (x̄ - μ₀) / (s / √n)
df = n - 1
```

### Step 4: Find P-Value or Critical Value
- **Two-tailed**: Hₐ: μ ≠ μ₀
- **Right-tailed**: Hₐ: μ > μ₀
- **Left-tailed**: Hₐ: μ < μ₀

### Step 5: Make Decision
- **If p-value ≤ α**: Reject H₀
- **If p-value > α**: Fail to reject H₀

## Example 1: Right-Tailed Z-Test
**Problem:** A company claims their product weighs 500g on average (σ = 20g). A sample of 40 products has x̄ = 508g. Test at α = 0.05.

**Solution:**
1. H₀: μ = 500; Hₐ: μ > 500 (right-tailed)
2. α = 0.05
3. z = (508 - 500) / (20/√40) = 8 / 3.16 = 2.53
4. p-value = P(Z > 2.53) = 0.0057
5. 0.0057 < 0.05, **Reject H₀**

**Conclusion:** Significant evidence that mean weight exceeds 500g.

## Example 2: Two-Tailed T-Test
**Problem:** Test if mean = 75 when sample of n=16 has x̄=78, s=8, α=0.05.

**Solution:**
1. H₀: μ = 75; Hₐ: μ ≠ 75
2. α = 0.05
3. t = (78-75)/(8/√16) = 3/2 = 1.5, df=15
4. p-value = 2×P(T>1.5) ≈ 0.155
5. 0.155 > 0.05, **Fail to reject H₀**

**Conclusion:** No significant evidence that mean differs from 75.

## Type I and Type II Errors
| Decision | H₀ True | H₀ False |
|----------|---------|----------|
| Reject H₀ | **Type I Error (α)** | Correct! |
| Fail to Reject | Correct! | **Type II Error (β)** |

---
*Practice with our Hypothesis Test Calculator!*
