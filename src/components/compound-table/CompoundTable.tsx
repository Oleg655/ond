/* eslint-disable no-else-return */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import './compound-table.css';
import { DropdownCheckboxContainer, DropdownContainer } from 'components/dropdown/Dropdown';
import { EditableSpan } from 'components/editable-span/EditableSpan';
import { Pagination } from 'components/pagination/Pagination';

import { generateColumnsSize } from './lib';
import { createSmartHeaders } from './lib/createSmartHeaders';
import { collapseColumn, resizer, showColumn } from './lib/resizer';
import { ChildrenI, ColumnI, PivotPropsI, TablePropsI } from './lib/types';
import { data } from './test-data';

const TableContent = createContext(null);

const Table = ({ children, minCellWidth, headers }: TablePropsI) => {
  const [pivotHeight, setPivotHeight] = useState<number>();
  const [showPivot, setShowPivot] = useState('pivot-highlighter');
  const [activeIndex, setActiveIndex] = useState(null);
  const tableElement = useRef<HTMLTableElement>(null);
  const smartHeaders = createSmartHeaders(headers);
  console.log(smartHeaders);
  const collapseWrapper = (index: number) => {
    collapseColumn(index, tableElement, smartHeaders, minCellWidth);
  };

  const showWrapper = (index: number) => {
    showColumn(index, tableElement, smartHeaders, minCellWidth);
  };

  const mouseMove = useCallback(
    (event: MouseEvent) => resizer(event, tableElement, smartHeaders, minCellWidth, activeIndex),
    [activeIndex, smartHeaders, minCellWidth],
  );

  const removeListeners = useCallback(() => {
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setShowPivot('pivot-highlighter');
    setActiveIndex(null);
    setPivotHeight(tableElement.current.clientHeight / headers.length);
    removeListeners();
  }, [removeListeners]);

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    }

    return () => {
      removeListeners();
    };
  }, [minCellWidth, mouseMove, mouseUp, removeListeners]);

  const state = useMemo(() => {
    return {
      smartHeaders,
      activeIndex,
      setActiveIndex,
      collapseWrapper,
      showWrapper,
      tableElement,
      pivotHeight,
      setPivotHeight,
      showPivot,
      setShowPivot,
    };
  }, [pivotHeight, showPivot, activeIndex]);

  return (
    <TableContent.Provider value={state}>
      <table
        ref={tableElement}
        style={{
          gridTemplateColumns: generateColumnsSize(headers.length),
        }}
      >
        {children}
      </table>
    </TableContent.Provider>
  );
};

Table.Pivot = ({ side, location }: PivotPropsI) => {
  const { tableElement, pivotHeight, setPivotHeight, setShowPivot, activeIndex, setActiveIndex } =
    useContext(TableContent);

  return (
    <>
      {side === 'LEFT' && (
        <div
          style={{ height: pivotHeight }}
          className={`left-pivot ${activeIndex === location ? 'active' : ''}`}
        />
      )}
      {side === 'RIGHT' && (
        <div
          style={{ height: pivotHeight }}
          onMouseDown={() => {
            setActiveIndex(location);
            setPivotHeight(tableElement.current.clientHeight);
            setShowPivot('');
          }}
          className={`right-pivot ${activeIndex === location ? 'active' : ''}`}
        />
      )}
    </>
  );
};

Table.TableHead = ({ addTableRow }: { addTableRow: () => void }) => {
  const { showPivot, collapseWrapper, showWrapper, smartHeaders } = useContext(TableContent);

  return (
    <thead>
      <tr>
        {smartHeaders.map(({ title, ref }: ColumnI, index: number) => {
          return (
            <td className={`menu-container ${showPivot}`} ref={ref} key={Math.random()}>
              <span>{title}</span>
              <DropdownContainer>
                <DropdownContainer.List>
                  <DropdownContainer.Item
                    callback={() => {
                      collapseWrapper(index);
                    }}
                    title={`Свернуть ${title}`}
                  />
                  <DropdownContainer.Item
                    callback={() => {
                      showWrapper(index);
                    }}
                    title={`Развернуть ${title}`}
                  />
                  <DropdownContainer.Item title="Сортировать по возрастанию" />
                  <DropdownContainer.Item
                    callback={() => {
                      addTableRow();
                    }}
                    title="Добавить строку"
                  />
                  <DropdownContainer.Item title="Сортировать по убыванию" />
                </DropdownContainer.List>
              </DropdownContainer>
              <Table.Pivot side="LEFT" location={index} />
              <Table.Pivot side="RIGHT" location={index} />
            </td>
          );
        })}
      </tr>
    </thead>
  );
};

Table.TableBody = ({ children }: ChildrenI) => {
  return <tbody>{children}</tbody>;
};

Table.TableRow = ({ children }: ChildrenI) => {
  return <tr>{children}</tr>;
};

Table.TableData = ({
  id,
  title,
  children,
}: {
  id?: number;
  title?: string | number;
  children?: JSX.Element | JSX.Element[];
}) => {
  return (
    <td key={id}>
      {!children && <EditableSpan title={title} />}
      {children && (
        <>
          <EditableSpan title={title} /> {children}
        </>
      )}
    </td>
  );
};

Table.TableDataWithDeleteButton = ({
  id,
  title,
  callback,
}: {
  id?: number;
  title?: string | number;
  callback: () => void;
}) => {
  return (
    <td key={id}>
      <EditableSpan title={title} /> <button onClick={callback}>delete</button>
    </td>
  );
};

Table.MainHead = ({
  headers,
  filterColumn,
}: {
  headers: string[];
  filterColumn: (index: number, checkbox: boolean) => void;
}) => {
  return (
    <DropdownCheckboxContainer>
      <DropdownContainer.List>
        {headers.map((element, index) => {
          return (
            <DropdownCheckboxContainer.CheckboxItem
              callback={checkbox => {
                filterColumn(index, checkbox);
              }}
              title={element}
              key={element}
            />
          );
        })}
      </DropdownContainer.List>
    </DropdownCheckboxContainer>
  );
};

export const CompoundTable = () => {
  const headers = ['Items', 'Order #', 'Amount', 'Status', 'Delivery Driver'];

  const [users, setUsers] = useState<any[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredHeaders, setFilteredHeaders] = useState<string[]>(headers);
  const addTableRow = () => {
    setUsers([{ id: Math.random() }, ...users]);
  };

  const indexOfLastItem = currentPage * 3;
  const indexOfFirstItem = indexOfLastItem - 3;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const filterColumn = (currentIndex: number, checkbox: boolean) => {
    setFilteredHeaders(
      filteredHeaders.map((element, index) => {
        if (currentIndex === index && checkbox) {
          return;
        }
        if (currentIndex === index && !checkbox) {
          return element;
        }
        return element;
      }),
    );
  };
  console.log(filteredHeaders);
  return (
    <>
      <div className="table-wrapper">
        <Table.MainHead
          filterColumn={filterColumn}
          headers={['Items', 'Order #', 'Amount', 'Status', 'Delivery Driver']}
        />
        <Table minCellWidth={120} headers={filteredHeaders}>
          <Table.TableHead addTableRow={addTableRow} />
          <Table.TableBody>
            {currentItems.map(user => (
              <Table.TableRow key={Math.random()}>
                {filteredHeaders[0] ? (
                  <Table.TableDataWithDeleteButton
                    title={user.title}
                    callback={() => {
                      setUsers(users.filter(element => element.id !== user.id));
                    }}
                  />
                ) : null}

                <Table.TableData title={user.order} />
                <Table.TableData title={user.amount} />
                <Table.TableData title={user.status} />
                <Table.TableData title={user.name} />
              </Table.TableRow>
            ))}
          </Table.TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        contentPerPage={3}
        totalElements={12}
        pageNumberLimit={10}
      />
    </>
  );
};
