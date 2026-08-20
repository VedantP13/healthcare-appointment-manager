const express = require('express');
const { bookAppointment } = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Only logged-in users with the 'patient' role can book
router.post('/book', authenticate, authorize(['patient']), bookAppointment);

module.exports = router;