import { useRef } from 'react';

export const createSmartHeaders = (headers: any[]) => {
  return headers.map(({ headerTitle, columnTitle }, index) => ({
    id: index,
    order: index,
    headerTitle,
    columnTitle,
    ref: useRef(),
    isShown: true,
  }));
};
