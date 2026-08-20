const pool = require('../config/db');
const { generatePreVisitSummary } = require('../services/llmService');

// 1. Book Appointment Function
const bookAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentTime, symptoms } = req.body;
        const patientId = req.user.id; // From auth token

        // Magic DB fix
        try {
            await pool.query('ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_doctor_id_fkey');
            await pool.query('ALTER TABLE appointments ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES users(id)');
        } catch (dbErr) {
            console.log("Database constraint already updated or skipped.");
        }

        // Call the AI service
        const { summary, urgency } = await generatePreVisitSummary(symptoms);

        // Save to database
        const result = await pool.query(
            `INSERT INTO appointments (patient_id, doctor_id, appointment_time, symptoms, pre_visit_summary, urgency_level) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [patientId, doctorId, appointmentTime, symptoms, summary, urgency]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ error: "Failed to book appointment." });
    }
};

// 2. Get Doctor's Appointments Function
const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const result = await pool.query(
            `SELECT a.id, a.appointment_time, a.symptoms, a.pre_visit_summary, a.urgency_level, a.status,
                    u.name as patient_name, u.email as patient_email
             FROM appointments a
             JOIN users u ON a.patient_id = u.id
             WHERE a.doctor_id = $1
             ORDER BY a.appointment_time ASC`,
            [doctorId]
        );

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Error fetching doctor appointments:", error);
        res.status(500).json({ error: "Server error while fetching appointments." });
    }
};

// 3. Get All Doctors Function (for the dropdown)
const getDoctors = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email FROM users WHERE role = 'doctor' ORDER BY name ASC`
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Failed to fetch doctors list." });
    }
};

// Export ALL THREE functions
module.exports = { bookAppointment, getDoctorAppointments, getDoctors };