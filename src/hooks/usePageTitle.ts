import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageTitle() {
  const location = useLocation();

  const getPageTitle = (pathname: string): string => {
    switch (pathname) {
      case '/':
        return 'Home | OEA';
      case '/about':
        return 'About Us | OEA';
      case '/events':
        return 'Events | OEA';
      case '/members':
        return 'Members | OEA';
      case '/messages':
        return 'Messages | OEA';
      case '/profile':
        return 'Profile | OEA';
      case '/resources':
        return 'Resources | OEA';
      case '/admin':
        return 'Admin Dashboard | OEA';
      case '/auth':
        return 'Sign In | OEA';
      case '/store':
        return 'Store | OEA';
      case '/maintenance':
        return 'Maintenance | OEA';
      case '/privacy':
        return 'Privacy Policy | OEA';
      case '/terms':
        return 'Terms & Conditions | OEA';
      default:
        if (pathname.startsWith('/events/')) {
          return 'Event Details | OEA';
        }
        return 'OEA';
    }
  };

  useEffect(() => {
    const title = getPageTitle(location.pathname);
    document.title = title;
  }, [location]);
}