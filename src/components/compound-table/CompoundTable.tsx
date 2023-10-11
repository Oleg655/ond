/* eslint-disable no-continue */
/* eslint-disable no-unreachable-loop */
/* eslint-disable guard-for-in */
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

const TableContext = createContext(null);

const Table = ({ children, minCellWidth, smartColumn }: TablePropsI) => {
  const [pivotHeight, setPivotHeight] = useState<number>();
  const [showPivot, setShowPivot] = useState('pivot-highlighter');
  const [activeIndex, setActiveIndex] = useState(null);
  const tableElement = useRef<HTMLTableElement>(null);

  const collapseWrapper = (index: number) => {
    collapseColumn(index, tableElement, smartColumn, minCellWidth);
  };

  const showWrapper = (index: number) => {
    showColumn(index, tableElement, smartColumn, minCellWidth);
  };

  const mouseMove = useCallback(
    (event: MouseEvent) => resizer(event, tableElement, smartColumn, minCellWidth, activeIndex),
    [activeIndex, smartColumn, minCellWidth],
  );

  const removeListeners = useCallback(() => {
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setShowPivot('pivot-highlighter');
    setActiveIndex(null);
    setPivotHeight(tableElement.current.clientHeight / smartColumn.length);
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
      smartColumn,
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
  }, [pivotHeight, showPivot, activeIndex, smartColumn]);

  return (
    <TableContext.Provider value={state}>
      <table
        ref={tableElement}
        style={{
          gridTemplateColumns: generateColumnsSize(smartColumn),
        }}
      >
        {children}
      </table>
    </TableContext.Provider>
  );
};

Table.Pivot = ({ side, location }: PivotPropsI) => {
  const { tableElement, pivotHeight, setPivotHeight, setShowPivot, activeIndex, setActiveIndex } =
    useContext(TableContext);

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

Table.TableHead = ({
  sorts,
  sortTableData,
  dragStartHandler,
  dragEndHandler,
  dragOverHandler,
  dragLeaveHandler,
  dropHandler,
  sortColumns,
}: any) => {
  const { showPivot, smartColumn } = useContext(TableContext);
  const [arrow, setArrow] = useState(null);
  return (
    <thead>
      <tr>
        {smartColumn.sort(sortColumns).map((element: ColumnI) => {
          return (
            <td
              style={{ display: !element.isShown && 'none' }}
              className={`menu-container ${showPivot}`}
              ref={element.ref}
              key={element.id}
              onClick={() => {
                setArrow(element.id);
                sortTableData(element.columnTitle);
              }}
            >
              <span
                draggable
                onDragStart={event => dragStartHandler(event, element)}
                onDragEnd={event => dragEndHandler(event)}
                onDragOver={event => dragOverHandler(event)}
                onDragLeave={event => dragLeaveHandler(event)}
                onDrop={event => dropHandler(event, element)}
              >
                {element.headerTitle}
              </span>
              <span style={{ display: !(arrow === element.id) && 'none' }}>
                {sorts[element.columnTitle] ? '↓' : '↑'}
              </span>
              <Table.Pivot side="LEFT" location={element.id} />
              <Table.Pivot side="RIGHT" location={element.id} />
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
  callback,
}: {
  id?: number;
  title?: string | number;
  children?: JSX.Element | JSX.Element[];
  callback?: () => void;
}) => {
  return (
    <td key={id}>
      {!children && callback && (
        <>
          <EditableSpan title={title} /> <button onClick={callback}>delete</button>
        </>
      )}
      {!children && !callback && <EditableSpan title={title} />}
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
  smartColumn,
  setSmartHeaders,
  sortColumns,
}: {
  smartColumn: ColumnI[];
  setSmartHeaders: (id: number, isShown: boolean) => void;
  sortColumns: (a: ColumnI, b: ColumnI) => number;
}) => {
  return (
    <DropdownCheckboxContainer>
      <DropdownContainer.List>
        {smartColumn.sort(sortColumns).map((element: any) => {
          return (
            <DropdownCheckboxContainer.CheckboxItem
              checked={element.isShown}
              callback={checkbox => setSmartHeaders(element.id, checkbox)}
              title={element.headerTitle}
              key={element.id}
            />
          );
        })}
      </DropdownContainer.List>
    </DropdownCheckboxContainer>
  );
};

Table.Arrow = ({ isSorted }: { isSorted: boolean }) => {
  return <div>{isSorted ? <span>&#8593;</span> : <span>&#8595;</span>}</div>;
};

export const CompoundTable = () => {
  const headers = [
    { headerTitle: 'Items', columnTitle: 'title' },
    { headerTitle: 'Order #', columnTitle: 'order' },
    { headerTitle: 'Amount', columnTitle: 'amount' },
    { headerTitle: 'Status', columnTitle: 'status' },
    { headerTitle: 'Delivery Driver', columnTitle: 'name' },
  ];
  const smartHeaders = createSmartHeaders(headers);
  const [smartColumn, setSmartColumn] = useState(smartHeaders);
  const [currentSmartColumn, setCurrentSmartColumn] = useState(null);

  const [users, setUsers] = useState<any[]>(data);
  const [sorts, setSorts] = useState<any>({
    title: false,
    order: false,
    amount: false,
    status: false,
    name: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentItems, setCurrentItems] = useState<any>([]);

  const generateCurrentItems = () => {
    const indexOfLastItem = currentPage * 3;
    const indexOfFirstItem = indexOfLastItem - 3;
    setCurrentItems(users.slice(indexOfFirstItem, indexOfLastItem));
  };

  useEffect(() => {
    generateCurrentItems();
  }, [currentPage, users]);

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
  const dragStartHandler = (event: any, element: ColumnI): void => {
    setCurrentSmartColumn(element);
  };
  const dragEndHandler = (): void => {
    generateCurrentItems();
  };
  const dragOverHandler = (event: any): void => {
    event.preventDefault();
    event.target.style.background = 'red';
  };
  const dragLeaveHandler = (event: any): void => {
    event.target.style.background = 'white';
  };
  const dropHandler = (event: any, column: ColumnI): void => {
    event.target.style.background = 'white';
    event.preventDefault();
    setSmartColumn(
      smartColumn.map(element => {
        if (element.id === column.id) {
          return { ...element, order: currentSmartColumn.order };
        }
        if (element.id === currentSmartColumn.id) {
          return { ...element, order: column.order };
        }
        return element;
      }),
    );
  };

  const sortTableData = (columnTitle: string) => {
    setSorts({ ...sorts, [columnTitle]: !sorts[columnTitle] });
    setUsers(
      users.sort((elementA: any, elementB: any) => {
        if (elementA[columnTitle] > elementB[columnTitle]) {
          return sorts[columnTitle] ? -1 : 1;
        }
        if (elementA[columnTitle] < elementB[columnTitle]) {
          return sorts[columnTitle] ? 1 : -1;
        }
        return 0;
      }),
    );
    generateCurrentItems();
  };

  const sortColumns = (a: ColumnI, b: ColumnI) => {
    if (a.order > b.order) {
      return 1;
    }
    return -1;
  };

  const addItem = () => {
    setUsers([
      {
        id: Math.random(),
        title: '',
        order: null,
        amount: null,
        status: '',
        name: '',
      },
      ...users,
    ]);
  };

  const renderDataCells = useMemo(() => {
    return currentItems.map((user: any) => {
      return (
        <Table.TableRow key={Math.random()}>
          {(() => {
            const cells: any = [];
            let index = 0;
            for (const key in user) {
              if (key === 'id') {
                continue;
              }
              if (key === 'title') {
                cells.push(
                  <React.Fragment key={smartColumn[index].id}>
                    {smartColumn[index].isShown && (
                      <Table.TableData
                        callback={() => {
                          setUsers(users.filter(element => element.id !== user.id));
                        }}
                        title={user[smartColumn[index].columnTitle]}
                      />
                    )}
                  </React.Fragment>,
                );
                index += 1;
              } else {
                cells.push(
                  <React.Fragment key={smartColumn[index].id}>
                    {smartColumn[index].isShown && (
                      <Table.TableData title={user[smartColumn[index].columnTitle]} />
                    )}
                  </React.Fragment>,
                );
                index += 1;
              }
            }
            return cells;
          })()}
        </Table.TableRow>
      );
    });
  }, [currentItems, smartColumn]);

  return (
    <div className="table-wrapper">
      <Table.MainHead
        sortColumns={sortColumns}
        smartColumn={smartColumn}
        setSmartHeaders={setSmartHeadersWrapper}
      />
      <button onClick={() => addItem()}>Добавить запись</button>
      <Table minCellWidth={120} smartColumn={smartColumn}>
        <Table.TableHead
          sorts={sorts}
          sortTableData={sortTableData}
          dragStartHandler={dragStartHandler}
          dragEndHandler={dragEndHandler}
          dragOverHandler={dragOverHandler}
          dragLeaveHandler={dragLeaveHandler}
          dropHandler={dropHandler}
          sortColumns={sortColumns}
        />
        <Table.TableBody>{renderDataCells}</Table.TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        contentPerPage={3}
        totalElements={users.length}
        pageNumberLimit={10}
      />
    </div>
  );
};
