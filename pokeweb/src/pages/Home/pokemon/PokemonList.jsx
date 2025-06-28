// pages/Home/Pokemon/PokemonList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PokemonCard from './PokemonCard';
import css from './Pokemon.module.css';
const API_URL = import.meta.env.VITE_API_URL;

export default function PokemonList({ pokemons,onSearch }) {
  const [page, setPage] = useState(1);
  const [fetchedPokemons, setFetchedPokemons] = useState([]);

  useEffect(() => {
    if (pokemons) return; // si es búsqueda, no hacemos fetch

    const fetchPokemons = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/pokemon?page=${page}&limit=20`);
        setFetchedPokemons(res.data);
      } catch (err) {
        console.error("Error fetching pokemons:", err);
      }
    };

    fetchPokemons();
  }, [page, pokemons]);

  const listToRender = pokemons || fetchedPokemons;


  const [query, setQuery] = useState("");
  
    const handleChange = (e) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    };


  return (
    <div className={css.wrapper}>
    <div className={css.searchContainer}>
        <input
          className={css.search}
          type="text"
          placeholder="Buscar Pokémon..."
          value={query}
          onChange={handleChange}
        />
      </div>
      
      <div className={css.grid}>
        {listToRender.length === 0 ? (
          <p>No se encontraron Pokémon.</p>
        ) : (
          listToRender.map(p => (
            <PokemonCard key={p.id} pokemon={p} />
          ))
        )}
      </div>
        
      {!pokemons && (
        <div className={css.pagination}>
          <button onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Anterior</button>
          <span>Página {page}</span>
          <button onClick={() => setPage(prev => prev + 1)}>Siguiente</button>
        </div>
      )}
    </div>
  );
}
