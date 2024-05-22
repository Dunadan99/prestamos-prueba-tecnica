import React from 'react';

interface TextInputProps {
  name: string
  text: string | number | undefined;
  setText: any;
  type?: string;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ name, text, setText, type = 'text', placeholder }) => {
  return (
    <div className={'w-full ' + (text ? '' : 'pt-4')}>
      {
        text && (
          <div className='text-xs ml-1 font-semibold bg-white'>
            {placeholder}
          </div>
        )
      }
      <input
        className='w-full border border-gray-300 rounded-md p-2'
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