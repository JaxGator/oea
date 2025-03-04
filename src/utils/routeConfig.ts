
export const publicRoutes = ['/', '/about', '/privacy', '/terms', '/resources', '/events', '/polls/share/:token', '/events/share/:id', '/auth', '/auth/callback'];
export const protectedRoutes = ['/profile', '/admin', '/users', '/store'];

export const isProtectedRoute = (pathname: string): boolean => {
  // Extract the base path without params for comparison
  const basePath = pathname.split('?')[0].split('/').slice(0, 3).join('/');
  
  // Check if the path starts with any protected route
  return protectedRoutes.some(route => 
    basePath === route || basePath.startsWith(`${route}/`)
  );
};

export const isPublicRoute = (pathname: string): boolean => {
  // Match exact routes or parameterized routes
  const exactMatch = publicRoutes.includes(pathname);
  if (exactMatch) return true;
  
  // Handle parameterized routes like /events/share/:id
  const pathParts = pathname.split('/');
  return publicRoutes.some(route => {
    const routeParts = route.split('/');
    if (pathParts.length !== routeParts.length) return false;
    
    return routeParts.every((part, i) => 
      part === pathParts[i] || part.startsWith(':')
    );
  });
};
