/* eslint-disable no-return-assign */
import React, { useState } from 'react';

import './stage.css';
import { StageInput } from './StageInput';
import { StageInputDate } from './StageInputDate';

export const Stage = () => {
  const [expand, setExpand] = useState(false);
  return (
    <>
      <div className={`stage ${expand && 'stage-expanded'}`} onClick={() => setExpand(true)}>
        <h4>Проверка комиссией по принятию</h4>
        <span>Важность - 30%</span>
        <span
          className="stage-burger"
          onClick={event => {
            event.stopPropagation();
            setExpand(!expand);
          }}
        >
          {expand ? <>&#128897;</> : <>&#128899;</>}
        </span>
        <p>Запланировано</p>
      </div>
      {expand && (
        <main>
          <StageInput title="Наименование" value="Проверка комиссией по принятию" />
          <div className="input-date-container">
            <StageInputDate title="Планируемая дата начала" />
            <StageInputDate title="Планируемая дата окончания" />
            <StageInputDate title="Фактическая дата начала" />
            <StageInputDate title="Фактическая дата окончания" />
          </div>
          <StageInput title="Длительность" value={365} />
          <StageInput title="Исполнитель мероприятия" value="Иванов Петр Сергеевич" />
          <StageInput title="Важность, %" value={20} />
          <StageInput title="Статус" value="Запланировано" />
          <StageInput title="Примечание" value="Введите текст примечания" />
        </main>
      )}
    </>
  );
};
