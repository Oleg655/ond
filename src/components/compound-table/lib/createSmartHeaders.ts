import { useRef } from 'react';

export const createSmartHeaders = (headers: string[]) => {
  return headers.map((header, index) => ({
    id: index,
    title: header,
    ref: useRef(),
  }));
};
