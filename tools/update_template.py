import os
import shutil
import sys
import filecmp
from datetime import datetime

TEMPLATES_DIR = "templates"
PROBLEMS_DIR = "problems"
LOG_FILE = os.path.join("tools", "update_template.log")

def log(message):
    """Append logs with timestamp."""
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now().isoformat(sep=' ', timespec='seconds')}] {message}\n")

def copy_template_to_problem(template_name, problem_path):
    """Copy updated template into a problem folder."""
    src_dir = os.path.join(TEMPLATES_DIR, template_name)
    dest_dir = os.path.join(problem_path, "templates", template_name)

    if not os.path.exists(src_dir):
        print(f"❌ Template '{template_name}' not found in {TEMPLATES_DIR}/")
        return False

    os.makedirs(dest_dir, exist_ok=True)

    updated = False
    for root, _, files in os.walk(src_dir):
        rel_root = os.path.relpath(root, src_dir)
        for file in files:
            src_file = os.path.join(root, file)
            dest_file = os.path.join(dest_dir, rel_root, file) if rel_root != "." else os.path.join(dest_dir, file)

            os.makedirs(os.path.dirname(dest_file), exist_ok=True)

            # Only replace if changed
            if not os.path.exists(dest_file) or not filecmp.cmp(src_file, dest_file, shallow=False):
                shutil.copy2(src_file, dest_file)
                updated = True
                log(f"Updated {dest_file}")
    return updated

def update_template_in_all_problems(template_name):
    """Iterate through all problem folders and update templates."""
    if not os.path.exists(PROBLEMS_DIR):
        print("⚠️ No problems directory found. Nothing to update.")
        return

    print(f"🔁 Updating template '{template_name}' across all problems...")
    updated_count = 0

    for folder in os.listdir(PROBLEMS_DIR):
        problem_path = os.path.join(PROBLEMS_DIR, folder)
        if not os.path.isdir(problem_path):
            continue

        if copy_template_to_problem(template_name, problem_path):
            updated_count += 1

    print(f"✅ Template '{template_name}' updated in {updated_count} problem(s).")
    log(f"Template '{template_name}' updated in {updated_count} problem(s).")

def main():
    if len(sys.argv) < 2:
        print("Usage: python tools/update_template.py <template_name>")
        print("Example: python tools/update_template.py problem-view")
        sys.exit(1)

    template_name = sys.argv[1]
    update_template_in_all_problems(template_name)

if __name__ == "__main__":
    main()
