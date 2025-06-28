import React from 'react'
import css from './Footer.module.css'
import logo from '../../assets/pokemon.png'

export default function Header() {
  return (
    <nav className={css.footer}>
        <div className={css.div_footer}>
            <div className={css.logo}>
                <img src={logo} alt="logo" />

            </div>
        </div>
    </nav>
  )
}
