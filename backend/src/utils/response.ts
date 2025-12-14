export const success = (data: any, message = "Success") => ({
  status: "success",
  message,
  data
});

export const error = (message: string, statusCode: number) => ({
  status: "error",
  message,
  statusCode
});
