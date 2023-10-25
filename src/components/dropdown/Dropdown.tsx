import React, { useEffect, useRef, useState } from 'react';

import './dropdown.css';

export const DropdownContainer = ({
  children,
  renderContent,
}: {
  children: JSX.Element | JSX.Element[];
  renderContent: () => JSX.Element | JSX.Element[];
}) => {
  const [isOpen, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);
  return (
    <div className="dropdown-container">
      <span
        ref={dropdownRef}
        className="dropdown-btn"
        onClick={() => {
          setOpen(prev => !prev);
        }}
      >
        {renderContent()}
      </span>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

DropdownContainer.List = ({
  children,
  width,
  padding,
}: {
  children: JSX.Element | JSX.Element[];
  width: string;
  padding: string;
}) => {
  return (
    <ul style={{ width, padding }} className="dropdown-menu">
      {children}
    </ul>
  );
};

DropdownContainer.Item = ({
  title,
  children,
  callback,
}: {
  title: string | number;
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

export const DropdownCheckboxContainer = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [isOpen, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="dropdown-container">
      <button
        // className="dropdown-btn"
        onClick={() => {
          setOpen(prev => !prev);
        }}
      >
        Параметры списка
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

DropdownCheckboxContainer.List = ({
  children,
  width,
  padding,
}: {
  children: JSX.Element | JSX.Element[];
  width: string;
  padding: string;
}) => {
  return (
    <ul style={{ width, padding }} className="dropdown-menu">
      {children}
    </ul>
  );
};

DropdownCheckboxContainer.CheckboxItem = ({
  checked,
  title,
  callback,
}: {
  checked: boolean;
  title: string;
  callback?: (checkbox: boolean) => void;
}) => {
  return (
    <label htmlFor={title}>
      <li>
        <input
          checked={checked}
          onChange={event => {
            callback(event.target.checked);
          }}
          id={title}
          type="checkbox"
        />
        {title}
      </li>
    </label>
  );
};
