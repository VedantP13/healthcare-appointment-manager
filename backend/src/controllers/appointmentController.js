const db = require('../config/db');
const { generatePreVisitSummary } = require('../services/llmService');

const bookAppointment = async (req, res) => {
    const { doctorId, appointmentTime, symptoms } = req.body;
    const patientId = req.user.id; // Comes from our auth middleware!

    try {
        // 1. Generate the AI Summary
        const { summary, urgency } = await generatePreVisitSummary(symptoms);

        // 2. Save the appointment to the database
        const result = await db.query(
            `INSERT INTO appointments 
            (patient_id, doctor_id, appointment_time, symptoms, pre_visit_summary, urgency_level) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [patientId, doctorId, appointmentTime, symptoms, summary, urgency]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { bookAppointment };