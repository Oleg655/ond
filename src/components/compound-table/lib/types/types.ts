import { RefObject } from 'react';

type PivotSideT = 'LEFT' | 'RIGHT';
type ReactChildrenT = JSX.Element[] | JSX.Element;

export interface PivotPropsI {
  side: PivotSideT;
  location: number;
}
export interface ColumnI {
  id?: number;
  order: number;
  headerTitle: string;
  columnTitle: string;
  ref: RefObject<HTMLTableCellElement>;
  isShown: boolean;
}
export interface TablePropsI {
  children: ReactChildrenT;
  // headers: string[];
  minCellWidth: number;
  smartColumn: ColumnI[];
}
export interface ChildrenI {
  children: ReactChildrenT;
}
