import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LampLoginAnimation() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lampOn, setLampOn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLampOn(true); // Enciende la lámpara y el brillo
    setTimeout(() => {
      setIsLoading(false);
      // Aquí puedes agregar tu lógica de autenticación o envío
    }, 2000);
  };

  return (
    <div className="lamp-login-wrapper">
      {/* Lámpara colgante superior */}
      <div className="lamp-container">
        <div className="lamp-cord"></div>
        <div className={`lamp-shade ${lampOn ? 'on' : ''}`}></div>
        <div className={`lamp-bulb ${lampOn ? 'on' : ''}`}></div>
        <div className={`lamp-glow ${lampOn ? 'on' : ''}`}></div>
      </div>

      {/* Formulario Estilo Glassmorphism ALLWEB */}
      <div className="contact-card allweb-tilt">
        <div className="contact-card-glow"></div>
        <h3><span>Acceso</span> / Iniciar Sesión</h3>
        <p>Ingresa tus credenciales para administrar tus servicios web.</p>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                placeholder="tucorreo@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={isLoading} style={{ marginTop: '10px' }}>
            {isLoading ? 'Verificando...' : 'Entrar a la plataforma'}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
