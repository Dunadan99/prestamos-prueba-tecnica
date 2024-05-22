import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/authApi';

export default function Header() {
  const location = useLocation();

  function getInfo(): { route: string; text: string } {
    const path = location.pathname;
    switch (path) {
      case '/login':
        return { route: '/', text: 'Regresar' };
      case path.match(/solicitudes/)?.input:
        return { route: '/', text: 'Cerrar Sesión' };
      default:
        return { route: '/login', text: 'Iniciar sesión' };
    }
  }

  const navigate = useNavigate();

  function handleClick(route: string) {
    if (route === '/') {
      logout();
    }
    navigate(route);
  }

  return (
    <header className='bg-white py-3 text-white flex flex-row justify-between align-middle px-28'>
      <button onClick={() => navigate('/')} className='cursor-pointer'>
        <img src='/icons/moni-logo.svg' alt='logo' className='h-10 '/>
      </button>
      <button onClick={() => handleClick(getInfo().route)} className='login-button'>
        {getInfo().text}
      </button>
    </header>
  );
}
