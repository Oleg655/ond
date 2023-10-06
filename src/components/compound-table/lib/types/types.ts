import { RefObject } from 'react';

type PivotSideT = 'LEFT' | 'RIGHT';
type ReactChildrenT = JSX.Element[] | JSX.Element;

export interface PivotPropsI {
  side: PivotSideT;
  location: number;
}
export interface ColumnI {
  id?: number;
  title: string;
  ref: RefObject<HTMLTableCellElement>;
}
export interface TablePropsI {
  children: ReactChildrenT;
  headers: string[];
  minCellWidth: number;
  smartHeaders: ColumnI[];
}
export interface ChildrenI {
  children: ReactChildrenT;
}
