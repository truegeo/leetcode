# 1. Two Sum

## Problem Description

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

## Approach

My initial thought was a brute-force O(n^2) solution. However, a more optimal approach is to use a hash map (or a Python dictionary) to achieve a single-pass O(n) solution.

As I iterate through the array, for each element `n`, I calculate the required complement (`target - n`). I then check if this complement already exists as a key in my hash map.
- If it exists, I have found the pair, and I can return the index of the complement (stored as the value in the hash map) and the current index.
- If it does not exist, I add the current number `n` and its index `i` to the hash map to be checked against future elements.

## Complexity

- **Time:** O(n)
- **Space:** O(n)