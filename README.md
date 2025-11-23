# LeetCode Solution Hub: A Dynamic Problem Management System

![Neobrutalist UI Screenshot](https://user-images.githubusercontent.com/23580511/141443564-97210a4e-128c-4375-8107-164b38d3810e.png)
*(Recommendation: Take a screenshot of your beautiful UI and replace the placeholder image link above)*

A robust, automated system for managing and documenting coding problems. This project provides a complete CLI-driven workflow to create problems, track progress, manage multi-language solutions, and dynamically generate a beautiful, interactive Neobrutalist UI to view them.

---

## ✨ Key Features

-   **🚀 Automated Scaffolding:** Create the entire file structure for a new problem with a single command.
-   **💅 Data-Driven UI:** A stunning Neobrutalist UI template built with React and TailwindCSS that is dynamically populated with your data.
-   **💻 Multi-Language Support:** Manage solutions in different languages (e.g., Python, C#) side-by-side, with support for both your own and official LeetCode solutions.
-   **⚙️ Powerful CLI Tooling:** A suite of Python scripts to create problems, update progress, and add new languages, automating the entire workflow.
-   **⚡️ Centralized Viewer:** A blazing-fast local web app powered by Vite that instantly renders the UI for any problem on demand.
-   **📈 Future-Proof:** Easily extend the system by adding new languages to a central config file or creating new UI templates.

---

## 🛠️ Tech Stack

-   **Backend & Tooling:** Python 3
-   **Frontend Viewer:** React, TypeScript, Vite, TailwindCSS
-   **UI Design:** Framer Motion (for animations), Lucide (for icons)

---

## 🚀 Getting Started

Follow these steps to get the system up and running on your local machine.

### Prerequisites

-   [Python 3.8+](https://www.python.org/downloads/)
-   [Node.js and npm](https://nodejs.org/en/download/)

### Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Set Up the Viewer Application:**
    This is a one-time setup for the app that displays your solutions.
    ```bash
    # Navigate into the viewer directory
    cd viewer

    # Install all necessary Node.js dependencies
    npm install
    ```

3.  **Launch the Viewer:**
    Start the Vite development server. **Keep this terminal running** while you work.
    ```bash
    npm run dev
    ```
    Your viewer is now running at `http://localhost:5173/`.

---

##  workflow in 30 Seconds

This is the core loop for using the system. All commands are run from a **new terminal** at the project root.

1.  **Create a Problem:**
    ```bash
    python tools/create_problem.py 2 "Add Two Numbers"
    ```

2.  **Write Your Code:**
    Edit the solution files, for example: `problems/0002_add-two-numbers/python/user_solution.py`.

3.  **Update Progress & Build UI:**
    This command syncs your `meta.json` and code with the UI.
    ```bash
    python tools/update_progress.py 2 solved=true tags=linked-list,math
    ```

4.  **View Your Solution:**
    Open your browser and navigate to the problem's URL.
    **`http://localhost:5173/view/0002_add-two-numbers`**

For a quick reminder of the daily workflow, see the **[Quick Start Guide](QUICK_START.md)**.

For a complete breakdown of every command and system detail, please read the **[Developer's Guide](DEVELOPER_GUIDE.md)**.

---

## 🧰 Scripts Overview

All automation is handled by scripts in the `/tools` directory.

| Script               | Description                                                               |
| -------------------- | ------------------------------------------------------------------------- |
| `create_problem.py`  | Scaffolds the complete directory structure for a new problem.             |
| `update_progress.py` | Updates `meta.json` and rebuilds the UI with the latest data and code.    |
| `add_language.py`    | Adds a new programming language to the system's configuration.            |
| `create_template.py` | Scaffolds the files for a new UI template.                                |

---

## 🤝 Contributing

Contributions to improve this system are welcome. Please read our **[Contributing Guide](CONTRIBUTING.md)** for details on our code standards and the pull request process.

## 📄 License

This project is licensed under the MIT License. See the **[LICENSE](LICENSE)** file for details.