import React from 'react';
import './progressbar.css';

export const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="progressbar-container">
      <span>{`${progress}%`}</span>
      <div className="progressbar">
        <div style={{ width: `${progress}%` }} className="bar" />
      </div>
    </div>
  );
};
