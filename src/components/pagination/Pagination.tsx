import React, { useEffect, useState } from 'react';

// import { ReactComponent as Left } from 'assets/left-indicator.svg';
// import { ReactComponent as Right } from 'assets/right-indicator.svg';

import './pagination.css';
import { PageSize } from './PageSize';

type UsePaginationPropsT = {
  contentPerPage: number;
  setContentPerPage: (count: number) => void;
  totalElements: number;
  pageNumberLimit: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

export const Pagination = ({
  contentPerPage,
  setContentPerPage,
  totalElements,
  pageNumberLimit,
  currentPage,
  setCurrentPage,
}: UsePaginationPropsT) => {
  const pageCount = Math.ceil(totalElements / contentPerPage);

  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState<number>(pageNumberLimit);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState<number>(1);

  useEffect(() => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage);
    }
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [pageCount]);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
    if ((currentPage - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  const onSetPageHandler = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const arrayFromPage: Array<number> = [];

  for (let index = 1; index <= pageCount; index += 1) {
    arrayFromPage.push(index);
  }

  const renderPageNumbers = arrayFromPage.map(page => {
    if (page < maxPageNumberLimit + 1 && page >= minPageNumberLimit) {
      return (
        <button
          className={currentPage === page ? 'btn-active' : 'btn'}
          type="button"
          onClick={() => onSetPageHandler(page)}
          key={page}
        >
          {page}
        </button>
      );
    }
    return null;
  });

  const leftIArrow = (
    <button
      disabled={currentPage === arrayFromPage[0]}
      onClick={prevPage}
      type="button"
      className={currentPage === arrayFromPage[0] ? 'btn-disabled' : 'btn'}
    >
      {/* <Left className="btnIcon" /> */}
      &#9001;
    </button>
  );

  const rightArrow = (
    <button
      disabled={currentPage === arrayFromPage[arrayFromPage.length - 1]}
      onClick={nextPage}
      type="button"
      className={currentPage === arrayFromPage[arrayFromPage.length - 1] ? 'btn-disabled' : 'btn'}
    >
      {/* <Right className="btnIcon" /> */}
      &#9002;
    </button>
  );

  let pageIncrementBtn: null | JSX.Element = null;
  if (arrayFromPage.length > maxPageNumberLimit) {
    pageIncrementBtn = (
      <button
        className="btn"
        type="button"
        onClick={() => {
          setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
          setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }}
      >
        &hellip;
      </button>
    );
  }

  let pageDecrementBtn: null | JSX.Element = null;
  if (minPageNumberLimit > 1) {
    pageDecrementBtn = (
      <button
        className="btn"
        type="button"
        onClick={() => {
          setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
          setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }}
      >
        &hellip;
      </button>
    );
  }

  return (
    <div className="pagination">
      <p>
        {currentPage}/{pageCount}
      </p>
      {leftIArrow}
      {pageDecrementBtn}
      {renderPageNumbers}
      {pageIncrementBtn}
      {rightArrow}
      <PageSize contentPerPage={contentPerPage} setContentPerPage={setContentPerPage} />
    </div>
  );
};
