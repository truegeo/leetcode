import os
import sys
import json

CONFIG_PATH = os.path.join("tools", "config.json")

def load_config():
    if not os.path.exists(CONFIG_PATH):
        print("⚙️ Config not found. Creating new one...")
        return {"languages": {}, "default_template": "problem-view"}
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_config(config):
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=4)
    print(f"✅ Saved config to {CONFIG_PATH}")

def add_language(lang_name, ext, boilerplate):
    config = load_config()

    if lang_name in config["languages"]:
        print(f"⚠️ Language '{lang_name}' already exists in config.")
        return

    config["languages"][lang_name] = {
        "ext": ext,
        "boilerplate": boilerplate
    }

    save_config(config)
    print(f"✨ Added new language: {lang_name} (.{ext})")

    # Ask if user wants to add this language to existing problems
    choice = input("Would you like to add this language to existing problems? (y/n): ").lower()
    if choice == "y":
        add_to_existing_problems(lang_name, ext, boilerplate)

def add_to_existing_problems(lang_name, ext, boilerplate):
    problems_dir = "problems"
    if not os.path.exists(problems_dir):
        print("⚠️ No problems directory found. Skipping.")
        return

    for problem_folder in os.listdir(problems_dir):
        path = os.path.join(problems_dir, problem_folder)
        if not os.path.isdir(path):
            continue

        lang_dir = os.path.join(path, lang_name)
        os.makedirs(lang_dir, exist_ok=True)

        for solution_type in ["user_solution", "leetcode_solution"]:
            file_path = os.path.join(lang_dir, f"{solution_type}.{ext}")
            if not os.path.exists(file_path):
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(boilerplate)
                print(f"🧩 Added {file_path}")
    print("✅ Added new language to all existing problems.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python tools/add_language.py <language_name> <file_extension>")
        print("Example: python tools/add_language.py typescript ts")
        sys.exit(1)

    lang_name = sys.argv[1].lower()
    ext = sys.argv[2].lower()
    print(f"Adding new language: {lang_name} (.{ext})")

    boilerplate = input("Enter boilerplate text for this language (press Enter for default): ").strip()
    if not boilerplate:
        boilerplate = f"// Write your {lang_name.capitalize()} solution here\n"

    add_language(lang_name, ext, boilerplate)
