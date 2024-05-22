import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Solicitud } from '../types/Solicitud';
import { fetchSolicitud, patchSolicitud } from '../services/solicitudesApi';
import SolicitudForm from '../components/SolicitudForm';
import { Status } from '../types/Auth';
import Spinner from '../components/Spinner';
import { AxiosError } from 'axios';
import { getErrorMessage } from '../utils';

export default function IndexSolicitudes() {
  const params = useParams();
  const navigate = useNavigate();

  const { idSol } = params;

  const [sol, setSol] = useState({} as Solicitud);

  const [status, setStatus] = useState(Status.NOT_SUBMITTED);
  const [error, setError] = useState('' as string);

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setSol({
      ...sol,
      [target.name]: target.value,
    });

    if (status === Status.ERROR) {
      setStatus(Status.NOT_SUBMITTED);
      setError('');
    }
  }

  function handleSubmit() {
    setStatus(Status.LOADING);

    if (
      error ||
      Object.values(sol).some((it) => typeof it !== 'boolean' && !it) ||
      !idSol
    ) {
      setStatus(Status.ERROR);
      return;
    }
    // Update solicitud
    patchSolicitud(idSol.toString(), sol)
      .then(() => {
        navigate('/solicitudes');
      })
      .catch((e: AxiosError) => {
        setStatus(Status.ERROR);
        setError(getErrorMessage(e));
      });
  }

  const handleError = (e: string) => {
    if (!error) {
      setError(e);
    }
  };

  useEffect(() => {
    if (!idSol) {
      navigate('/solicitudes');
      return;
    }

    // Fetch solicitud
    fetchSolicitud(idSol)
      .then((res) => {
        setSol({...res});
      })
      .catch(() => {
        navigate('/solicitudes');
      });
  }, [idSol, navigate]);

  if (Object.keys(sol).length === 0) {
    return (
      <div className='flex flex-col h-full justify-center items-middle'>
        <Spinner classes='h-28 text-moni-blue' />
      </div>
    );
  }

  return (
    <div className='justify-between-dashboard'>
      <div className='flex flex-col align-items-middle space-y-4'>
        <p className='font-extrabold text-2xl text-moni-blue text-center'>
          Editando solicitud {'#' + idSol}
        </p>
        <SolicitudForm
          reqs={sol}
          status={status}
          handleChange={handleChange}
          setError={handleError}
        />
      </div>

      {/* Botón de confirmación */}
      <div className='mt-14'>
        <div className='text-center text-moni-error italic'>
          {status === Status.ERROR ? error : ''}
        </div>
        <button
          className='big-button mt-1 flex justify-center'
          onClick={handleSubmit}
        >
          {status === Status.LOADING ? (
            <Spinner classes='h-7 text-white' />
          ) : (
            'Confirmar'
          )}
        </button>
      </div>
    </div>
  );
}
