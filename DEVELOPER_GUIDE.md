# Developer's Guide: Coding Problem Management System

## 1. Introduction

Welcome to the developer's guide for the automated coding problem management system. This system is designed to provide a robust, scalable, and elegant workflow for solving, documenting, and viewing coding problems.

The core philosophy is a strict **separation of concerns**:
-   **Data (`meta.json`, solution files):** This is the "source of truth." You manage your progress, notes, and code here.
-   **Presentation (`ProblemViewTemplate.tsx`):** This is a "dumb" template that is dynamically populated with data.
-   **Automation (`tools/` scripts):** These are the engines that read your data and build the final presentation layer.
-   **Viewing (`viewer/` app):** A centralized web application to beautifully render any problem's UI on demand.

This guide will walk you through every aspect of using the system.

---

## 2. Initial One-Time Setup

Before you begin solving problems, you need to start the central viewing application. You only need to do this once per work session.

1.  **Navigate to the Viewer Directory:**
    Open a terminal at the root of the project and move into the `viewer` directory.
    ```bash
    cd viewer
    ```

2.  **Install Dependencies (First Time Only):**
    If you have never run the viewer before, install its dependencies.
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    Run the `dev` script. This will launch a local web server, typically on port 5173.
    ```bash
    npm run dev
    ```

    You will see output like this:
    ```
    ➜  Local:   http://localhost:5173/
    ```

**Keep this terminal running.** This server is what allows you to see your UIs. You can now open a *new* terminal for running the other commands.

---

## 3. The Core Workflow: Solving a Problem

This is the day-to-day workflow you will follow for each new problem.

### Step 1: Create the Problem Structure

Use the `create_problem.py` script to scaffold all necessary files.

-   **Command:** `python tools/create_problem.py <problem_number> "<problem_title>"`
-   **Example:**

    ```bash
    # Run from the project root
    python tools/create_problem.py 136 "Single Number"
    ```

This command creates a new folder `problems/0136_single-number/` containing the `meta.json`, language subfolders, empty solution files, and a fresh copy of the UI template.

### Step 2: Write Your Solution Code

Navigate to the newly created folder and open the `user_solution` file for your chosen language.

-   **Example:** Open `problems/0136_single-number/python/user_solution.py` and write your code.
    ```python
    # In user_solution.py
    class Solution:
        def singleNumber(self, nums: list[int]) -> int:
            res = 0
            for n in nums:
                res = n ^ res
            return res
    ```
You can also add an optimal or official solution to the corresponding `leetcode_solution` file.

### Step 3: Update Progress & Build the UI

This is the most important step. The `update_progress.py` script synchronizes all your data (`meta.json` and code) with the UI template.

-   **Command:** `python tools/update_progress.py <problem_number> <key>=<value> ...`
-   **Functionality:**
    -   It modifies the `meta.json` file with the key-value pairs you provide.
    -   It reads the content of all solution files (e.g., `user_solution.py`, `leetcode_solution.py`).
    -   It bundles all this data into a single JSON object.
    -   It injects this JSON into the master template and overwrites the problem's local UI file (`problems/0136.../ui/ProblemViewTemplate.tsx`).

-   **Example Usage:**
    First, mark the problem as solved and set its difficulty.
    ```bash
    python tools/update_progress.py 136 solved=true difficulty=Easy
    ```
    Next, add tags and an external link. The script correctly parses comma-separated lists for `tags` and nested keys for `links`.
    ```bash
    python tools/update_progress.py 136 tags=array,bit-manipulation links=https://leetcode.com/problems/single-number/
    ```

### Step 4: View the Result

With the viewer server still running, open your browser and navigate to the URL corresponding to the problem's slug.

-   **URL Structure:** `http://localhost:5173/view/<problem-slug>`
-   **Example:**

    **`http://localhost:5173/view/0136_single-number`**

You will see your beautiful, fully-rendered UI with your code, tags, difficulty, and links. If you make another change and re-run the `update_progress.py` script, simply **refresh the browser** to see the update.

### Step 5: Commit to Version Control

Finally, save your work using Git.

1.  **Add the new problem folder** to the staging area.
    ```bash
    git add problems/0136_single-number/
    ```

2.  **Commit your changes** with a descriptive message.
    ```bash
    git commit -m "feat: Solve problem #136 - Single Number"
    ```

3.  **Push to your remote repository.**
    ```bash
    git push
    ```

---

## 4. System Expansion

The system is designed to be easily expanded.

### Workflow: Adding a New Language

Use the `add_language.py` script to seamlessly add support for a new language across the entire system.

1.  **Run the Script:**
    Provide the language name (lowercase) and its file extension.
    ```bash
    python tools/add_language.py typescript ts
    ```

2.  **Follow the Prompts:**
    -   The script will ask for **boilerplate code** for new files.
    -   It will then ask if you want to **add this language to all existing problems**. Answering `y` will automatically create the `typescript/` subfolder and solution files in every problem you've already solved.

3.  **Commit the Changes:**
    The script modifies `tools/config.json` and potentially adds many new files. Commit these changes to make the new language official.
    ```bash
    git add tools/config.json problems/
    git commit -m "feat: Add TypeScript language support"
    git push
    ```

### Workflow: Creating a New UI Template

If you want a different visual style, you can create a new template.

1.  **Run the Script:**
    Execute `create_template.py` to start the interactive scaffolding process.
    ```bash
    python tools/create_template.py
    ```

2.  **Follow the Prompts:**
    Provide a folder name, a React component name, and a short description.

3.  **CRITICAL - Make the Template Dynamic:**
    The script creates a generic template. You **must** manually edit it to work with our data injection system.
    -   Open the new file (e.g., `templates/new-template-name/NewTemplateName.tsx`).
    -   Replace the `props` interface and destructuring with the `__PROBLEM_DATA__` placeholder and parsing logic, just like in `ProblemViewTemplate.tsx`.
        ```tsx
        // ... imports
        const problemDataJson = `__PROBLEM_DATA__`;
        // ... (copy interface definitions)

        export default function NewTemplateName() {
          const data = JSON.parse(problemDataJson);
          // ... rest of your component JSX using the 'data' object
        }
        ```

4.  **Use the New Template:**
    When creating a new problem, you can now pass the template's folder name as an optional final argument.
    ```bash
    python tools/create_problem.py 101 "Symmetric Tree" minimal-view
    ```

5.  **Commit the New Template:**
    Add the new template directory to Git.
    ```bash
    git add templates/minimal-view/
    git commit -m "feat: Create new minimal-view UI template"
    git push
    ```