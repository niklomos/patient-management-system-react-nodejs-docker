const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.post('/register', employeeController.registerEmployee);
router.post('/login', employeeController.loginEmployee);
router.get('/:id', employeeController.getEmployeeById);



module.exports = router;
