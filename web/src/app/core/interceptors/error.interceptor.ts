import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 0) {
        toast.show("Can't reach the server. Check your connection and try again.");
      } else if (err.status === 403) {
        toast.show("You don't have permission to do that.");
      } else if (err.status >= 500) {
        toast.show('Something went wrong on the server. Please try again.');
      }

      return throwError(() => err);
    }),
  );
};
