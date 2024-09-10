const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const upload = require('../config/uploadConfig');

router.get('/', patientController.getAllPatients);
router.post('/', upload.single('profile_picture'), patientController.addPatient); 
router.put('/:id', upload.single('profile_picture'), patientController.updatePatient); 
router.get('/:id', patientController.getPatientById); 
router.put('/update-status/:id', patientController.updateStatusPatient);


module.exports = router;
