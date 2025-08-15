const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });



  try {
  const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
  req.user = { id: payload.id, email: payload.email, name: payload.name };
  next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
