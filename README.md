# 🎓 The Hub - Student Productivity Dashboard

A full-stack web application designed to help students manage their academic and personal lives. The Hub features a centralized dashboard connecting four key productivity tools: a Priority To-Do List, CGPA Calculator, Life Plan Vision Board, and a Quiz Game.

## 🚀 Features

### 1. 📝 Priority To-Do List
* **Smart Sorting:** Tasks are automatically sorted by priority (High, Medium, Low).
* **Color Coded:** Visual cues for different priority levels.
* **Status Tracking:** Mark tasks as completed or delete them instantly.

### 2. 📊 CGPA Calculator
* **Multi-Scale Support:** Switch instantly between 5.0, 4.0, and 3.0 grading scales.
* **History Tracking:** Save your GPA for every semester and view your cumulative progress.
* **Dynamic Inputs:** Add as many courses as you need for each calculation.

### 3. 🎯 Life Plan & Vision Board
* **Vision Statement:** Auto-saving text area for your long-term goals.
* **Categorized Goals:** Organize goals by Career, Wealth, Health, and Relationships.
* **Deadlines:** Set target dates for every life goal.

### 4. 🧠 Quiz Game
* **Interactive Gameplay:** Test your knowledge with a built-in quiz.
* **Score Tracking:** Saves your high scores to the database.
* **Review System:** Shows you exactly which questions you missed and what the correct answers were.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Authentication:** BCrypt (Password Hashing)

---

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/sophia0-dev/hub-app.git](https://github.com/sophia0-dev/hub-app.git)
    cd hub-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup the Database**
    * Create a MySQL database named `hub_db`.
    * Import the tables using the SQL script provided in `database.sql`.

4.  **Configure Environment Variables**
    * Create a `.env` file in the root directory.
    * Add your database credentials:
        ```env
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=your_password
        DB_NAME=hub_db
        PORT=3000
        ```

5.  **Run the Server**
    ```bash
    node server.js
    ```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/sophia0-dev/hub-app/issues).

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
