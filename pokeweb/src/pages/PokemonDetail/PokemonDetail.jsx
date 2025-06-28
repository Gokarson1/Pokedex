import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import css from './PokemonDetail.module.css';
import pokeball from '../../assets/pokebola.png';

export default function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [debilidades, setDebilidades] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teamMessage, setTeamMessage] = useState("");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemon(res.data);
      } catch (err) {
        console.error("Error fetching pokemon:", err);
      }
    };

    fetchPokemon();
  }, [name]);

  useEffect(() => {
    const fetchWeaknesses = async () => {
      if (!pokemon) return;
      try {
        const responses = await Promise.all(
          pokemon.types.map((t) =>
            axios.get(`https://pokeapi.co/api/v2/type/${t.type.name}`)
          )
        );

        const allWeaknesses = responses.flatMap((res) =>
          res.data.damage_relations.double_damage_from.map((t) => t.name)
        );

        const uniqueWeaknesses = [...new Set(allWeaknesses)];
        setDebilidades(uniqueWeaknesses);
      } catch (error) {
        console.error("Error fetching weaknesses:", error);
      }
    };

    fetchWeaknesses();
  }, [pokemon]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !pokemon) return;
      try {
        const res = await axios.get(`https://pokedex-api-hpim.onrender.com/api/favorites/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const found = res.data.find((p) => p.id === pokemon.id);
        setIsFavorite(!!found);
      } catch (err) {
        console.error("Error checking favorites:", err);
      }
    };

    checkFavorite();
  }, [pokemon, user, token]);
  useEffect(() => {
  if (!user) return;

  const fetchTeams = async () => {
    try {
      const res = await axios.get(`https://pokedex-api-hpim.onrender.com/api/teams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(res.data);
    } catch (err) {
      console.error("Error al obtener equipos:", err);
    }
  };

  fetchTeams();
}, [user, token]);
const handleAddToTeam = async () => {
  if (!selectedTeam) {
    setTeamMessage("Selecciona un equipo");
    return;
  }
  try {
    await axios.post(
      `https://pokedex-api-hpim.onrender.com/api/teams/add/${selectedTeam}`,
      {
        name: pokemon.name,
        id: pokemon.id,
        sprite: pokemon.sprites.front_default,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTeamMessage("Pokémon agregado al equipo!");
  } catch (err) {
    setTeamMessage("Error al agregar Pokémon: " + (err.response?.data?.msg || err.message));
  }
};

  const handleAddFavorite = async () => {
    if (!user || !token) return;

    try {
      await axios.post(
        `https://pokedex-api-hpim.onrender.com/api/favorites/add/${user.id}`,
        {
          name: pokemon.name,
          id: pokemon.id,
          sprite: pokemon.sprites.front_default,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFavorite(true);
    } catch (err) {
      console.error("Error al agregar a favoritos:", err);
    }
  };

  const handleNavigate = (offset) => {
    if (pokemon?.id) {
      const newId = pokemon.id + offset;
      navigate(`/pokemon/${newId}`);
    }
  };

  if (!pokemon) return <div className={css.loading}>Cargando...</div>;

  const tipos = pokemon.types.map((t) => t.type.name);

  function getStatColor(statName) {
    switch (statName) {
      case 'hp': return '#FF5959';
      case 'attack': return '#F5AC78';
      case 'defense': return '#FAE078';
      case 'special-attack': return '#9DB7F5';
      case 'special-defense': return '#A7DB8D';
      case 'speed': return '#FA92B2';
      default: return '#A8A77A';
    }
  }

  return (
    <div className={css.container}>
      <div className={css.navButtons}>
        <button onClick={() => handleNavigate(-1)}>⬅ Anterior</button>
        <h3 className="id-pokemon">#{pokemon.id.toString().padStart(3, '0')}</h3>
        <button onClick={() => handleNavigate(1)}>Siguiente ➡</button>
      </div>

      <div className={css.name}>
        <h1>{pokemon.name.toUpperCase()}</h1>
      </div>

      <div className={css.detailGrid}>
        <div className={css.leftColumn}>
          <div className={css.tipos}>
            <strong>Tipos:</strong>
            {tipos.map((tipo) => (
              <span key={tipo} className={`type-badge tipo-${tipo}`}>
                {tipo}
              </span>
            ))}
          </div>
          <div className={css.weaknesses}>
            <strong>Debilidades:</strong>
            {debilidades.length > 0 ? (
              debilidades.map((tipo) => (
                <span key={tipo} className={`type-badge tipo-${tipo}`}>
                  {tipo}
                </span>
              ))
            ) : (
              <p>Cargando...</p>
            )}
          </div>
          <div className={css.abilities}>
            <strong>Habilidades:</strong>
            <ul>
              {pokemon.abilities.map((a) => (
                <li key={a.ability.name}>{a.ability.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={css.centerColumn}>
          <div className={css.pokeImageContainer}>
            <img src={pokeball} className={css.pokeballBackground} alt="pokeball" />
            <img
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              className={css.pokemonImage}
            />
          </div>
        </div>

        <div className={css.rightColumn}>
          <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
          <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>

          <div>
            <strong>Stats:</strong>
            <div className={css.statsContainer}>
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className={css.statRow}>
                  <span className={css.statName}>{stat.stat.name}</span>
                  <div className={css.statBarBackground}>
                    <div
                      className={css.statBar}
                      style={{
                        width: `${Math.min(stat.base_stat, 150) / 1.5}%`,
                        backgroundColor: getStatColor(stat.stat.name),
                      }}
                    >
                      <span className={css.statValue}>{stat.base_stat}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
              
          {user && (
            
          isFavorite ? (
            
            <p>✅ Ya está en favoritos</p>
          ) : (
            <button onClick={handleAddFavorite}>❤️ Agregar a favoritos</button>
          )
          
        )}

        
        {user && (
  <div style={{ marginTop: '1rem' }}>
    <h3>Agregar a un equipo</h3>
    <select
      className={css.custom_select}
      value={selectedTeam}
      onChange={e => {
        setSelectedTeam(e.target.value);
        setTeamMessage("");
      }}
    >
      <option value="">-- Selecciona equipo --</option>
      {teams.map(t => (
        <option key={t._id} value={t._id}>{t.name}</option>
      ))}
    </select>
    <button onClick={handleAddToTeam} style={{ marginLeft: '0.5rem' }}>Agregar</button>
    {teamMessage && <p>{teamMessage}</p>}
  </div>
)}

    </div>
  );
}
