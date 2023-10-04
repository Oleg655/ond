import { useRef } from 'react';

export const createSmartHeaders = (headers: string[]) => {
  return headers.map(header => ({
    title: header,
    ref: useRef(),
  }));
};
