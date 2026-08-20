const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (req, res) => {
    const { name, email, password, role, specialization, workingHours, slotDuration } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const userResult = await db.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role]
        );
        const user = userResult.rows[0];

        if (role === 'doctor') {
            await db.query(
                'INSERT INTO doctor_profiles (user_id, specialization, working_hours, slot_duration) VALUES ($1, $2, $3, $4)',
                [user.id, specialization, JSON.stringify(workingHours || {}), slotDuration || 30]
            );
        }

        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ success: true, token, role: user.role });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { register, login };