require('dotenv').config();           // Carga variables de entorno
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');

// Importa rutas (elige solo una para users y una para teams)
const userRoutes = require('./routes/userRoutes');   // Unifica tus rutas de usuarios aquí
const teamRoutes = require('./routes/teamRoutes');   // Unifica aquí rutas de equipos
const favoritesRoutes = require('./routes/favorites'); // Rutas para favoritos si las usas
const authRoutes = require('./routes/authRoutes');

const app = express();

connectDB();  // Conecta a MongoDB

// Middlewares
app.use(cors());
app.use(express.json());

// Define rutas de tu API
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/auth', authRoutes);

// Proxy para PokeAPI
app.get('/api/pokemon/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: "Pokémon not found" });
  }
});

app.get('/api/pokemon', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const results = response.data.results;
    const pokemonDetails = await Promise.all(results.map(p => axios.get(p.url).then(res => res.data)));
    res.json(pokemonDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Pokémon list" });
  }
});

app.get('/api/pokemon-names', async (req, res) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1300`);
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Pokémon names" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
