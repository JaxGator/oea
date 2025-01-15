export const SERVICE_ENDPOINTS = {
  netlify: 'https://www.netlify.com',
  lovable: 'https://lovable.dev',
  github: 'https://www.github.com'
} as const;

// Helper to ensure URLs are properly formatted
export const getServiceUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    // Remove any duplicate colons and ensure proper URL format
    return parsedUrl.toString().replace(/([^:])(:+)\//, '$1/').replace(/\/$/, '');
  } catch (e) {
    console.error('Invalid URL:', url);
    return url;
  }
};