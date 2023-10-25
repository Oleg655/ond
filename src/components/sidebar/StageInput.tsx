import React, { useState } from 'react';
import './stage-input.css';

interface StageInputI {
  title: string;
  value: string | number;
}
export const StageInput = ({ title, value }: StageInputI) => {
  const [inputValue, setInputValue] = useState<string | number>(value);
  return (
    <div className="stage-input-container">
      <span>{title}</span>
      <input
        className="stage-input"
        value={inputValue}
        onChange={event => setInputValue(event.currentTarget.value)}
      />
    </div>
  );
};
