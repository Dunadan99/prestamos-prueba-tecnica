import React from 'react';

interface RadioInputProps {
  name: string;
  options: { option: string; value: string }[];
  selectedOption: string;
  setSelectedOption: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioInput: React.FC<RadioInputProps> = ({
  name,
  options,
  selectedOption,
  setSelectedOption,
}) => {
  return (
    <div className='flex flex-row justify-between'>
      {options.map((option, index) => (
        <label key={index} className='flex flex-row space-x-2'>
          <input
            type='radio'
            name={name}
            value={option.value}
            checked={selectedOption === option.value}
            onChange={setSelectedOption}
          />
          <div>{option.option}</div>
        </label>
      ))}
    </div>
  );
};

export default RadioInput;
