import { useNavigate } from 'react-router-dom';
import { Solicitud, getGender } from '../types/Solicitud';
import { priceFormatter, formatDate, formatTime } from '../utils';
import Spinner from './Spinner';

interface SolicitudItemProps {
  sol: Solicitud;
  handleDelete: (id: number) => void;
  isDeleting: boolean;
}

const SolicitudItem: React.FC<SolicitudItemProps> = ({sol, handleDelete, isDeleting}) => {
  const navigate = useNavigate();

  function handleEdit(id: number) {
    navigate(`/solicitudes/${id}`);
  }

  function getGrantedColor() {
    return sol.granted ? 'text-green-600' : 'text-moni-error';
  }

  return (
    <div key={sol.id} className='solicitud-card'>
      {/* Nombre y Precio */}
      <div className='flex flex-row justify-between'>
        <h3 className='font-extrabold truncate pr-5'>{sol.first_name} {sol.last_name}</h3>
        <h3 className={'font-bold ' + getGrantedColor()}>
          {priceFormatter.format(sol.amount as number)}
        </h3>
      </div>

      {/* Email y Estado */}
      <div className='flex flex-row justify-between'>
        <p>{sol.email}</p>
        <p className={'font-semibold ' + getGrantedColor()}>
          {sol.granted ? 'Aprobada' : 'Denegada'}
        </p>
      </div>

      {/* DNI y Género */}
      <p>{getGender(sol.gender)} • {sol.dni}</p>

      <div className='flex flex-row justify-between items-end'>
        {/* Fecha de creación */}
        <div className='text-xs text-moni-blue italic font-bold'>
          <p>Creada el {formatDate(sol.creation_date)} a las {formatTime(sol.creation_date)}</p>
        </div>

        {/* Opciones */}
        <div className='flex flex-row space-x-2'>
          <button className='base-button-white w-20' onClick={() => handleEdit(sol.id)}>
            Editar
          </button>
          <button className='delete-button w-20' onClick={() => handleDelete(sol.id)}>
            {isDeleting ? <Spinner classes='text-white h-4' /> : 'Borrar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SolicitudItem;
