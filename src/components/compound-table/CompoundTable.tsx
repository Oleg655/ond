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

const Table = ({ children, minCellWidth, smartHeaders }: TablePropsI) => {
  const [pivotHeight, setPivotHeight] = useState<number>();
  const [showPivot, setShowPivot] = useState('pivot-highlighter');
  const [activeIndex, setActiveIndex] = useState(null);
  const tableElement = useRef<HTMLTableElement>(null);

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
    setPivotHeight(tableElement.current.clientHeight / smartHeaders.length);
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
          gridTemplateColumns: generateColumnsSize(smartHeaders),
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

Table.TableHead = () => {
  const { showPivot, smartHeaders } = useContext(TableContent);

  return (
    <thead>
      <tr>
        {smartHeaders.map(({ id, title, ref, isShown }: ColumnI) => {
          return (
            <td
              style={{ display: !isShown && 'none' }}
              className={`menu-container ${showPivot}`}
              ref={ref}
              key={Math.random()}
            >
              <span>{title}</span>
              <Table.Pivot side="LEFT" location={id} />
              <Table.Pivot side="RIGHT" location={id} />
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
  smartHeaders,
  setSmartHeaders,
}: {
  smartHeaders: ColumnI[];
  setSmartHeaders: (id: number, isShown: boolean) => void;
}) => {
  return (
    <DropdownCheckboxContainer>
      <DropdownContainer.List>
        {smartHeaders.map(element => {
          return (
            <DropdownCheckboxContainer.CheckboxItem
              checked={element.isShown}
              callback={checkbox => setSmartHeaders(element.id, checkbox)}
              title={element.title}
              key={element.id}
            />
          );
        })}
      </DropdownContainer.List>
    </DropdownCheckboxContainer>
  );
};

export const CompoundTable = () => {
  const headers = ['Items', 'Order #', 'Amount', 'Status', 'Delivery Driver'];
  const smartHeaders = createSmartHeaders(headers);

  const [users, setUsers] = useState<any[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [smartColumn, setSmartColumn] = useState(smartHeaders);

  const indexOfLastItem = currentPage * 3;
  const indexOfFirstItem = indexOfLastItem - 3;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const setSmartHeadersWrapper = (id: number, isShown: boolean) => {
    setSmartColumn(
      smartColumn.map(element => {
        if (element.id === id) {
          element.isShown = isShown;
        }
        return element;
      }),
    );
  };

  return (
    <>
      <div className="table-wrapper">
        <Table.MainHead smartHeaders={smartColumn} setSmartHeaders={setSmartHeadersWrapper} />
        <Table minCellWidth={120} smartHeaders={smartColumn}>
          <Table.TableHead />
          <Table.TableBody>
            {currentItems.map(user => (
              <Table.TableRow key={Math.random()}>
                {smartColumn[0].isShown ? (
                  <Table.TableDataWithDeleteButton
                    title={user.title}
                    callback={() => {
                      setUsers(users.filter(element => element.id !== user.id));
                    }}
                  />
                ) : null}

                {smartColumn[1].isShown ? <Table.TableData title={user.order} /> : null}
                {smartColumn[2].isShown ? <Table.TableData title={user.amount} /> : null}
                {smartColumn[3].isShown ? <Table.TableData title={user.status} /> : null}
                {smartColumn[4].isShown ? <Table.TableData title={user.name} /> : null}
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
