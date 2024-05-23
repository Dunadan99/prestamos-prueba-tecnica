import TextInput from '../components/TextInput';
import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { Status } from '../types/Auth';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authApi';
import { AxiosError } from 'axios';

export default function IndexLogin() {
  const navigate = useNavigate();

  const baseInfo = {
    user: '',
    password: '',
  };

  const [reqs, setReqs] = useState({ ...baseInfo });
  const [status, setStatus] = useState(Status.NOT_SUBMITTED);
  const [error, setError] = useState('' as string);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/solicitudes');
    }
  }, [navigate]);

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setReqs({
      ...reqs,
      [target.name]: target.value,
    });

    if (status === Status.ERROR) {
      setStatus(Status.NOT_SUBMITTED);
      setError('');
    }
  }

  function handleSubmit() {
    setStatus(Status.LOADING);
    login(reqs.user, reqs.password)
      .then(() => {
        navigate('/solicitudes');
      })
      .catch((e: AxiosError) => {
        setStatus(Status.ERROR);
        if (e.response?.status === 401) {
          setError('Usuario o contraseña incorrectos');
        } else {
          setError('Ups! Ocurrió un error');
        }
      });
  }

  return (
    <div className='justify-between-dashboard'>
      <div className='flex flex-col align-items-middle '>

        {/* Titulo */}
        <h1 className=' text-center font-bold text-moni-blue mb-10'>Iniciar sesión</h1>

        {/* Credenciales */}
          <div className='flex flex-col space-y-4'>
            <TextInput
              name='user'
              type='text'
              text={reqs.user}
              setText={handleChange}
              placeholder='Usuario'
              showError={false}
            />
            <TextInput
              name='password'
              type='password'
              text={reqs.password}
              setText={handleChange}
              placeholder='Contraseña'
              showError={false}
            />
          </div>
      </div>

      {/* Botón de confirmación */}
      <div className='mt-8'>
        <div className='text-center text-moni-error italic'>
          {error}
        </div>
        <button
          className='big-button mt-1 flex justify-center'
          onClick={handleSubmit}
        >
          {status === Status.LOADING ? <Spinner classes='h-7'/> : 'Confirmar'}
        </button>
      </div>
    </div>
  );
}
