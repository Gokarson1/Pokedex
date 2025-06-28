import React, { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import './AuthPage.css'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <>
          <LoginForm />
          <p>
            ¿No tienes cuenta?{" "}
            <button onClick={() => setIsLogin(false)}>Regístrate</button>
          </p>
        </>
      ) : (
        <>
          <RegisterForm onRegisterSuccess={() => setIsLogin(true)} />
          <p>
            ¿Ya tienes cuenta?{" "}
            <button onClick={() => setIsLogin(true)}>Inicia sesión</button>
          </p>
        </>
      )}
    </div>
  );
}
