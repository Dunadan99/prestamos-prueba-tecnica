import TextInput from '../components/TextInput';
import { useEffect, useState } from 'react';
import { Solicitud } from '../types/Solicitud';
import { fetchAllSolicitudes, deleteSolicitud } from '../services/solicitudesApi';
import { AxiosError } from 'axios';
import { logout } from '../services/authApi';
import { useNavigate } from 'react-router-dom';
import PageButtons from '../components/PageButtons';
import SolicitudItem from '../components/SolicitudItem';
import { Status } from '../types/Auth';
import Spinner from '../components/Spinner';

export default function IndexSolicitudList() {
  const navigate = useNavigate();

  const [status, setStatus] = useState(Status.NOT_SUBMITTED);
  const [totalPages, setTotal] = useState(1);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('' as string);
  const [debouncedSearch, setDebouncedSearch] = useState('' as string);

  const [solicitudes, setSolicitudes] = useState([] as Solicitud[]);

  // Debounce search
  useEffect(() => {
    setStatus(Status.LOADING);
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {clearTimeout(timer);};
  }, [search]);

  // Fetch solicitudes
  useEffect(() => {
    setStatus(Status.LOADING);
    fetchAllSolicitudes(debouncedSearch, page.toString())
      .then((res) => {
        setSolicitudes(res.results);
        setTotal(Math.floor(res.count / 10));
        setStatus(Status.NOT_SUBMITTED);
      })
      .catch((e: AxiosError) => {
        if (e.response?.status === 401) {
          logout();
          navigate('/login');
        }
      });
  }, [navigate, debouncedSearch, page]);

  function handleDelete(id: number) {
    deleteSolicitud(id.toString())
      .then(() => {
        setSolicitudes(solicitudes.filter((solicitud) => solicitud.id !== id));
      })
      .catch((e: AxiosError) => {
        if (e.response?.status === 401) {
          logout();
          navigate('/login');
        }
      });
  }

  const solicitudesList = solicitudes.map((solicitud) => (
    <SolicitudItem key={solicitud.id} sol={{...solicitud}} handleDelete={handleDelete} />
  ));

  return (
    <div className='w-full flex flex-col justify-between-dashboard space-y-3'>
      <TextInput
        text={search}
        name='search'
        setText={(e: any) => setSearch(e.target.value)}
        placeholder='Buscar por nombre, apellido o DNI'
      />
      <div className='flex flex-col space-y-2'>{
        status === Status.LOADING
          ? <div className='flex flex-col justify-center'><Spinner classes='text-moni-blue' /></div>
          : (
            solicitudes.length === 0
            ? <h2 className='text-center text-moni-lightblue'>No hay solicitudes</h2>
            : solicitudesList
          )
      }</div>
      <PageButtons total={totalPages} current={page} setCurrent={setPage} />
    </div>
  );
}
