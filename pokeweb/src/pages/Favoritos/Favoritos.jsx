import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Favoritos.module.css"; // 👈 Importa el CSS

export default function Favoritos() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBox, setCurrentBox] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`https://pokedex-api-hpim.onrender.com/api/favorites/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorites(res.data);
      } catch (err) {
        console.error("Error al obtener favoritos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, token]);

  const handleRemove = async (pokemonId) => {
    try {
      await axios.delete(`https://pokedex-api-hpim.onrender.com/api/favorites/remove/${user.id}/${pokemonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites((prev) => prev.filter((p) => p.id !== pokemonId));
    } catch (err) {
      console.error("Error al eliminar favorito:", err);
    }
  };

  // === Box logic ===
  const boxSize = 30;
  const totalBoxes = Math.ceil(favorites.length / boxSize);
  const currentFavorites = favorites.slice(
    currentBox * boxSize,
    currentBox * boxSize + boxSize
  );

  const handlePrev = () => {
    if (currentBox > 0) setCurrentBox(currentBox - 1);
  };

  const handleNext = () => {
    if (currentBox < totalBoxes - 1) setCurrentBox(currentBox + 1);
  };

  if (!user) return <p>Debes iniciar sesión para ver tus favoritos.</p>;
  if (loading) return <p>Cargando favoritos...</p>;

  return (
   <div className={styles.pcContainer}>
      <h2 className={styles.title}>Caja {currentBox + 1}</h2>
      {favorites.length === 0 ? (
        <p className={styles.emptyMessage}>No tienes favoritos aún.</p>
      ) : (
        <>
          <div className={styles.pcBox}>
            <div className={styles.grid}>
              {currentFavorites.map((poke) => (
                <div key={poke.id} className={styles.slot}>
                  <img src={poke.sprite} alt={poke.name} className={styles.pokeImg} />
                  <span className={styles.pokeName}>{poke.name}</span>
                  <button
                    onClick={() => handleRemove(poke.id)}
                    className={styles.removeBtn}
                    aria-label={`Quitar ${poke.name} de favoritos`}
                  >
                    ❌
                  </button>
                </div>
              ))}
              {/* Render empty slots if box not full */}
              {Array.from({ length: boxSize - currentFavorites.length }).map((_, i) => (
                <div key={`empty-${i}`} className={styles.slot}></div>
              ))}
            </div>
          </div>

          <div className={styles.boxNav}>
            <button onClick={handlePrev} disabled={currentBox === 0}>
              ◀ Anterior
            </button>
            <span>Box {currentBox + 1} / {totalBoxes}</span>
            <button onClick={handleNext} disabled={currentBox === totalBoxes - 1}>
              Siguiente ▶
            </button>
          </div>
        </>
      )}
    </div>

  );
}
