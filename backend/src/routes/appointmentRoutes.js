const express = require('express');
const router = express.Router();

// 1. Import ALL THREE functions from the controller
const { bookAppointment, getDoctorAppointments, getDoctors } = require('../controllers/appointmentController');

// 2. Import the middleware
const authMiddleware = require('../middleware/authMiddleware');

// 3. Define the routes
router.post('/book', authMiddleware, bookAppointment);
router.get('/doctor', authMiddleware, getDoctorAppointments);
router.get('/doctors-list', authMiddleware, getDoctors);

module.exports = router;