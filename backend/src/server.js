const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/api/db-test', async (req, res) => {
    try {
        const result = await db.query('SELECT current_database(), now()');
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});