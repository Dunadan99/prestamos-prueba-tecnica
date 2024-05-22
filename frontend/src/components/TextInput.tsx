import React from 'react';

interface TextInputProps {
  name: string;
  text: string | number | undefined;
  setText: any;
  type: string;
  placeholder?: string;
  showError: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  text,
  setText,
  type = 'text',
  placeholder,
  showError,
}) => {
  function getLabel() {
    if (text || showError) {
      return (<p className={`text-xs ml-1 font-semibold ${showError && 'text-moni-error'}`}>
        {showError && 'El '}{placeholder}{showError && (!text ? ' es requerido' : ' es inválido')}
      </p>);
    }
    return (<div className='h-4' />)
  }

  return (
    <div className='w-full'>
      {getLabel()}
      <input className={`w-full border border-gray-300 rounded-md p-2 ${showError && 'border-moni-error'}`}
        name={name}
        type={type}
        value={text}
        placeholder={placeholder}
        onChange={setText}
      />
    </div>
  );
};

export default TextInput;
