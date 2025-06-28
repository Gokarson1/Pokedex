const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const authMiddleware = require('../middleware/auth');

// Crear un nuevo equipo (protegido)
router.post('/create', authMiddleware, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const team = new Team({ name, user: userId, pokemons: [] });
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear equipo' });
  }
});

// Obtener todos los equipos del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const teams = await Team.find({ user: userId });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener equipos' });
  }
});

// Agregar Pokémon a un equipo (verifica dueño)
router.post('/add/:teamId', authMiddleware, async (req, res) => {
  const { teamId } = req.params;
  const userId = req.user.id;
  const { name, id, sprite } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ msg: 'Equipo no encontrado' });
    if (team.user.toString() !== userId) return res.status(403).json({ msg: 'No autorizado' });

    if (team.pokemons.length >= 6) {
      return res.status(400).json({ msg: 'El equipo ya tiene 6 Pokémon' });
    }

    team.pokemons.push({ name, id, sprite });
    await team.save();

    res.json(team);
  } catch (err) {
    res.status(500).json({ msg: 'Error al agregar Pokémon' });
  }
});

// Eliminar Pokémon de un equipo (verifica dueño)
router.delete('/remove/:teamId/:pokemonId', authMiddleware, async (req, res) => {
  try {
    const { teamId, pokemonId } = req.params;
    const userId = req.user.id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ msg: 'Equipo no encontrado' });
    if (team.user.toString() !== userId) return res.status(403).json({ msg: 'No autorizado' });

    team.pokemons = team.pokemons.filter(p => p._id.toString() !== pokemonId);
    await team.save();

    res.json({ msg: 'Pokémon eliminado del equipo', team });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Eliminar un equipo completo (verifica dueño)
router.delete('/delete/:teamId', authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ msg: 'Equipo no encontrado' });
    if (team.user.toString() !== userId) return res.status(403).json({ msg: 'No autorizado' });

    await Team.findByIdAndDelete(teamId);
    res.json({ msg: 'Equipo eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
