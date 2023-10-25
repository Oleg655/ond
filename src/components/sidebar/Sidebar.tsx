import React, { useContext, useState } from 'react';

import './sidebar.css';
import { TableContext } from 'components/compound-table/CompoundTable';
import { generateColumnsSize } from 'components/compound-table/lib';

import { Parameters } from './Parameters';
import { Stage } from './Stage';

export const Sidebar = ({ setShowSidebar }: { setShowSidebar: (flag: boolean) => void }) => {
  const { tableElement, smartColumn } = useContext(TableContext);
  const enum Page {
    STAGES,
    PARAMETERS,
  }
  const [page, setPage] = useState<Page>(Page.STAGES);
  return (
    <div className="sidebar">
      <header className="sidebar-header">
        <h3
          onClick={() => setPage(Page.STAGES)}
          className={page === Page.STAGES ? 'active-page' : ''}
        >
          Этапы
        </h3>
        <h3
          onClick={() => setPage(Page.PARAMETERS)}
          className={page === Page.PARAMETERS ? 'active-page' : ''}
        >
          Параметры
        </h3>
        <span
          className="close-sidebar"
          onClick={() => {
            tableElement.current.style.gridTemplateColumns = generateColumnsSize(smartColumn);
            setShowSidebar(false);
          }}
        >
          X
        </span>
      </header>
      {page === Page.STAGES && <Stage />}
      {page === Page.PARAMETERS && <Parameters />}
    </div>
  );
};
