import { useState } from 'react';
import { SolicitudReq, Solicitud } from '../types/Solicitud';
import { createSolicitud } from '../services/solicitudesApi';
import Spinner from '../components/Spinner';
import SolicitudForm from '../components/SolicitudForm';
import { Status } from '../types/Auth';
import { AxiosError } from 'axios';
import { getErrorMessage } from '../utils';
import Check from '../components/Check';
import X from '../components/X';

export default function IndexCreate() {
  const baseInfo = {
    first_name: '',
    last_name: '',
    email: '',
    dni: '',
    gender: '',
    amount: '',
  } as SolicitudReq;

  const [reqs, setReqs] = useState({ ...baseInfo });
  const [res, setRes] = useState({...baseInfo, id: 0} as Solicitud);

  const [status, setStatus] = useState(Status.NOT_SUBMITTED);
  const [error, setError] = useState('' as string);

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

    if (error || Object.values(reqs).some((it) => !it)) {
      setStatus(Status.ERROR);
      return;
    }
    createSolicitud(reqs)
      .then((res) => {
        setStatus(Status.SUCCESS);
        setRes(res);
      })
      .catch((e: AxiosError) => {
        setStatus(Status.ERROR);
        setError(getErrorMessage(e));
      });
  }

  function handleReset() {
    setReqs({ ...baseInfo });
    setStatus(Status.NOT_SUBMITTED);
    setError('');
  }

  const handleError = (e: string) => {
    setError(e);
  }

  function getEndTitles(): string[] {
    if (res.granted) {
      return ['¡Felicitaciones!', 'Tu solicitud fue aprobada'];
    }
    return ['Lo lamentamos', 'Tu solicitud fue rechazada'];
  }

  if (status !== Status.SUCCESS) {
    return (
      <div className='justify-between-dashboard'>
        <div className='flex flex-col align-items-middle space-y-4'>

          {/* Titulos */}
          <div className='text-center'>
            <h1 className='font-bold text-moni-blue mb-2'>
              Solicitar prestamo
            </h1>
            <h3 className='mb-2'>
              Completa los datos para validar tu solicitud
            </h3>
          </div>

          {/* Formulario */}
          <SolicitudForm
            reqs={reqs}
            status={status}
            handleChange={handleChange}
            setError={handleError} />
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
            {status === Status.LOADING ? <Spinner classes='h-7 text-white' /> : 'Confirmar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='justify-between-dashboard'>
      <div className='flex flex-col'>
        {/* Titulos */}
        <div className='text-center'>
          <h1 className='font-bold text-moni-blue mb-2'>{getEndTitles()[0]}</h1>
          <h2
            className={`text-center font-extrabold ${
              res.granted ? 'text-green-600' : 'text-moni-error'
            }`}
          >
            {getEndTitles()[1]}
          </h2>
        </div>
        <div className='flex flex-row justify-center'>{
          res.granted
            ? <Check classes='w-48 text-green-600' />
            : <X classes='w-48 text-moni-error'/>
          }</div>
      </div>

      <div>
        {/* Mensaje de ayuda */}
        <div>
          <p className='text-gray-600 text-center mx-6 mb-1'>
            {res.granted
              ? 'En breve recibirás un correo con los detalles de tu préstamo'
              : 'Puedes intentarlo nuevamente con otro monto'}
          </p>
        </div>

        {/* Botón de reintento */}
        <button className='big-button' onClick={handleReset}>
          Realizar otra solicitud
        </button>
      </div>
    </div>
  );
}
