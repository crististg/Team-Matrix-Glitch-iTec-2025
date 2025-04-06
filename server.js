const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'code')));
const cors = require('cors');
app.use(cors());

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

const db_products = new sqlite3.Database('./products.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db_products.run(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                image TEXT
            )
        `);
    }
});
const db_collaborations = new sqlite3.Database('./collaborations.db', (err) => {
    if (err) {
        console.error('Error opening collaborations database:', err.message);
    } else {
        console.log('Connected to SQLite collaborations database.');
        db_collaborations.run(`
            CREATE TABLE IF NOT EXISTS collaborations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                image TEXT,
                image2 TEXT
            )
        `, (err) => {
            if (err) {
                console.error('Error creating collaborations table:', err.message);
            } else {
                console.log('Collaborations table initialized.');
            }
        });
    }
});

app.post('/admin/add-item', (req, res) => {
    const { type, name, description, price, image, image2 } = req.body;

    console.log('Received item:', { type, name, description, price, image, image2 });

    if (type === 'product') {
        // Salvează în tabela `products`
        db_products.run(
            'INSERT INTO products (name, description, price, image, image2) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, image, image2],
            function (err) {
                if (err) {
                    console.error('Error inserting product:', err.message);
                    res.status(500).json({ error: err.message });
                } else {
                    console.log('Product inserted with ID:', this.lastID);
                    res.json({ id: this.lastID, message: 'Product added successfully!' });
                }
            }
        );
    } else if (type === 'collaboration') {
        // Salvează în tabela `collaborations`
        db_collaborations.run(
            'INSERT INTO collaborations (name, description, price, image, image2) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, image, image2],
            function (err) {
                if (err) {
                    console.error('Error inserting collaboration:', err.message);
                    res.status(500).json({ error: err.message });
                } else {
                    console.log('Collaboration inserted with ID:', this.lastID);
                    res.json({ id: this.lastID, message: 'Collaboration added successfully!' });
                }
            }
        );
    } else {
        res.status(400).json({ error: 'Invalid type. Must be "product" or "collaboration".' });
    }
});

app.get('/products', (req, res) => {
    const { order } = req.query;
    let query = 'SELECT * FROM products';

    // Adaugă sortarea după preț, dacă este specificată
    if (order) {
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
        query += ` ORDER BY price ${sortOrder}`;
    }

    console.log('Executing query:', query); // Debugging

    db_products.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.post('/collaborations', (req, res) => {
    const { name, description, price, image, image2} = req.body;

    console.log('Received collaboration:', { name, description, price, image, image2});

    db_collaborations.run(
        'INSERT INTO collaborations (name, description, price, image, image2) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, image, image2],
        function (err) {
            if (err) {
                console.error('Error inserting collaboration:', err.message);
                res.status(500).json({ error: err.message });
            } else {
                console.log('Collaboration inserted with ID:', this.lastID);
                res.json({ id: this.lastID, message: 'Collaboration added successfully!' });
            }
        }
    );
});

app.get('/collaborations', (req, res) => {
    db_collaborations.all('SELECT * FROM collaborations', [], (err, rows) => {
        if (err) {
            console.error('Error fetching collaborations:', err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get('/collaborations/:id', (req, res) => {
    const collaborationId = req.params.id;

    db_collaborations.get('SELECT * FROM collaborations WHERE id = ?', [collaborationId], (err, row) => {
        if (err) {
            console.error('Error fetching collaboration details:', err.message);
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Collaboration not found' });
        } else {
            res.json(row);
        }
    });
});

db_products.run('ALTER TABLE products ADD COLUMN image2 TEXT', (err) => {
    if (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('Column "image2" already exists.');
        } else {
            console.error('Error adding column "image2":', err.message);
        }
    } else {
        console.log('Column "image2" added successfully.');
    }
});

app.post('/products', (req, res) => {
    const { name, description, price, image, image2 } = req.body;

    console.log('Received product:', { name, description, price, image, image2 });

    db_products.run(
        'INSERT INTO products (name, description, price, image, image2) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, image, image2],
        function (err) {
            if (err) {
                console.error('Error inserting product:', err.message); // Afișează erorile
                res.status(500).json({ error: err.message });
            } else {
                console.log('Product inserted with ID:', this.lastID); // Confirmă inserarea
                res.json({ id: this.lastID });
            }
        }
    );
});

app.get('/products/:id', (req, res) => {
    const productId = req.params.id;

    db_products.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
        if (err) {
            console.error('Error fetching product details:', err.message);
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(row); // Returnează toate detaliile produsului, inclusiv cele două imagini
        }
    });
});

app.post('/products', (req, res) => {
    const { name, description, price, image, image2 } = req.body;

    console.log('Received product:', { name, description, price, image, image2 });

    db_products.run(
        'INSERT INTO products (name, description, price, image, image2) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, image, image2],
        function (err) {
            if (err) {
                console.error('Error inserting product:', err.message); // Afișează erorile
                res.status(500).json({ error: err.message });
            } else {
                console.log('Product inserted with ID:', this.lastID); // Confirmă inserarea
                res.json({ id: this.lastID });
            }
        }
    );
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

// Endpoint pentru sortarea produselor după preț
app.get('/products/sort', (req, res) => {
    const { order } = req.query; // `order` poate fi 'asc' sau 'desc'
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    db_products.all(`SELECT * FROM products ORDER BY price ${sortOrder}`, [], (err, rows) => {
        if (err) {
            console.error('Error sorting products:', err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});