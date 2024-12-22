import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}

export function TawkToWidget() {
  useEffect(() => {
    // Initialize Tawk API variables
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Create and append the Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/67687b5049e2fd8dfefc16d1/1ifo23cud';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    // Insert the script before the first script tag
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);

    return () => {
      // Cleanup on unmount
      script.remove();
      delete window.Tawk_API;
      delete window.Tawk_LoadStart;
    };
  }, []);

  return null;
}