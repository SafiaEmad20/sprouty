import { HttpInterceptorFn } from '@angular/common/http';

// Adds the JWT to every request once the backend is connected.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};
