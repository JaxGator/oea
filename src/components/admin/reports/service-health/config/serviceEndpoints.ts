export const SERVICE_ENDPOINTS = {
  netlify: 'https://www.netlify.com',
  lovable: 'https://lovable.dev',
  github: 'https://www.github.com'
} as const;

// Helper to ensure URLs are properly formatted
export const getServiceUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.toString();
  } catch (e) {
    console.error('Invalid URL:', url);
    return url;
  }
};