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
import { DropdownContainer } from 'components/dropdown/Dropdown';
import { EditableSpan } from 'components/editable-span/EditableSpan';

import { generateColumnsSize } from './lib';
import { createSmartHeaders } from './lib/createSmartHeaders';
import { collapseColumn, resizer, showColumn } from './lib/resizer';
import { ChildrenI, ColumnI, PivotPropsI, TablePropsI } from './lib/types';

const TableContent = createContext(null);

const Table = ({ children, minCellWidth, headers }: TablePropsI) => {
  const [pivotHeight, setPivotHeight] = useState<number>();
  const [showPivot, setShowPivot] = useState('pivot-highlighter');
  const [activeIndex, setActiveIndex] = useState(null);
  const tableElement = useRef<HTMLTableElement>(null);
  const smartHeaders = createSmartHeaders(headers);

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
      <div className="table-wrapper">
        <table
          ref={tableElement}
          style={{
            gridTemplateColumns: generateColumnsSize(headers.length),
          }}
        >
          {children}
        </table>
      </div>
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
  title,
  children,
}: {
  title?: string | number;
  children?: JSX.Element | JSX.Element[];
}) => {
  return (
    <td>
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
  title,
  callback,
}: {
  title?: string | number;
  callback: () => void;
}) => {
  return (
    <td>
      <EditableSpan title={title} /> <button onClick={callback}>delete</button>
    </td>
  );
};

export const CompoundTable = () => {
  const [users, setUsers] = useState<any[]>([
    {
      id: 1,
      title: 'Large Detroit Style Pizza',
      order: 3213456785,
      amount: '$31.43',
      status: 'Pending',
      name: 'Dave',
    },
    {
      id: 2,
      title: 'Double Decker Club With Fries. Pickles, extra side avacado',
      order: 9874563245,
      amount: '$12.99',
      status: 'Delivered',
      name: 'Cathy',
    },
    {
      id: 3,
      title: 'Family Sized Lobster Dinner',
      order: 3456781234,
      amount: '$320.00',
      status: 'In Progress',
      name: 'Alexander',
    },
  ]);

  const addTableRow = () => {
    setUsers([{ id: Math.random() }, ...users]);
  };

  return (
    <Table minCellWidth={120} headers={['Items', 'Order #', 'Amount', 'Status', 'Delivery Driver']}>
      <Table.TableHead addTableRow={addTableRow} />
      <Table.TableBody>
        {users.map(user => (
          <Table.TableRow key={Math.random()}>
            <Table.TableDataWithDeleteButton
              title={user.title}
              callback={() => {
                setUsers(users.filter(element => element.id !== user.id));
              }}
            />
            <Table.TableData title={user.order} />
            <Table.TableData title={user.amount} />
            <Table.TableData title={user.status} />
            <Table.TableData title={user.name} />
          </Table.TableRow>
        ))}
      </Table.TableBody>
    </Table>
  );
};
