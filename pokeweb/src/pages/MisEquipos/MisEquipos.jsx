import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MisEquipos.module.css";

export default function MisEquipos() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState("");
  const [creating, setCreating] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) return;

    const fetchTeams = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/teams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeams(res.data);
      } catch (err) {
        console.error("Error al obtener equipos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [user, token]);

  const handleDelete = async (teamId) => {
    try {
      await axios.delete(`http://localhost:3001/api/teams/delete/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeams((prev) => prev.filter((team) => team._id !== teamId));
    } catch (err) {
      console.error("Error al eliminar equipo:", err);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;

    setCreating(true);
    try {
      const res = await axios.post(
        `http://localhost:3001/api/teams/create`,
        {
          name: newTeamName,
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeams((prev) => [...prev, res.data]);
      setNewTeamName("");
    } catch (err) {
      console.error("Error al crear equipo:", err);
    } finally {
      setCreating(false);
    }
  };

  if (!user) return <p>Debes iniciar sesión para ver tus equipos.</p>;
  if (loading) return <p>Cargando equipos...</p>;

  return (
     <div className={styles.container}>
      <h2>Mis Equipos</h2>

      <div className={styles.teamCreator}>
        <input
          type="text"
          placeholder="Nombre del nuevo equipo"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          disabled={creating}
        />
        <button onClick={handleCreateTeam} disabled={creating || !newTeamName.trim()}>
          {creating ? "Creando..." : "Crear Equipo"}
        </button>
      </div>

      {teams.length === 0 ? (
        <p>No tienes equipos aún.</p>
      ) : (
        <ul className={styles.teamsList}>
          {teams.map((team) => (
            <li key={team._id} className={styles.teamCard}>
              <div className={styles.teamHeader}>
                <strong>{team.name}</strong>
                <button onClick={() => handleDelete(team._id)} className={styles.deleteButton}>
                  ❌ Eliminar equipo
                </button>
              </div>

              <div className={styles.pokeGrid}>
                {[...Array(6)].map((_, i) => {
                  const poke = team.pokemons[i];
                  return (
                    <div key={i} className={styles.pokeSlot}>
                      {poke ? (
                        <>
                          <img src={poke.sprite} alt={poke.name} width="50" />
                          <div className={styles.pokeName}>{poke.name}</div>
                          <button
                            onClick={async () => {
                              try {
                                await axios.delete(
                                  `http://localhost:3001/api/teams/remove/${team._id}/${poke._id}`,
                                  {
                                    headers: { Authorization: `Bearer ${token}` },
                                  }
                                );
                                setTeams((prev) =>
                                  prev.map((t) =>
                                    t._id === team._id
                                      ? {
                                          ...t,
                                          pokemons: t.pokemons.filter((p) => p._id !== poke._id),
                                        }
                                      : t
                                  )
                                );
                              } catch (err) {
                                console.error("Error al eliminar Pokémon del equipo:", err);
                              }
                            }}
                            className={styles.removeBtn}
                          >
                            ❌
                          </button>
                        </>
                      ) : (
                        <div className={styles.emptySlot}>—</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
