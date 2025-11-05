import os
from textwrap import dedent

# === CONFIGURABLE PARAMETERS ===
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

# === CORE UTILITIES ===
def create_file(path: str, content: str):
    """Create a file with default content if it doesn't exist."""
    if not os.path.exists(path):
        with open(path, "w", encoding="utf-8") as f:
            f.write(dedent(content).strip() + "\n")
        print(f"✅ Created: {path}")
    else:
        print(f"⚠️ Skipped (already exists): {path}")

def update_templates_readme(template_name: str, description: str):
    """Add template info to templates/README.md if not already listed."""
    readme_path = os.path.join(TEMPLATES_DIR, "README.md")
    if not os.path.exists(readme_path):
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write("# Templates\n\nThis folder contains reusable UI templates for documenting LeetCode problems.\n\n")

    with open(readme_path, "r+", encoding="utf-8") as f:
        content = f.read()
        entry = f"- **{template_name}/** → {description}\n"
        if entry not in content:
            f.write(entry)
            print(f"📝 Added to README: {template_name}")
        else:
            print(f"⚠️ Template already documented in README: {template_name}")

# === TEMPLATE CREATION LOGIC ===
def create_template(template_name: str, component_name: str, description: str):
    """Create a new template folder and base files."""
    template_dir = os.path.join(TEMPLATES_DIR, template_name)
    os.makedirs(template_dir, exist_ok=True)
    print(f"📁 Ensured folder exists: {template_dir}")

    # --- Component file ---
    component_content = f"""
    import React from "react";
    import {{ motion }} from "framer-motion";

    interface {component_name}Props {{
      title: string;
      number: number;
      difficulty?: "Easy" | "Medium" | "Hard";
      description?: string;
      codeSamples?: {{ language: string; code: string }}[];
      complexity?: {{ time: string; space: string }};
      notes?: string;
    }}

    const {component_name}: React.FC<{component_name}Props> = ({{
      title,
      number,
      difficulty = "Medium",
      description,
      codeSamples = [],
      complexity,
      notes,
    }}) => {{
      return (
        <div className="min-h-screen bg-gray-100 text-gray-900 font-mono p-8">
          <motion.div
            className="max-w-4xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_black] rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold mb-2">
              #{{number}} — {{title}}
            </h1>
            <span className="px-3 py-1 bg-black text-white rounded text-sm uppercase">
              {{difficulty}}
            </span>

            {{description && (
              <p className="mt-6 text-lg leading-relaxed">{{description}}</p>
            )}}

            {{codeSamples.length > 0 && (
              <div className="mt-8 space-y-4">
                {{codeSamples.map((sample, i) => (
                  <div key={{i}}>
                    <h3 className="font-bold text-lg mb-2">{{sample.language}}</h3>
                    <pre className="bg-gray-900 text-green-200 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{{sample.code}}</code>
                    </pre>
                  </div>
                ))}}
              </div>
            )}}

            {{complexity && (
              <div className="mt-6 text-sm text-gray-700">
                <strong>Time:</strong> {{complexity.time}} | <strong>Space:</strong> {{complexity.space}}
              </div>
            )}}

            {{notes && (
              <div className="mt-6 border-t-2 border-black pt-4 text-gray-700">
                <h3 className="font-bold mb-2">Notes</h3>
                <p>{{notes}}</p>
              </div>
            )}}
          </motion.div>
        </div>
      );
    }};

    export default {component_name};
    """
    create_file(os.path.join(template_dir, f"{component_name}.tsx"), component_content)

    # --- index.ts ---
    index_content = f'export {{ default as {component_name} }} from "./{component_name}";'
    create_file(os.path.join(template_dir, "index.ts"), index_content)

    # --- preview.tsx (FIXED using triple quotes without f-string formatting) ---
    preview_content = dedent("""\
    import React from "react";
    import { createRoot } from "react-dom/client";
    import { PLACEHOLDER_COMPONENT } from ".";

    const App = () => (
      <PLACEHOLDER_COMPONENT
        title="Two Sum"
        number={1}
        difficulty="Easy"
        description="Given an array of integers, return indices of the two numbers that add up to a target."
        codeSamples={[
          { language: "Python", code: "def twoSum(nums, target):\\n    ..." },
          { language: "C#", code: "public int[] TwoSum(int[] nums, int target) { ... }" },
        ]}
        complexity={{ time: "O(n)", space: "O(n)" }}
        notes="Use a hash map for constant-time lookups."
      />
    );

    const root = createRoot(document.getElementById("root")!);
    root.render(<App />);
    """).replace("PLACEHOLDER_COMPONENT", component_name)

    create_file(os.path.join(template_dir, "preview.tsx"), preview_content)

    # --- Update README ---
    update_templates_readme(template_name, description)

# === MAIN ENTRY ===
if __name__ == "__main__":
    print("🧩 Create a new UI template\n")

    template_name = input("Enter folder name (e.g., problem-view, problem-list): ").strip()
    component_name = input("Enter React component name (e.g., ProblemViewTemplate): ").strip()
    description = input("Short description: ").strip()

    create_template(template_name, component_name, description)
    print("\n🎉 Template creation complete!")
