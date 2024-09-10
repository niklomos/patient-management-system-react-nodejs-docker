const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const validateToken = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.json({ message: 'Token is valid', userId: decoded.userId });
  });
};

module.exports = { validateToken };
