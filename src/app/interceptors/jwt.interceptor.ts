import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (authService.loggedInUser()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.loggedInUser()?.token}`,
      },
    });
  }

  return next(req);
};
