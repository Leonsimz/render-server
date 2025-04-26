const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 3000; // Change this to your desired port

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com', // Replace with your remote database host
    user: 'sql12775334',              // Replace with your database username
    password: 'mLQi5BLQ9Y',           // Replace with your database password
    database: 'sql12775334'           // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the remote database!');
});

// Login endpoint
app.post('/login', (req, res) => {
    const { type } = req.query; // Get the login type from the query parameter
    const { username, usercode } = req.body;

    let tableName;
    let nameColumn;
    let codeColumn;

    // Determine the table and columns based on the login type
    if (type === 'student' || type === 'parent') {
        tableName = 'Students';
        nameColumn = 'studentname';
        codeColumn = 'studentcode';
    } else if (type === 'staff') {
        tableName = 'staff';
        nameColumn = 'staffname';
        codeColumn = 'staffcode';
    } else {
        return res.status(400).json({ message: 'Invalid login type' });
    }

    // Query the database using the selected table and columns
    const query = `SELECT * FROM ${tableName} WHERE ${nameColumn} = ? AND ${codeColumn} = ?`;
    db.query(query, [username, usercode], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Database error' });
        } else if (results.length > 0) {
            res.json({ message: 'Login successful' });
        } else {
            res.json({ message: 'Invalid credentials' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


