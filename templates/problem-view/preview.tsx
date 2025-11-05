import React from "react";
import { createRoot } from "react-dom/client";
import { ProblemViewTemplate } from ".";

const App = () => (
  <ProblemViewTemplate
    number={1}
    title="Two Sum"
    difficulty="Easy"
    tags={["Array", "Hash Table"]}
    approach="Use a hash map to store visited values and check for the complement."
    notes="This is a classic problem testing understanding of hash maps."
    links={{
      leetcode: "https://leetcode.com/problems/two-sum/",
      github: "https://github.com/yourusername/leetcode",
    }}
    examples={[
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "2 + 7 = 9",
      },
    ]}
  />
);

createRoot(document.getElementById("root")!).render(<App />);