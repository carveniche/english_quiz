export function getQueryParams(): string {
  let queryParams = new URLSearchParams(window.location.search).toString();
  return queryParams;
}

export function getQueryParamsDetails(): URLSearchParams {
  let queryParams = new URLSearchParams(window.location.search);
  return queryParams;
}
