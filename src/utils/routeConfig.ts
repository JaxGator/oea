
export const publicRoutes = [
  '/',
  '/about',
  '/privacy-policy',
  '/terms',
  '/terms-and-conditions',
  '/resources',
  '/events',
  '/polls/share/:token',
  '/events/share/:id',
  '/auth',
  '/auth/callback',
  '/maintenance'
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
  '/site',
  '/events/:id'
];

export const isProtectedRoute = (pathname: string): boolean => {
  // Check if the path matches any protected route pattern
  return protectedRoutes.some(route => {
    const pattern = route
      .replace(/:\w+/g, '[^/]+')
      .replace(/\//g, '\\/');
    return new RegExp(`^${pattern}$`).test(pathname);
  });
};

export const isPublicRoute = (pathname: string): boolean => {
  // Check if the path matches any public route pattern
  return publicRoutes.some(route => {
    const pattern = route
      .replace(/:\w+/g, '[^/]+')
      .replace(/\//g, '\\/');
    return new RegExp(`^${pattern}$`).test(pathname);
  });
};

export const isValidRoute = (pathname: string): boolean => {
  // Split the path and check each segment
  const pathSegments = pathname.split('/').filter(Boolean);
  const basePath = '/' + (pathSegments[0] || '');
  return isPublicRoute(pathname) || isProtectedRoute(pathname) || isPublicRoute(basePath) || isProtectedRoute(basePath);
};
