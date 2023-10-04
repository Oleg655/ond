import React, { useEffect, useRef, useState } from 'react';

import './dropdown.css';

export const DropdownContainer = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const [isOpen, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className="dropdown-container">
      <span
        className="dropdown-btn"
        ref={dropdownRef}
        onClick={() => {
          setOpen(prev => !prev);
        }}
      >
        &#8230;
      </span>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

DropdownContainer.List = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return <ul className="dropdown-menu">{children}</ul>;
};

DropdownContainer.Item = ({
  title,
  children,
  callback,
}: {
  title: string;
  children?: JSX.Element | JSX.Element[];
  callback?: () => void;
}) => {
  return (
    <>
      {!children && (
        <li
          onClick={() => {
            callback();
          }}
        >
          {title}
        </li>
      )}
      {children && (
        <li onClick={() => {}}>
          {title}&rang;
          <div>{children}</div>
        </li>
      )}
    </>
  );
};
