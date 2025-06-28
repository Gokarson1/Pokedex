import React, { useEffect, useState } from 'react';
import css from "./layout.module.css";
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import PokemonList from '../Pokemon/PokemonList';
import PokemonDetail from '../../PokemonDetail/PokemonDetail';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import AuthPage from '../../AuthPage/AuthPage'
import MisEquipos from '../../MisEquipos/MisEquipos';
import Favoritos from '../../Favoritos/Favoritos';

const API_URL = import.meta.env.VITE_API_URL;



export default function LayoutHome() {
  const [allNames, setAllNames] = useState([]);
  const [searchResults, setSearchResults] = useState(null); // lista de pokémon filtrados

  useEffect(() => {
    const fetchNames = async () => {
      const res = await axios.get(`${API_URL}/api/pokemon-names`);
      
      setAllNames(res.data);
    };
    fetchNames();
  }, []);

  const handleSearch = async (query) => {
    if (query.trim() === "") {
      setSearchResults(null);
      return;
    }

    const matched = allNames.filter(p => p.name.includes(query.toLowerCase()));

    const detailed = await Promise.all(
      matched.slice(0, 10).map(p => axios.get(p.url).then(res => res.data))
    );
    setSearchResults(detailed);
  };

  return (
    <div className={css.layout}>
      <Header  />

      <Routes>
        <Route path="/" element={<PokemonList pokemons={searchResults} onSearch={handleSearch} />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/miequipos" element={<MisEquipos />} />
        <Route path="/favoritos" element={<Favoritos />} />
      </Routes>

      <Footer />
    </div>
  );
}
