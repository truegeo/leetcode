import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  Tag,
  BookOpen,
  Activity,
  Share2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

/**
 * ==========================================================================================
 * DATA INJECTION PLACEHOLDER
 * ==========================================================================================
 * This placeholder will be replaced by a real JSON object by the `update_progress.py` script.
 * The script reads `meta.json` and solution files, aggregates them into a single JSON,
 * and injects it here, making the template fully dynamic.
 */
const problemDataJson = `{
  "problem_number": 1,
  "title": "Two Sum",
  "slug": "two-sum",
  "template": "problem-view",
  "languages": [
    "python",
    "csharp"
  ],
  "created_at": "2025-11-08T17:55:23",
  "solved": true,
  "notes_complete": false,
  "tags": [
    "array",
    "hash-table"
  ],
  "difficulty": "Easy",
  "links": {
    "leetcode": "https://leetcode.com/problems/two-sum/",
    "github": "",
    "discussion": ""
  },
  "statement": "Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.",
  "approach": "My initial thought was a brute-force O(n^2) solution. However, a more optimal approach is to use a hash map (or a Python dictionary) to achieve a single-pass O(n) solution.\\n\\nAs I iterate through the array, for each element \`n\`, I calculate the required complement (\`target - n\`). I then check if this complement already exists as a key in my hash map.\\n- If it exists, I have found the pair, and I can return the index of the complement (stored as the value in the hash map) and the current index.\\n- If it does not exist, I add the current number \`n\` and its index \`i\` to the hash map to be checked against future elements.",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "notes": "",
  "examples": [],
  "code": {
    "python": {
      "user_solution": "class Solution:\\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\\n        for i in range(len(nums)):\\n            if target-nums[i] in nums[i+1:]:\\n                return [i, nums[i+1:].index(target-nums[i])+i+1]",
      "leetcode_solution": "class Solution:\\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\\n        # Hash map to store the value -> index\\n        prev_map = {}  \\n        \\n        for i, n in enumerate(nums):\\n            diff = target - n\\n            # If the difference is in the map, we found the pair\\n            if diff in prev_map:\\n                return [prev_map[diff], i]\\n            # Otherwise, store the current number and its index\\n            prev_map[n] = i\\n        return []"
    },
    "csharp": {
      "user_solution": "// Write your C# solution here\\n",
      "leetcode_solution": "// Write your C# solution here\\n"
    }
  }
}`;

// --- DATA STRUCTURE DEFINITIONS ---

// Defines the structure for code solutions for a single language.
type SolutionSet = {
  user_solution: string;
  leetcode_solution: string;
};

// The main data structure for the entire problem.
// This mirrors the JSON that will be injected.
interface ProblemData {
  problem_number: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  tags: string[];
  languages: string[];
  created_at: string;
  solved: boolean;
  notes_complete: boolean;
  links: {
    leetcode?: string;
    github?: string;
    discussion?: string;
  };
  // The code is now a nested object: language -> solution type -> code string.
  code: Record<string, SolutionSet>;
  // These fields are placeholders for content that would be in the README.md
  // The update script could be extended to parse and inject them.
  statement: string;
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  notes: string;
  examples: { input: string; output: string; explanation?: string }[];
}

// Default boilerplate to show if a solution file is empty.
const defaultBoilerplate = "// Your code solution will appear here.\n// Edit the corresponding file and run the update script.";


export default function ProblemViewTemplate() {
  // Parse the injected JSON data.
  // In a real app, you would add error handling here.
  const data: ProblemData = JSON.parse(problemDataJson);

  const {
    problem_number,
    title,
    difficulty,
    tags,
    links,
    code,
    created_at,
    solved,
    notes_complete,
    statement,
    approach,
    timeComplexity,
    spaceComplexity,
    notes,
    examples
  } = data;
  
  // --- STATE MANAGEMENT ---
  // State to track the currently selected language. Defaults to the first available language.
  const [selectedLang, setSelectedLang] = React.useState<string>(Object.keys(code)[0] || "python");
  // State to toggle between the user's solution and the official LeetCode solution.
  const [solutionType, setSolutionType] = React.useState<"user" | "leetcode">("user");

  // Determine the color for the difficulty badge based on the value.
  const difficultyColor =
    difficulty === "Hard"
      ? "border-red-700 text-red-800"
      : difficulty === "Medium"
      ? "border-yellow-600 text-yellow-800"
      : "border-green-700 text-green-800";
  
  // Format the ISO date string into a more readable format.
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#fafafa] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <motion.header
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="rounded-lg border-4 border-gray-900 bg-white p-6 shadow-[8px_8px_0px_black]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  <span className="inline-block align-middle mr-3 px-3 py-1 bg-gray-900 text-white rounded-sm">
                    #{String(problem_number).padStart(4, "0")}
                  </span>
                  {title}
                </h1>

                {/* DYNAMIC TAGS & DIFFICULTY */}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-700">
                  <span
                    className={`inline-flex items-center gap-2 px-2 py-1 rounded-md font-medium border-2 ${difficultyColor}`}
                  >
                    <Activity size={14} /> {difficulty}
                  </span>
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 text-xs font-semibold bg-gray-100 border-2 border-gray-900 rounded-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* DYNAMIC LINKS */}
              <div className="flex items-center gap-3">
                {links.leetcode && (
                  <a
                    href={links.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 border-2 border-gray-900 rounded-sm bg-gray-900 text-white flex items-center gap-2 hover:bg-gray-700"
                  >
                    <ExternalLink size={14} /> View on LeetCode
                  </a>
                )}
              </div>
            </div>
            
            {/* DYNAMIC PROGRESS INDICATORS */}
            <div className="mt-4 pt-4 border-t-2 border-gray-900 flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className={`flex items-center gap-2 text-sm font-semibold ${solved ? 'text-green-700' : 'text-gray-500'}`}>
                {solved ? <CheckCircle size={16} /> : <XCircle size={16} />}
                Problem Solved
              </div>
              <div className={`flex items-center gap-2 text-sm font-semibold ${notes_complete ? 'text-green-700' : 'text-gray-500'}`}>
                {notes_complete ? <CheckCircle size={16} /> : <XCircle size={16} />}
                Notes Complete
              </div>
               <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={16} />
                Created: {formattedDate}
              </div>
            </div>
          </div>
        </motion.header>

        {/* MAIN CONTENT */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2">
            {/* PROBLEM STATEMENT & COMPLEXITY */}
            <article className="rounded-lg border-4 border-gray-900 bg-white p-6 shadow-lg">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen size={18} /> Problem
              </h2>
              <p className="mt-3 text-gray-800 whitespace-pre-line">
                {statement || "Problem statement not available."}
              </p>
              <hr className="my-4 border-gray-900" />
              <h3 className="text-lg font-semibold">Approach</h3>
              <p className="mt-2 text-gray-700 whitespace-pre-line">
                  {approach || "No approach documented yet."}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded border-2 border-gray-900 p-3 bg-gray-50">
                  <h4 className="text-sm font-semibold">Time Complexity</h4>
                  <p className="text-sm mt-2">{timeComplexity || "N/A"}</p>
                </div>
                <div className="rounded border-2 border-gray-900 p-3 bg-gray-50">
                  <h4 className="text-sm font-semibold">Space Complexity</h4>
                  <p className="text-sm mt-2">{spaceComplexity || "N/A"}</p>
                </div>
              </div>
              <hr className="my-4 border-gray-900" />

              {/* DYNAMIC CODE SECTION */}
              <div className="rounded border-2 border-gray-900 p-4 bg-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  {/* SOLUTION TYPE TOGGLE */}
                  <div className="flex items-center gap-2">
                     <button
                        onClick={() => setSolutionType("user")}
                        className={`px-3 py-1 text-sm font-bold border-2 rounded-sm border-gray-900 ${
                          solutionType === "user" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                        }`}
                      >
                        Your Solution
                      </button>
                      <button
                        onClick={() => setSolutionType("leetcode")}
                        className={`px-3 py-1 text-sm font-bold border-2 rounded-sm border-gray-900 ${
                          solutionType === "leetcode" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                        }`}
                      >
                        LeetCode Solution
                      </button>
                  </div>

                  {/* DYNAMIC LANGUAGE BUTTONS */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {Object.keys(code).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`px-2 py-1 text-xs border-2 rounded-sm ${
                          selectedLang === lang ? "bg-gray-900 text-white" : "bg-white"
                        } border-gray-900`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <pre className="overflow-x-auto p-4 rounded text-sm bg-[#f7f7f7] border-2 border-gray-900">
                  <code>
                    {/* Display the selected code or a default message if empty */}
                    {code[selectedLang]?.[solutionType === "user" ? "user_solution" : "leetcode_solution"] || defaultBoilerplate}
                  </code>
                </pre>
              </div>
            </article>

            {/* NOTES */}
            <motion.section
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-6"
            >
              <div className="rounded-lg border-4 border-gray-900 bg-white p-6 shadow-lg">
                <h3 className="font-bold text-lg">Notes</h3>
                <p className="mt-3 text-gray-700 whitespace-pre-line">
                  {notes || "Add your implementation notes, edge cases, and insights here."}
                </p>
              </div>
            </motion.section>
          </section>

          {/* RIGHT METADATA COLUMN */}
          <aside className="md:col-span-1 space-y-6">
            <div className="rounded-lg border-4 border-gray-900 bg-white p-5 shadow-lg sticky top-6">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <Tag size={16} /> Metadata
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <strong>Status:</strong> {solved ? "Solved" : "In Progress"}
                </li>
                <li>
                  <strong>Difficulty:</strong> {difficulty}
                </li>
                <li>
                  <strong>Languages:</strong>{" "}
                  {Object.keys(code).map((k) => k.toUpperCase()).join(", ")}
                </li>
                 <li>
                  <strong>Created:</strong> {formattedDate}
                </li>
              </ul>
              {/* DYNAMIC QUICK LINKS */}
              <div className="mt-4 border-t-2 border-gray-900 pt-4">
                 <h5 className="font-semibold text-base mb-3">Quick Links</h5>
                 <ul className="text-sm space-y-2">
                   {links.github && (
                     <li><a className="underline hover:text-blue-700" href={links.github}>Edit on GitHub</a></li>
                   )}
                   {links.leetcode && (
                     <li><a className="underline hover:text-blue-700" href={links.leetcode}>View on LeetCode</a></li>
                   )}
                   {links.discussion && (
                     <li><a className="underline hover:text-blue-700" href={links.discussion}>View Discussion</a></li>
                   )}
                 </ul>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}