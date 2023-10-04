import React, { ChangeEvent, useState, KeyboardEvent } from 'react';

import './editable-span.css';

interface EditableSpanProps {
  title: string | number;
  // onSendData?: (newTitle: string) => void;
}

export const EditableSpan = ({ title }: EditableSpanProps) => {
  const [editMode, setEditMode] = useState(false);
  const [changedTitle, setChangedTitle] = useState(title || '');

  const onViewMode = () => {
    setEditMode(false);
    // onSendData(changedTitle);
  };

  const pressEnterKeyHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setEditMode(false);
      // onSendData(changedTitle);
    }
  };

  const onChangeTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setChangedTitle(event.currentTarget.value);
  };

  return (
    <div className="editable-span" onDoubleClick={() => setEditMode(true)}>
      {editMode ? (
        <input
          onChange={onChangeTitleHandler}
          type="text"
          autoFocus
          value={changedTitle}
          onBlur={onViewMode}
          onKeyPress={pressEnterKeyHandler}
        />
      ) : (
        <span>{changedTitle}</span>
      )}
    </div>
  );
};
