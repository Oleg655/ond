import { ColumnI } from './types';

export const generateColumnsSize = (smartHeaders: ColumnI[]) => {
  const fractions = smartHeaders.map(element => {
    if (element.isShown) {
      return '1fr ';
    }
    return '';
  });

  return fractions.join(' ');
};
