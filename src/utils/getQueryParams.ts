export function getQueryParams(): String {
  let queryParams = new URLSearchParams(window.location.search).toString();
  return queryParams;
}
