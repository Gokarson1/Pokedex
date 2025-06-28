import React from 'react';
import css from './Header.module.css';
import logo from '../../assets/pokemon.png';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return (
    <nav className={css.header}>
      <div className={css.div_header}>
        <div className={css.logo}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>

        <div className={css.nav_links}>
          {user ? (
            <>
              <span>👤 {user.username}</span>
              <Link to="/miequipos">Mis Equipos</Link>
              <Link to="/favoritos">Favoritos</Link>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <button onClick={() => navigate('/auth')}>Iniciar sesión</button>
          )}
        </div>
      </div>
    </nav>
  );
}
