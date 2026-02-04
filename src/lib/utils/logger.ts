const isDev = process.env.NODE_ENV === 'development';

export const log = {
  error: isDev ? console.error : () => {},
  warn: isDev ? console.warn : () => {},
};
