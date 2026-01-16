export interface CustomError extends Error {
  status?: any;
  statusCode?: any;
}
