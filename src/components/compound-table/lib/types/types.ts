import { RefObject } from 'react';

type PivotSideT = 'LEFT' | 'RIGHT';
type ReactChildrenT = JSX.Element[] | JSX.Element;

export interface PivotPropsI {
  side: PivotSideT;
  location: number;
}
export interface ColumnI {
  title: string;
  ref: RefObject<HTMLTableCellElement>;
}
export interface TablePropsI {
  children: ReactChildrenT;
  headers: string[];
  minCellWidth: number;
}
export interface ChildrenI {
  children: ReactChildrenT;
}
