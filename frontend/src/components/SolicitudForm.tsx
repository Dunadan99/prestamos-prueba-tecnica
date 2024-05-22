import React from 'react';
import TextInput from './TextInput';
import { GENDERS, SolicitudReq } from '../types/Solicitud';
import RadioInput from './RadioInput';

interface SolicitudFormProps {
  reqs: SolicitudReq;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SolicitudForm: React.FC<SolicitudFormProps> = ({
  reqs,
  handleChange,
}) => {
  return (
      <>
          <div className='flex flex-row w-full space-x-4'>
            <TextInput
              name='first_name'
              text={reqs.first_name}
              setText={handleChange}
              placeholder='Nombre'
            />
            <TextInput
              name='last_name'
              text={reqs.last_name}
              setText={handleChange}
              placeholder='Apellido'
            />
          </div>
          <TextInput
            name='email'
            text={reqs.email}
            type='email'
            setText={handleChange}
            placeholder='Email'
          />
          <TextInput
            name='dni'
            text={reqs.dni}
            type='number'
            setText={handleChange}
            placeholder='DNI'
          />
          <div>
            <div className='text-gray-400 mb-1'>Genero</div>
            <RadioInput
              name='gender'
              options={GENDERS}
              selectedOption={reqs.gender}
              setSelectedOption={handleChange}
            />
          </div>
          <TextInput
            name='amount'
            text={reqs.amount}
            type='number'
            setText={handleChange}
            placeholder='Monto a solicitar'
          />
      </>
  );
};

export default SolicitudForm;
