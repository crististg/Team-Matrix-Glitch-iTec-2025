const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'code')));

// Database setup
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `);
    }
});

// Routes
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal server error');
        } else if (row) {
            res.send('<h1>Welcome back, ' + email + '!</h1>');
        } else {
            res.status(401).send('<h1>Invalid email or password</h1>');
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Endpoint pentru Sign Up
app.post('/signup', (req, res) => {
    // Extrage datele din formular
    const { email, password, confirmPassword } = req.body;

    // Verifică dacă parolele coincid
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    if (password !== confirmPassword) {
        return res.status(400).send('<h1>Passwords do not match</h1>');
    }

    // Adaugă utilizatorul în baza de date
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err) => {
        if (err) {
            // Verifică dacă email-ul există deja
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).send('<h1>Email already exists</h1>');
            }
            // Alte erori
            console.error(err.message);
            return res.status(500).send('<h1>Internal server error</h1>');
        }

        // Răspuns pentru utilizator
        res.send('<h1>Account created successfully! You can now <a href="/code/html/signin.html">log in</a>.</h1>');
    });
});