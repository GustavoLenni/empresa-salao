import React, { useState } from 'react';
import '../styles/login.css';
import Images from '../assets/images';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login realizado:', formData);
      alert('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro no login:', error);
      setErrors({
        general: 'Erro ao fazer login'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Gradient suave no background */}
      <div className="background-gradient"></div>
      
      <div className="login-content">
        {/* Logo simples */}
        <div className="logo-section">
          <div className="logo">
            <img 
              src={Images.Logo} 
              alt="Claudete Dias" 
              className="logo-img"
            />
          </div>
          <h1 className="brand-name">Salão da Clau</h1>
          <p className="brand-tagline">Gestão Financeira</p>
        </div>

        {/* Formulário minimalista */}
        <form className="login-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-alert">
              {errors.general}
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              name="email"
              className={`input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="input-group">
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Senha"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading">
                <span className="spinner"></span>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>

          <button 
            type="button" 
            className="forgot-link"
            onClick={() => alert('Funcionalidade de recuperar senha')}
          >
            Esqueceu a senha?
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;