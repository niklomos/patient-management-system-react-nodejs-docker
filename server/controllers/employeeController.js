const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.registerEmployee = async (req, res) => {
  const { first_name, last_name, email, phone_number, role, password } = req.body;

  try {
    const checkEmailSql = 'SELECT * FROM employees WHERE email = ?';
    const [existingEmployee] = await db.query(checkEmailSql, [email]);

    if (existingEmployee.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO Employees (first_name, last_name, email, phone_number, role, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(sql, [first_name, last_name, email, phone_number, role, hashedPassword]);

    res.status(201).json({ message: 'employee registered successfully', userId: result.insertId });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = 'SELECT * FROM employees WHERE email = ?';
    const [results] = await db.query(sql, [email]);


    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const employee = results[0];

    // Check password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: employee.id, email: employee.email },process.env.JWT_SECRET,{ expiresIn: '1h' });

    // Send the token in response
    res.json({ message: 'Login successful', token:token, empName: employee.first_name ,empId:employee.id});
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a patient by ID
exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = 'SELECT * FROM employees WHERE id = ?';
    const [results] = await db.query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

