import React from 'react';
import TextInput from './TextInput';
import { GENDERS, SolicitudReq, solicitudValidation } from '../types/Solicitud';
import RadioInput from './RadioInput';
import { Status } from '../types/Auth';

interface SolicitudFormProps {
  reqs: SolicitudReq;
  status: Status;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setError: (e: string) => void;
}

const SolicitudForm: React.FC<SolicitudFormProps> = ({
  reqs,
  status,
  handleChange,
  setError,
}) => {
  function formValidation(): { [key: string]: boolean } {
    const isSubmitted = status !== Status.NOT_SUBMITTED;
    const errors = solicitudValidation(reqs, !isSubmitted);

    if (Object.values(errors).some((it) => it)) {
      setError('Hay errores en el formulario');
    }
    return errors;
  }

  return (
    <>
      <div className='flex flex-row w-full space-x-4'>
        <TextInput
          name='first_name'
          type='text'
          text={reqs.first_name}
          setText={handleChange}
          placeholder='Nombre'
          showError={formValidation().first_name}
        />
        <TextInput
          name='last_name'
          type='text'
          text={reqs.last_name}
          setText={handleChange}
          placeholder='Apellido'
          showError={formValidation().last_name}
        />
      </div>
      <TextInput
        name='email'
        text={reqs.email}
        type='email'
        setText={handleChange}
        placeholder='Email'
        showError={formValidation().email}
      />
      <TextInput
        name='dni'
        text={reqs.dni}
        type='number'
        setText={handleChange}
        placeholder='DNI'
        showError={formValidation().dni}
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
        showError={formValidation().amount}
      />
    </>
  );
};

export default SolicitudForm;
