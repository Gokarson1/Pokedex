import React, { useState } from "react";
import { register } from "../../services/authService";
import styles from './RegisterForm.module.css'; // 👈 Importa el CSS module

export default function RegisterForm({ onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    try {
      await register(username, email, password);
      setMsg("Registro exitoso. Ahora puedes iniciar sesión.");
      onRegisterSuccess(); // Cambia a modo login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2>Registro</h2>
      {msg && <p className={styles.success}>{msg}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registrarse</button>
    </form>
  );
}
