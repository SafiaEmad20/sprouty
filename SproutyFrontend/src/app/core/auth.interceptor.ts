import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

// Adds the JWT to every request, and sends the user back to Login when the token is rejected.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService), router = inject(Router), token = auth.token;
  const authed = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(authed).pipe(catchError((e: HttpErrorResponse) => {
    if (e.status === 401 && !req.url.includes('/auth/')) { auth.logout(); router.navigate(['/login']); }
    return throwError(() => e);
  }));
};
