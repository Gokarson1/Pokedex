// routes/favorites.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST agregar favorito
router.post('/add/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, id, sprite } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    const exists = user.favorites.some(p => p.id === id);
    if (exists) return res.status(400).json({ msg: "Pokémon ya está en favoritos" });

    user.favorites.push({ name, id, sprite });
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ msg: "Error al agregar favorito" });
  }
});

// DELETE eliminar favorito
router.delete('/remove/:userId/:pokemonId', async (req, res) => {
  const { userId, pokemonId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    user.favorites = user.favorites.filter(p => p.id !== Number(pokemonId));
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ msg: "Error al eliminar favorito" });
  }
});
// Obtener lista de favoritos de un usuario
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener favoritos" });
  }
});

module.exports = router;
