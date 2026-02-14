require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const cors = require('cors'); // to prevent connection blocks

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',    
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'MYSQL/sophia_1', // Default XAMPP/MySQL password is often empty
    database: process.env.DB_NAME || 'hub_db',
    port: process.env.DB_PORT || 3306 // <--- CHANGED FROM 3000 TO 3306
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database Connection Failed:', err.message);
        console.error('Check if MySQL is running on port 3306');
    } else {
        console.log('✅ Connected to MySQL Database!');
    }
});

// --- AUTH ROUTES ---
//Testing Route
app.get('/test',(req, res) => res.send('Backend alive'));
// 1. fOR THE SIGNUP
app.post('/api/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        console.log(`Attempting signup for: ${email}`);

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)';
        
        db.query(sql, [fullname, email, hashedPassword], (err, result) => {
            if (err) {
                console.error("Signup Error:", err.message);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'This email is already registered.' });
                }
                return res.status(500).json({ message: 'Database error during signup.' });
            }
            console.log("User registered successfully.");
            res.status(201).json({ message: 'User registered!' });
        });
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 2. LOGIN
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Login DB Error:", err.message);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("Login successful.");
        res.json({ 
            message: 'Login successful',
            user: { id: user.id, name: user.full_name } 
        });
    });
});

// --- TODO ROUTES (starting with Priority) ---

app.get('/api/todos', (req, res) => {
    const userId = req.query.userId;
    // Sort ALGORITHM: High first, then Medium, then Low. Newest items first.
    const sql = `
        SELECT * FROM todos 
        WHERE user_id = ? 
        ORDER BY FIELD(priority, 'High', 'Medium', 'Low'), created_at DESC
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/todos', (req, res) => {
    const { userId, text, priority } = req.body;
    const sql = 'INSERT INTO todos (user_id, text, priority) VALUES (?, ?, ?)';
    db.query(sql, [userId, text, priority], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, text, priority, completed: 0 });
    });
});

app.put('/api/todos/:id', (req, res) => {
    const { completed } = req.body;
    db.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Updated' });
    });
});

app.delete('/api/todos/:id', (req, res) => {
    db.query('DELETE FROM todos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Deleted' });
    });
});

// --- CGPA ROUTES ---
app.get('/api/cgpa', (req, res) => {
    const userId = req.query.userId;
    db.query('SELECT * FROM cgpa_history WHERE user_id = ? ORDER BY id DESC', [userId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/cgpa', (req, res) => {
    const { userId, session, level, semester, totalUnits, totalPoints, gpa } = req.body;
    const sql = 'INSERT INTO cgpa_history (user_id, session, level, semester, total_units, total_points, gpa) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [userId, session, level, semester, totalUnits, totalPoints, gpa], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, message: 'Saved' });
    });
});

app.delete('/api/cgpa/:id', (req, res) => {
    db.query('DELETE FROM cgpa_history WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Deleted' });
    });
});

// --- LIFE PLAN ROUTES ---
app.get('/api/lifeplan', (req, res) => {
    const userId = req.query.userId;
    const response = { vision: "", goals: [] };
    db.query('SELECT statement FROM life_vision WHERE user_id = ?', [userId], (err, visionResult) => {
        if (visionResult.length > 0) response.vision = visionResult[0].statement;
        db.query('SELECT * FROM life_goals WHERE user_id = ?', [userId], (err, goalsResult) => {
            response.goals = goalsResult;
            res.json(response);
        });
    });
});

app.post('/api/lifeplan/vision', (req, res) => {
    const { userId, statement } = req.body;
    const sql = 'INSERT INTO life_vision (user_id, statement) VALUES (?, ?) ON DUPLICATE KEY UPDATE statement = ?';
    db.query(sql, [userId, statement, statement], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Vision Saved' });
    });
});

app.post('/api/lifeplan/goal', (req, res) => {
    const { userId, category, text, date } = req.body;
    db.query('INSERT INTO life_goals (user_id, category, text, target_date) VALUES (?, ?, ?, ?)', 
    [userId, category, text, date], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId });
    });
});

app.put('/api/lifeplan/goal/:id', (req, res) => {
    const { completed } = req.body;
    db.query('UPDATE life_goals SET completed = ? WHERE id = ?', [completed, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Updated' });
    });
});

app.delete('/api/lifeplan/goal/:id', (req, res) => {
    db.query('DELETE FROM life_goals WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Deleted' });
    });
});

// --- QUIZ ROUTES ---
app.post('/api/quiz', (req, res) => {
    const { userId, score, total } = req.body;
    db.query('INSERT INTO quiz_scores (user_id, score, total_questions) VALUES (?, ?, ?)', [userId, score, total], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Score Saved' });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});