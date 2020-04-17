const { sign } = require('jsonwebtoken');

const deleteObjectProperties = (source, ...keys) => {
  keys.forEach(k => delete source[k]);
};

const signToken = id => sign({ id }, process.env.JWT_SECRET);

const assign = (source, target) => {
  for (let key in source) {
    const value = source[key];
    if (value) target[key] = value;
  }
};

const assignIgnore = (source, target) => {
  for (let key in source) {
    const value = source[key];
    target[key] = value;
  }
};

const createPages = (from, to) => {
  const pages = [];
  for (let page = from; page <= to; page++) pages.push(page);
  return pages;
};

const paginate = (totalResults = [], currentPage = 1, resultsPerPage = 10) => {
  // This represents the total number of results we want to paginate
  const totalResultsNumber = totalResults.length;
  // Prevent results per page from exceeding the total number of results or from being a decimal
  resultsPerPage =
    resultsPerPage > totalResultsNumber
      ? totalResultsNumber
      : Math.floor(resultsPerPage);

  // By default in pagination the first page is always 1
  const firstPage = 1;
  // Total number of calculated pages
  const totalPages = Math.ceil(totalResultsNumber / resultsPerPage);
  // Last page which is also the total number of pages there are
  const lastPage = totalPages;
  // Actual pages array
  const pages = createPages(firstPage, lastPage);
  // Prevent current page from being greater than the last page or becoming a decimal
  currentPage = currentPage > lastPage ? lastPage : Math.floor(currentPage);
  // This stores the number of existing pages between the current page and the first page
  const offsetLeft = currentPage - firstPage;
  // This stores the number of existing pages between the current page and the last page
  const offsetRight = lastPage - currentPage;

  // Figures out if there is a previous page from the current page
  const hasPreviousPage = currentPage > firstPage;
  // Figures out if there is a next page from the current page
  const hasNextPage = currentPage < lastPage;
  // Previous page eqauls (current page - 1) if there is a previous page, null otherwise
  const previousPage = hasPreviousPage ? currentPage - 1 : null;
  // Next page eqauls (current page + 1) if there is a next page, null otherwise
  const nextPage = hasNextPage ? currentPage + 1 : null;

  // Index from which to start slicing the total results array
  const startIndex = (currentPage - 1) * resultsPerPage;
  // Index from which to stop slicing the total results array
  const endIndex = currentPage * resultsPerPage;
  // Actual results obtained after pagination
  const results = totalResults.slice(startIndex, endIndex);
  // Number of results contained in the paginated results
  const numberOfReturnedResults = results.length;

  return {
    totalResultsNumber,
    resultsPerPage,
    hasPreviousPage,
    hasNextPage,
    currentPage,
    previousPage,
    nextPage,
    firstPage,
    lastPage,
    offsetLeft,
    offsetRight,
    results,
    numberOfReturnedResults,
    pages,
    totalPages,
  };
};

module.exports = {
  assign,
  assignIgnore,
  deleteObjectProperties,
  signToken,
  paginate,
};
