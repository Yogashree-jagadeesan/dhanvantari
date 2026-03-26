-- ============================================================
--  Dhanvantari — MySQL Schema  v1.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS dhanvantari
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dhanvantari;

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(180)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('patient','doctor','admin') NOT NULL DEFAULT 'patient',
  is_verified   TINYINT(1) NOT NULL DEFAULT 0,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role  (role)
) ENGINE=InnoDB;

-- 2. PATIENT PROFILES
CREATE TABLE IF NOT EXISTS patient_profiles (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED NOT NULL UNIQUE,
  full_name     VARCHAR(120) NOT NULL,
  date_of_birth DATE,
  gender        ENUM('male','female','other','prefer_not_to_say'),
  phone         VARCHAR(20),
  address       TEXT,
  blood_group   VARCHAR(5),
  allergies     TEXT,
  avatar_url    VARCHAR(500),
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_patient_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. SPECIALTIES
CREATE TABLE IF NOT EXISTS specialties (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(10)
) ENGINE=InnoDB;

INSERT IGNORE INTO specialties (name, icon) VALUES
  ('General Physician','🏥'),('Mental Health','🧠'),
  ('Physical Therapy','💪'),('Ayurveda','🌿'),
  ('Dermatology','✨'),('Pediatrics','👶'),
  ('Cardiology','❤️'),('Orthopedics','🦴'),
  ('Gynecology','🌸'),('Dentistry','🦷');

-- 4. DOCTOR PROFILES
CREATE TABLE IF NOT EXISTS doctor_profiles (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id          INT UNSIGNED NOT NULL UNIQUE,
  full_name        VARCHAR(120) NOT NULL,
  specialty_id     SMALLINT UNSIGNED NOT NULL,
  qualification    VARCHAR(200),
  experience_years TINYINT UNSIGNED DEFAULT 0,
  bio              TEXT,
  consultation_fee DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  phone            VARCHAR(20),
  avatar_url       VARCHAR(500),
  google_meet_link VARCHAR(500),
  is_approved      TINYINT(1) NOT NULL DEFAULT 0,
  rating_avg       DECIMAL(3,2) DEFAULT 0.00,
  rating_count     INT UNSIGNED DEFAULT 0,
  available_from   TIME DEFAULT '09:00:00',
  available_to     TIME DEFAULT '18:00:00',
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_doctor_user      FOREIGN KEY (user_id)      REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_doctor_specialty FOREIGN KEY (specialty_id) REFERENCES specialties(id),
  INDEX idx_specialty (specialty_id),
  INDEX idx_approved  (is_approved)
) ENGINE=InnoDB;

-- 5. AVAILABILITY SLOTS
CREATE TABLE IF NOT EXISTS availability_slots (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  doctor_id   INT UNSIGNED NOT NULL,
  day_of_week TINYINT UNSIGNED NOT NULL,
  slot_time   TIME NOT NULL,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_slot_doctor FOREIGN KEY (doctor_id) REFERENCES doctor_profiles(id) ON DELETE CASCADE,
  UNIQUE KEY uq_doctor_slot (doctor_id, day_of_week, slot_time)
) ENGINE=InnoDB;

-- 6. APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_id       INT UNSIGNED NOT NULL,
  doctor_id        INT UNSIGNED NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  consult_type     ENUM('video','audio','chat') NOT NULL DEFAULT 'video',
  status           ENUM('pending','approved','rejected','cancelled','completed','no_show') NOT NULL DEFAULT 'pending',
  symptoms         TEXT,
  doctor_notes     TEXT,
  rejection_reason VARCHAR(255),
  google_meet_url  VARCHAR(500),
  fee_charged      DECIMAL(8,2),
  payment_status   ENUM('pending','paid','refunded') DEFAULT 'pending',
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
  CONSTRAINT fk_appt_doctor  FOREIGN KEY (doctor_id)  REFERENCES doctor_profiles(id),
  INDEX idx_patient_status (patient_id, status),
  INDEX idx_doctor_status  (doctor_id,  status),
  INDEX idx_appt_date      (appointment_date)
) ENGINE=InnoDB;

-- 7. PRESCRIPTIONS
CREATE TABLE IF NOT EXISTS prescriptions (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT UNSIGNED NOT NULL UNIQUE,
  doctor_id      INT UNSIGNED NOT NULL,
  patient_id     INT UNSIGNED NOT NULL,
  medicines      JSON NOT NULL,
  notes          TEXT,
  issued_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rx_appt    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
  CONSTRAINT fk_rx_doctor  FOREIGN KEY (doctor_id)      REFERENCES doctor_profiles(id),
  CONSTRAINT fk_rx_patient FOREIGN KEY (patient_id)     REFERENCES patient_profiles(id)
) ENGINE=InnoDB;

-- 8. HEALTH RECORDS
CREATE TABLE IF NOT EXISTS health_records (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_id  INT UNSIGNED NOT NULL,
  doctor_id   INT UNSIGNED,
  title       VARCHAR(200) NOT NULL,
  record_type ENUM('lab_report','scan','prescription','vaccination','other') DEFAULT 'other',
  file_url    VARCHAR(500),
  notes       TEXT,
  recorded_on DATE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hr_patient FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
  CONSTRAINT fk_hr_doctor  FOREIGN KEY (doctor_id)  REFERENCES doctor_profiles(id)
) ENGINE=InnoDB;

-- 9. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT UNSIGNED NOT NULL UNIQUE,
  patient_id     INT UNSIGNED NOT NULL,
  doctor_id      INT UNSIGNED NOT NULL,
  rating         TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment        TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rev_appt    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
  CONSTRAINT fk_rev_patient FOREIGN KEY (patient_id)     REFERENCES patient_profiles(id),
  CONSTRAINT fk_rev_doctor  FOREIGN KEY (doctor_id)      REFERENCES doctor_profiles(id)
) ENGINE=InnoDB;

-- Auto-update doctor rating on review insert
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS trg_update_doctor_rating
AFTER INSERT ON reviews FOR EACH ROW
BEGIN
  UPDATE doctor_profiles
  SET rating_avg   = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE doctor_id = NEW.doctor_id),
      rating_count = (SELECT COUNT(*) FROM reviews WHERE doctor_id = NEW.doctor_id)
  WHERE id = NEW.doctor_id;
END$$
DELIMITER ;

-- 10. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  title      VARCHAR(200) NOT NULL,
  body       TEXT,
  type       ENUM('appointment','reminder','system','prescription') DEFAULT 'system',
  is_read    TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_read (user_id, is_read)
) ENGINE=InnoDB;

-- 11. REFRESH TOKENS
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  revoked    TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
--  SEED DATA  (demo accounts — change passwords in production)
-- ============================================================

-- Demo patient  (password: Patient@123)
INSERT IGNORE INTO users (id, email, password_hash, role, is_verified)
  VALUES (1,'patient@demo.com','$2b$12$DEMO_PATIENT_HASH_REPLACE_ME','patient',1);
INSERT IGNORE INTO patient_profiles (user_id, full_name, date_of_birth, gender, phone, blood_group)
  VALUES (1,'Rahul Sharma','1992-04-15','male','+91-9876543210','O+');

-- Demo doctor  (password: Doctor@123)
INSERT IGNORE INTO users (id, email, password_hash, role, is_verified)
  VALUES (2,'doctor@demo.com','$2b$12$DEMO_DOCTOR_HASH_REPLACE_ME','doctor',1);
INSERT IGNORE INTO doctor_profiles
  (user_id, full_name, specialty_id, qualification, experience_years, bio, consultation_fee, google_meet_link, is_approved)
  VALUES (2,'Dr. Priya Sharma',1,'MBBS, MD',12,
    'Expert in preventive care and chronic disease management.',
    499.00,'https://meet.google.com/demo-meet-link',1);
