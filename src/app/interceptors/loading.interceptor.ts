import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(SpinnerService);

  spinner.start();

  return next(req).pipe(
    delay(1000),
    finalize(() => spinner.stop())
  );
};
