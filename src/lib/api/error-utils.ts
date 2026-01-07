/**
 * Formats error for logging (We flat error messages to be able to throw error locally)
 */
export function formatErrorMessage(prefix: string, error: unknown): string {
  if (error instanceof Error) {
    return `${prefix} ${error.message}`;
  }

  if (typeof error === 'string') {
    return `${prefix} ${error}`;
  }

  return `${prefix} ${String(error)}`;
}

/**
 * Creates a standardized error for API failures
 */
export function createApiStatusError(message: string, status?: number): Error {
  return new Error(status ? `${message}: ${status}` : message);
}
