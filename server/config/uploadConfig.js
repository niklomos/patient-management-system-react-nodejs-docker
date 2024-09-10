// config/uploadConfig.js
const multer = require('multer');
const path = require('path');

// กำหนดที่เก็บไฟล์และการตั้งค่า
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // โฟลเดอร์ที่เก็บไฟล์
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // ตั้งชื่อไฟล์ใหม่
  }
});

// ฟิลเตอร์ไฟล์ที่อนุญาต
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // ขนาดไฟล์สูงสุด 2MB
});

module.exports = upload;
