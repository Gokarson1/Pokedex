const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_aqui';

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ msg: 'No autorizado, token faltante' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // userId y username quedan accesibles en req.user
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};
