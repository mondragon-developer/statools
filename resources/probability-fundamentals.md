# Probability Fundamentals
**MDragon Data Tools - Study Guide**

---

## Table of Contents
1. Basic Probability Concepts
2. Probability Rules
3. Counting Techniques
4. Step-by-Step Examples
5. Practice Problems

---

## 1. Basic Probability Concepts

### What is Probability?
Probability measures the likelihood of an event occurring, ranging from 0 (impossible) to 1 (certain).

**Formula:**
```
P(Event) = Number of favorable outcomes / Total number of possible outcomes
```

### Key Terms
- **Experiment**: A process that produces outcomes
- **Sample Space (S)**: All possible outcomes
- **Event (E)**: A subset of the sample space
- **Complement (E')**: All outcomes NOT in E

---

## 2. Probability Rules

### Addition Rule
For mutually exclusive events A and B:
```
P(A or B) = P(A) + P(B)
```

For non-mutually exclusive events:
```
P(A or B) = P(A) + P(B) - P(A and B)
```

### Multiplication Rule
For independent events A and B:
```
P(A and B) = P(A) × P(B)
```

For dependent events:
```
P(A and B) = P(A) × P(B|A)
```

### Complement Rule
```
P(E') = 1 - P(E)
```

---

## 3. Counting Techniques

### Permutations (Order Matters)
```
nPr = n! / (n - r)!
```
where n = total items, r = items selected

### Combinations (Order Doesn't Matter)
```
nCr = n! / (r! × (n - r)!)
```

---

## 4. Step-by-Step Examples

### Example 1: Simple Probability
**Problem:** What is the probability of rolling a 4 on a fair six-sided die?

**Solution:**
1. Identify favorable outcomes: {4} → 1 outcome
2. Identify total possible outcomes: {1, 2, 3, 4, 5, 6} → 6 outcomes
3. Apply formula:
   ```
   P(rolling 4) = 1/6 ≈ 0.167 or 16.7%
   ```

**Answer:** 0.167 or 16.7%

---

### Example 2: Addition Rule (Mutually Exclusive)
**Problem:** A card is drawn from a standard deck. What is the probability of drawing a King OR a Queen?

**Solution:**
1. P(King) = 4/52 = 1/13
2. P(Queen) = 4/52 = 1/13
3. These events are mutually exclusive (can't draw both at once)
4. Apply addition rule:
   ```
   P(King or Queen) = P(King) + P(Queen)
                     = 1/13 + 1/13
                     = 2/13 ≈ 0.154
   ```

**Answer:** 2/13 or approximately 15.4%

---

### Example 3: Addition Rule (Non-Mutually Exclusive)
**Problem:** A card is drawn from a standard deck. What is the probability of drawing a Heart OR a King?

**Solution:**
1. P(Heart) = 13/52 = 1/4
2. P(King) = 4/52 = 1/13
3. P(Heart AND King) = 1/52 (King of Hearts)
4. These events are NOT mutually exclusive
5. Apply general addition rule:
   ```
   P(Heart or King) = P(Heart) + P(King) - P(Heart and King)
                    = 13/52 + 4/52 - 1/52
                    = 16/52 = 4/13 ≈ 0.308
   ```

**Answer:** 4/13 or approximately 30.8%

---

### Example 4: Multiplication Rule (Independent Events)
**Problem:** You flip a fair coin twice. What is the probability of getting heads both times?

**Solution:**
1. P(Heads on first flip) = 1/2
2. P(Heads on second flip) = 1/2
3. Flips are independent
4. Apply multiplication rule:
   ```
   P(Heads AND Heads) = P(Heads) × P(Heads)
                       = 1/2 × 1/2
                       = 1/4 = 0.25
   ```

**Answer:** 0.25 or 25%

---

### Example 5: Complement Rule
**Problem:** The probability of rain tomorrow is 0.35. What is the probability of NO rain?

**Solution:**
1. P(Rain) = 0.35
2. Apply complement rule:
   ```
   P(No Rain) = 1 - P(Rain)
              = 1 - 0.35
              = 0.65
   ```

**Answer:** 0.65 or 65%

---

### Example 6: Combinations
**Problem:** A committee of 3 people must be selected from a group of 8. How many different committees are possible?

**Solution:**
1. n = 8 (total people)
2. r = 3 (people selected)
3. Order doesn't matter (combination)
4. Apply combination formula:
   ```
   8C3 = 8! / (3! × 5!)
       = (8 × 7 × 6) / (3 × 2 × 1)
       = 336 / 6
       = 56
   ```

**Answer:** 56 different committees

---

### Example 7: Permutations
**Problem:** How many different 3-digit lock codes can be created using digits 1-9 without repetition?

**Solution:**
1. n = 9 (available digits)
2. r = 3 (digits in code)
3. Order matters (permutation)
4. Apply permutation formula:
   ```
   9P3 = 9! / (9 - 3)!
       = 9! / 6!
       = 9 × 8 × 7
       = 504
   ```

**Answer:** 504 different codes

---

## 5. Practice Problems

### Problem 1
A bag contains 5 red marbles, 3 blue marbles, and 2 green marbles. What is the probability of randomly selecting a blue marble?

### Problem 2
What is the probability of rolling a sum of 7 with two fair dice?

### Problem 3
A student takes two exams. The probability of passing the first is 0.8 and passing the second is 0.7. If the exams are independent, what is the probability of passing both?

### Problem 4
In a class of 30 students, 18 are female. A committee of 4 students is randomly selected. How many different committees are possible?

### Problem 5
A password must contain 4 letters followed by 2 digits. Letters can be any of 26 letters (case-insensitive) and digits 0-9, with repetition allowed. How many different passwords are possible?

---

## Answers to Practice Problems

1. **3/10 or 0.3** (3 blue out of 10 total marbles)
2. **1/6 or 0.167** (6 ways to roll 7 out of 36 total combinations)
3. **0.56** (0.8 × 0.7 = 0.56)
4. **27,405** (30C4 = 30!/(4!×26!))
5. **45,697,600** (26^4 × 10^2)

---

## Quick Reference Formulas

| Concept | Formula |
|---------|---------|
| Basic Probability | P(E) = favorable/total |
| Complement | P(E') = 1 - P(E) |
| Addition (Mutually Exclusive) | P(A or B) = P(A) + P(B) |
| Addition (General) | P(A or B) = P(A) + P(B) - P(A and B) |
| Multiplication (Independent) | P(A and B) = P(A) × P(B) |
| Permutation | nPr = n!/(n-r)! |
| Combination | nCr = n!/(r!×(n-r)!) |

---

*For more practice, use our Probability Calculator at MDragon Data Tools*
