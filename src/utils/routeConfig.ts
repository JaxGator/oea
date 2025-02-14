
export const publicRoutes = [
  '/',
  '/about',
  '/privacy-policy',
  '/terms-and-conditions',
  '/resources',
  '/events',
  '/polls/share/:token',
  '/events/share/:id',
  '/auth',
  '/auth/callback'
];

export const protectedRoutes = [
  '/profile',
  '/admin',
  '/users',
  '/store',
  '/gallery',
  '/social',
  '/messages',
  '/account',
  '/site'
];

export const isProtectedRoute = (pathname: string): boolean => {
  // Check if the path exactly matches or starts with any protected route
  return protectedRoutes.some(route => {
    // Convert route pattern to regex to handle dynamic segments
    const routePattern = route
      .replace(/:\w+/g, '[^/]+') // Replace :param with regex for any non-slash chars
      .replace(/\//g, '\\/'); // Escape forward slashes
    const regex = new RegExp(`^${routePattern}(?:\\/.*)?$`);
    return regex.test(pathname);
  });
};

export const isPublicRoute = (pathname: string): boolean => {
  // Check if the path exactly matches or starts with any public route
  return publicRoutes.some(route => {
    // Convert route pattern to regex to handle dynamic segments
    const routePattern = route
      .replace(/:\w+/g, '[^/]+') // Replace :param with regex for any non-slash chars
      .replace(/\//g, '\\/'); // Escape forward slashes
    const regex = new RegExp(`^${routePattern}(?:\\/.*)?$`);
    return regex.test(pathname);
  });
};

export const isValidRoute = (pathname: string): boolean => {
  return isPublicRoute(pathname) || isProtectedRoute(pathname);
};
