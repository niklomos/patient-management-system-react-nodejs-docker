const db = require('../config/db');
const path = require('path');
const fs = require('fs');
const upload = require('../config/uploadConfig');

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const status = req.query.status;

    const [results] = await db.query('SELECT * FROM patients WHERE status = ?', [status]);
    
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const generateHospitalNumber = async () => {
  const sql = 'SELECT MAX(hospital_number) AS lastNumber FROM patients';
  const [result] = await db.query(sql);

  let lastNumber = result[0].lastNumber || '0000'; 
  let newNumber = (parseInt(lastNumber) + 1).toString().padStart(4, '0'); 

  return newNumber;
};

exports.addPatient = async (req, res) => {
  const { 
    first_name, last_name, date_of_birth, gender, phone_number, email, address, 
    medical_history, current_medications, emergency_contact_name, emergency_contact_phone, 
    insurance_information,  created_by, updated_by 
  } = req.body;

  const profile_picture = req.file ? req.file.filename : null;
  const hospital_number = await generateHospitalNumber(); 

  const sql = `
    INSERT INTO patients 
    (hospital_number, first_name, last_name, date_of_birth, gender, phone_number, email, address, 
    medical_history, current_medications, emergency_contact_name, emergency_contact_phone, 
    insurance_information,  profile_picture, created_by, updated_by) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?)
  `;
  const values = [
    hospital_number, first_name, last_name, date_of_birth, gender, phone_number, email, address, 
    medical_history, current_medications, emergency_contact_name, emergency_contact_phone, 
    insurance_information,  profile_picture, created_by, updated_by
  ];

  try {
    const [results] = await db.query(sql, values);
    res.status(201).json({ id: results.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Update a patient
exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { 
    first_name, last_name, date_of_birth, gender, phone_number, email, address, 
    medical_history, current_medications, emergency_contact_name, emergency_contact_phone, 
    insurance_information 
  } = req.body;
  
  const updated_by = req.body.updated_by; 

  try {
    const [patient] = await db.query('SELECT profile_picture FROM patients WHERE id = ?', [id]);
    
    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const profile_picture = req.file ? req.file.filename : patient[0].profile_picture; 

    const sql = `
      UPDATE patients 
      SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, phone_number = ?, email = ?, address = ?, 
          medical_history = ?, current_medications = ?, emergency_contact_name = ?, emergency_contact_phone = ?, 
          insurance_information = ?, profile_picture = ?, updated_by = ?
      WHERE id = ?
    `;

    const values = [
      first_name, last_name, date_of_birth, gender, phone_number, email, address, 
      medical_history, current_medications, emergency_contact_name, emergency_contact_phone, 
      insurance_information, profile_picture, updated_by, id
    ];

    const [results] = await db.query(sql, values);
    res.status(200).json({ message: 'Patient updated successfully' });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};



// Get a patient by ID
exports.getPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = 'SELECT * FROM patients WHERE id = ?';
    const [results] = await db.query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Delete a patient
exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM patients WHERE id = ?';
  
  try {
    await db.query(sql, [id]);
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateStatusPatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    const status = req.body.status;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const [result] = await db.query(
      'UPDATE patients SET status = ? WHERE id = ?',
      [status, patientId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: `Patient status updated to ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

