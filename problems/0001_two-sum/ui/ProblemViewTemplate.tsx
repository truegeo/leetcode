import React from "react";
import { motion } from "framer-motion";
import { Code, Tag, BookOpen, Activity, Share2, ExternalLink } from "lucide-react";

/**
 * ProblemViewTemplate
 * A neobrutalist UI template for documenting coding problems.
 * Built with TailwindCSS, Framer Motion, and Lucide icons.
 */

export type LanguageKey = "python" | "csharp" | "typescript" | "cpp" | string;

export interface ProblemViewProps {
  number?: number;
  title?: string;
  difficulty?: "Easy" | "Medium" | "Hard" | string;
  tags?: string[];
  statement?: string;
  approach?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  code?: Record<LanguageKey, string>;
  notes?: string;
  examples?: { input: string; output: string; explanation?: string }[];
  links?: { github?: string; leetcode?: string; discussion?: string };
}

const defaultCode: Record<LanguageKey, string> = {
  python: `class Solution:\n    def twoSum(self, nums, target):\n        lookup = {}\n        for i, n in enumerate(nums):\n            if target - n in lookup:\n                return [lookup[target - n], i]\n            lookup[n] = i`,
  csharp: `public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        var map = new Dictionary<int,int>();\n        for(int i=0;i<nums.Length;i++){\n            int comp = target - nums[i];\n            if(map.ContainsKey(comp)) return new[]{map[comp], i};\n            map[nums[i]] = i;\n        }\n        return null;\n    }\n}`,
  typescript: `export function twoSum(nums:number[], target:number): number[] {\n    const map = new Map<number, number>();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) return [map.get(comp)!, i];\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
};

export default function ProblemViewTemplate(props: ProblemViewProps) {
  const {
    number = 1,
    title = "Two Sum",
    difficulty = "Easy",
    tags = ["array", "hash-table"],
    statement = "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    approach = "",
    timeComplexity = "O(n)",
    spaceComplexity = "O(n)",
    code = defaultCode,
    notes = "",
    examples = [],
    links = {},
  } = props;

  const [selectedLang, setSelectedLang] = React.useState<LanguageKey>(
    Object.keys(code)[0] || "python"
  );

  const difficultyColor =
    difficulty === "Hard"
      ? "border-red-700 text-red-800"
      : difficulty === "Medium"
      ? "border-yellow-600 text-yellow-800"
      : "border-green-700 text-green-800";

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
                    #{String(number).padStart(4, "0")}
                  </span>
                  {title}
                </h1>

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

              <div className="flex items-center gap-3">
                <button className="px-3 py-2 border-2 border-gray-900 rounded-sm bg-white hover:bg-gray-100 flex items-center gap-2">
                  <Share2 size={14} /> Share
                </button>
                {links.leetcode && (
                  <a
                    href={links.leetcode}
                    target="_blank"
                    className="px-3 py-2 border-2 border-gray-900 rounded-sm bg-gray-900 text-white flex items-center gap-2"
                  >
                    <ExternalLink size={14} /> View on LeetCode
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        {/* MAIN */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <section className="md:col-span-2">
            {/* PROBLEM */}
            <article className="rounded-lg border-4 border-gray-900 bg-white p-6 shadow-lg">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen size={18} /> Problem
              </h2>
              <p className="mt-3 text-gray-800 whitespace-pre-line">
                {statement}
              </p>

              <hr className="my-4 border-gray-900" />

              <h3 className="text-lg font-semibold">Approach</h3>
              {approach ? (
                <p className="mt-2 text-gray-700 whitespace-pre-line">
                  {approach}
                </p>
              ) : (
                <p className="mt-2 text-gray-500 italic">
                  Add your reasoning and method here.
                </p>
              )}

              {/* COMPLEXITY */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded border-2 border-gray-900 p-3 bg-gray-50">
                  <h4 className="text-sm font-semibold">Time Complexity</h4>
                  <p className="text-sm mt-2">{timeComplexity}</p>
                </div>
                <div className="rounded border-2 border-gray-900 p-3 bg-gray-50">
                  <h4 className="text-sm font-semibold">Space Complexity</h4>
                  <p className="text-sm mt-2">{spaceComplexity}</p>
                </div>
              </div>

              <hr className="my-4 border-gray-900" />

              {/* CODE SECTION */}
              <div className="rounded border-2 border-gray-900 p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Code size={16} /> <strong>Solution</strong>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {Object.keys(code).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`px-2 py-1 text-xs border-2 rounded-sm ${
                          selectedLang === lang
                            ? "bg-gray-900 text-white"
                            : "bg-white"
                        } border-gray-900`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <pre
                  className="overflow-x-auto p-4 rounded text-sm bg-[#f7f7f7] border-2 border-gray-900"
                  style={{
                    whiteSpace: "pre",
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace',
                  }}
                >
{code[selectedLang]}
                </pre>
              </div>

              {/* EXAMPLES */}
              {examples.length > 0 && (
                <>
                  <hr className="my-4 border-gray-900" />
                  <h3 className="text-lg font-semibold">Examples</h3>
                  <div className="mt-3 space-y-3">
                    {examples.map((ex, i) => (
                      <div
                        key={i}
                        className="p-3 border-2 border-gray-900 rounded bg-gray-50"
                      >
                        <div className="text-sm font-semibold">Input</div>
                        <pre className="text-xs mt-2 p-2 bg-white border rounded">
                          {ex.input}
                        </pre>
                        <div className="text-sm font-semibold mt-2">Output</div>
                        <pre className="text-xs mt-2 p-2 bg-white border rounded">
                          {ex.output}
                        </pre>
                        {ex.explanation && (
                          <p className="mt-2 text-sm text-gray-700">
                            {ex.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
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
                  {notes ||
                    "Add your implementation notes, edge cases, and insights here."}
                </p>
              </div>
            </motion.section>
          </section>

          {/* RIGHT COLUMN */}
          <aside className="md:col-span-1 space-y-6">
            <div className="rounded-lg border-4 border-gray-900 bg-white p-5 shadow-lg sticky top-6">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <Tag size={16} /> Metadata
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <strong>Problem:</strong> #{String(number).padStart(4, "0")} —{" "}
                  {title}
                </li>
                <li>
                  <strong>Difficulty:</strong> {difficulty}
                </li>
                <li>
                  <strong>Languages:</strong>{" "}
                  {Object.keys(code)
                    .map((k) => k.toUpperCase())
                    .join(", ")}
                </li>
                <li>
                  <strong>Last updated:</strong>{" "}
                  {new Date().toLocaleDateString()}
                </li>
              </ul>

              <div className="mt-4 border-t-2 border-gray-900 pt-4">
                <button className="w-full px-3 py-2 border-2 border-gray-900 rounded-sm mb-2">
                  Run tests
                </button>
                <button className="w-full px-3 py-2 border-2 border-gray-900 rounded-sm bg-gray-900 text-white">
                  Download
                </button>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="p-4 rounded-lg border-4 border-gray-900 bg-white shadow-lg">
              <h5 className="font-semibold">Quick Links</h5>
              <ul className="mt-3 text-sm space-y-2">
                {links.github && (
                  <li>
                    <a
                      className="underline hover:text-gray-700"
                      href={links.github}
                    >
                      Edit on GitHub
                    </a>
                  </li>
                )}
                {links.leetcode && (
                  <li>
                    <a
                      className="underline hover:text-gray-700"
                      href={links.leetcode}
                    >
                      LeetCode Problem
                    </a>
                  </li>
                )}
                {links.discussion && (
                  <li>
                    <a
                      className="underline hover:text-gray-700"
                      href={links.discussion}
                    >
                      Discussion / Notes
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
