export const publicRoutes = ['/', '/about', '/privacy', '/terms'];
export const protectedRoutes = ['/events', '/profile', '/admin', '/resources', '/members', '/store'];

export const isProtectedRoute = (pathname: string): boolean => {
  // Check if the path starts with any protected route
  return protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
};

export const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
};