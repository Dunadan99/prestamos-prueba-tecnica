import { Solicitud, SolicitudReq, SolicitudesRes } from '../types/Solicitud.ts';
import { api, authenticatedApi } from './http.ts';

export async function fetchAllSolicitudes(search = '', order = ''): Promise<SolicitudesRes> {
  const { data } = await authenticatedApi.get('/solicitudes/', { params: { search, order } });
  return data;
}

export async function fetchSolicitud(id: string): Promise<Solicitud> {
  const { data } = await authenticatedApi.get(`/solicitudes/${id}/`);
  return data;
}

export async function createSolicitud(body: SolicitudReq): Promise<Solicitud> {
  const { data } = await api.post('/solicitudes/', body);
  return data;
}

export async function patchSolicitud(id: string, body: SolicitudReq): Promise<Solicitud[]> {
  const { data } = await authenticatedApi.patch(`/solicitudes/${id}/`, body);
  return data;
}

export async function deleteSolicitud(id: string): Promise<Solicitud> {
  const { data } = await authenticatedApi.delete(`/solicitudes/${id}/`);
  return data;
}
