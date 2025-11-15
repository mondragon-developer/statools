# Probability Calculator Guide
**How to Use the MDragon Probability Calculator**

## Features
The Probability Calculator includes:
1. Basic probability rules
2. Combinatorics (permutations & combinations)
3. Expected value
4. Dice probability simulator

## Module 1: Basic Probability

### Addition Rule
**When to use:** Finding P(A OR B)

**Inputs:**
- P(A): Probability of event A
- P(B): Probability of event B
- P(A and B): Joint probability (if applicable)

**Output:** P(A or B)

**Example:**
P(King) = 4/52, P(Heart) = 13/52, P(King∩Heart) = 1/52
Result: P(King or Heart) = 16/52

### Multiplication Rule
**When to use:** Finding P(A AND B)

**Types:**
- Independent: P(A) × P(B)
- Dependent: P(A) × P(B|A)

## Module 2: Combinatorics

### Permutations (nPr)
**When to use:** Order matters
**Formula:** n!/(n-r)!

**Example:** 3-digit codes from 9 numbers
Input: n=9, r=3
Result: 504 codes

### Combinations (nCr)
**When to use:** Order doesn't matter
**Formula:** n!/(r!×(n-r)!)

**Example:** Choose 3 people from 10
Input: n=10, r=3
Result: 120 committees

## Module 3: Expected Value

**When to use:** Finding average outcome
**Formula:** E(X) = Σ[x × P(x)]

**Example:** Game where you win $10 (p=0.3) or $0 (p=0.7)
E(X) = 10(0.3) + 0(0.7) = $3

## Module 4: Dice Simulator

**Features:**
- Roll 1-6 dice
- Calculate probability of sums
- Visualize distribution

**Example:** Probability of rolling 7 with 2 dice
Result: 6/36 = 16.67%

---
