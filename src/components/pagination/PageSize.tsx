import React from 'react';

import { DropdownContainer } from 'components/dropdown/Dropdown';

interface PageSizePropsI {
  contentPerPage: number;
  setContentPerPage: (count: number) => void;
}

export const PageSize = ({ contentPerPage, setContentPerPage }: PageSizePropsI) => {
  return (
    <div>
      <span>Элементов: {contentPerPage}</span>
      <DropdownContainer renderContent={() => <span>&#9660;</span>}>
        <DropdownContainer.List width="50px">
          <DropdownContainer.Item callback={() => setContentPerPage(3)} title={3} />
          <DropdownContainer.Item callback={() => setContentPerPage(4)} title={4} />
          <DropdownContainer.Item callback={() => setContentPerPage(6)} title={6} />
        </DropdownContainer.List>
      </DropdownContainer>
    </div>
  );
};
