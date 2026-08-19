CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE urgency_status AS ENUM ('Low', 'Medium', 'High');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctor_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(100) NOT NULL,
    working_hours JSONB NOT NULL,
    slot_duration INTEGER NOT NULL
);

CREATE TABLE doctor_leaves (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    leave_date DATE NOT NULL,
    UNIQUE(doctor_id, leave_date)
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES users(id),
    doctor_id INTEGER REFERENCES doctor_profiles(id),
    appointment_time TIMESTAMP NOT NULL,
    symptoms TEXT NOT NULL,
    pre_visit_summary TEXT,
    urgency_level urgency_status,
    post_visit_summary TEXT,
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);