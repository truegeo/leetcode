import os
import sys
import json
from typing import Optional, Dict

# Define base directories
PROBLEMS_DIR = "problems"
TEMPLATES_DIR = "templates"

def parse_readme(readme_path: str) -> Dict[str, str]:
    """
    Parses the README.md file to extract content.
    Uses robust string splitting to handle variable whitespace.
    """
    # Default values if parsing fails or file doesn't exist
    data = {
        "statement": "Problem statement not found in README.md.",
        "approach": "Approach not found in README.md.",
        "timeComplexity": "O(?)",
        "spaceComplexity": "O(?)",
        "notes": ""
    }

    if not os.path.exists(readme_path):
        return data

    with open(readme_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Helper to extract text between two markers
    def get_section(text, start_marker, end_marker=None):
        try:
            if start_marker not in text:
                return ""
            # Split after the start marker
            part = text.split(start_marker)[1]
            # If there's an end marker, split before it
            if end_marker and end_marker in part:
                return part.split(end_marker)[0].strip()
            # Otherwise, take everything until the next standard header or end of string
            # This logic handles cases where "Notes" might be the last section
            return part.split('\n## ')[0].strip()
        except Exception:
            return ""

    # Extract Main Sections
    data["statement"] = get_section(content, "## Problem Description")
    data["approach"] = get_section(content, "## Approach")
    
    # Extract Notes (Looking for a generic Notes header, or defaulting to empty)
    data["notes"] = get_section(content, "## Notes")

    # Extract Complexity (Line by line parsing for precision)
    for line in content.split('\n'):
        if "- **Time:**" in line:
            data["timeComplexity"] = line.split("- **Time:**")[1].strip()
        elif "- **Space:**" in line:
            data["spaceComplexity"] = line.split("- **Space:**")[1].strip()

    return data

def find_problem_folder(problem_number: str) -> Optional[str]:
    padded_number = f"{int(problem_number):04d}"
    for folder_name in os.listdir(PROBLEMS_DIR):
        if folder_name.startswith(padded_number):
            return os.path.join(PROBLEMS_DIR, folder_name)
    return None

def read_file_content(file_path: str, default_content: str = "") -> str:
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
            
            # Robust Logic: Create parent dictionary if it doesn't exist
            if parent_key not in meta_data or not isinstance(meta_data.get(parent_key), dict):
                meta_data[parent_key] = {}
            
            meta_data[parent_key][child_key] = value
            print(f"   - Updated '{key}' to '{value}'")
            
        elif key in meta_data:
            meta_data[key] = value
            print(f"   - Updated '{key}' to '{value}'")
        else:
            print(f"   - ⚠️  Warning: Key '{key}' not found in meta.json. Skipping.")

    # --- 2. Aggregate All Problem Data ---
    
    # Parse the README content
    readme_path = os.path.join(problem_folder, "README.md")
    readme_data = parse_readme(readme_path)
    print("   - 📝 Parsed README.md content.")

    # Start with metadata and merge in README data
    final_data = meta_data.copy()
    final_data["statement"] = readme_data["statement"]
    final_data["approach"] = readme_data["approach"]
    final_data["timeComplexity"] = readme_data["timeComplexity"]
    final_data["spaceComplexity"] = readme_data["spaceComplexity"]
    final_data["notes"] = readme_data["notes"]
    final_data["examples"] = [] # Placeholder for future example parsing
    
    # Load code solutions
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
    
    # Convert data to JSON and Escape for JavaScript
    injected_json = json.dumps(final_data, indent=2)
    js_safe_json = injected_json.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')

    # Replace the placeholder
    final_template_content = template_content.replace("`__PROBLEM_DATA__`", f"`{js_safe_json}`")

    # --- 4. Write the Updated Files ---
    
    # Write the UI file
    problem_ui_path = os.path.join(problem_folder, "ui", "ProblemViewTemplate.tsx")
    with open(problem_ui_path, "w", encoding="utf-8") as f:
        f.write(final_template_content)
    print(f"   - 🎨 Rebuilt UI template at: {problem_ui_path}")
    
    # Save the updated metadata
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta_data, f, indent=4)
    print(f"   - 🗂️  Saved updates to meta.json")

    print(f"\n✅ Successfully updated Problem #{problem_number}: {meta_data['title']}")

def parse_value(value: str):
    """Converts string command-line arguments into Python types."""
    if value.lower() == "true": return True
    if value.lower() == "false": return False
    if "," in value: return [tag.strip() for tag in value.split(",")]
    return value

if __name__ == "__main__":
    if len(sys.argv) < 2: # Changed check to 2 to allow running without extra args just to rebuild
        print("\nUsage: python tools/update_progress.py <problem_number> [<key>=<value>...]")
        print("Example: python tools/update_progress.py 1 solved=true")
        sys.exit(1)

    problem_number_arg = sys.argv[1]
    
    updates_dict = {}
    if len(sys.argv) > 2:
        for arg in sys.argv[2:]:
            if "=" not in arg:
                print(f"❌ Error: Invalid argument format '{arg}'. Must be 'key=value'.")
                sys.exit(1)
            key, value = arg.split("=", 1)
            updates_dict[key] = parse_value(value)

    update_problem(problem_number_arg, updates_dict)