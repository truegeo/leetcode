# Quick Start: Daily Problem Workflow

This guide is a simplified "cheat sheet" for the daily workflow of solving a new coding problem using this system.

---

### Step 0: Start the Engine (Once Per Session)

Before you begin, make sure your local viewer application is running. You only need to do this once.

1.  **Open a terminal** and navigate to the `viewer` directory:
    ```bash
    cd viewer
    ```

2.  **Start the dev server:**
    ```bash
    npm run dev
    ```

**Leave this terminal running.** Now, open a new terminal at the project root for the following steps.

---

### The Daily Problem Workflow

Follow these five steps for every new problem.

#### ✅ Step 1: Create the Problem

Use the `create_problem.py` script to generate the problem's folder and all necessary files.

-   **Command:** `python tools/create_problem.py <number> "<Title>"`
-   **Example:**
    ```bash
    python tools/create_problem.py 141 "Linked List Cycle"
    ```

#### ✅ Step 2: Write Your Code

Navigate into the new directory (`problems/0141_linked-list-cycle/`) and edit the solution file for your language.

-   **Example:** Open `python/user_solution.py` and write your solution.

#### ✅ Step 3: Update Progress & Build the UI

Use the `update_progress.py` script to sync your metadata and code with the visual template. This is the "build" step.

-   **Command:** `python tools/update_progress.py <number> <key>=<value> ...`
-   **Example Scenarios:**
    -   Marking a problem as solved:
        ```bash
        python tools/update_progress.py 141 solved=true
        ```
    -   Adding tags, difficulty, and a link:
        ```bash
        python tools/update_progress.py 141 difficulty=Easy tags=hash-table,linked-list,two-pointers links.leetcode=https://leetcode.com/problems/linked-list-cycle/
        ```

#### ✅ Step 4: View Your Result

Open your browser and navigate to the URL for the problem slug.

-   **URL Format:** `http://localhost:5173/view/<slug>`
-   **Example:**
    ```
    http://localhost:5173/view/0141_linked-list-cycle
    ```
> **Tip:** After running the `update_progress.py` script, just refresh the page in your browser to see the latest changes.

#### ✅ Step 5: Save Your Work

Commit the newly solved problem to your Git history.

1.  **Add the new folder:**
    ```bash
    git add problems/0141_linked-list-cycle/
    ```
2.  **Commit with a clear message:**
    ```bash
    git commit -m "feat: Solve problem #141 - Linked List Cycle"
    ```
3.  **Push your changes:**
    ```bash
    git push
    ```

---

That's it! This five-step loop (`Create -> Code -> Update -> View -> Commit`) is the entire daily workflow.