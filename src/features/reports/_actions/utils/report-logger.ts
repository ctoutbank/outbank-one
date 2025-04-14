export const logger = {
  info: (message: string, data?: any) => {
    console.log(
      `[REPORT-SCHEDULE] ${message}`,
      data ? JSON.stringify(data) : ""
    );
  },
  error: (message: string, error?: any) => {
    console.error(
      `[REPORT-SCHEDULE] ${message}`,
      error ? JSON.stringify(error) : ""
    );
  },
};
