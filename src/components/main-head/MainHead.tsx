import React, { useContext } from 'react';

import { TableActionsContext, TableContext } from 'components/compound-table/CompoundTable';
import { DropdownCheckboxContainer } from 'components/dropdown/Dropdown';

export const MainHead = () => {
  const { smartColumn } = useContext(TableContext);
  const { sortColumns, isShownColumn } = useContext(TableActionsContext);
  return (
    <DropdownCheckboxContainer>
      <DropdownCheckboxContainer.List width="200px" padding="15px">
        {smartColumn.sort(sortColumns).map((element: any) => {
          return (
            <DropdownCheckboxContainer.CheckboxItem
              checked={element.isShown}
              callback={checkbox => isShownColumn(element.id, checkbox)}
              title={element.headerTitle}
              key={element.id}
            />
          );
        })}
      </DropdownCheckboxContainer.List>
    </DropdownCheckboxContainer>
  );
};
