import React, { useState } from 'react';
import './stage-input-date.css';

interface StageInputDateI {
  title: string;
  value?: string;
}
export const StageInputDate = ({ title, value }: StageInputDateI) => {
  const [inputValue, setInputValue] = useState<string>(value);
  return (
    <div className="stage-input-date-container">
      <span>{title}</span>
      <input
        type="date"
        className="stage-input-date"
        value={inputValue}
        onChange={event => setInputValue(event.currentTarget.value)}
      />
    </div>
  );
};
