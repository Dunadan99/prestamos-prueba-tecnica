import React from 'react';

interface PageButtonsProps {
  total: number;
  current: number;
  setCurrent: (value: number) => void;
}

const PageButtons: React.FC<PageButtonsProps> = ({
  total,
  current,
  setCurrent,
}) => {
  const handleArrowClick = (value: number) => {
    if (value < 1 || value > total) return;
    setCurrent(value);
  };

  let start = Math.max(current - 4, 1);
  const end = Math.min(start + 7, total);

  if (end - start < 7) {
    start = Math.max(end - 7, 1);
  }

  const buttons = [];
  for (let i = start; i <= end; i++) {
    buttons.push(
      <button
        key={i}
        className={`base-button min-w-11 ${
          i === current
            ? 'base-button-active'
            : 'bg-gray-200 hover:bg-moni-lightblue hover:text-white'
        }`}
        onClick={() => setCurrent(i)}
      >
        {i}
      </button>
    );
  }
  return (
    <div className='w-full flex flex-row justify-center space-x-3'>
      {(<button className='base-button' onClick={() => handleArrowClick(current - 1)}>
        {'<'}
        </button>) && current > 1}

      {buttons}

      {(<button className='base-button' onClick={() => handleArrowClick(current + 1)}>
        {'>'}
        </button>) && current < total}
    </div>
  );
};

export default PageButtons;
