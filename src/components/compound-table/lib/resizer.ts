/* eslint-disable no-return-assign */
import { RefObject } from 'react';

import { ColumnI } from './types';

export const resizer = (
  event: MouseEvent,
  tableElement: RefObject<HTMLTableElement>,
  createdColumns: ColumnI[],
  minCellWidth: number,
  activeIndex: number,
) => {
  const fractions = createdColumns.map((column: ColumnI, index) => {
    if (index === activeIndex) {
      const width = event.clientX - column.ref.current.offsetLeft;
      if (width >= minCellWidth) {
        return `${width}px`;
      }
    }
    return `${column.ref.current.offsetWidth}px`;
  });
  tableElement.current.style.gridTemplateColumns = `${fractions.join(' ')}`;
};

export const hide = (
  currentIndex: number,
  tableElement: RefObject<HTMLTableElement>,
  createdColumns: ColumnI[],
  // minCellWidth: number,
) => {
  const fractions = createdColumns.filter((column: ColumnI, index) => {
    if (index === currentIndex) {
      return ``;
    }

    return `1fr`;
  });
  tableElement.current.style.gridTemplateColumns = `${fractions.join(' ')}`;
};

export const collapseColumn = (
  currentIndex: number,
  tableElement: RefObject<HTMLTableElement>,
  createdColumns: ColumnI[],
  minCellWidth: number,
) => {
  const fractions = createdColumns.map((column: ColumnI, index) => {
    if (index !== currentIndex && column.ref.current.offsetWidth === minCellWidth) {
      column.ref.current.style.display = 'none';
      return ``;
    }
    if (index === currentIndex) {
      column.ref.current.style.display = 'none';
      return ``;
    }

    return `1fr`;
  });
  console.log(tableElement.current.children);
  tableElement.current.style.gridTemplateColumns = `${fractions.join(' ')}`;
};

export const showColumn = (
  currentIndex: number,
  tableElement: RefObject<HTMLTableElement>,
  createdColumns: ColumnI[],
  minCellWidth: number,
) => {
  const fractions = createdColumns.map((column: ColumnI, index) => {
    if (index === currentIndex && column.ref.current.offsetWidth === minCellWidth) {
      return '1fr';
    }
    if (index !== currentIndex && column.ref.current.offsetWidth === minCellWidth) {
      return `${minCellWidth}px`;
    }
    return `1fr`;
  });
  tableElement.current.style.gridTemplateColumns = `${fractions.join(' ')}`;
};
