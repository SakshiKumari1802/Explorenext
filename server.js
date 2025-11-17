const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Make sure your index.html is inside 'public' folder

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'P@p@#3008',
    database: 'travelmatch'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API for travel recommendations
app.post('/api/recommendations', (req, res) => {
    const p = req.body;
     console.log("Received preferences:", p);

    let sql = `SELECT * FROM destinations WHERE 1=1`;
    const params = [];

    if (p.continent) {
        sql += ` AND continent = ?`;
        params.push(p.continent);
    }

    if (p.destinationType && p.destinationType.length) {
        sql += ` AND (${p.destinationType.map(() => `FIND_IN_SET(?, type)`).join(' OR ')})`;
        params.push(...p.destinationType);
    }

    if (p.temperatureRange) {
        sql += ` AND temperature_min <= ? AND temperature_max >= ?`;
        params.push(p.temperatureRange, p.temperatureRange);
    }

    if (p.weatherType && p.weatherType.length) {
        sql += ` AND (${p.weatherType.map(() => `FIND_IN_SET(?, weather)`).join(' OR ')})`;
        params.push(...p.weatherType);
    }

    if (p.tripPurpose) {
        sql += ` AND FIND_IN_SET(?, purpose_tags)`;
        params.push(p.tripPurpose);
    }

    if (p.activities && p.activities.length) {
        sql += ` AND (${p.activities.map(() => `FIND_IN_SET(?, activities)`).join(' OR ')})`;
        params.push(...p.activities);
    }

    if (p.accommodationBudget) {
        sql += ` AND avg_budget <= ?`;
        params.push(p.accommodationBudget);
    }

    if (p.amenities && p.amenities.length) {
        sql += ` AND (${p.amenities.map(() => `FIND_IN_SET(?, amenities)`).join(' OR ')})`;
        params.push(...p.amenities);
    }

    if (p.foodPreference && p.foodPreference !== 'any') {
        sql += ` AND food LIKE ?`;
        params.push(`%${p.foodPreference}%`);
    }

    if (p.localityRating) {
        sql += ` AND rating >= ?`;
        params.push(p.localityRating);
    }

    sql += ` ORDER BY rating DESC LIMIT 10`;

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log("Query executed successfully, results:", results);
        res.json(results);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

