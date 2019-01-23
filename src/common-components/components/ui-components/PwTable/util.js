const isLastPage = (total, current, pageSize) => {
  return current === Math.ceil(total / pageSize);
};

export const getRang = pagination => {
  const rang = {};
  const { pageSize, current, total } = pagination;
  rang.start = (current - 1) * pageSize + 1;
  if (isLastPage(total, current, pageSize)) {
    rang.end = rang.start + (total % 10) - 1;
  } else {
    rang.end = rang.start + pageSize - 1;
  }
  return rang;
};
