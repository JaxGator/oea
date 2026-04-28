// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateResponse = (response: any, message: string) => {
  if (!response || response.error) {
    throw new Error(`${message}: ${response?.error?.message || 'Unknown error'}`);
  }
  return response;
};