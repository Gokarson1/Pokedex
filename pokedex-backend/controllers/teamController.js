const Team = require('../models/Team');

// Crear un nuevo equipo
exports.createTeam = async (req, res) => {
  const { name, userId } = req.body;

  try {
    const team = new Team({ name, user: userId, pokemons: [] });
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear equipo' });
  }
};

// Obtener todos los equipos de un usuario
exports.getTeamsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const teams = await Team.find({ user: userId });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener equipos' });
  }
};

// Agregar Pokémon a un equipo
exports.addPokemonToTeam = async (req, res) => {
  const { teamId } = req.params;
  const { name, id, sprite } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ msg: 'Equipo no encontrado' });

    if (team.pokemons.length >= 6) {
      return res.status(400).json({ msg: 'El equipo ya tiene 6 Pokémon' });
    }

    team.pokemons.push({ name, id, sprite });
    await team.save();

    res.json(team);
  } catch (err) {
    res.status(500).json({ msg: 'Error al agregar Pokémon' });
  }
};
