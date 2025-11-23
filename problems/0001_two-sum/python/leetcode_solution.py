class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Hash map to store the value -> index
        prev_map = {}  
        
        for i, n in enumerate(nums):
            diff = target - n
            # If the difference is in the map, we found the pair
            if diff in prev_map:
                return [prev_map[diff], i]
            # Otherwise, store the current number and its index
            prev_map[n] = i
        return []