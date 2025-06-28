import React from 'react';
import './PokemonCard.css';
import './TypeColors.css';
import pokeball from '../../../assets/pokeball.png';
import { useNavigate } from 'react-router-dom';

export default function PokemonCard({ pokemon }) {
  const tipoPrincipal = pokemon.types[0]?.type.name;
  const tipos = pokemon.types.map((t) => t.type.name);
  const navigate = useNavigate();
  return (
    <div className={`pokemon-card tipo-${tipoPrincipal}`} onClick={() => navigate(`/pokemon/${pokemon.name}`)}>
      {/* 1. número */}
      <div className="card-header">
        <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
      </div>

      {/* 2. imagen */}
      <div className="image-wrapper">
        <img src={pokeball} alt="pokeball" className="pokeball" />
        <img src={pokemon.sprites.front_default} alt={pokemon.name} className="pokemon-image" />
      </div>

      {/* 3. nombre y tipo */}
      <h2 className="pokemon-name">{pokemon.name}</h2>
      <div className="types">
        {tipos.map((tipo) => (
          <span key={tipo} className={`type-badge tipo-${tipo}`}>
            {tipo}
          </span>
        ))}
      </div>
    </div>
  );
}
