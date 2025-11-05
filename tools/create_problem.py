import os
import sys
import json
import shutil
from datetime import datetime

# Path to the configuration file, located in the 'tools' directory.
CONFIG_PATH = os.path.join("tools", "config.json")

def load_config():
    """Loads the language configuration from config.json."""
    if not os.path.exists(CONFIG_PATH):
        print(f"❌ Error: Config file not found at {CONFIG_PATH}")
        print("Please run 'python tools/add_language.py' to create one.")
        sys.exit(1)
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def normalize_title(title: str) -> str:
    """Converts a problem title into a URL-friendly and filesystem-safe slug."""
    return title.lower().replace(" ", "-").strip()

def create_problem_folder(problem_number, problem_title, template_name="problem-view"):
    """
    Scaffolds the complete directory and file structure for a new coding problem.
    """
    safe_title = normalize_title(problem_title)
    # Pad the problem number to four digits for consistent sorting.
    folder_name = f"{int(problem_number):04d}_{safe_title}"

    base_path = os.path.join("problems", folder_name)
    os.makedirs(base_path, exist_ok=True)

    print(f"📂 Creating problem folder: {base_path}")

    # --- 1. Create README.md with basic structure ---
    readme_path = os.path.join(base_path, "README.md")
    if not os.path.exists(readme_path):
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(f"# {problem_number}. {problem_title}\n\n")
            f.write("## Problem Description\n\n(Add the problem statement here.)\n\n")
            f.write("## Approach\n\n(Describe your thought process.)\n\n")
            f.write("## Complexity\n\n- **Time:** O(...)\n- **Space:** O(...)\n")
        print("📝 Created README.md")

    # --- 2. Create language-specific folders and solution files ---
    config = load_config()
    supported_languages = config["languages"]
    for lang, details in supported_languages.items():
        lang_dir = os.path.join(base_path, lang)
        os.makedirs(lang_dir, exist_ok=True)

        # Create both user and LeetCode solution files with boilerplate.
        for solution_type in ["user_solution", "leetcode_solution"]:
            file_path = os.path.join(lang_dir, f"{solution_type}.{details['ext']}")
            if not os.path.exists(file_path):
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(details["boilerplate"])
                print(f"   - 💻 Created {file_path}")

    # --- 3. Copy the UI template from the main /templates directory ---
    templates_dir = os.path.join("templates", template_name)
    if os.path.exists(templates_dir):
        ui_folder = os.path.join(base_path, "ui")
        # Ensure a clean copy by removing the old one if it exists.
        if os.path.exists(ui_folder):
            shutil.rmtree(ui_folder)
        shutil.copytree(templates_dir, ui_folder)
        print(f"🎨 Copied UI template '{template_name}' to {ui_folder}")
    else:
        print(f"⚠️ Warning: Template '{template_name}' not found, skipping UI files.")

    # --- 4. Create a complete meta.json file ---
    meta_path = os.path.join(base_path, "meta.json")
    metadata = {
        "problem_number": int(problem_number),
        "title": problem_title,
        "slug": safe_title,
        "template": template_name,
        "languages": list(supported_languages.keys()),
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "solved": False,
        "notes_complete": False,
        "tags": [],
        "difficulty": "Easy",
        "links": {
            "leetcode": "",
            "github": "",
            "discussion": ""
        }
    }

    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4)

    print(f"🗂️  Created metadata file: {meta_path}")
    print(f"\n✅ Problem setup complete for: #{problem_number} - {problem_title}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("\nUsage: python tools/create_problem.py <problem_number> \"<problem_title>\" [template_name]")
        print("Example: python tools/create_problem.py 1 \"Two Sum\"")
        print("Note: Remember to wrap the problem title in quotes if it contains spaces.")
        sys.exit(1)
    
    problem_number = sys.argv[1]
    problem_title = sys.argv[2]
    # The template name is optional and defaults to 'problem-view'.
    template_name = sys.argv[3] if len(sys.argv) > 3 else "problem-view"
    
    create_problem_folder(problem_number, problem_title, template_name)