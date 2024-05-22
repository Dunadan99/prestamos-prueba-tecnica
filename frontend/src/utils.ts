import { AxiosError } from 'axios';

export const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

export function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getErrorMessage(error: AxiosError): string {
  const data = error?.response?.data;
  if (data) {
    switch (Object.keys(data)[0]) {
      case 'first_name':
        return 'El nombre es inválido';
      case 'last_name':
        return 'El apellido es inválido';
      case 'email':
        return 'El email es inválido';
      case 'dni':
        return 'El DNI es inválido';
      case 'amount':
        return 'El monto es inválido';
    }
  }
  return 'Ups! Ocurrió un error';
}

export const validators = {
  isValidUser: (user: string) => (/^[a-zA-Z0-9_-]+$/.test(user) || validators.isValidEmail(user)) && user.length < 100,
  isValidPass: (pass: string) => /[a-z]/.test(pass) && /[A-Z]/.test(pass) && /[0-9]/.test(pass)
    && pass.length >= 8 && pass.length <= 30,
  isValidName: (name: string) => /^[a-zA-ZÀ-ÖØ-öø-ÿ ]+$/.test(name) && name.length < 100,
  isValidDNI: (dni: string) => /^[0-9]{7,9}$/.test(dni),
  isValidEmail: (email: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) && email.length < 100,
};
