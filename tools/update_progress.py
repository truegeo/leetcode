import os
import sys
import json
from datetime import datetime
from typing import Optional

# Define base directories for clarity and easy modification.
PROBLEMS_DIR = "problems"
TEMPLATES_DIR = "templates"

def find_problem_folder(problem_number: str) -> Optional[str]:
    """
    Finds the full path to a problem's folder using its number.
    The number is padded to four digits to match the folder naming convention.
    """
    padded_number = f"{int(problem_number):04d}"
    for folder_name in os.listdir(PROBLEMS_DIR):
        if folder_name.startswith(padded_number):
            return os.path.join(PROBLEMS_DIR, folder_name)
    return None

def read_file_content(file_path: str, default_content: str = "") -> str:
    """Safely reads the content of a file. Returns default content if file doesn't exist."""
    if not os.path.exists(file_path):
        return default_content
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def update_problem(problem_number: str, updates: dict):
    """
    The main function to update a problem's metadata and rebuild its UI template.
    """
    problem_folder = find_problem_folder(problem_number)
    if not problem_folder:
        print(f"❌ Error: Problem {problem_number} not found in '{PROBLEMS_DIR}/'")
        return

    meta_path = os.path.join(problem_folder, "meta.json")
    if not os.path.exists(meta_path):
        print(f"❌ Error: meta.json not found for problem {problem_number}.")
        return

    # --- 1. Update Metadata ---
    with open(meta_path, "r", encoding="utf-8") as f:
        meta_data = json.load(f)

    for key, value in updates.items():
        # Handle nested keys like 'links.leetcode'
        if '.' in key:
            parent_key, child_key = key.split('.', 1)
            if parent_key in meta_data and isinstance(meta_data[parent_key], dict):
                meta_data[parent_key][child_key] = value
                print(f"   - Updated '{key}' to '{value}'")
        elif key in meta_data:
            meta_data[key] = value
            print(f"   - Updated '{key}' to '{value}'")
        else:
            print(f"   - ⚠️  Warning: Key '{key}' not found in meta.json. Skipping.")

    # --- 2. Aggregate All Problem Data for Injection ---
    
    # Start with the updated metadata.
    final_data = meta_data.copy()
    
    # FUTURE-PROOF: This is where you could add logic to parse README.md
    # For now, we'll use placeholder text as the template expects these fields.
    final_data["statement"] = "Problem statement from README.md would go here."
    final_data["approach"] = "Detailed approach from README.md would go here."
    final_data["timeComplexity"] = "O(n)"
    final_data["spaceComplexity"] = "O(n)"
    final_data["notes"] = "Implementation notes from README.md would go here."
    final_data["examples"] = []
    
    # Load code solutions for all supported languages.
    final_data["code"] = {}
    config_path = os.path.join("tools", "config.json")
    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    for lang in meta_data.get("languages", []):
        lang_details = config["languages"].get(lang)
        if not lang_details:
            continue
        
        ext = lang_details["ext"]
        lang_folder = os.path.join(problem_folder, lang)

        final_data["code"][lang] = {
            "user_solution": read_file_content(os.path.join(lang_folder, f"user_solution.{ext}")),
            "leetcode_solution": read_file_content(os.path.join(lang_folder, f"leetcode_solution.{ext}"))
        }

    # --- 3. Inject Data into the UI Template ---
    master_template_path = os.path.join(TEMPLATES_DIR, meta_data["template"], "ProblemViewTemplate.tsx")
    if not os.path.exists(master_template_path):
        print(f"❌ Error: Master template not found at {master_template_path}")
        return

    template_content = read_file_content(master_template_path)
    
    # Convert the aggregated data to a JSON string.
    injected_json = json.dumps(final_data, indent=2)

    # Replace the placeholder with the actual data.
    final_template_content = template_content.replace("`__PROBLEM_DATA__`", f"`{injected_json}`")

    # --- 4. Write the Updated Files ---
    
    # Write the new UI file to the problem's 'ui' directory.
    problem_ui_path = os.path.join(problem_folder, "ui", "ProblemViewTemplate.tsx")
    with open(problem_ui_path, "w", encoding="utf-8") as f:
        f.write(final_template_content)
    print(f"   - 🎨 Rebuilt UI template at: {problem_ui_path}")
    
    # Save the updated metadata back to meta.json.
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta_data, f, indent=4)
    print(f"   - 🗂️  Saved updates to meta.json")

    print(f"\n✅ Successfully updated Problem #{problem_number}: {meta_data['title']}")

def parse_value(value: str):
    """Converts string command-line arguments into Python types."""
    if value.lower() == "true":
        return True
    if value.lower() == "false":
        return False
    # Handle comma-separated lists for tags.
    if "," in value:
        return [tag.strip() for tag in value.split(",")]
    # Check for numbers if needed, for now, default to string.
    return value

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("\nUsage: python tools/update_progress.py <problem_number> <key>=<value> [<key2>=<value2>...]")
        print("\nExamples:")
        print("  python tools/update_progress.py 1 solved=true notes_complete=true")
        print("  python tools/update_progress.py 1 tags=array,hash-table,two-pointers")
        print("  python tools/update_progress.py 1 links.leetcode=http://...")
        print("  python tools/update_progress.py 1 difficulty=Medium")
        sys.exit(1)

    problem_number_arg = sys.argv[1]
    
    # Parse all key=value arguments into a dictionary.
    updates_dict = {}
    for arg in sys.argv[2:]:
        if "=" not in arg:
            print(f"❌ Error: Invalid argument format '{arg}'. Must be 'key=value'.")
            sys.exit(1)
        key, value = arg.split("=", 1)
        updates_dict[key] = parse_value(value)

    update_problem(problem_number_arg, updates_dict)