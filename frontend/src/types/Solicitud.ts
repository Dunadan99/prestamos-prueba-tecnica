import { validators } from '../utils';

export type SolicitudReq = {
  first_name: string;
  last_name: string;
  email: string;
  gender: 'M' | 'F' | 'O' | 'N' | string;
  dni: number | string;
  amount: number | string;
};

export type Solicitud = SolicitudReq & {
  id: number;
  creation_date: string;
  granted: boolean;
};

export type SolicitudesRes = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Solicitud[];
};

export const GENDERS = [
  { option: 'Hombre', value: 'M' },
  { option: 'Mujer', value: 'F' },
  { option: 'Otro', value: 'O' },
  { option: 'Prefiero no decir', value: 'N' },
];

export function getGender(value: string) {
  return GENDERS.find((it) => it.value === value)?.option || value;
}

export function solicitudValidation(
  sol: SolicitudReq,
  checkEmpty: boolean
): { [key: string]: boolean } {
  return {
    first_name: !(sol.first_name ? validators.isValidName(sol.first_name) : checkEmpty),
    last_name: !(sol.last_name ? validators.isValidName(sol.last_name) : checkEmpty),
    email: !(sol.email ? validators.isValidEmail(sol.email) : checkEmpty),
    dni: !(sol.dni ? validators.isValidDNI(sol.dni.toString()) : checkEmpty),
    amount: !(sol.amount 
      ? Number(sol.amount) > 0 && Number(sol.amount) <= 9999999999
      : checkEmpty),
  };
}
