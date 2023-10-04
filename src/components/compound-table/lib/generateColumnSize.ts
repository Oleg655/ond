export const generateColumnsSize = (tableCount: number) => {
  let fractions = '';
  for (let index = 0; index < tableCount; index += 1) {
    fractions += '1fr ';
  }

  return fractions;
};
