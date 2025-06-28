const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_aqui';

// Registro
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Verificar si usuario ya existe
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Usuario ya registrado' });

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario nuevo
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ msg: 'Usuario creado exitosamente' });
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

    // Comparar password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

    // Crear token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};
